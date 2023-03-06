import fp from 'fastify-plugin'

export default fp (async (fastify) => {
  fastify.setErrorHandler(async (err, _, reply) => {
    console.error(err);
    reply.statusCode = err.statusCode ?? 500;
    return {
      name: err.name,
      statusCode: err.statusCode,
      message: err.message,
    }
  });
});