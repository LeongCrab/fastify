import { Type, TSchema } from '@sinclair/typebox';
import { FastifyRequestHandler, SchemaRoute } from '../../../lib/RouteType';
import RegEx from '../../../lib/RegEx';

const Nullable = <T extends TSchema>(type: T) => Type.Union([type, Type.Null()]);

export const addInquirySchema = {
  body: Type.Object({
    imageSrc: Type.Optional(Type.String()),
    what: Type.String(),
    phone: Type.RegEx(RegEx.phone),
    time: Type.Optional(Type.Number()),
    platformId: Type.Optional(Type.Number()),
    userId: Type.Optional(Type.Number()),
    video: Type.Optional(
      Nullable(
        Type.Object({
          pId: Type.Optional(Type.String()),
          desc: Type.Optional(Type.String()),
          title: Type.Optional(Type.String()),
        })
      )
    ),
    metadata: Type.Object({
      desc: Type.Optional(Type.String()),
      thumbnail: Type.Optional(Type.String()),
      title: Type.Optional(Type.String()),
      url: Type.String(),
      canonical: Type.Optional(Type.String()),
    }),
  }),
}

export type addInquiryController = FastifyRequestHandler<SchemaRoute<typeof addInquirySchema>>;