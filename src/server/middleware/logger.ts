import pino from 'pino';
import { Request, Response, NextFunction } from 'express';

export const logger = pino({
  level: 'info',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:standard',
      ignore: 'pid,hostname',
    },
  },
});

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();
  
  logger.info({
    event: 'request_start',
    method: req.method,
    url: req.url,
    headers: {
      'content-type': req.get('content-type'),
      'user-agent': req.get('user-agent'),
    },
    body: req.method !== 'GET' ? req.body : undefined,
    query: Object.keys(req.query).length ? req.query : undefined,
  });
  
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    logger.info({
      event: 'request_complete',
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration: `${duration}ms`,
      userAgent: req.get('user-agent'),
      ip: req.ip,
      body: req.method !== 'GET' ? req.body : undefined,
      query: Object.keys(req.query).length ? req.query : undefined,
      params: Object.keys(req.params).length ? req.params : undefined,
    });
  });

  next();
}; 