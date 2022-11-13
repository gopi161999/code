export const permission = {
    '1': ['user', 'admin'],
    '2': ['admin'],
    '3': ['user'],
};

export interface IResponse<T> {
    status: 'ERROR' | 'SUCCESS';
    data: T;
    msg: unknown;
}
