import path from "path";
import type { DefaultSettings } from "./types";

const rootDir = process.cwd();


const defaultSettings: DefaultSettings = {
    buildOptions: {
        entrypoints: ["data/gametests-bun/src/main.ts"],
        outdir: "BP/scripts",
        naming: "main.js",
        format: "esm",
        minify: true
    },
    debugBuild: false
}

const argParsed = process.argv[2] ? JSON.parse(process.argv[2]) : {};
const settings: DefaultSettings = Object.assign({}, defaultSettings, argParsed);

settings.buildOptions = Object.assign({}, defaultSettings.buildOptions, settings.buildOptions);
settings.buildOptions.entrypoints = settings.buildOptions.entrypoints.map((entrypoint: string) => path.join(rootDir, entrypoint));
settings.buildOptions.outdir = path.join(rootDir, settings.buildOptions.outdir as string);

await Bun.build(settings.buildOptions);