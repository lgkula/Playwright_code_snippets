type LogType = 'log' | 'info' | 'warn' | 'error';
type LogLevel = 'critical' | 'important' | 'all';
const acceptableEnvVariableSettings = ['CRITICAL', 'IMPORTANT', 'ALL'];

export const pwLogger = (
    logText: string,
    logType: LogType = 'log',
    logLevel: LogLevel = 'all',
) => {
    if (process.env.ENHANCED_LOGGER !== 'TRUE') {
        return;
    }
    if (!process.env.LOGGER_LEVEL) {
        throw new Error('Please provide LOGGER_LEVEL env variable');
    }
    if (!acceptableEnvVariableSettings.includes(process.env.LOGGER_LEVEL)) {
        throw new Error(
            'Please provide correct value LOGGER_LEVEL env variable',
        );
    }

    const choseLoggerType = (logType, logText) => {
        switch (logType) {
            case 'log':
                console.log(logText);
                break;
            case 'info':
                console.info(logText);
                break;
            case 'warn':
                console.warn(logText);
                break;
            case 'error':
                console.error(logText);
                break;
            default:
                console.log(logText);
        }
    };

    if (process.env.LOGGER_LEVEL === 'CRITICAL') {
        if (logLevel === 'critical') {
            choseLoggerType(logType, logText);
        }
    } else if (process.env.LOGGER_LEVEL === 'IMPORTANT') {
        if (logLevel === 'critical' || logLevel === 'important') {
            choseLoggerType(logType, logText);
        }
    } else {
        choseLoggerType(logType, logText);
    }
};
