# Tests

- **Consistency** (data/config): from project root run  
  `python3 scripts/tools/data/check_consistency.py`  
  or `npm run test:consistency`.  
  Checks: scene registry vs scene JS, hotspots, scene images, i18n coverage, English audio files per scene.

- **E2E** (Playwright): from project root run  
  `npm install` then `npx playwright install` (first time), then  
  `npm run test:e2e`.  
  Starts a local server and runs the smoke test (main menu → open first scene → assert "Find These" and object list).
