const optionalVariables: string[] = ['INTERVAL_TIMER'];
const mandatoryVariables: string[] = ['NODE_ENVIRONMENT'];

export function checkEnvValue() {
    optionalVariables.forEach((v) => {
        if (!process.env[v]) {
            console.warn(`Environment Variable : ${v} is not set`);
        }
    });
    const errors: string[] = [];
    mandatoryVariables.forEach((v) => {
        if (!process.env[v])
            errors.push(`Envirionment Variable : ${v} must be set`);
    });
    if (errors.length > 0) errors.forEach((v) => console.error(v));
}

export const environment = {
    intervalTime: parseInt(process.env.INTERVAL_TIMER ?? '60000'),
    production: process.env.NODE_ENVIRONMENT === 'production',
} as const;
