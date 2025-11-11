/**
 * api routes details
 * @author damith
 */

const ApiRoutes = {
  //CATEGORY
  CREATE_CATEGORY: "/create/new/category",
  GET_ALL_CATEGORY: "/get/all/categories",

  //SUBCATEGORY
  CREATE_SUB_CATEGORY: "/create/new/sub-category",
  GET_ALL_SUB_CATEGORY_BY_CATEGORYID: "/get/sub-categories/by",
  GET_SUB_CATEGORY_BY_SUB_CATEGORY_ID: "/get/sub-categories",

  //TEMPLATE
  CREATE_TEMPLATE: "/create/new/template",
  UPDATE_TEMPLATE_BY_ID: "/update/template/by",
  GET_ALL_TEMPLATES: "/get/all/templates",

  //MEDIA UPLOAD
  IMAGE_UPLOAD: "/upload/image",
  ZIP_UPLOAD: "/upload/zip",
  JOB_PROGRESS: "/get/progress/by",
  DELETE_IMAGE: "/delete/image",
};
export default ApiRoutes;
