const fs = require('fs');
const glob = require("fast-glob")

const defSettings = {
    includes: [],
    excludes: []
}

/** @type {typeof defSettings} */
const argParsed = process.argv[2] ? JSON.parse(process.argv[2]) : {}
const settings = Object.assign({}, defSettings, argParsed)

const resolveEntryPoints = (includes = [], excludes = []) => {
    const includePatterns = Array.isArray(includes) ? includes : [includes]
    const excludePatterns = (Array.isArray(excludes) ? excludes : [excludes])
        .map(p => '!' + p)

    const patterns = [...includePatterns, ...excludePatterns]

    return glob.sync(patterns, { absolute: true, onlyFiles: true })
}

const minifyFile = (filePath) => {
    const raw = fs.readFileSync(filePath, 'utf-8')
    const minified = JSON.stringify(JSON.parse(raw))
    
    
    fs.writeFileSync(filePath, minified)
}

resolveEntryPoints(settings.includes, settings.excludes).forEach(minifyFile)