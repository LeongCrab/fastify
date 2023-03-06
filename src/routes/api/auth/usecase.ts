import bcrypt from 'bcrypt';
import { FastifyReply } from 'fastify';

import { Token, User } from '@prisma/client';
import BaseError from '../../../lib/BaseError';
import db from '../../../lib/db';
import { TablePick } from '../../../lib/RouteType';
import { generateToken, RefreshTokenPayload, validateToken } from '../../../lib/token';

const SALT_ROUNDS = 10;

export const duplicateUser = async (email: string) => {
  const exist = await db.user.findFirst({
    where: { email }
  });
  if (exist) throw new BaseError('UserExists', '이미 가입된 이메일입니다.');
}

export const findUserByPhone = async(phone: string) => {
  return await db.user.findFirst({
    where: { phone }
  });
}

export const updateUser = async (id: number, data: TablePick<User, 'phone' | 'avatar' | 'email' | 'nickname' | 'password' | 'gender' | 'birthday'>) => {
  return await db.user.update({
    where: { id }, 
    data
  });
}

export const addUser = async (user: TablePick<User, 'phone' | 'avatar' | 'email' | 'nickname' | 'password' | 'gender' | 'birthday'>) => {
  const hash = await bcrypt.hash(user.password, SALT_ROUNDS);
  try {
    const result = await db.user.create({
      data: {
        ...user,
        password: hash,
      }
    });

    return result;
  } catch (e) {
    throw new BaseError("DBError", "유저 생성 실패");
  }
}

export const findUserByEmail = async (email: string) => {
  const exist = db.user.findUnique({
    where: { email }
  });

  return exist;
}

export const checkPassword = async (exist: User, password: string): Promise<boolean> => {
  return await bcrypt.compare(password, exist.password);
}

export const generateTokens = async (user: User, existingToken?: Token) => {
  const userId = user.id;
  const token = existingToken ?? (await createToken(userId))
  const tokenId = token.id

  const [accessToken, refreshToken] = await Promise.all([
    generateToken({
      type: 'access_token',
      userId,
      tokenId,
    }),
    generateToken({
      type: 'refresh_token',
      tokenId,
      rotationCounter: token.rotationCounter,
    }),
  ]);

  return {
    accessToken,
    refreshToken,
  }
}

export const regenerateTokens = async (refreshToken: string) => {
  try {
    const { tokenId, rotationCounter } = await validateToken<RefreshTokenPayload>(refreshToken);
    const token = await db.token.findUnique({
      where: { id: tokenId },
      include: { user: true },
    })
    if (!token) throw new BaseError('NotFound', "Token not found");
    if (token.blocked) throw new BaseError('Unauthorized', 'Token is blocked');
    if (token.rotationCounter !== rotationCounter) {
      await db.token.update({
        where: { id: tokenId },
        data: { blocked: true },
      });
      throw new BaseError('BadRequest', 'Rotation counter does not match');
    }

    token.rotationCounter += 1;
    await db.token.update({
      where: { id: tokenId },
      data: { rotationCounter: token.rotationCounter },
    });

    return await generateTokens(token.user, token);
  } catch (e) {
    throw new BaseError('BadRequest', "리프레시 토큰 오류");
  }
}

export const setCookieTokens = (reply: FastifyReply, tokens: { accessToken: string, refreshToken: string }): void => {
  reply.setCookie('access_token', tokens.accessToken, {
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 60 * 60),
    path: '/',
  });

  reply.setCookie('refresh_token', tokens.refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    path: '/',
  });
}

const createToken = async (userId: number) => {
  const token = await db.token.create({
    data: { userId },
  });
  return token;
}