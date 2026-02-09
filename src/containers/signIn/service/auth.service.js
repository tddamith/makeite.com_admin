import ApiRoutes from "../../../constants/api-routes";
import { mitAdminApi } from "../../../services";

export const authentication = async (body) =>
  mitAdminApi.post(`${ApiRoutes.SIGN_IN}`, body);

export const validateToken = async (body) =>
  mitAdminApi.post(`${ApiRoutes.TOKEN_VALIDATE}`, body);
