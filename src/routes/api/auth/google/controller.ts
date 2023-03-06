import { CallbackController } from './schema';
import { addUser, findUserByEmail } from '../usecase';
import { googleRedirection, getGoogleTokenAndUserInfo } from './usecase';
import { generateTokens, setCookieTokens } from '../usecase';
import BaseError from '../../../../lib/BaseError';
import { AsyncFunction } from '../schema';

type GoogleControllers = {
  getCode: AsyncFunction,
  callback: CallbackController,
}

const googleController: GoogleControllers = {
  getCode: async (_, reply) => {
    reply.redirect(googleRedirection());
  },
  callback: async (req, reply) => {
    try{
      const userInfo = await getGoogleTokenAndUserInfo(req.query.code);
      if (!userInfo) throw new BaseError('APIError', '구글 유저 정보를 불러오는데 실패했습니다.');
      
      const exist = await findUserByEmail(userInfo.email);
  
      if(exist) {
        const tokens = await generateTokens(exist);
        setCookieTokens(reply, tokens);
        reply.code(200).send(tokens);
      } else {
        const user = await addUser({
          ...userInfo,
          password: 'none'
        });
        reply.code(201).send(user);
      }
    } catch (e) {
      throw e;
    }
  },
};

export default googleController;