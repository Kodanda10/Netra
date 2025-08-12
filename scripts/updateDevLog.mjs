import { execSync } from 'node:child_process'
import { appendFileSync, existsSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'

function sh(cmd) {
  return execSync(cmd, { stdio: ['ignore', 'pipe', 'pipe'] }).toString().trim()
}

try {
  const repoRoot = sh('git rev-parse --show-toplevel')
  const logFile = join(repoRoot, 'develoment_logs.md')
  const resultsDir = join(repoRoot, 'FrontendUITesting')
  if (!existsSync(resultsDir)) mkdirSync(resultsDir, { recursive: true })
  const resultsFile = join(resultsDir, 'results.log')
  const ts = new Date().toISOString()
  const lastCommit = sh('git log -1 --pretty=format:"%h %ad | %an | %s" --date=iso-strict')
  let lastLine = ''
  try {
    lastLine = sh(`tail -n 3 "${resultsFile}" | sed -n '1p'`)
  } catch {}
  const entry = `\n## ${ts}\n- Commit: ${lastCommit}\n- Latest test log line: ${lastLine || 'n/a'}\n`
  appendFileSync(logFile, entry)
  process.exit(0)
} catch (e) {
  console.error('[updateDevLog] failed:', e?.message || e)
  process.exit(0)
}


