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

const filterDataPath = path.resolve(path.resolve(rootPath, dataPath), "bunnyscript");

if (fs.existsSync(filterDataPath)) {
    console.log("Installing dependencies for bunnyscript in", filterDataPath);
    Bun.spawnSync(["bun", "install"], {
        cwd: filterDataPath
    });
} else {
    console.error("bunnyscript data folder not found, execute 'bun install' manually in", filterDataPath);
}

console.log("Setup completed.")