export interface DefaultSettings {
    buildOptions: Bun.BuildConfig,
    debugBuild: boolean
}

export interface RegolithConfig {
    regolith: {
        dataPath: string,
    }
}