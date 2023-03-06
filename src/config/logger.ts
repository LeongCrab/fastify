import { FastifyServerOptions } from 'fastify';

const loggerConfigEnv: {
  [key in 'development' | 'production']:
    | FastifyServerOptions['logger']
    | boolean;
} = {
  development: {
    level: 'debug',
    transport: {
      target: '@mgcrea/pino-pretty-compact',
      options: {
        translateTime: 'SYS:[yy/mm/dd HH:MM:ss: Z]',
      },
    },
  },
  production: {
    level: 'info',
    transport: {
      target: '@mgcrea/pino-pretty-compact',
      options: {
        translateTime: 'SYS:[yy/mm/dd HH:MM:ss: Z]',
      },
    },
  },
};

export const loggerConfig =
  loggerConfigEnv[
    (process.env.NODE_ENV as 'development' | 'production') || 'development'
  ];
