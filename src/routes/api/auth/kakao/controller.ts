import { AsyncFunction } from '../schema';
import { CallbackController } from './schema';
import { addUser, findUserByEmail } from '../usecase';
import { KakaoRedirection, getKakaoToken, getKakaoUserInfo } from './usecase';
import { generateTokens, setCookieTokens } from '../usecase';
import BaseError from '../../../../lib/BaseError';

type KakaoControllers = {
  getCode: AsyncFunction,
  callback: CallbackController,
}

const kakaoController: KakaoControllers = {
  getCode: async (_, reply) => {
    reply.redirect(KakaoRedirection());
  },
  callback: async (req, reply) => {
    try{
      const access_token = await getKakaoToken(req.query.code);

      const userInfo = await getKakaoUserInfo(access_token);
      if (!userInfo) throw new BaseError('APIError', '카카오 유저 정보를 불러오는데 실패했습니다.');
  
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

export default kakaoController;