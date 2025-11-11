import ApiRoutes from "../../../../constants/api-routes";
import { mitAdminApi } from "../../../../services";

export const createNewCategory = async (body) =>
  mitAdminApi.post(`${ApiRoutes.CREATE_CATEGORY}`, body);

export const getAllCategory = async () =>
  mitAdminApi.get(`${ApiRoutes.GET_ALL_CATEGORY}`);

export const createNewSubCategory = async (body) =>
  mitAdminApi.post(`${ApiRoutes.CREATE_SUB_CATEGORY}`, body);

export const getAllSubCategoryByCategoryId = async (category_id) =>
  mitAdminApi.get(
    `${ApiRoutes.GET_ALL_SUB_CATEGORY_BY_CATEGORYID}/${category_id}`
  );

export const getSubCategoryBySubCategoryId = async (sub_category_id) =>
  mitAdminApi.get(
    `${ApiRoutes.GET_SUB_CATEGORY_BY_SUB_CATEGORY_ID}/${sub_category_id}`
  );

// export const updateCategory = async (body, category_id) =>
//   mitAdminApi.put(`${ApiRoutes.UPDATE_CATEGORY}/${category_id}`, body);

// export const getAllMenus = async () =>
//   mitAdminApi.get(`${ApiRoutes.GET_ALL_MENUS}`);

// export const getCategoryById = async (category_id) =>
//   mitAdminApi.get(`${ApiRoutes.GET_CATEGORY}/${category_id}`);
