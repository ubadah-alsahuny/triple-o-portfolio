import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./Gallery.module.css";
import Spinner from "../../../components/Spinner/Spinner.jsx";
import SkeletonCard from "../../../components/SkeletonCard/SkeletonCard.jsx";
import toast from "react-hot-toast";
import Button from "../../../components/Button/Button.jsx";
const Gallery = () => {
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const token = localStorage.getItem("auth_token");
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const fetchImages = async (pageNumber = 1) => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `http://localhost:8000/api/gallery?page=${pageNumber}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const formattedImages = response.data.data.map((photo) => ({
        id: photo.id,
        url: `http://localhost:8000/storage/${photo.photo_path}`,
        selected: false,
      }));

      setImages(formattedImages);
      setTotalPages(response.data.last_page);
      setPage(response.data.current_page);
    } catch (error) {
      console.error("Error loading images:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    setLoading(true);
    for (const file of files) {
      const formData = new FormData();
      formData.append("photo", file);

      try {
        const response = await axios.post(
          "http://localhost:8000/api/gallery/upload",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        await fetchImages(page);
        toast.success("✅ photo added successfully");
      } catch (error) {
        console.error("Upload failed:", error);
        toast.error("❌ Failed to add photo");
      } finally {
        setLoading(false);
      }
    }
  };

  const toggleSelect = (id) => {
    setImages((prev) =>
      prev.map((img) =>
        img.id === id ? { ...img, selected: !img.selected } : img
      )
    );
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "are you sure you want to delete the photo/s"
    );
    if (!confirmed) return;
    setLoading(true);
    const selectedIds = images
      .filter((img) => img.selected)
      .map((img) => img.id);
    try {
      await axios.delete(
        "http://localhost:8000/api/gallery/photos/bulk-delete",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          data: {
            photoIds: selectedIds,
          },
        }
      );

      fetchImages(page);
      toast.success("✅ photo/s deleted successfully");
    } catch (error) {
      console.error("Failed to delete selected photos:", error);
      toast.error("❌ Failed to delete photo/s");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`h-full w-full flex flex-col ${styles.container}`}>
      <div className={`h-1/7 mb-3`}>
        <h1 className={styles.heading}>your<span> </span><span>GALLERY</span></h1>
        <p className={styles.subtext}>
          This is where you will find all the pictures you uploaded.
        </p>
      </div>

      <div className={`w-full h-5/7 mb-3`}>
        <div className={`rounded-lg w-full h-full overflow-y-auto ${styles.wrapper}`}>
          <div className={`${styles.actions}`}>
            <label htmlFor="image-upload" className={`${styles.uploadButton}`}>
              <input
                  type="file"
                  //multiple
                  accept="image/*"
                  id="image-upload"
                  className="hidden"
                  disabled={loading}
                  onChange={handleImageUpload}
              />
              ADD A PICTURE
              {loading && <Spinner/>}
            </label>

            <button
                onClick={handleDelete}
                disabled={!images.some((img) => img.selected) || loading}
                className={styles.deleteButton}
            >
              DELETE PICTURE
              {loading && <Spinner/>}
            </button>
          </div>

          {/* Image Grid or Skeleton */}
          {isLoading ? (
              <div className={styles.imageGrid}>
                {Array.from({length: 10}).map((_, i) => (
                    <SkeletonCard key={i}/>
                ))}
              </div>
          ) : images.length === 0 ? (
              <div className="text-gray-500 text-center text-sm py-8">
                No images found... Start uploading some!
              </div>
          ) : (
              <div className={styles.imageGrid}>
                {images.map((img) => (
                    <div
                        key={img.id}
                        className={`${styles.imageItem} ${
                            img.selected ? styles.selected : ""
                        }`}
                    >
                      <input
                          type="checkbox"
                          checked={img.selected}
                          onChange={() => toggleSelect(img.id)}
                          className={styles.checkbox}
                      />
                      <img
                          src={img.url}
                          alt="Uploaded preview"
                          className={styles.imagePreview}
                      />
                    </div>
                ))}
              </div>
          )}
        </div>
      </div>

      {/* Pagination */}
      {images.length > 0 && (
          <div className={`items-center flex-1 w-full ${styles.pagination}`}>
            <button onClick={() => fetchImages(page - 1)} disabled={page === 1}>
              Previous
            </button>
            <span className="text-black">
            Page {page} of {totalPages}
          </span>
            <button
                onClick={() => fetchImages(page + 1)}
                disabled={page === totalPages}
            >
              Next
            </button>
          </div>
      )}
    </div>
  );
};
export default Gallery;
