import React, { useEffect, useState } from "react";
import styles from "./Profile.module.css";
import axios from "axios";
import Spinner from "../../../components/Spinner [Renewed]/Spinner.jsx";
import Button from "../../../components/Button/Button.jsx";
import Input from "../../../components/Input/Input.jsx";
import InputTextArea from "../../../components/Input/InputTextArea.jsx";
import ImageCropper from "../../../components/ImageCropper/ImageCropper.jsx";

const EditProfileModal = ({
  isOpen,
  onClose,
  initialName,
  initialDescription,
  initialOccupationId,
  initialSkillIds,
  onDeletePhoto,
  onSave,
}) => {
  const UploadStatus = {
    IDLE: "idle",
    UPLOADING: "uploading",
    DONE: "done",
    ERROR: "error",
  };

  const token = localStorage.getItem("auth_token");
  const [loading, setLoading] = useState(false);

  // name / bio
  const [name, setName] = useState(initialName || "");
  const [description, setDescription] = useState(initialDescription || "");

  // occupation + skills (IDs)
  const [occupations, setOccupations] = useState([]); // [{id, name}]
  const [skillsCatalog, setSkillsCatalog] = useState([]); // [{id, name}]
  const [selectedOccupationId, setSelectedOccupationId] = useState(
    initialOccupationId ?? null
  );
  const [selectedSkillIds, setSelectedSkillIds] = useState(
    Array.isArray(initialSkillIds) ? initialSkillIds : []
  );
  const [skillSearch, setSkillSearch] = useState("");

  // photo crop/upload
  const [profilePhoto, setProfilePhoto] = useState();
  const [image, setImage] = useState("");
  const [currentPage, setCurrentPage] = useState("profile-page");
  const [status, setStatus] = useState(UploadStatus.IDLE);

  // ====== load options when modal opens ======
  useEffect(() => {
    if (!isOpen) return;

    const source = axios.CancelToken.source();
    const headers = { Authorization: `Bearer ${token}` };

    (async () => {
      try {
        const [occRes, skRes] = await Promise.all([
          axios.get("http://localhost:8000/api/occupations", {
            headers,
            cancelToken: source.token,
          }),
          axios.get("http://localhost:8000/api/skills", {
            headers,
            cancelToken: source.token,
          }),
        ]);

        setOccupations(Array.isArray(occRes.data) ? occRes.data : []);
        setSkillsCatalog(Array.isArray(skRes.data) ? skRes.data : []);
        setSelectedSkillIds(
          Array.isArray(initialSkillIds) ? initialSkillIds : []
        );
      } catch (err) {
        if (!axios.isCancel(err)) {
          console.error("Error loading options:", err);
        }
      }
    })();

    return () => source.cancel("modal closed");
  }, [isOpen, token, initialOccupationId, initialSkillIds]);
  useEffect(() => {
    if (initialOccupationId !== null && occupations.length > 0) {
      setSelectedOccupationId(initialOccupationId);
    }
  }, [initialOccupationId, occupations]);

  // ====== photo crop/upload ======
  const onImageSelected = (selectedImage) => {
    setImage(selectedImage);
    setCurrentPage("crop-image");
  };

  const onCropDone = (croppedArea) => {
    const canvasElement = document.createElement("canvas");
    canvasElement.width = croppedArea.width;
    canvasElement.height = croppedArea.height;

    const context = canvasElement.getContext("2d");

    const imageObj1 = new Image();
    imageObj1.src = image;

    imageObj1.onload = function () {
      context.drawImage(
        imageObj1,
        croppedArea.x,
        croppedArea.y,
        croppedArea.width,
        croppedArea.height,
        0,
        0,
        croppedArea.width,
        croppedArea.height
      );

      canvasElement.toBlob(async (blob) => {
        if (!blob) {
          console.error("Failed to convert canvas to blob.");
          return;
        }

        const formData = new FormData();
        formData.append("photo", blob, "profile.jpg");

        setStatus(UploadStatus.UPLOADING);

        try {
          const response = await axios.post(
            "http://localhost:8000/api/profile/photo",
            formData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
              },
            }
          );
          const imagePath = response.data.path;
          const fullUrl = `http://localhost:8000/storage/${imagePath}`;
          setProfilePhoto(fullUrl);
          setStatus(UploadStatus.DONE);
          setCurrentPage("profile-page");
        } catch (error) {
          console.error("Upload error:", error);
          setStatus(UploadStatus.ERROR);
        }
      }, "image/jpeg");
    };
  };

  const onCropCancel = () => {
    setCurrentPage("profile-page");
    setImage("");
  };

  const deleteprofilephoto = async () => {
    try {
      await axios.delete("http://localhost:8000/api/profile/photo", {
        headers: { Authorization: `Bearer ${token}` },
      });
      onDeletePhoto?.();
    } catch (error) {
      console.error("failed to delete profile photo", error);
    }
  };

  // ====== select helpers ======
  const toggleSkill = (skillId) => {
    setSelectedSkillIds((prev) =>
      prev.includes(skillId)
        ? prev.filter((id) => id !== skillId)
        : [...prev, skillId]
    );
  };

  const clearAllSkills = () => setSelectedSkillIds([]);

  // ====== submit ======
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        name,
        description,
        // skills: required by backend as "skillIds"
        skillIds: selectedSkillIds, // [] allowed to clear
      };

      // occupationId:
      if (selectedOccupationId !== null) {
        payload.occupationId = selectedOccupationId;
      }

      await axios.put("http://localhost:8000/api/profile", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      onSave?.({
        name,
        description,
        occupationId: selectedOccupationId,
        skillIds: selectedSkillIds,
      });
      onClose();
    } catch (error) {
      console.error("Failed to update profile:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {currentPage === "crop-image" && (
        <ImageCropper
          image={image}
          onCropDone={onCropDone}
          onCropCancel={onCropCancel}
        />
      )}

      {currentPage === "profile-page" && (
        <div>
          <div className={`w-full justify-items-center mb-5`}>
            <p className={styles.title}>Edit your profile</p>
            <p className={styles.subtitle}>Change the way your profile looks</p>
          </div>

          {/* hidden file input */}
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              onImageSelected(URL.createObjectURL(e.target.files[0]))
            }
            id="imageUpload"
            style={{ display: "none" }}
          />

          <div className="flex gap-2 mb-4">
            <Button
              label="Change profile photo"
              type="button"
              onClick={() => document.getElementById("imageUpload").click()}
            />
            <Button
              label="Delete profile photo"
              type="button"
              onClick={deleteprofilephoto}
            />
            {status === "uploading" && <Spinner height={30} width={29} />}
          </div>

          {/* form: two columns */}
          <form onSubmit={handleSubmit} className={styles.formGrid}>
            {/* left column: name + bio */}
            <div>
              <div className="mb-3">
                <Input
                  label="Full name:"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <InputTextArea
                  label="Bio:"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={5}
                />
              </div>
            </div>

            {/* right column: occupation + skills */}
            <div>
              {/* Occupation select */}
              <div className="mb-4">
                <label className={styles.fieldLabel}>Occupation:</label>
                <select
                  className={styles.select}
                  value={selectedOccupationId ?? ""}
                  onChange={(e) => {
                    const v = e.target.value;
                    setSelectedOccupationId(v === "" ? null : Number(v));
                  }}
                >
                  <option value="">Select an occupation…</option>
                  {occupations.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Skills multiselect (checkbox list with search) */}
              <div className="mb-3">
                <label className={styles.fieldLabel}>Skills:</label>

                <input
                  type="text"
                  placeholder="Search skills…"
                  className={styles.inputLike}
                  value={skillSearch}
                  onChange={(e) => setSkillSearch(e.target.value)}
                />

                <div className={styles.skillsList}>
                  {skillsCatalog
                    .filter((s) =>
                      s.name
                        .toLowerCase()
                        .includes(skillSearch.trim().toLowerCase())
                    )
                    .map((skill) => (
                      <label key={skill.id} className={styles.skillRow}>
                        <input
                          type="checkbox"
                          checked={selectedSkillIds.includes(skill.id)}
                          onChange={() => toggleSkill(skill.id)}
                        />
                        <span>{skill.name}</span>
                      </label>
                    ))}
                  {skillsCatalog.length === 0 && (
                    <div className={styles.mutedText}>No skills found.</div>
                  )}
                </div>

                <div className="mt-2">
                  <Button
                    type="button"
                    onClick={clearAllSkills}
                    label="Clear all"
                  />
                </div>
              </div>
            </div>

            {/* footer actions */}
            <div className="flex justify-end gap-2 col-span-2 mt-2">
              <Button type="button" onClick={onClose} label="Cancel" />
              <Button type="submit" disabled={loading} label="Save changes" loading={loading}/>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default EditProfileModal;
