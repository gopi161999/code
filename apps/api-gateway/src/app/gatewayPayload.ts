export class IGatewayPayload<T, S> {
    requestId: string;
    data: T;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    user: any;
    parentData?: S;
}
