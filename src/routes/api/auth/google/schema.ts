import { Type } from '@sinclair/typebox';
import { FastifyRequestHandler, SchemaRoute } from '../../../../lib/RouteType';

export const CallbackSchema = {
  querystring: Type.Object({
    code: Type.String(),
    scope: Type.String(),
  })
}

export type CallbackController = FastifyRequestHandler<SchemaRoute<typeof CallbackSchema>>;