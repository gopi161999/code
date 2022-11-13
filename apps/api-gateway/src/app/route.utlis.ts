export const IncomingHeaders = {
    API_TESTING_1: [
        {
            header: 'f_service',
            permission: '1',
            auth: false,
            doneWith: 'f_service_data',
        },
        {
            header: 'second_service',
            permission: '1',
            auth: false,
            doneWith: 'second_service_data',
        },
        {
            header: 'service',
            permission: '1',
            auth: false,
            doneWith: 'service_data',
        },
    ],
    API_SIGNUP: [{ header: 'SIGNUP', auth: false, doneWith: 'Signup details' }],
    API_LOGIN: [{ header: 'LOGIN', auth: false, doneWith: 'Login details' }],
    API_TESTING: [{ header: 'f_service', permission: '3', auth: true }],
};

// export type IHeaders = keyof typeof IncomingHeaders;
