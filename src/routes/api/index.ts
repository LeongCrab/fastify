import { FastifyInstance } from 'fastify';

import data from './data/route';
import inquiry from './inquiry/route';
import auth from './auth/route';

export default async (fastify: FastifyInstance) => {
  fastify.register(inquiry, { prefix: '/inquiry' });
  fastify.register(data, { prefix: '/data' });
  fastify.register(auth, { prefix: '/auth' });
}
