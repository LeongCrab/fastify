import BaseError from '../../../lib/BaseError';
import db from '../../../lib/db';
import { getRequestById, addProduct, addResult, updateStateByRequestId } from './usecase';
import { getInquiryListController, getInquiryController, completeInquiryController, deleteInquiryController } from './schema'

type AdminInquiryControllers = {
  getInquiryList: getInquiryListController,
  getInquiry: getInquiryController,
  completeInquiry: completeInquiryController,
  deleteInquiry: deleteInquiryController,
}

const adminInquiryControllers: AdminInquiryControllers = {
  getInquiryList: async (req, reply) => {
    try {
      const take = req.query.limit ?? 12;
      const skip = req.query.offset ? req.query.offset - 1 : 0;
      
      const requests = await db.request.findMany({
        take,
        skip: skip * take,
        select: {
          createdAt: true,
          id: true,
          phone: true,
          state: true,
          targetId: true,
          updatedAt: true,
          userId: true,
          what: true,
          user: { select: { email: true, phone: true, nickname: true, avatar: true } },
          target: {
            select: {
              imageSrc: true,
              time: true,
              updatedAt: true,
              metadata: true,
              results: { select: { type: true, customProduct: true } },
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
      if (!requests) throw new BaseError("NotFound", "문의를 찾을 수 없습니다.");
      const length = await db.request.count();
      reply.code(200).send({ length, requests });
    } catch (e) {
      throw e;
    }
  },
  getInquiry: async (req, reply) => {
    try {
      const id = req.params.requestId;
      const request = await db.request.findUnique({
        where: { id },
        select: {
          createdAt: true,
          id: true,
          phone: true,
          state: true,
          targetId: true,
          updatedAt: true,
          userId: true,
          what: true,
          user: { select: { email: true, phone: true, nickname: true, avatar: true } },
          target: {
            select: {
              imageSrc: true,
              time: true,
              updatedAt: true,
              metadata: true,
              results: { select: { type: true, customProduct: true } },
            },
          },
        },
      });
      if (!request) throw new BaseError("NotFound", "해당 문의를 찾을 수 없습니다");
  
      reply.code(200).send(request);
    } catch (e) {
      throw e;
    }
  },
  completeInquiry: async (req, reply) => {
    try {
      const id = req.params.requestId;
      const request = await getRequestById(id);
      const product = await addProduct({
        ...req.body.product,
        metadataId: request!.target.metadataId
      });
  
      const result = await addResult({
        type: req.body.state === 'exact' ? 1 : 2,
        targetId: request!.targetId,
        customProductId: product.id,
      });
  
      const updateRequest = await updateStateByRequestId(id, req.body.state);
      reply.code(201).send(updateRequest);
    } catch (e) {
      throw e;
    }
  },
  deleteInquiry: async (req, reply) => {
    try {
      const id = req.params.requestId;
      const result = await db.request.delete({
        where: { id }
      });
      reply.code(201).send(`${result.id}번 요청 삭제 완료`);
    } catch (e) {
      throw new BaseError("NotFound", "삭제할 요청을 찾을 수 없습니다.");
    }
  },
};

export default adminInquiryControllers;