import React, { useEffect, useState } from "react";
import axiosInstance, { BASE_IMAGE_URL } from "../utils/axiosInstnace";
import { Link, useNavigate } from "react-router-dom";

function HomeBanner() {
  const [bannerImages, setBannerImages] = useState([]);
  const navigate = useNavigate();
  const fetchBannerImages = async () => {
    try {
      const response = await axiosInstance.get("/banner-images/");
      setBannerImages(response.data);
    } catch (error) {
      console.error("Error fetching banner images:", error);
    }
  };
  const handleDelete = async (id) => {
    // Display confirmation dialog
    const confirmDelete = window.confirm("Are you sure you want to delete this banner image?");
  
    // If the user clicks "Cancel", exit the function
    if (!confirmDelete) {
      return;
    }
  
    try {
      await axiosInstance.delete(`/banner-images/${id}`);
      alert("Banner image deleted successfully.");
      fetchBannerImages(); // Refresh the list of banner images after deletion
    } catch (error) {
      console.error("Error deleting image:", error);
      alert("Error deleting image.");
    }
  };
  
  const handleEdit = (image) => {
    navigate("/add-banner-image", { state: { image } }); 
  };
  useEffect(() => {
    fetchBannerImages(); 
  }, []);

  return (
    <div>
      <div className="section-heading">
        <h2>Banner Image</h2>
      </div>
      <div className="action-btn">
        <div className="add-btn">
          <Link to="/add-banner-image">
            <button type="button" className="w-auto btn btn-success">
              Add Post
            </button>
          </Link>
        </div>
        <div className="back-btn">
          <Link to="/dashboard">
            <button type="button" className="w-auto btn btn-primary">
              Back
            </button>
          </Link>
        </div>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">Index</th>
            <th scope="col">Banner Image</th>
            <th scope="col">Alternate Text</th>
            <th scope="col">Created At</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {bannerImages.map((image, index) => (
            <tr key={image._id}>
              <th scope="row">{index + 1}</th>
              <td>
                <img
                  src={`${BASE_IMAGE_URL}${image.imageUrl}`}
                  alt={image.altText}
                  style={{ width: "100px", height: "auto" }}
                />
              </td>
              <td>{image.altText}</td>
              <td>{new Date(image.createdAt).toLocaleString()}</td>
              <td>
                <div className="action-btn">
                  <button
                    className="btn btn-warning btn-sm"
                    onClick={() => handleEdit(image)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
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

export default HomeBanner;
