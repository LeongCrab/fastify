import axios from 'axios';

const HOST = process.env.KAKAO_HOST;
const CLIENT_ID = process.env.KAKAO_API_KEY;
const REDIRECT_URI = process.env.KAKAO_REDIRECT_URI;

export const KakaoRedirection = () => {
  return `https://${HOST}/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code`;
}

export const getKakaoToken = async (code: string): Promise<{ access_token: string, refresh_token: string }> => {
  const token_url = `https://${HOST}/oauth/token?grant_type=authorization_code&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&code=${code}`;
  const { access_token, refresh_token } = await axios.post(token_url)
    .then(res => res.data)
    .catch(err => console.error(err));

  return {
    access_token,
    refresh_token
  }
}
type UserInfo = {
  nickname?: string,
  avatar?: string,
  email: string,
  birthday?: string,
  gender?: string,
}

export const getKakaoUserInfo = async (access_token: string) => {
  const userInfo = await axios.get(
    `https://kapi.kakao.com/v2/user/me`,
    {
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
      }
    }
  )
    .then(res => {
      const data = res.data.kakao_account;
      const userInfo: UserInfo = {
        nickname: data.profile.nickname,
        avatar: data.profile.profile_image_url,
        email: data.email,
        birthday: data.birthday,
        gender: data.gender,
      }
      return userInfo;
    })
    .catch(err => console.error(err));

  return userInfo;
}
