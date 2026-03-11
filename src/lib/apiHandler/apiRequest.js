import apiClient from "./apiClient";

export const apiRequest = async ({
  method = "GET",
  url,
  data = null,
  headers = {},
  isMultipart = false,
}) => {
  try {
    const config = {
      method,
      url,
      headers: { ...headers },
    };

    if (data) {
      config.data = data;

      if (isMultipart) {
        // Let browser set correct Content-Type
        delete config.headers["Content-Type"];
      } else {
        config.headers["Content-Type"] = "application/json";
      }
    }

    const response = await apiClient(config);

    return response.data;

  } catch (error) {
    if (!error.response) {
      throw new Error("Network error. Please check connection.");
    }

    const message =
      // error.response.data?.error ||
      error.response.data?.message ||
      "Something went wrong";

    throw new Error(message);
  }
};
