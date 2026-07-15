import React, { useEffect, useState } from "react";
import { fetchGalleryImages } from "../../utils/galleryAPI.js";
import SkeletonCard from "../../../../../components/SkeletonCard/SkeletonCard.jsx";
import {CgClose} from "react-icons/cg";
import {LiaWindowClose} from "react-icons/lia";
import styles from "../../components/actionBars/TopBar.module.css"

const ImageModal = ({ isOpen, onClose, onImageSelect }) => {
  const [galleryImages, setGalleryImages] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadImages(page);
    }
  }, [isOpen, page]);

  const loadImages = async (pageNumber = 1) => {
    setIsLoading(true);
    const result = await fetchGalleryImages(pageNumber);
    setGalleryImages(result.data);
    setTotalPages(result.totalPages);
    setPage(result.currentPage);
    setIsLoading(false);
  };

  const handleSelectImage = (url) => {
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      onImageSelect(url, img);
      onClose();
    };
    img.src = url;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="relative bg-white rounded-lg p-3 w-[45%] h-fit overflow-y-auto border drop-shadow">
        <div className={`h-1/5 w-full mb-3`}>
          <LiaWindowClose size={25}
                          onClick={onClose} className={`text-red-500 cursor-pointer fixed right-3`}/>

          <p className={`text-xl font-semibold text-gray-800 ${styles.Title}`}>
            Select <span className={`${styles.inTitle}`}>from <br/> your</span> Gallery
          </p>

          <div className="text-sm text-gray-500">
            Showing {galleryImages.length} image(s) • Page {page} of {totalPages}
          </div>
        </div>

        <div className="grid grid-cols-5 h-3/5 w-full gap-4 mb-3">
          {isLoading
            ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
            : galleryImages.map((img) => (
                <div
                  key={img.id}
                  className="relative group rounded shadow-md overflow-hidden cursor-pointer"
                  onClick={() => handleSelectImage(img.url)}
                >
                  <img
                    src={img.url}
                    alt=""
                    className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105 group-active:scale-95"
                  />
                </div>
              ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center flex-1 items-center gap-4 ">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-sm text-gray-600">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageModal;
