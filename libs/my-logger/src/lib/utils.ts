import {
    production,
    LogFramer,
    LogType,
    ILogDetails,
    IFrameMessageType,
    ILogFramer,
} from './interface';
export function addPadding(value: number, padding = 2) {
    return `${value}`.padStart(padding, '0');
}

export function getTime(): {
    timestamp: number;
    timeString: string;
} {
    const date = new Date();
    const timeString =
        addPadding(date.getDate()) +
        '/' +
        addPadding(date.getMonth() + 1) +
        '/' +
        date.getFullYear() +
        ' ' +
        addPadding(date.getHours()) +
        ':' +
        addPadding(date.getMinutes()) +
        ':' +
        addPadding(date.getSeconds()) +
        ':' +
        addPadding(date.getMilliseconds(), 3);
    return {
        timeString: timeString,
        timestamp: date.getTime(),
    };
}

export function frameMessageType(
    logType: LogType,
    data: IFrameMessageType
): void {
    const time = getTime();
    const logs: ILogFramer = {
        type: logType,
        date: data.format == 'string' ? time.timeString : time.timestamp,
        location: data.location,
        requestId: data.requestId,
        message: data.message,
    };
    const logMessage = LogFramer[logType](logs);
    const logDetails: ILogDetails = {
        logType: logType.toUpperCase(),
        time: time.timestamp,
        location: data.location,
        requestId: data.requestId,
        message: logMessage,
        errorStack: data.error,
        options: data.options,
    };
    if (production) console.log(logDetails);
    else console.log(logMessage);
}
