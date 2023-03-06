import dotenv from 'dotenv-flow';
import db from './lib/db';

if (!process.env.PORT) {
  dotenv.config();
}

db.$connect()
  .then(()=> {
    app.log.info('DB Connected');
  })
  .catch(e => app.log.error(e, 'DB Error'));

import fastify, { FastifyPluginAsync } from 'fastify';
import { join } from 'path';
import AutoLoad from '@fastify/autoload';
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';

import { loggerConfig } from './config/logger';
import plugins from './plugins';
import routes from './routes'

const app = fastify({ 
  logger: loggerConfig,
}).withTypeProvider<TypeBoxTypeProvider>();

const initPlugin: FastifyPluginAsync = async (fastify) => {
  await fastify.register(AutoLoad, {
    dir: join(__dirname, 'plugins/auto'),
  });
  await fastify.register(plugins.auth);
  await fastify.register(plugins.errorHandler);
  await fastify.register(routes);
}

app.register(initPlugin);

app.listen({ port: +process.env.PORT || 8080 }, (err, address) => {
  if(err){
    app.log.error(err);
  }
  console.log(`Server is running on ${address}`);
});