import BaseError from '../../../lib/BaseError';
import { SignUpController, LogInController, AsyncFunction, RefreshController } from './schema';
import { duplicateUser, addUser, findUserByEmail, checkPassword, generateTokens, regenerateTokens, setCookieTokens, findUserByPhone, updateUser } from './usecase';
import db from '../../../lib/db';
import { getInquiryListController } from '../../admin/inquiry/schema';

type AuthControllers = {
  signUp: SignUpController,
  logIn: LogInController,
  logOut: AsyncFunction,
  getMe: AsyncFunction,
  refresh: RefreshController,
  getMyInquiry: getInquiryListController,
}

const authControllers: AuthControllers = {
  signUp: async (req, reply) => {
    try {
      if (req.body.email) await duplicateUser(req.body.email);
      if (req.body.phone) {
        const exist = await findUserByPhone(req.body.phone);

        if (exist && exist.password) {
          const user = await updateUser(exist.id, req.body);
          reply.code(201).send(user);
        }
      }

      const user = await addUser(req.body);

      reply.code(201).send(user);
    } catch (e) {
      throw e;
    }
  },
  logIn: async (req, reply) => {
    try {
      const exist = await findUserByEmail(req.body.email);
      if (!exist) throw new BaseError('WrongCredentials');

      const result = await checkPassword(exist, req.body.password);
      if (!result) throw new BaseError('WrongCredentials');

      const tokens = await generateTokens(exist);

      setCookieTokens(reply, tokens);

      reply.code(200).send({ user: { id: exist.id, email: exist.email } });
    } catch (e) {
      throw e;
    }
  },
  logOut: async (_, reply) => {
    reply.clearCookie('access_token');
    reply.clearCookie('refresh_token');
    reply.code(200).send('유저 로그아웃 완료');
  },
  getMe: async (req, reply) => {
    try {
      const user = await db.user.findUnique({
        where: { id: req.user!.id },
        select: {
          id: true,
          phone: true,
          email: true,
          nickname: true,
          avatar: true,
          lastLogin: true
        }
      });
      reply.code(200).send(user);
    } catch (e) {
      throw e;
    }
  },
  refresh: async (req, reply) => {
    try {
      let refreshToken;
      if (req.body) {
        refreshToken = req.body.refreshToken ?? "";
      } else {
        refreshToken = req.cookies.refresh_token ?? "";
      }

      if (!refreshToken) throw new BaseError('BadRequest', '리프레시 토큰이 없습니다.');

      const tokens = await regenerateTokens(refreshToken);

      setCookieTokens(reply, tokens);

      reply.code(200).send(tokens);
    } catch (e) {
      throw e;
    }
  },
  getMyInquiry: async (req, reply) => {
    try {
      const userId = req.user!.id;
      const take = req.query.limit ?? 12;
      const skip = req.query.offset ? req.query.offset - 1 : 0;

      const user = await db.user.findUnique({
        where: { id: userId }
      });
      if (!user) throw new BaseError('NotFound', '유저를 찾을 수 없습니다.');

      const requests = await db.request.findMany({
        where: {
          userId
        },
        take,
        skip: skip * take,
        select: {
          createdAt: true,
          id: true,
          state: true,
          what: true,
          target: {
            select: {
              imageSrc: true,
              metadata: {
                select: {
                  url: true,
                  title: true,
                  desc: true,
                  thumbnail: true,
                  video: {
                    select: {
                      platform: {
                        select: {
                          name: true,
                          logoSrc: true,
                          displayName: true,
                          urlList: true,
                        }
                      }
                    }
                  }
                }
              },
              results: {
                select: {
                  type: true,
                  customProduct: {
                    select: {
                      brand: true,
                      name: true,
                      price: true,
                      url: true,
                    }
                  }
                }
              },
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
      if (!requests) throw new BaseError("NotFound", "문의를 찾을 수 없습니다.");
      const myInquiry = requests.map((request) => {
        return {
          inquiry: {
            metadata: request.target.metadata,
            createdAt: request.createdAt.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' }),
          },
          result: request.target.results,
        }
      })
      const length = await db.request.count({
        where: {
          userId
        }
      });
      const max_offset = Math.ceil(length / take);

      reply.code(200).send({ nickname: user.nickname, max_offset, inquiryList: myInquiry });
    } catch (e) {
      throw e;
    }
  }
}

export default authControllers;