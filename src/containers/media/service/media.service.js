import ApiRoutes from "../../../constants/api-routes";
import { mitAdminApi } from "../../../services";

export const getAllMedia = async (body) =>
  mitAdminApi.get(`${ApiRoutes.GET_ALL_MEDIA}`, body);
