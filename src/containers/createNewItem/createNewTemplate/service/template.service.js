import ApiRoutes from "../../../../constants/api-routes";
import { mitAdminApi } from "../../../../services";

export const createNewTemplate = async (body) =>
  mitAdminApi.post(`${ApiRoutes.CREATE_TEMPLATE}`, body);

export const updateTemplateById = async (body, template_id) =>
  mitAdminApi.put(`${ApiRoutes.UPDATE_TEMPLATE_BY_ID}/${template_id}`, body);

export const imageUpload = async (body) =>
  mitAdminApi.post(`${ApiRoutes.IMAGE_UPLOAD}`, body);

export const zipUpload = async (body) =>
  mitAdminApi.post(`${ApiRoutes.ZIP_UPLOAD}`, body);

export const jobProgress = async (job_id) =>
  mitAdminApi.get(`${ApiRoutes.JOB_PROGRESS}/${job_id}`);
