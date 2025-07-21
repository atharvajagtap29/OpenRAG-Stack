import axiosInstance from "../Configs/axiosConfig";
import { BACKEND_API_ENDPOINTS } from "../Helpers/endpoints.json";

// GET ALL CONTEXTS
export const GetAllContextsAPI = async () => {
  try {
    const response = await axiosInstance.get(
      BACKEND_API_ENDPOINTS.CONTEXTS.READ
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching contexts:", error);
    throw error;
  }
};

// CREATE A NEW CONTEXT
export const CreateContextAPI = async (formData) => {
  try {
    const response = await axiosInstance.post(
      BACKEND_API_ENDPOINTS.CONTEXTS.CREATE,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating context:", error);
    throw error;
  }
};

// DELETE A CONTEXT
export const DeleteContextAPI = async (payload) => {
  try {
    const response = await axiosInstance.delete(
      BACKEND_API_ENDPOINTS.CONTEXTS.DELETE,
      {
        data: payload,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting context:", error);
    throw error;
  }
};
