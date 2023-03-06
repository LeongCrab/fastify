import { Static, TSchema } from '@sinclair/typebox';
import { FastifyRequest, RouteGenericInterface, FastifyReply} from 'fastify';

export type RouteSchema = {
  params?: TSchema;
  body?: TSchema;
  querystring?: TSchema;
  response?: unknown;
};

type RouteType<T extends RouteSchema> = {
  Params: T['params'] extends TSchema ? Static<T['params']> : never;
  Body: T['body'] extends TSchema ? Static<T['body']> : never;
  Querystring: T['querystring'] extends TSchema ? Static<T['querystring']> : never;
};

export type SchemaRoute<T extends RouteSchema> = RouteType<T>;

export type FastifyRequestHandler<T extends RouteGenericInterface> = (
  req: FastifyRequest<T>,
  res: FastifyReply
) => Promise<void>;

type PickNullable<T> = {
  [P in keyof T as null extends T[P] ? P : never]: T[P];
};
type PickNotNullable<T> = {
  [P in keyof T as null extends T[P] ? never : P]: T[P];
};
type OptionalNullable<T> = {
  [K in keyof PickNullable<T>]?: T[K];
} & {
  [K in keyof PickNotNullable<T>]: T[K];
};

/**
 * Prisma에서는 nullable한 필드를 Optional (?) 이 아닌 Required로 처리한다.
 * 이를 Optional로 바꿔주는 유틸리티 타입이다.
 */
export type TablePick<T, K extends keyof T> = OptionalNullable<{
  [P in K]: T[P];
}>;