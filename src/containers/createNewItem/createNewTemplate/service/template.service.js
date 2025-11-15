import ApiRoutes from "../../../../constants/api-routes";
import { mitAdminApi } from "../../../../services";

export const createNewTemplate = async (body) =>
  mitAdminApi.post(`${ApiRoutes.CREATE_TEMPLATE}`, body);

export const updateTemplateById = async (body, template_id) =>
  mitAdminApi.put(`${ApiRoutes.UPDATE_TEMPLATE_BY_ID}/${template_id}`, body);

export const getAllTemplates = async (body) =>
  mitAdminApi.get(`${ApiRoutes.GET_ALL_TEMPLATES}`, body);

export const getAllTemplatesStatus = async (body) =>
  mitAdminApi.get(`${ApiRoutes.GET_TEMPLATE_STATUS}`, body);

export const getTemplateByPage = async (pageCount, pageNo) =>
  mitAdminApi.get(`${ApiRoutes.GET_TEMPLATE_BY_PAGE}/${pageCount}/${pageNo}`);

export const imageUpload = async (body) =>
  mitAdminApi.post(`${ApiRoutes.IMAGE_UPLOAD}`, body);

export const deleteImage = async (key) =>
  mitAdminApi.delete(`${ApiRoutes.DELETE_IMAGE}/${key}`);

export const zipUpload = async (body) =>
  mitAdminApi.post(`${ApiRoutes.ZIP_UPLOAD}`, body);

export const jobProgress = async (job_id) =>
  mitAdminApi.get(`${ApiRoutes.JOB_PROGRESS}/${job_id}`);
