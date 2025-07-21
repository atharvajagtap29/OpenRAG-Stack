import axiosInstance from "../Configs/axiosConfig";
import { BACKEND_API_ENDPOINTS } from "../Helpers/endpoints.json";

// CREATE A NEW CONTEXT
export const CallTheAgentAPI = async (payload) => {
  try {
    const response = await axiosInstance.post(
      BACKEND_API_ENDPOINTS.AGENT.ASK,
      payload
    );
    return response.data;
  } catch (error) {
    console.error("Error creating context:", error);
    throw error;
  }
};
