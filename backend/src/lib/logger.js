import winston from 'winston';

const { combine, timestamp, printf, colorize, errors } = winston.format;

const logFormat = printf(({ level, message, timestamp, stack, method, httpMethod, req, ...meta }) => {
  let detectedMethod = method || httpMethod || req?.method;
  let cleanMessage = stack || message;

  // If no method explicitly passed, check if message begins with [METHOD] or METHOD
  if (!detectedMethod && typeof cleanMessage === 'string') {
    const match = cleanMessage.match(/^\[?(GET|POST|PUT|PATCH|DELETE|OPTIONS|HEAD)\]?[:\s]+(.*)$/i);
    if (match) {
      detectedMethod = match[1].toUpperCase();
      cleanMessage = match[2];
    }
  }

  const methodTag = detectedMethod ? ` [${String(detectedMethod).toUpperCase()}]` : '';
  const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';

  return `[${timestamp}] [${level}]${methodTag}: ${cleanMessage}${metaStr}`;
});

export const winstonLogger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: combine(
    colorize(),
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    errors({ stack: true }),
    logFormat
  ),
  transports: [
    new winston.transports.Console()
  ]
});

// Primary logger export for Winston
export const logger = winstonLogger;
