
# Bunnyscript

Bunnyscript lets you develop Script API code using the Bun runtime.

Inspired by:
- [gametests](https://github.com/Bedrock-OSS/regolith-filters/tree/master/gametests), which uses ESBuild
- [dinoscript](https://github.com/azurite-bedrock/regolith-filters/tree/main/dinoscript), which uses Deno


## Installation

Install automatically via Regolith:

```bash
regolith install bunnyscript
```

Then add the following to the relevant profiles to apply the filter:

```json
{
    "filters": [
        {
            "filter": "bunnyscript",
            "settings": {
                "buildOptions": {
                    "entrypoints": ["data/bunnyscript/src/main.ts"],
                    "outdir": "BP/scripts",
                    "external": ["@minecraft/server"]
                },
                "debugBuild": false
            }
        }
    ]
}
```

## Configuration

| Name         | Type                                                     | Default                                                       | Description                                              |
|--------------|----------------------------------------------------------|---------------------------------------------------------------|----------------------------------------------------------|
| buildOptions | [buildOptions](https://bun.com/reference/bun/build)      | [Default Build Options](#default-build-options)  | Specifies build options                                  |
| debugBuild   | `boolean`                                                | `false`                                                       | Enables source maps and adds launch configuration        |

### Default Build Options
```json
{
    "entrypoints": ["data/bunnyscript/src/main.ts"],
    "outdir": "BP/scripts",
    "naming": "main.js",
    "format": "esm",
    "minify": true,
    "external": ["@minecraft/server"]
}
```