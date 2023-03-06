import { Type, TSchema } from '@sinclair/typebox';
import { FastifyRequestHandler, SchemaRoute } from '../../../lib/RouteType';
import RegEx from '../../../lib/RegEx';
import { FastifyReply, FastifyRequest } from 'fastify';

const Nullable = <T extends TSchema>(type: T) => Type.Union([type, Type.Null()]);

export type AsyncFunction = (req: FastifyRequest, reply: FastifyReply) => Promise<void>;

export const SignUpSchema = {
  body: Type.Object({
    phone: Type.Optional(Type.RegEx(RegEx.phone)),
    password: Type.String(),
    email: Type.RegEx(RegEx.email),
    nickname: Type.Optional(Type.String()),
    avatar: Type.Optional(Type.String()),
  })
}

export type SignUpController = FastifyRequestHandler<SchemaRoute<typeof SignUpSchema>>;

export const LogInSchema = {
  body: Type.Object({
    email: Type.RegEx(RegEx.email),
    password: Type.String(),
  })
}

export type LogInController = FastifyRequestHandler<SchemaRoute<typeof LogInSchema>>;

export const RefreshSchema = {
  body: Nullable(
    Type.Object({
      refreshToken: Type.Optional(Type.String())
    })
  )
}

export type RefreshController = FastifyRequestHandler<SchemaRoute<typeof RefreshSchema>>;