// utils/galleryAPI.js
import axios from "axios";
export const fetchGalleryImages = async (page = 1) => {
  try {
    const token = localStorage.getItem("auth_token");
    const response = await axios.get(
      `http://localhost:8000/api/gallery?page=${page}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return {
      data: response.data.data.map((photo) => ({
        id: photo.id,
        url: `http://localhost:8000/image/${photo.photo_path}`,
      })),
      totalPages: response.data.last_page,
      currentPage: response.data.current_page,
    };
  } catch (error) {
    console.error("فشل في تحميل الصور من المعرض:", error);
    return { data: [], totalPages: 1, currentPage: 1 };
  }
};
