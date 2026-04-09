import { spawn } from 'child_process'
import path from 'path'

const argv = process.argv.slice(2)
spawn('bun', ['run', path.join(process.env.FILTER_DIR, "index.ts"), ...argv], {
    stdio: 'inherit'
})