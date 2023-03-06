import { FastifyInstance } from 'fastify';

import dataController from './controller';
import { getDataSchema, getPlatformSchema, encodeImageSchema } from './schema';

export default async (fastify: FastifyInstance) => {
  // GET | api/data/platform/:id
  fastify.get('/platform/:id', { schema: getPlatformSchema }, dataController.getPlatform);
  // GET | api/data/scrap/metadata?url=
  fastify.get('/scrap/metadata', { schema: getDataSchema }, dataController.getData);
  // GET | api/data/scrap/image?url=
  fastify.get('/scrap/image', { schema: encodeImageSchema }, dataController.encodeImage);
} 