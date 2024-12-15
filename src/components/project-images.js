import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axiosInstance, { BASE_IMAGE_URL } from "../utils/axiosInstnace";

function ProjectImage() {
  const { id } = useParams();
  const [images, setImages] = useState([]);
  const [thumbnailId, setThumbnailId] = useState(null);

  const fetchImages = async () => {
    try {
      const response = await axiosInstance.get(`/gallery-image/${id}`);
      setImages(response.data);
      const existingThumbnail = response.data.find(
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
            <th scope="col">Show as Thumbnail</th>
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
                  alt={image.altText}
                  style={{ width: "100px", height: "auto" }}
                />
              </td>
              <td>
                <button
                  className={`w-auto btn ${thumbnailId === image._id
                      ? "btn-success"
                      : "btn-outline-secondary"
                    }`}
                  onClick={() => handleThumbnailToggle(image._id)}
                  aria-label={
                    thumbnailId === image._id
                      ? "Unset Thumbnail"
                      : "Set as Thumbnail"
                  }
                >
                  {thumbnailId === image._id
                    ? "Unset Thumbnail"
                    : "Set as Thumbnail"}
                </button>
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
    </div>
  );
}

export default ProjectImage;
