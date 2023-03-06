import { Type } from '@sinclair/typebox';
import { FastifyRequestHandler, SchemaRoute } from '../../../lib/RouteType';

export const getDataSchema = {
  querystring: Type.Object({
    url: Type.String({ format: 'uri' }),
  })
}

export type getDataController = FastifyRequestHandler<SchemaRoute<typeof getDataSchema>>;

export const getPlatformSchema = {
  params: Type.Object({
    id: Type.Optional(Type.Number()),
  })
}

export type getPlatformController = FastifyRequestHandler<SchemaRoute<typeof getPlatformSchema>>;

export const encodeImageSchema = {
  querystring: Type.Object({
    url: Type.String({ format: 'uri' }),
  })
}

export type encodeImageController = FastifyRequestHandler<SchemaRoute<typeof encodeImageSchema>>;