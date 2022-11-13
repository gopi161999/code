import { environment } from './environment';

export type DateFormat = 'string' | 'epoch';
export const defaultLocation = `Logger`;
export const production = environment.production;
export const ONE_MINUTE = 60_000;
export type IFrameMessageType = {
    requestId: string;
    message: string;
    location: string;
    format: DateFormat;
    options: IOptions;
    error?: string;
};

export interface ILogFramer {
    type: LogType;
    message: string;
    date: string | number;
    location: string;
    requestId: string;
}

export type LogType = 'log' | 'error' | 'warn' | 'debug';

const addPad = (text: string, padLength = 5, padCharacter = ' ') =>
    text.padEnd(padLength, padCharacter).slice(padLength * -1);
export const LogFramer: {
    [K in LogType]: (logFramer: ILogFramer) => string | null;
} = {
    log: (log: ILogFramer) =>
        production
            ? `[${log.requestId}] ${log.message}`
            : `\x1B[32m${addPad(log.type.toUpperCase())}\x1B[0m ${
                  log.date
              } \x1B[33m[${log.location}] [${log.requestId}]\x1B[0m \x1B[32m${
                  log.message
              }\x1B[0m`,
    error: (log: ILogFramer) =>
        production
            ? `[${log.requestId}] ${log.message}`
            : `\x1B[31m${addPad(log.type.toUpperCase())}\x1B[0m ${
                  log.date
              } \x1B[33m[${log.location}] [${log.requestId}]\x1B[0m \x1B[31m${
                  log.message
              }\x1B[0m`,
    warn: (log: ILogFramer) =>
        production
            ? `[${log.requestId}] ${log.message}`
            : `\x1B[33m${addPad(log.type.toUpperCase())}\x1B[0m ${
                  log.date
              } \x1B[33m[${log.location}] [${log.requestId}]\x1B[0m \x1B[33m${
                  log.message
              }\x1B[0m`,
    debug: (log: ILogFramer) =>
        production
            ? `[${log.requestId}] ${log.message}`
            : `\x1B[35m${addPad(log.type.toUpperCase())}\x1B[0m ${
                  log.date
              } \x1B[33m[${log.location}] [${log.requestId}]\x1B[0m \x1B[35m${
                  log.message
              }\x1B[0m`,
} as const;

export const Flag = {
    DEFAULT: 'DEFAULT',
    SECURITY: 'SECURITY',
    OPERATIONS: 'OPERATIONS',
} as const;

export type Flag = typeof Flag[keyof typeof Flag];

export interface IOptions {
    flags: Flag[];
    userId?: string;
    data?: any;
}

export interface ILogOptions extends IOptions {
    location?: string;
    format?: DateFormat;
}

export interface ILogDetails {
    logType: string;
    time: number;
    location: string;
    requestId: string;
    message: string;
    errorStack?: string;
    options: IOptions;
}
