import { addMetadata, addRequest, addTarget, addVideo } from './usecase';

import { addInquiryController } from './schema';

type InquiryControllers = {
  addInquiry: addInquiryController,
}

const inquiryController: InquiryControllers = {
  addInquiry: async (req, reply) => {
    try {
      const metadata = await addMetadata(req.body.metadata);

      let videoId;
      if (req.body.video && req.body.platformId) {
        const video = await addVideo({
          ...req.body.video,
          metadataId: metadata.id,
          platformId: req.body.platformId,
        });
        videoId = video.id;
      }

      const target = await addTarget({
        imageSrc: req.body.imageSrc,
        metadataId: metadata.id,
        time: req.body.time,
        videoId: videoId,
      });

      const request = await addRequest({
        targetId: target.id,
        phone: req.body.phone,
        what: req.body.what,
        userId: req.body.userId,
      });

      reply.code(201).send(request);
    } catch (e) {
      throw e;
    }
  }
}

export default inquiryController;