import fp from 'fastify-plugin';

import { AccessTokenPayload, validateToken } from '../lib/token';
import { JsonWebTokenError } from 'jsonwebtoken';

declare module 'fastify' {
  interface FastifyRequest {
    user: {
      id: number;
    } | null;
    isExpiredToken: boolean;
  }
}

export default fp(async (fastify) => {
  fastify.decorateRequest('user', null);
  fastify.decorateRequest('isExpiredToken', false);
  fastify.addHook('preHandler', async (request) => {
    const token = request.headers.authorization?.split(' ')[1] ?? request.cookies.access_token;
    if (!token) return;
    try {
      const decoded = await validateToken<AccessTokenPayload>(token);
      request.user = {
        id: decoded.userId
      };
    } catch (e: any) {
      if (e instanceof JsonWebTokenError) {
        if (e.name === 'TokenExpiredError') {
          request.isExpiredToken = true;
        }
      }
    }
  });
});