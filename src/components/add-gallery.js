import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import axiosInstance from "../utils/axiosInstnace";

function AddGallery() {
  const [projectName, setProjectName] = useState('');
  const [location, setLocation] = useState('');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaKeywords, setMetaKeywords] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [errors, setErrors] = useState({});
  const [image, setImage] = useState(null);  
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateFields = () => {
    const newErrors = {};
    if (!image) {
      newErrors.image = "Please upload an image.";
    }
    if (!projectName.trim()) {
      newErrors.projectName = "Project name is required.";
    }
    if (!location.trim()) {
      newErrors.location = "Location is required.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateFields()) {
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append('projectName', projectName);
    formData.append('metaTitle', metaTitle);
    formData.append('metaKeywords', metaKeywords);
    formData.append('metaDescription', metaDescription);
    formData.append('location', location);
    formData.append('image', image);

    try {
      const response = await axiosInstance.post('/gallery', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert(response.data.message);
      navigate('/gallery');
    } catch (error) {
      console.error("Error uploading image:", error);
      alert('An error occurred while uploading the image. Please try again.');
    }finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    if (errors[field]) {
      setErrors((prevErrors) => ({ ...prevErrors, [field]: undefined }));
    }
    if (field === "projectName") {
      setProjectName(value);
    }
    if (field === "location") {
      setLocation(value);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (errors.image) {
      setErrors((prevErrors) => ({ ...prevErrors, image: undefined }));
    }
  };

  return (
    <div className="w-100 add-gallery">
      <div className="section-heading">
        <h2>Add Gallery Images</h2>
      </div>
      <div className="action-btn d-grid gap-2 d-md-flex justify-content-md-end">
        <div className="back-btn">
          <Link to="/gallery">
            <button type="button" className="w-auto btn btn-primary">
              Back
            </button>
          </Link>
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-6">
            <div className="mb-3">
              <label htmlFor="text-alt" className="form-label">
                Meta Title
              </label>
              <input
                type="text"
                className="form-control"
                id="metaTitle"
                value={metaTitle}
                onChange={(e) => setMetaTitle(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="text-alt" className="form-label">
                Meta Description
              </label>
              <input
                type="text"
                className="form-control"
                id="metaDescription"
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="project-name" className="form-label">
                Project Name
              </label>
              <input
                type="text"
                className="form-control"
                id="project-name"
                value={projectName}
                onChange={(e) => handleInputChange("projectName", e.target.value)}
              />
              {errors.projectName && <small className="text-danger">{errors.projectName}</small>}
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-3">
              <label htmlFor="text-alt" className="form-label">
                Meta Keywords
              </label>
              <input
                type="text"
                className="form-control"
                id="metaKeywords"
                value={metaKeywords}
                onChange={(e) => setMetaKeywords(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="location" className="form-label">
                Location
              </label>
              <input
                type="text"
                className="form-control"
                id="location"
                value={location}
                onChange={(e) => handleInputChange("location", e.target.value)}
              />
              {errors.location && <small className="text-danger">{errors.location}</small>}
            </div>
            <div className="mb-3">
              <label htmlFor="formFile" className="form-label">
                Add Project Thumb
              </label>
              <input
                className="form-control"
                type="file"
                id="formFile"
                onChange={handleFileChange}
              />
              {errors.image && <small className="text-danger">{errors.image}</small>}
            </div>
          </div>
        </div>
        <button type="submit" className="w-auto btn btn-primary" disabled={loading}>
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
}

export default AddGallery;
