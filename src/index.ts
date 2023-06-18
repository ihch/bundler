import { createLogger } from "./logger.js";
import { createModulePathResolver, getBasePath, getEntryFile, getFileName, isNodeModule } from "./path.js";

function main() {
    const logger = createLogger();

    logger.info('Start bundler process');

    const entryFilePath = getEntryFile();
    logger.info(getBasePath(entryFilePath));
    logger.info(getFileName(entryFilePath));

    const modulePathResolver = createModulePathResolver(getBasePath(entryFilePath));

    if (isNodeModule(entryFilePath)) {
        const a = modulePathResolver.getNodeModulePath(entryFilePath);
        logger.info('a', a);
    }
    else {
        const a = modulePathResolver.getModulePath(entryFilePath);
        logger.info(a);
    }

    logger.info('Finish bundler process')
}

main();
