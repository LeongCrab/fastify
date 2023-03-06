import { Metadata, Video, Target, Request } from '@prisma/client';
import BaseError from '../../../lib/BaseError';
import db from '../../../lib/db';
import { TablePick } from '../../../lib/RouteType';

export const addMetadata = async (metadata: TablePick<Metadata, 'url' | 'title' | 'desc' | 'thumbnail' | 'canonical'>) => {
  try {
    const exist = await db.metadata.findFirst({
      where: { url: metadata.url },
    });
    let result;
    if (exist) {
      result = await db.metadata.update({
        where: { id: exist.id },
        data: metadata
      });
    } else {
      result = await db.metadata.create({
        data: metadata
      });
    }
    return result;
  } catch (e) {
    throw new BaseError("DBError", "메타데이터 생성 실패");
  }
}

export const addVideo = async (video: TablePick<Video, 'pId' | 'desc' | 'title' | 'metadataId' | 'platformId'>) => {
  try {
    const exist = await db.video.findFirst({
      where: {
        pId: video.pId,
        platformId: video.platformId,
      },
    });

    let result;
    if (exist) {
      result = await db.video.update({
        data: video,
        where: { id: exist.id },
      });
    } else {
      result = await db.video.create({
        data: video,
      });
    }
    return result;
  } catch (e) {
    throw new BaseError("DBError", "Video 생성 실패");
  }
};

export const addTarget = async (target: TablePick<Target, 'imageSrc' | 'metadataId' | 'time' | 'videoId'>) => {
  const getType = () => {
    let type = 3;
    if (target.imageSrc) type = 1;
    if (target.videoId) type = 2;

    return type;
  };
  
  try {
    const result = await db.target.create({
      data: {
        ...target,
        type: getType(),
      },
    });
    return result;
  } catch (e) {
    throw new BaseError("DBError", "Target 생성 실패");
  }
};

export const addRequest = async (request: TablePick<Request, 'targetId' | 'phone' | 'what' | 'userId'>) => {
  try {
    if (!request.userId) throw new BaseError("BadRequest", "유저 아이디를 입력해주세요.");
    const user = await db.user.findUnique({
      where: { id: request.userId },
    });
    if (!user) throw new BaseError("NotFound", "헤당 유저를 찾을 수 없습니다.")

    const result = await db.request.create({
      data: request,
    });
    if (!result) throw new BaseError("DBError", "Request 생성 실패");

    if (request.userId !== 1) {
      await db.user.update({
        where: { id: request.userId },
        data: { phone: request.phone },
      });
    }
    return result;
  } catch (e) {
    throw e;
  }
};