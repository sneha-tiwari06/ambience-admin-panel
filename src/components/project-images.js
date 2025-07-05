import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axiosInstance, { BASE_IMAGE_URL } from "../utils/axiosInstnace";

function ProjectImage() {
  const { id } = useParams();
  const [images, setImages] = useState([]);
  const [thumbnailId, setThumbnailId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [caption, setCaption] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchImages = async () => {
    try {
      const response = await axiosInstance.get(`/gallery-image/${id}`);
      // Sort images by priority (ascending)
      const sortedImages = response.data.sort((a, b) => a.priority - b.priority);
      setImages(sortedImages);
      const existingThumbnail = sortedImages.find(
        (image) => image.isThumbnail
      );
      if (existingThumbnail) {
        setThumbnailId(existingThumbnail._id);
      }
    } catch (error) {
      console.error("Error fetching project images:", error);
    }
  };

  useEffect(() => {
    fetchImages();
  }, [id]);

  // Handler to update priority
  const handlePriorityChange = async (imageId, newPriority) => {
    try {
      await axiosInstance.put(`/gallery-image/${imageId}/priority`, {
        priority: Number(newPriority),
      });
      fetchImages();
    } catch (error) {
      console.error("Error updating priority:", error);
    }
  };

  const handleThumbnailToggle = async (imageId) => {
    try {
      const isCurrentlyThumbnail = thumbnailId === imageId;
      const response = await axiosInstance.put(`/gallery-image/${imageId}/toggle-thumbnail`);
      if (response.data.image) {
        setThumbnailId(response.data.image._id);
      }
      fetchImages();
    } catch (error) {
      console.error("Error updating thumbnail status:", error);
    }
  };

  const handleDelete = async (imageId) => {
    if (window.confirm("Are you sure you want to delete this image?")) {
      try {
        await axiosInstance.delete(`/gallery-image/${imageId}`);
        alert("Image deleted successfully!");
        fetchImages(); 
      } catch (error) {
        console.error("Error deleting image:", error);
      }
    }
  };

  const openCaptionModal = (image) => {
    setSelectedImage(image);
    setCaption(image.caption || '');
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedImage(null);
    setCaption('');
  };

  const handleCaptionSubmit = async (e) => {
    e.preventDefault();
    if (!selectedImage) return;

    setLoading(true);
    try {
      console.log('Sending caption update:', { caption: caption }); // Debug log
      const response = await axiosInstance.put(`/gallery-image/${selectedImage._id}`, {
        caption: caption
      });
      console.log('Response from server:', response.data); // Debug log
      alert("Caption updated successfully!");
      closeModal();
      fetchImages(); // Refresh the images list
    } catch (error) {
      console.error("Error updating caption:", error);
      console.error("Error response:", error.response?.data); // Debug log
      alert("Error updating caption. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-100 project-image">
      <div className="section-heading">
        <h2>Project Images</h2>
      </div>
      <div className="action-btn">
        <div className="add-btn">
          <Link to={`/add-gallery-image/${id}`}>
            <button type="button" className="w-auto btn btn-success">
              Add Post
            </button>
          </Link>
        </div>
        <div className="back-btn">
          <Link to="/gallery">
            <button type="button" className="w-auto btn btn-primary">
              Back
            </button>
          </Link>
        </div>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">Id</th>
            <th scope="col">Images</th>
             <th scope="col">Caption</th>
            <th scope="col">Priority</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody>
          {images.map((image, index) => (
            <tr key={image._id}>
              <th scope="row">{index + 1}</th>
              <td>
                <img
                  src={`${BASE_IMAGE_URL}/${image.originalImagePath}`}
                  alt={image.caption || 'Gallery Image'}
                  style={{ width: "100px", height: "auto" }}
                />
              </td>
              <td>
                <span className="text-muted">{image.caption || 'No caption'}</span>
                <button
                  className="btn w-auto btn-sm btn-outline-primary ms-2"
                  onClick={() => openCaptionModal(image)}
                >
                  {image.caption ? 'Edit Caption' : 'Add Caption'}
                </button>
              </td>
              <td>
                <input
                  type="number"
                  value={image.priority}
                  min={1}
                  onChange={(e) => handlePriorityChange(image._id, e.target.value)}
                  style={{ width: "60px" }}
                />
              </td>
              <td>
                <div className="action-btn2">
                  {/* <Link to={`/edit-gallery-image/${image._id}`}>
                    <button className="w-auto btn btn-warning">Edit</button>
                  </Link> */}
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(image._id)}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Caption Modal */}
      {showModal && (
        <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {selectedImage?.caption ? 'Edit Caption' : 'Add Caption'}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeModal}
                ></button>
              </div>
              <form onSubmit={handleCaptionSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label htmlFor="caption" className="form-label">Caption</label>
                    <input
                      className="form-control"
                      type="text"
                      id="caption"
                      rows="3"
                      value={caption}
                      onChange={(e) => setCaption(e.target.value)}
                      placeholder="Enter caption for this image..."
                      required
                    ></input>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary w-auto"
                    onClick={closeModal}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary w-auto"
                    disabled={loading}
                  >
                    {loading ? "Saving..." : "Save Caption"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal Backdrop */}
      {showModal && (
        <div 
          className="modal-backdrop fade show" 
          onClick={closeModal}
        ></div>
      )}
    </div>
  );
}

export default ProjectImage;
