import axios from "axios";

export const getDesignById = async (id) => {
  const token = localStorage.getItem("auth_token");

  const response = await axios.get(`http://localhost:8000/api/designs/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const rawData = response.data.data.designData || [];

  const canvasSettings = rawData.find((el) => el.canvasSettings)
    ?.canvasSettings || {
    backgroundColor: "#ffffff",
    backgroundImage: null,
  };

  const elements = rawData.filter((el) => !el.canvasSettings);
  return {
    elements,
    canvasSettings,
  };
};
