import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../utils/axiosInstnace";

function Spotlights() {
  const [spotlight, setSpotlight] = useState([]);

  useEffect(() => {
    const fetchSpotlights = async () => {
      try {
        const response = await axiosInstance.get("/spotlights");
        setSpotlight(response.data);
      } catch (error) {
        console.error("Error fetching spotlight data:", error);
      }
    };

    fetchSpotlights();
  }, []);
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this spotlight?");
    
    if (!confirmDelete) {
      return;
    }
  
    try {
      await axiosInstance.delete(`/spotlights/${id}`);
      setSpotlight((prevSpotlights) => prevSpotlights.filter((spotlight) => spotlight._id !== id)); 
      alert("Spotlight deleted successfully."); 
    } catch (error) {
      console.error("Error deleting Spotlight:", error);
      alert("Failed to delete Spotlight."); 
    }
  };
  return (
    <div className="w-100 careers">
      <div className="section-heading">
        <h2>Spotlights</h2>
      </div>
      <div className="action-btn">
        <div className="add-btn">
          <Link to="/add-spotlight">
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
            <th scope="col">Id</th>
            <th scope="col">Heading</th>
            <th scope="col">Content</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody>
          {spotlight.length > 0 ? (
            spotlight.map((spotlights, index) => (
              <tr key={spotlights._id}>
                <th scope="row">{index + 1}</th>
                <td>{spotlights.spotlightheading}</td>
                <td>{spotlights.spotlightcontent}</td>
                <td>
                  <div className="action-btn2">
                    <Link to={`/edit-spotlights/${spotlights._id}`}>
                      <button type="button" className="w-auto btn btn-warning me-2">
                        Edit
                      </button>
                    </Link>
                    <button
                      type="button"
                      className="w-auto btn btn-danger"
                      onClick={() => handleDelete(spotlights._id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center">
                No spotlights available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Spotlights;
