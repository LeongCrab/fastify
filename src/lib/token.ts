import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET ?? 'defaultSecret';

export const tokenDuration = {
  access_token: '1h',
  refresh_token: '30d',
};

if (process.env.JWT_SECRET === undefined) console.warn('JWT_SECRET is not defined');

export function generateToken(payload: TokenPayload) {
  return new Promise<string>((resolve, reject) => {
    const {type, ...rest} = payload;
    jwt.sign(
      rest,
      JWT_SECRET,
      {
        subject: type,
        expiresIn: tokenDuration[payload.type],
      }, 
      (err, token) => { 
        if (err || !token) {
          reject(err);
          return;
        }
        resolve(token);
      }
    )
  });
};

export function validateToken<T>(token: string) {
  return new Promise<DecodedToken<T>>((resolve, reject) => {
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if(err){
        reject(err);
      }
      resolve(decoded as DecodedToken<T>); 
    })
  });
};

export interface AccessTokenPayload {
  type: 'access_token';
  userId: number;
  tokenId: number;
}

export interface RefreshTokenPayload {
  type: 'refresh_token';
  tokenId: number;
  rotationCounter: number;
}

type TokenPayload = AccessTokenPayload | RefreshTokenPayload;

type DecodedToken<T> = {
  iat: number;
  exp: number;
} & T