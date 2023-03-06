import { FastifyInstance } from 'fastify';

import inquiry from './inquiry/route';

export default async (fastify: FastifyInstance) => {
  fastify.register(inquiry, { prefix: '/inquiry' });
}
