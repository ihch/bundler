import fs from 'node:fs';
import { basename, dirname, extname, join } from "node:path";

/* 本来は入力されるもの */
export function getEntryFile(): string {
    return './main.js';
}

export function getBasePath(filePath: string): string {
    return dirname(filePath);
}

export function getFileName(filePath: string): string {
    if (filePath === '.') {
        return 'index.js';
    }

    if (extname(filePath) === '') {
        return `${filePath}.js`;
    }

    return basename(filePath);
}

export function isNodeModule(fileName: string): boolean {
    return !fileName.startsWith('.');
}

export function createModulePathResolver(basePath: string) {
    return {
        getModulePath(fileName: string): string {
            return join(basePath, getFileName(fileName));
        },

        getNodeModulePath(fileName: string): string {
            const modulePath = join(basePath, "node_modules", fileName);

            if (fileName.includes('/')) {
                const dir = dirname(modulePath);
                const name = basename(modulePath);
                return join(dir, getFileName(name));
            }

            const packageJson = fs.readFileSync(join(modulePath, "package.json"), { encoding: "utf8" });
            const parsedPackageJson = JSON.parse(packageJson);
            const entryFile = parsedPackageJson.main;
            return join(modulePath, entryFile);
        }
    }
}
