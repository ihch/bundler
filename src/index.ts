import fs from 'fs';
import { createLogger } from "./logger.js";
import { createModulePathResolver, getBasePath, getEntryFile, getFileName, isNodeModule } from "./path.js";
import { parse as babelParse } from '@babel/parser';
import Traverse from '@babel/traverse';
import prettier from 'prettier';

const traverse = Traverse.default;

function parse(code: string) {
    return babelParse(code);
}

function createModuleAnalyzer(basePath: string) {
    const modules = new Map();

    const analyzeModule = (entryFilePath: string) => {
        const modulePathResolver = createModulePathResolver(getBasePath(entryFilePath));
        const modulePath = isNodeModule(entryFilePath)
            ? modulePathResolver.getNodeModulePath(entryFilePath)
            : modulePathResolver.getModulePath(entryFilePath);

        const code = fs.readFileSync(modulePath, { encoding: 'utf8' })
        const ast = parse(code);

        traverse(ast, {
            // @ts-ignore
            CallExpression({ node: { callee, arguments: args } }) {
                if (callee.type === 'Identifier' && callee.name === 'require') {
                    const importModule = args[0].extra?.rawValue as string;
                    if (importModule.includes('node:')) { }
                    else {
                        analyzeModule(importModule);
                    }
                }
            }
        });

        modules.set(entryFilePath, {
            code,
        });

        return modules;
    }

    return analyzeModule
}

function main() {
    const logger = createLogger({ disabled: true });

    logger.info('Start bundler process');

    const entryFilePath = getEntryFile();
    logger.info(getBasePath(entryFilePath));
    logger.info(getFileName(entryFilePath));

    const analyzeModule = createModuleAnalyzer(entryFilePath);
    const modules = analyzeModule(entryFilePath);

    const template =
`
((modules) => {
    const usedModules = {};

    function require(moduleId) {
        if (usedModules[moduleId]) {
            return usedModules[moduleId].exports;
        }

        const module = (usedModules[moduleId] = {
            exports: {},
        });
        modules[moduleId](module, module.exports, require);

        return module.exports;
    }

    return require("${entryFilePath}");
})({
    ${Array.from(modules.entries()).map(([key, value]: [key: string, value: { code: string }]) => {
        if (value.code === '') return '';
        return `\t"${key}": function (module, exports, require) { ${value.code} }`
    }).join(',\n')}
});
`;

    // printing to stdout
    console.log(prettier.format(template, { 'parser': 'babel' }));

    logger.info('Finish bundler process')
}

main();
