import pino from 'pino';
export const logger = pino({ redact: ['token', 'authorization', 'url', 'source_url', 'public_url', 'error', 'err'] });
