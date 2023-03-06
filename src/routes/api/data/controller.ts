import getMetaData from 'metadata-scraper';
import axios from 'axios';
import { encode } from 'base64-arraybuffer'

import BaseError from '../../../lib/BaseError';
import db from '../../../lib/db';
import { getDataController, getPlatformController, encodeImageController } from './schema';

type DataControllers = {
  getData: getDataController,
  getPlatform: getPlatformController,
  encodeImage: encodeImageController,
}

const dataControllers: DataControllers = {
  getData: async (req, reply) => {
    try {
      const metadata = await getMetaData(req.query.url);
      const data = {
        url: metadata.url,
        title: metadata.title,
        desc: metadata.description,
        thumbnail: metadata.image,
        canonical: metadata.url,
      }

      if (!data) throw new BaseError('Unknown', "메타데이터를 가져오는데 실패했습니다.");
      reply.code(200).send(data);
    } catch (e) {
      throw e;
    }
  },
  getPlatform: async (req, reply) => {
    try {
      let result;
      const id = req.params.id ?? undefined;

      if (id) {
        result = await db.platform.findUnique({
          where: { id },
          select: {
            id: true,
            name: true,
            logoSrc: true,
            urlList: true,
          }
        });

        if (!result) throw new BaseError("NotFound", "해당 플랫폼을 찾을 수 없습니다.");
        reply.code(200).send(result);
      } else {
        result = await db.platform.findMany({
          select: {
            id: true,
            name: true,
            logoSrc: true,
            urlList: true,
          }
        });
        if (!result) throw new BaseError("DBError", "플랫폼 정보를 불러오는데 실패했습니다.")
        reply.code(200).send(result);
      }
    } catch (e) {
      throw e;
    }
  },
  encodeImage: async (req, reply) => {
    try {
      const image = await axios
        .get(req.query.url, {
          responseType: 'arraybuffer',
        })
        .then(res => encode(res.data));
      reply.code(200).send(image);
    } catch (e) {
      throw e;
    }
  },
};

export default dataControllers;