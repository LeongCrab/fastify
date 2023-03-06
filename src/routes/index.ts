import api from './api';
import admin from './admin';
import { FastifyInstance } from 'fastify';

export default async (fastify: FastifyInstance) => {
  fastify.register(api, { prefix: '/api' });
  fastify.register(admin, { prefix: '/admin' });
};