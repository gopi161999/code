import { DateFormat, defaultLocation, IOptions } from './interface';
import { frameMessageType } from './utils';
import { environment } from './environment';
import { Injectable } from '@nestjs/common';
@Injectable()
export class MyLogger {
    private debugLogging = false;
    private dateFormat: DateFormat = 'string';

    static instance = new MyLogger(defaultLocation);
    constructor(private readonly location: string) {}

    setFormat(format: DateFormat) {
        this.dateFormat = format;
    }

    enableDebugLogging() {
        this.debugLogging = true;
    }

    disableDebugLogging() {
        this.debugLogging = false;
    }

    log(
        requestId: string,
        message: string,
        options: IOptions = { flags: ['DEFAULT'] }
    ) {
        this.info(requestId, message, options);
    }
    info(
        requestId: string,
        message: string,
        options: IOptions = { flags: ['DEFAULT'] }
    ) {
        frameMessageType('log', {
            requestId,
            message,
            location: this.location,
            format: this.dateFormat,
            options,
        });
    }
    error(
        requestId: string,
        message: string,
        options: IOptions = { flags: ['DEFAULT'] }
    ) {
        frameMessageType('error', {
            requestId,
            message,
            location: this.location,
            format: this.dateFormat,
            options,
            error: new Error().stack,
        });
    }
    debug(
        requestId: string,
        message: string,
        options: IOptions = { flags: ['DEFAULT'] }
    ) {
        if (environment.production && this.debugLogging == false) return;
        frameMessageType('debug', {
            requestId,
            message,
            location: this.location,
            format: this.dateFormat,
            options,
        });
    }
    warn(
        requestId: string,
        message: string,
        options: IOptions = { flags: ['DEFAULT'] }
    ) {
        frameMessageType('warn', {
            requestId,
            message,
            location: this.location,
            format: this.dateFormat,
            options,
        });
    }
}
