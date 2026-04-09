import fs from 'fs';
import path from 'path'
import json5 from 'json5';
import type { RegolithConfig } from './types';

const rootPath = process.env.ROOT_DIR;
if (!rootPath) {
    console.warn("ROOT_DIR environment variable not found");
    process.exit(1);
}
const configPath = path.resolve(rootPath, "config.json");
const config = json5.parse(await Bun.file(configPath).text()) as RegolithConfig;

const dataPath = config.regolith.dataPath;

if (!dataPath) {
    throw new Error("dataPath not found in config.json");
}

const gametestsDataPath = path.resolve(path.resolve(rootPath, dataPath), "gametests");

if (fs.existsSync(gametestsDataPath)) {
    console.log("Installing dependencies for gametests in", gametestsDataPath);
    Bun.spawnSync(["bun", "install"], {
        cwd: gametestsDataPath
    });
} else {
    console.log("gametests data folder not found, execute 'bun install' manually in", gametestsDataPath);
}

console.log("Setup completed.")