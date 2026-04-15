import type { Settings } from "./types";
import { globSync } from "fast-glob";
import JSON5 from "json5";
import path from "path";

const defaultSettings: Settings = {
    includes: [],
    excludes: []
}

const argParsed = process.argv[2] ? JSON.parse(process.argv[2]) : {};
const settings: Settings = Object.assign({}, defaultSettings, argParsed);

if (!Array.isArray(settings.includes)) settings.includes = [settings.includes];
if (!Array.isArray(settings.excludes)) settings.excludes = [settings.excludes];

const cwd = process.cwd()

const minify = async (filePath: string) => {
    try {
        const file = Bun.file(filePath);
        const raw = await file.text();
        const parsed = JSON5.parse(raw);
        const minified = JSON.stringify(parsed);

        if (raw !== minified)
            await Bun.write(filePath, JSON.stringify(parsed));
    } catch (e) {
        console.error(`Invalid JSON file: ${path.relative(cwd, filePath)}`);
    }
}

const patterns = settings.includes.concat(settings.excludes.map(e => `!${e}`))
const files = globSync(patterns, { cwd, onlyFiles: true, absolute: true });

const limit = 20
for (let i = 0; i < files.length; i += limit) {
    const chunk = files.slice(i, i + limit)
    await Promise.all(chunk.map(minify))
}