# re-collapse — the event is fixed, the meaning is yours to re-choose

**▶ Live: https://sjgant80-hub.github.io/recollapse/**  (open it tonight; every re-collapse is saved on your device and will be there tomorrow)

A quiet practice, made permanent. What happened is fixed — you never edit it. But the **meaning** you carry is
live, and it's re-choosable. This tool walks the five steps and **saves every one**, so no session is ever lost to
the next chat.

## The mechanism (not mysticism)

Memories are reconstructed each time you recall them (**reconsolidation**), and the emotional charge of the stored
version can change while the event itself stays fixed. So: you can't change what happened, but you have authority
over **which past you carry** — and a wound-past and a lesson-past reach different futures. That's the whole idea:
re-collapse the *stored meaning*, not the event.

## The five steps

1. **Name it** — the fixed event. You won't edit this.
2. **Rise** — climb above the scene. From inside you orbit the wound; from above it's a bounded thing you can hold.
3. **Walk the readings** — turn it in the light. Each reading sits **137.5° further round** (the golden angle), so
   walking a few makes you *spiral* through genuinely different meanings instead of *orbiting* one. (The first is
   the peer one: *"it's all good — you made it here."*)
4. **Collapse** — choose the reading that opens the **most future** — not the safest. This choice is always yours.
5. **Seal** — that reading is what you now carry. The event stands; the meaning is re-collapsed; the reachable
   futures have shifted.

## Made permanent — a repo, not a chat

Every seal is saved, **content-addressed by the event** (real SHA-256). So re-collapsing the *same* thing later
**deepens** its reading instead of duplicating it — one wound, one thread — and the **journal** holds every past
you've re-chosen, newest first, with the full history of how each reading changed. Nothing is lost to the next
session. That was the whole point.

## The guardrail (honest, load-bearing)

It works on **meaning, not events**, and it is **not a substitute for real care**. If something needs a person, a
professional, or action in the present, that comes first. Some pasts need more than a re-reading; be kind to
yourself about which is which. The event stands; only the stored meaning is yours to re-choose.

## Proven — `node test.mjs`, zero tokens, 29/29

`§1` the content-address is real (SHA-256 matches the canonical vectors; the same event maps to the same id) ·
`§2` the five steps are a real state machine (you can only collapse a reading you actually walked) · `§3` the
branch-walk spirals, not orbits (distinct golden angles, no clustering) · `§4` **the flag** — re-collapsing the
same event *deepens* it, never duplicates, full history kept · `§5` the journal is newest-first, nothing lost ·
`§6` guardrail present · backup round-trips · deterministic · fuzz-safe.

## Files

`recollapse.mjs` (the kernel — SHA-256 content-addressing, the golden-offset branch-walk, the five-step state
machine, the deepen-don't-duplicate seal store + journal, the guardrail) · `test.mjs` (the 29/29 gate) ·
`index.html` (the quiet five-step tool + journal). Zero-dep, offline PWA, your journal stays on your device.

```bash
node test.mjs                 # the proof
python -m http.server 8080    # then open http://localhost:8080
```

*Fold-into-the-estate spec (mechanism, the two upgrades, fall-remember / si-didy wiring) lives in the private
v23 seed, §Q. A sealed re-collapse is a fall-remember write — a re-compressed memory with a typed edge*
`event —recollapsed-to→ new reading`. *si-didy may guide a session but must never collapse for you — the choice of
which past to carry is always yours.*
