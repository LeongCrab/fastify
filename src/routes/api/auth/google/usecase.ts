import { google } from 'googleapis';

const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;
const SCOPES = [
  'https://www.googleapis.com/auth/userinfo.profile',
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/user.gender.read',
  'https://www.googleapis.com/auth/user.birthday.read',
];

const client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

export const googleRedirection = () => {
  return client.generateAuthUrl({ access_type: 'offline', scope: SCOPES });
}

export const getGoogleTokenAndUserInfo = async (code: string) => {
  const { tokens } = await client.getToken(code);
  client.setCredentials(tokens);
  const service = google.people({ version: 'v1', auth: client });
  const res = await service.people.get({
    resourceName: 'people/me',
    personFields: 'emailAddresses,names,nicknames,birthdays,genders,phoneNumbers,photos'
  });

  const userInfo: UserInfo = {
    nickname: res.data.nicknames[0].value,
    avatar: res.data.photos[0].url,
    gender: res.data.genders[0].value,
    birthday: convertBirthday(res.data.birthdays[0].date.year, res.data.birthdays[0].date.month, res.data.birthdays[0].date.day),
    email: res.data.emailAddresses[0].value
  }

  return userInfo;
}

const convertBirthday = (year: number, month: number, day: number): string => {
  const toStr = (n: number): string => {
    return (n < 10) ? '0' + n : n + '';
  }
  const mm = toStr(month);
  const dd = toStr(day);
  return year + mm + dd;
}