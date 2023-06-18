type LoggerFunction = (message?: any, ...optionalProps: any[]) => void;

export type Logger = {
    info: LoggerFunction;
    warn: LoggerFunction;
    error: LoggerFunction;
}

export function createLogger({ disabled = false }): Logger {
    if (disabled) {
        return {
            info: () => {},
            warn: () => {},
            error: () => {},
        };
    }

    const info: LoggerFunction = (message, ...optionalProps) => {
        console.info(
            '[INFO]',
            message,
            ...optionalProps,
        )
    };
    const warn: LoggerFunction = (message, ...optionalProps) => {
        console.warn(
            '[WARN]',
            message,
            ...optionalProps,
        )
    };
    const error: LoggerFunction = (message, ...optionalProps) => {
        console.error(
            '[ERROR]',
            message,
            ...optionalProps,
        )
    };

    return {
        info,
        warn,
        error,
    };
}
