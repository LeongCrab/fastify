import fp from 'fastify-plugin';
import cors, { FastifyCorsOptions } from '@fastify/cors';

export default fp(async fastify => {
  let opt: FastifyCorsOptions;
  if( process.env.NODE_ENV === 'production') {
    opt = {
      origin: [/turnup\.ai$/, /turnup\.me$/],
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
      credentials: true,
    };
  } else {
    opt = {
      origin: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
      credentials: true,
    };
  }

  await fastify.register(cors, opt);
})