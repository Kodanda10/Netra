# Development Log

- 2025-08-11 12:46:19 UTC: Initialized development log.

- 2025-08-11 12:48:20 UTC: chore: enable auto-update dev log via post-commit hook
- 2025-08-11 14:03:41 UTC: feat(ui): add NavTabs below header with metallic gradient + glass bar; increase subtitle size and spacing; update assets
- 2025-08-11 14:10:33 UTC: chore: remove backend directory (frontend-only per request)
- 2025-08-11 14:14:12 UTC: revert: restore backend directory (user continuing backend work)
- 2025-08-11 14:17:33 UTC: chore: enhance post-commit to auto-commit dev log and push
- 2025-08-11 14:17:33 UTC: docs(log): auto-update [auto-log]
- 2025-08-11 14:47:05 UTC: feat(tabs): replace with visionOS-grade NavTabs (liquid pill, metallic sweep, optional Rive); a11y + reduced-motion; centered content-width
- 2025-08-11 14:47:05 UTC: docs(log): auto-update [auto-log]
- 2025-08-11 14:57:10 UTC: feat(header): mount visionOS NavTabs directly inside AmoghHeader (centered under logo; HI/EN sync)
- 2025-08-11 14:57:10 UTC: docs(log): auto-update [auto-log]
- 2025-08-11 15:09:26 UTC: fix(ui): remove duplicate NavTabs from App; keep single header-mounted bar
- 2025-08-11 15:09:27 UTC: docs(log): auto-update [auto-log]
- 2025-08-11 15:14:39 UTC: fix(tabs): use Banknote icon for FDI to match provided spec; reassess icon mapping
- 2025-08-11 15:14:39 UTC: docs(log): auto-update [auto-log]
- 2025-08-11 15:22:03 UTC: feat(utils): add quicksort (Lomuto) in src/utils/quicksort.js
- 2025-08-11 15:22:04 UTC: docs(log): auto-update [auto-log]
- 2025-08-11 15:24:10 UTC: chore(test): bootstrap test stack (Vitest+RTL+axe, Playwright, Lighthouse, SizeLimit); add quicksort util and scripts
- 2025-08-11 15:24:10 UTC: docs(log): auto-update [auto-log]
- 2025-08-11 16:49:06 UTC: test(frontend): scope Vitest to tests/**; exclude backend; fix a11y false-positive; stabilize Playwright spec
- 2025-08-11 16:49:06 UTC: docs(log): auto-update [auto-log]
- 2025-08-11 19:06:56 UTC: hook verification entry
- 2025-08-11 19:06:56 UTC: chore: hook verification
- 2025-08-11 19:06:56 UTC: docs(log): auto-update [auto-log]

- 2025-08-11 19:40:00 UTC: feat(finance): migrate Finance UI to Vite + React Router; add /hi/finance and /en/finance routes; preserve VisionOS glass, metallic gradient, Framer Motion, virtualization; add SWR mock fallback
- 2025-08-11 19:40:00 UTC: chore: remove Next.js app/ folder to avoid conflicts; keep SPA routing via vercel.json
- 2025-08-11 19:40:00 UTC: build: Vite prod build successful; assets generated; fonts resolved at runtime via @fontsource
- 2025-08-11 19:11:59 UTC: feat(finance): migrate to Vite + React Router; add /hi/finance and /en/finance pages; preserve animations & styles; add SWR mock fallback; remove Next app/; build clean
