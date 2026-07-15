import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Spinner2 from "../../../../components/Spinner2/Spinner2.jsx";
import toast from "react-hot-toast";
import SkeletonCard from "../../../../components/SkeletonCard/SkeletonCard.jsx";
import StatusBadge from "../components/StatusBadge";
import StatusActions from "../components/StatusActions";
import { getStatusConfig } from "../utils/designStatus";
import { STATUS_INTERNAL_MAP } from "../utils/statusMap";
import styles from "./DesignLibrary.module.css";
import Card from "../../../../components/Portfolio Card/Card.jsx";

const DesignLibrary = () => {
  const [designs, setDesigns] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deletingDesignId, setDeletingDesignId] = useState(null);
  const [togglingStatusId, setTogglingStatusId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const fetchDesigns = async (pageNumber = 1) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("auth_token");
      const response = await axios.get(
        `http://localhost:8000/api/designs?page=${pageNumber}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response.data?.data?.original || {};
      setDesigns(data.data || []);
      setPage(data.current_page || 1);
      setTotalPages(data.last_page || 1);
    } catch (error) {
      console.error("Failed to load designs:", error);
      setDesigns([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDesigns(page);
  }, [page]);

  const handleDeleteDesign = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this design?"
    );
    if (!confirmDelete) return;

    setDeletingDesignId(id);
    try {
      const token = localStorage.getItem("auth_token");
      await axios.delete(`http://localhost:8000/api/designs/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setDesigns((prev) => prev.filter((d) => d.id !== id));
      toast.success("✅ Design deleted successfully");
    } catch (error) {
      console.error("Failed to delete design:", error);
      toast.error("❌ Failed to delete design");
    } finally {
      setDeletingDesignId(null);
    }
  };

  const handleStatusChange = async (newStatus, designId) => {
    setTogglingStatusId(designId);
    try {
      const token = localStorage.getItem("auth_token");
      const payload = {
        status: STATUS_INTERNAL_MAP[newStatus],
        ...(newStatus === "under_review" && { is_templated: true }),
      };

      await axios.post(
        `http://localhost:8000/api/designs/${designId}`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success(`✅ Status updated to ${newStatus}`);
      fetchDesigns(page);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update status");
    } finally {
      setTogglingStatusId(null);
    }
  };

  return (
    <div className="h-full w-full flex flex-col p-6">
      <div className={`w-full h-fit content-center mb-3`}>
        <h1 className={`text-4xl font-bold text-gray-900 ${styles.inTitle}`}>
          your<span className={`ml-2 ${styles.Title}`}>Portfolios</span>
        </h1>
      </div>

      {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({length: 8}).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full h-fit">
            {designs.map((design) => (
              <div
                key={design.id}
              >
                <Card title={design.name}
                      thumbnail={`http://localhost:8000/storage/${design.thumbnailPath}`}
                      description={design.status}
                      onClickforOpen={() =>
                          window.open(
                              `/home/design/${design.id}?preview=true`,
                              "_blank")}
                      onClickforEdit={() => navigate(`/home/design/${design.id}`)}
                      design={design}
                      onChangeStatus={(newStatus) => handleStatusChange(newStatus, design.id)}
                      isLoading={togglingStatusId === design.id}
                      onClickforDelete={() => handleDeleteDesign(design.id)}
                      onClickforCopy={() =>
                          navigator.clipboard.writeText(
                              `http://localhost:5173/shared/${design.id}`
                          )}/>

                {/*<div className="relative">
                  <img
                    loading="lazy"
                    src={`http://localhost:8000/storage/${design.thumbnailPath}`}
                    alt={design.name}
                    className="w-full h-56 object-cover"
                  />
                  <div className="absolute top-0 left-0 right-0 flex justify-between p-3 bg-gradient-to-b from-black/40 to-transparent text-white text-sm">
                    <span className="font-semibold truncate">
                      {design.name}
                    </span>
                    <StatusBadge status={design.status} />
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <StatusActions
                    design={design}
                    onChangeStatus={(newStatus) =>
                      handleStatusChange(newStatus, design.id)
                    }
                    isLoading={togglingStatusId === design.id}
                  />

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
                    {!["under review", "approved"].includes(design.status) && (
                      <button
                        onClick={() => navigate(`/home/design/${design.id}`)}
                        className="px-3 py-1.5 text-xs rounded-md bg-indigo-500 text-white hover:bg-indigo-600"
                      >
                        ✏️ Edit
                      </button>
                    )}

                    <button
                      onClick={() =>
                        window.open(
                          `/home/design/${design.id}?preview=true`,
                          "_blank"
                        )
                      }
                      className="px-3 py-1.5 text-xs rounded-md bg-blue-100 text-blue-800 hover:bg-blue-200"
                    >
                      🔍 Preview
                    </button>

                    <button
                      onClick={() => handleDeleteDesign(design.id)}
                      className="px-3 py-1.5 text-xs rounded-md bg-red-100 text-red-700 hover:bg-red-200"
                      disabled={deletingDesignId === design.id}
                    >
                      🗑️ Delete {deletingDesignId === design.id && <Spinner2 />}
                    </button>

                    <button
                      onClick={() =>
                        navigator.clipboard.writeText(
                          `http://localhost:5173/shared/${design.id}`
                        )
                      }
                      className="px-3 py-1.5 text-xs rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200"
                    >
                      📎 Copy Link
                    </button>
                  </div>
                </div>*/}
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-10 flex justify-center items-center gap-4">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-sm text-gray-600">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default DesignLibrary;
