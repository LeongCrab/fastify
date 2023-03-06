import { FastifyInstance } from 'fastify';

import inquiryController from './controller';
import { getInquiryListSchema, getInquirySchema, completeInquirySchema, deleteInquirySchema } from './schema';

export default async (fastify: FastifyInstance) => {
  // GET | /admin/inquiry/?limit=&offset=
  fastify.get('/', { schema: getInquiryListSchema }, inquiryController.getInquiryList);
  // GET | /admin/inquiry/:requestId
  fastify.get('/:requestId', { schema: getInquirySchema }, inquiryController.getInquiry);
  // PATCH | /admin/inquiry/:requestId/complete
  fastify.patch('/:requestId/complete', { schema: completeInquirySchema }, inquiryController.completeInquiry);
  // DELETE | /admin/inquiry/:requestId
  fastify.delete('/:requestId', { schema: deleteInquirySchema }, inquiryController.deleteInquiry);
};