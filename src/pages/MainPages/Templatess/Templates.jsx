import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import SkeletonCard from "../../../components/SkeletonCard/SkeletonCard";
import Spinner2 from "../../../components/Spinner2/Spinner2.jsx";
import { useNavigate } from "react-router-dom";
const Templates = () => {
  const [templates, setTemplates] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLLoading, setIsLLoading] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("auth_token");
      const response = await axios.get(
        "http://localhost:8000/api/designs/templates",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response.data?.data?.original?.data || [];

      setTemplates(data);
    } catch (error) {
      console.error("Failed to load templates:", error);
      toast.error("❌ Failed to load templates");
    } finally {
      setIsLoading(false);
    }
  };
  const fetchTemplateDesignData = async (templateId) => {
    try {
      const token = localStorage.getItem("auth_token");
      const response = await axios.get(
        `http://localhost:8000/api/designs/${templateId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const fullDesign = response.data?.data?.original || response.data?.data;
      if (!fullDesign?.design_data && !fullDesign?.designData) {
        throw new Error("Design data missing in response");
      }

      return fullDesign.design_data || fullDesign.designData;
    } catch (error) {
      console.error("Failed to fetch design data:", {
        error: error.response?.data || error.message,
        templateId,
      });
      throw error;
    }
  };
  const createNewDesign = async (name, designData, thumbnailBlob) => {
    try {
      const token = localStorage.getItem("auth_token");
      const formData = new FormData();

      formData.append("name", name);
      formData.append("designData", JSON.stringify(designData));
      formData.append("status", "draft");

      if (thumbnailBlob) {
        formData.append("thumbnail", thumbnailBlob, "thumbnail.png");
      }

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

      return response.data?.id || response.data?.data?.id;
    } catch (error) {
      console.error("Error creating design:", {
        request: error.config?.data,
        response: error.response?.data,
      });
      throw error;
    }
  };
  const handleUseTemplate = async (template) => {
    try {
      setIsLLoading(true);

      // 1. جلب بيانات التصميم من القالب فقط
      const designData = await fetchTemplateDesignData(template.id);

      // 2. إنشاء التصميم الجديد بدون صورة مصغرة
      const newDesignId = await createNewDesign(
        `Copy of ${template.designName}`,
        designData
      );

      // 3. جلب التصميم الجديد لتفقده
      const { data: newDesign } = await axios.get(
        `http://localhost:8000/api/designs/${newDesignId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
        }
      );

      toast.success(" Saved successfully");
      navigate(`/home/design/${newDesignId}`);
    } catch (error) {
      console.error("Error details:", {
        error: error.response?.data || error.message,
      });
      toast.error(
        `saved faild: ${error.response?.data?.message || error.message}`
      );
    } finally {
      setIsLLoading(false);
    }
  };
  return (
    <div className="p-6 min-h-screen">
      <h2 className="text-3xl font-bold mb-8 text-gray-900">🧩 Templates</h2>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : templates.length === 0 ? (
        <p className="text-gray-600">No Design Yet....</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {templates.map((template) => (
            <div
              key={template.id}
              className="bg-white shadow-md rounded-xl overflow-hidden flex flex-col"
            >
              {/*  الاسم يظهر أعلى الصورة */}
              <div className="px-4 pt-4 pb-2">
                <h3 className="text-lg font-semibold text-gray-800 truncate">
                  {template.designName || template.name || "Unnamed Template"}
                </h3>
              </div>

              {/*  الصورة المصغرة */}
              <img
                src={`http://localhost:8000/storage/${template.thumbnailPath}`}
                alt={template.name}
                className="w-full h-48 object-cover"
              />

              {/*  الأزرار */}
              <div className="p-4 flex flex-col gap-2 mt-auto">
                <button
                  onClick={() => handleUseTemplate(template)}
                  disabled={isLLoading}
                  className={`w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 transition ${
                    isLLoading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  Use Template
                  {isLLoading && <Spinner2 />}
                </button>

                <button
                  onClick={() =>
                    window.open(
                      `/home/design/${template.id}?preview=true`,
                      "_blank"
                    )
                  }
                  className="w-full bg-gray-200 text-gray-700 py-2 px-4 rounded hover:bg-gray-300 transition"
                >
                  Preview
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Templates;
