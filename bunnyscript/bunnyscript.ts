import type { DefaultSettings } from "./types";
import { existsSync } from "fs";
import json5 from "json5";
import path from "path";

const cwdDir = process.cwd();
const rootDir = process.env.ROOT_DIR as string;

const defaultSettings: DefaultSettings = {
    buildOptions: {
        entrypoints: ["data/bunnyscript/src/main.ts"],
        outdir: "BP/scripts",
        naming: "main.js",
        format: "esm",
        minify: true,
        external: ["@minecraft/server", "@minecraft/server-ui"]
    },
    debugBuild: false
}

const argParsed = process.argv[2] ? JSON.parse(process.argv[2]) : {};
const settings: DefaultSettings = Object.assign({}, defaultSettings, argParsed);

settings.buildOptions = Object.assign({}, defaultSettings.buildOptions, argParsed.buildOptions || {});
settings.buildOptions.outdir = path.join(cwdDir, settings.buildOptions.outdir as string);
settings.buildOptions.external = [...defaultSettings.buildOptions.external!, ...(argParsed.buildOptions?.external || [])];
settings.buildOptions.entrypoints = settings.buildOptions.entrypoints.map((entrypoint: string) => path.join(cwdDir, entrypoint));

if (settings.debugBuild) {
    settings.buildOptions.minify = false;
    settings.buildOptions.sourcemap = "linked";
}

const p = performance.now();
const result = await Bun.build(settings.buildOptions)
if (result.success) {
    if (settings.debugBuild) {
        const config = json5.parse(await Bun.file(path.join(rootDir, "config.json")).text());
        const behaviorPackPath = config.packs.behaviorPack as string;
        const dataPath = config.regolith.dataPath as string;

        const launchConfigPath = path.join(rootDir, ".vscode", "launch.json");

        interface LaunchConfig {
            version: string,
            configurations: any[]
        }
        const launchConfig: LaunchConfig = existsSync(launchConfigPath) ? json5.parse(await Bun.file(launchConfigPath).text()) : { version: "0.3.0", configurations: [] };

        let uuid;

        const manifest = Bun.file(path.join(rootDir, behaviorPackPath, "manifest.json"));
        if (await manifest.exists()) {
            const parsed = json5.parse(await manifest.text());
            const modules = parsed.modules as { type: string, uuid: string }[] || [];
            uuid = modules.find((module) => module.type == "script")?.uuid;
        }

        interface DebuggerConfig {
            type: string,
            request: string,
            name: string,
            mode: string,
            targetModuleUuid?: string,
            sourceMapRoot: string,
            generatedSourceRoot: string,
            localRoot: string,
            port: number
        }
        const debuggerConfig: DebuggerConfig = {
            "type": "minecraft-js",
            "request": "attach",
            "name": "(bunnyscript) Debug with Minecraft",
            "mode": "listen",
            "sourceMapRoot": path.join(cwdDir, "BP/scripts/"),
            "generatedSourceRoot": path.join(cwdDir, "BP/scripts/"),
            "localRoot": path.join(rootDir, dataPath, "bunnyscript/src/"),
            "port": 19144
        }

        if (uuid) {
            debuggerConfig.targetModuleUuid = uuid;
        } else {
            console.warn("No script module found in manifest.json");
        }

        if (!launchConfig.configurations) launchConfig.configurations = [];
        const index = launchConfig.configurations
            .findIndex((config) => config.name === "(bunnyscript) Debug with Minecraft");

        if (index !== -1) {
            launchConfig.configurations[index] = debuggerConfig;
        } else launchConfig.configurations.push(debuggerConfig);

        await Bun.write(launchConfigPath, JSON.stringify(launchConfig, null, 4));

        const oldBase = path.normalize("../../data");
        const newBase = dataPath;
        for (const output of result.outputs) {
            if (output.kind == "sourcemap") {
                const file = Bun.file(output.path);
                const json: { sources: string[] } = json5.parse(await file.text());

                json.sources = json.sources.map((source: string) => {
                    const relative = path.relative(oldBase, source);
                    const result = path.join(newBase, relative);

                    return path.join(rootDir, result);
                })

                await Bun.write(output.path, JSON.stringify(json));
            }
        }
    }
    console.log(`Build completed in ${performance.now() - p}ms`);
} else {
    console.error("Build failed");
    result.logs.forEach((log) => log.level == "error" && console.error(log));
    process.exit(1);
}