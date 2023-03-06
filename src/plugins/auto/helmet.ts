import helmet from '@fastify/helmet';
import fp from 'fastify-plugin';

export default fp(async fastify => {
  if (process.env.NODE_ENV === 'production') {
    fastify.register(helmet, { contentSecurityPolicy: false, global: true });
  }
});