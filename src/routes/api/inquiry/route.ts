import { FastifyInstance } from 'fastify';

import inquiryController from './controller';
import { addInquirySchema } from './schema';

export default async (fastify: FastifyInstance) => {
  // POST | api/inquiry/request
  fastify.post('/request', { schema: addInquirySchema }, inquiryController.addInquiry);
};