export interface DefaultSettings {
    buildOptions: Bun.BuildConfig,
    debugBuild: boolean,
    typeCheck: boolean
}

export interface RegolithConfig {
    regolith: {
        dataPath: string,
    }
}