import html2canvas from "html2canvas";
import axios from "axios";

/**
 * يتحديث تصميم محفوظ مسبقا.
 * @param {Object} params
 * @param {string} params.id - رقم التصميم
 * @param {string} params.name - اسم التصميم
 * @param {Array} params.elements - العناصر على الكانفا
 * @param {Object} params.canvasRef - مرجع الكانفا
 * @param {string} params.token - توكن المصادقة
 * @param {Object} params.canvasSettings - إعدادات الخلفية
 */
export const updateDesign = async ({
  id,
  name,
  elements,
  canvasRef,
  token,
  canvasSettings,
}) => {
  if (!elements.length) throw new Error("لا يوجد عناصر");

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

  const designDataWithSettings = [...elements, { canvasSettings }];

  //  تحديث البيانات
  await axios.post(
    `http://localhost:8000/api/designs/${id}`,
    {
      name,
      status: "draft",
      design_data: JSON.stringify(designDataWithSettings),
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  //(طلب مستقل)تحديث الصورة المصغرة
  const formData = new FormData();
  formData.append("thumbnail", blob, "thumbnail.png");

  await axios.post(
    `http://localhost:8000/api/designs/${id}/update-thumbnail/`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return true;
};
