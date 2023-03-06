import fp from 'fastify-plugin';
import BaseError from '../lib/BaseError';

export default fp(async (fastify) => {
  fastify.addHook('preHandler', async (request) => {
    if (request.isExpiredToken) {
      throw new BaseError('TokenExpiredError');
    }
    if (!request.user) {
      throw new BaseError('Unauthorized');
    }
  });
});