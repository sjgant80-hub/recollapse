// test.mjs — PROOF-OF-PLAY for RE-COLLAPSE. Zero tokens. Proves the practice is a real state machine and that its
// persistence does what a chat can't: the event is content-addressed (same event → same id, real SHA-256), a seal
// is saved, and re-collapsing the SAME event DEEPENS it (never duplicates), journaled newest-first, never lost.
// The choice is always the user's (you can only collapse a reading you actually walked). Deterministic, fuzz-safe.
import R from './recollapse.mjs';
const { sha256, eventId, newSession, rise, walk, collapse, seal, newStore, journal, history, recall, stats, depth, shape, branches, LENSES, readyToSeal, GUARDRAIL, exportStore, importStore } = R;

let pass = 0, fail = 0;
const ok = (c, m) => { c ? pass++ : fail++; console.log((c ? '  ✓ ' : '  ✗ FAIL ') + m); };

console.log('\n=== §1 · THE CONTENT-ADDRESS IS REAL — SHA-256 matches the known vectors ===');
{
  ok(sha256('') === 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', 'sha256("") = the canonical empty-string digest');
  ok(sha256('abc') === 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad', 'sha256("abc") = the canonical test vector');
  ok(eventId('  The Thing   That Happened ') === eventId('the thing that happened'), 'the event-id normalises whitespace/case — the SAME event maps to the SAME address');
  ok(eventId('a') !== eventId('b'), 'different events get different addresses');
}

console.log('\n=== §2 · THE FIVE STEPS — a real state machine (name → rise → walk → collapse → seal) ===');
{
  const s = newSession('the interview that went badly');
  ok(!rise(newSession('')).ok, 'you cannot rise without first naming an event');
  ok(!walk(s, 'peer', 'x').ok, 'you cannot walk the branches before you rise above the scene');
  rise(s);
  ok(s.risen && s.step === 2, 'rising takes you to the witness-fold (step 2)');
  walk(s, 'peer', "it's all good — you made it here");
  walk(s, 'taught', 'it taught me to prep the story, not the CV');
  ok(depth(s) === 2 && s.step === 3, 'walking readings records them (step 3)');
  ok(!collapse(s, 'door').ok, 'you can only collapse a reading you ACTUALLY walked — not one you skipped');
  ok(collapse(s, 'taught').ok && s.chosen === 'taught', 'collapsing chooses one walked reading (the choice is yours)');
  ok(readyToSeal(s), 'and now it is ready to seal');
}

console.log('\n=== §3 · THE BRANCH-WALK SPIRALS, it does not orbit (the golden-offset upgrade) ===');
{
  const b = branches();
  ok(b.length === LENSES.length && b[0].key === 'peer', "the readings load, first is the peer one (\"it's all good\")");
  const angles = b.map(x => Math.round(x.angle));
  ok(new Set(angles).size === angles.length, 'every reading sits at a DISTINCT golden-angle — walking them spirals through different meanings');
  let minGap = 360; const sorted = [...angles].sort((a, c) => a - c); for (let i = 1; i < sorted.length; i++) minGap = Math.min(minGap, sorted[i] - sorted[i - 1]);
  ok(minGap > 15, `no two readings clump together (smallest gap ${minGap}° — a spread, not a cluster)`);
  const one = newSession('x'); rise(one); walk(one, 'peer', 'warm'); ok(shape(one) === 'orbit', 'walking ONE reading is an orbit (the old habit)');
  ['peer', 'taught', 'door'].forEach(k => walk(one, k, 'r')); ok(shape(one) === 'spiral', 'walking the tree is a spiral (the upgrade)');
}

console.log('\n=== §4 · THE FLAG — SAVED, and re-collapsing the SAME wound DEEPENS it (never duplicates) ===');
{
  const store = newStore();
  const s1 = newSession('the breakup'); rise(s1); walk(s1, 'neutral', 'it just ended'); collapse(s1, 'neutral'); seal(store, s1, 100);
  ok(journal(store).length === 1 && recall(store, 'the breakup').reading === 'it just ended', 'a seal is saved and recallable by its event');
  // months later, re-collapse the SAME event deeper
  const s2 = newSession('The Breakup'); rise(s2); walk(s2, 'door', 'it made room for the work I do now'); walk(s2, 'peer', "it's all good — you made it here"); collapse(s2, 'door');
  const r = seal(store, s2, 200);
  ok(journal(store).length === 1, 'the same event does NOT create a second entry — content-addressed, one wound one thread');
  ok(r.deepened && recall(store, 'the breakup').recollapses === 2, 'it DEEPENED — the same past re-collapsed twice');
  ok(recall(store, 'the breakup').reading === 'it made room for the work I do now', 'the carried reading is the newest one you chose');
  ok(history(store, eventId('the breakup')).length === 2 && history(store, eventId('the breakup'))[0].reading === 'it just ended', 'the full history is kept — you can see how the reading changed over time');
}

console.log('\n=== §5 · THE JOURNAL — newest-first, nothing lost to the next chat ===');
{
  const store = newStore();
  for (const [ev, ts] of [['a', 1], ['b', 2], ['c', 3]]) { const s = newSession(ev); rise(s); walk(s, 'neutral', 'r'); collapse(s, 'neutral'); seal(store, s, ts); }
  ok(journal(store).map(x => x.event).join('') === 'cba', 'the journal is newest-first');
  const s = newSession('a'); rise(s); walk(s, 'peer', 'again'); collapse(s, 'peer'); seal(store, s, 4);
  ok(journal(store).map(x => x.event).join('') === 'acb', 're-collapsing an old event floats it back to the top');
  ok(stats(store).events === 3 && stats(store).recollapses === 4, 'the stats hold — 3 events, 4 re-collapses');
}

console.log('\n=== §6 · GUARDRAIL + BACKUP + DETERMINISM + FUZZ ===');
{
  ok(typeof GUARDRAIL === 'string' && /not a substitute|real care/i.test(GUARDRAIL) && /event stands|meaning/i.test(GUARDRAIL), 'the guardrail is present and honest — meaning not events, not a substitute for real care');
  const store = newStore(); const s = newSession('keep me'); rise(s); walk(s, 'taught', 'lesson'); collapse(s, 'taught'); seal(store, s, 1);
  const back = importStore(exportStore(store));
  ok(back && journal(back).length === 1 && recall(back, 'keep me').reading === 'lesson', 'export → import restores every sealed past (yours to keep)');
  ok(sha256('abc') === sha256('abc'), 'deterministic — the same event always addresses the same');
  let threw = false;
  try { newSession(); newSession(null); rise({}); walk(newSession('x'), 'nope', 'r'); collapse(newSession('x'), 'peer'); seal(newStore(), newSession('x')); journal({ seals: {}, order: [] }); importStore('garbage{'); recall(newStore(), ''); }
  catch { threw = true; }
  ok(!threw, 'empty / unknown / malformed input never throws');
  ok(importStore('nonsense') === null && !seal(newStore(), newSession('x')).ok, 'a bad backup is rejected, and you cannot seal nothing');
}

const done = fail === 0;
console.log('\n' + (done
  ? `=== ✅ RE-COLLAPSE — the event is fixed; its stored meaning is yours to re-choose. Named, walked as a spiral, collapsed for the most future, sealed — content-addressed, journaled, never lost · ${pass}/${pass} · zero tokens ===`
  : `=== ❌ ${fail} FAILED / ${pass + fail} ===`));
process.exit(done ? 0 : 1);
