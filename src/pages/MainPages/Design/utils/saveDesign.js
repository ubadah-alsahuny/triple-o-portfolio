import html2canvas from "html2canvas";
import axios from "axios";

export const saveDesign = async ({
  name,
  elements,
  canvasRef,
  token,
  canvasSettings,
}) => {
  if (!elements.length) throw new Error(" لا يوجد عناصر");

  const stageContainer = canvasRef?.current?.container();
  if (!stageContainer) throw new Error(" canvasRef غير جاهز");

  // التقاط صورة مصغرة
  const canvasSnapshot = await html2canvas(stageContainer, {
    backgroundColor: "#ffffff",
    useCORS: true,
  });

  const blob = await new Promise((resolve) =>
    canvasSnapshot.toBlob(resolve, "image/png")
  );

  const formData = new FormData();
  formData.append("name", name);
  formData.append("status", "draft");
  const designDataWithSettings = [
    ...elements,
    { canvasSettings },
    //{ canvasSettings: canvasRef?.current?.canvasSettings || {} }, // سنضبط هذا بعد قليل
  ];

  formData.append("designData", JSON.stringify(designDataWithSettings));

  formData.append("thumbnail", blob, "thumbnail.png");

  const response = await axios.post(
    "http://localhost:8000/api/designs",
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};
