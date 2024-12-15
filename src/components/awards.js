// src/components/Awards.js
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance, { BASE_IMAGE_URL } from "../utils/axiosInstnace";

function Awards() {
  const [awards, setAwards] = useState([]);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const fetchAwards = async () => {
      try {
        const response = await axiosInstance.get("/awards");
        setAwards(response.data);
      } catch (error) {
        console.error("Error fetching awards:", error);
      } finally {
        setLoading(false); 
      }
    };

    fetchAwards();
  }, []);
  const toggleStatus = async (id) => {
    try {
      const response = await axiosInstance.patch(`/awards/${id}/toggle-status`);
      if (response.status === 200) {
        setAwards((prevAwards) =>
          prevAwards.map((award) =>
            award._id === id ? { ...award, isActive: !award.isActive } : award
          )
        );
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this award?");
    
    if (!confirmDelete) {
      return;
    }
  
    try {
      await axiosInstance.delete(`/awards/${id}`); 
      setAwards((prevAwards) => prevAwards.filter((award) => award._id !== id)); 
      alert("Award deleted successfully."); 
    } catch (error) {
      console.error("Error deleting award:", error);
      alert("Failed to delete award.");
    }
  };
  

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="w-100 awards">
      <div className="section-heading">
        <h2>Awards & Certifications</h2>
      </div>
      <div className="action-btn">
        <div className="add-btn">
          <Link to="/add-awards">
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
            <th scope="col">Image</th>
            <th scope="col">Status</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody>
          {awards.length > 0 ? (
            awards.map((award, index) => (
              <tr key={award._id}>
                <th scope="row">{index + 1}</th>
                <td>
                  <img
                    src={`${BASE_IMAGE_URL}/${award.image}`} // Use the base URL for images
                    alt={award.altText}
                    style={{ width: "100px", height: "auto" }} // Set image size
                  />
                </td>
                <td>
                  <button
                    onClick={() => toggleStatus(award._id)}
                    className={`w-auto btn ${
                      award.isActive ? "btn-success" : "btn-warning"
                    }`}
                  >
                    {award.isActive ? "Active" : "Inactive"}
                  </button>
                </td>

                <td>
                  <div className="action-btn2">
                    <Link to={`/edit-awards/${award._id}`}>
                      <button className="w-auto btn btn-warning me-2">Edit</button>
                    </Link>

                    <button
                      className="w-auto btn btn-danger"
                      onClick={() => handleDelete(award._id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center">
                No awards found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Awards;
