type LoggerFunction = (message?: any, ...optionalProps: any[]) => void;

export type Logger = {
    info: LoggerFunction;
    warn: LoggerFunction;
    error: LoggerFunction;
}

export function createLogger(): Logger {
    const info: LoggerFunction = (message, ...optionalProps) => {
        console.log(
            '[INFO]',
            message,
            ...optionalProps,
        )
    };
    const warn: LoggerFunction = (message, ...optionalProps) => {
        console.log(
            '[WARN]',
            message,
            ...optionalProps,
        )
    };
    const error: LoggerFunction = (message, ...optionalProps) => {
        console.log(
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
