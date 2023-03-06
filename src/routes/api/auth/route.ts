import { FastifyInstance } from 'fastify';
import plugins from '../../../plugins';

import authController from './controller';
import { SignUpSchema, LogInSchema, RefreshSchema } from './schema';
import { CallbackSchema } from './kakao/schema';
import googleController from './google/controller';
import kakaoController from './kakao/controller';
import { getInquiryListSchema } from '../../admin/inquiry/schema';

export default async (fastify: FastifyInstance) => {
  // POST | api/auth/signup
  fastify.post('/signup', { schema: SignUpSchema }, authController.signUp);
  // POST | api/auth/login
  fastify.post('/login', { schema: LogInSchema }, authController.logIn);
  // POST | api/auth/refresh
  fastify.post('/refresh', {schema: RefreshSchema }, authController.refresh);
  // below APIs are required authorization
  fastify.register(async (_fastify: FastifyInstance) => {
    _fastify.register(plugins.requireAuth);
    // GET | api/auth/me
    _fastify.get('/me', authController.getMe);
    // GET | api/auth/myInquiry
    _fastify.get('/myInquiry', { schema: getInquiryListSchema }, authController.getMyInquiry);
    // DELETE | api/auth/logout
    _fastify.delete('/logout', authController.logOut);
  });

  // OAuth
  // Kakao
  fastify.get('/kakao/login', kakaoController.getCode);
  fastify.get('/kakao/login/callback', { schema: CallbackSchema }, kakaoController.callback);
  // Google
  fastify.get('/google/login', googleController.getCode);
  fastify.get('/google/login/callback', { schema: CallbackSchema }, googleController.callback);
};