import { Type } from '@sinclair/typebox';
import { FastifyRequestHandler, SchemaRoute } from '../../../lib/RouteType';

export const getInquiryListSchema = {
  querystring: Type.Object({
    limit: Type.Optional(Type.Number()),
    offset: Type.Optional(Type.Number()),
  })
};

export type getInquiryListController = FastifyRequestHandler<SchemaRoute<typeof getInquiryListSchema>>;

export const getInquirySchema = {
  params: Type.Object({
    requestId: Type.Number(),
  })
};

export type getInquiryController = FastifyRequestHandler<SchemaRoute<typeof getInquirySchema>>;

export const completeInquirySchema = {
  params: Type.Object({
    requestId: Type.Number(),
  }),
  body: Type.Object({
    state: Type.Optional(Type.Union([Type.Literal('exact'), Type.Literal('similar')])),
    product: Type.Object({
      brand: Type.String(),
      price: Type.String(),
      name: Type.String(),
      url: Type.String(),
    }),
  })
};

export type completeInquiryController = FastifyRequestHandler<SchemaRoute<typeof completeInquirySchema>>;

export const deleteInquirySchema = {
  params: Type.Object({
    requestId: Type.Number(),
  })
};

export type deleteInquiryController = FastifyRequestHandler<SchemaRoute<typeof deleteInquirySchema>>;
