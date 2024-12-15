import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../utils/axiosInstnace";

function Careers() {
  const [careers, setCareers] = useState([]);

  // Fetch data on component mount
  useEffect(() => {
    const fetchCareers = async () => {
      try {
        const response = await axiosInstance.get("/careers");
        setCareers(response.data);
      } catch (error) {
        console.error("Error fetching careers data:", error);
      }
    };

    fetchCareers();
  }, []);
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this award?");
    
    if (!confirmDelete) {
      return;
    }
  
    try {
      await axiosInstance.delete(`/careers/${id}`); // Make DELETE request to delete the award
      setCareers((prevCareers) => prevCareers.filter((career) => career._id !== id)); // Update state to remove deleted award
      alert("Career deleted successfully."); // Optional: Show success message
    } catch (error) {
      console.error("Error deleting career:", error);
      alert("Failed to delete career."); // Optional: Show error message
    }
  };
  return (
    <div className="w-100 careers">
      <div className="section-heading">
        <h2>Careers</h2>
      </div>
      <div className="action-btn">
        <div className="add-btn">
          <Link to="/add-careers">
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
            <th scope="col">Role</th>
            <th scope="col">Position</th>
            <th scope="col">Experience</th>
            <th scope="col">Location</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody>
          {careers.length > 0 ? (
            careers.map((career, index) => (
              <tr key={career._id}>
                <th scope="row">{index + 1}</th>
                <td>{career.role}</td>
                <td>{career.position}</td>
                <td>{career.experience}</td>
                <td>{career.location}</td>
                <td>
                  <div className="action-btn2">
                    <Link to={`/edit-career/${career._id}`}>
                      <button type="button" className="w-auto btn btn-warning me-2">
                        Edit
                      </button>
                    </Link>
                    <button
                      type="button"
                      className="w-auto btn btn-danger"
                      onClick={() => handleDelete(career._id)}
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
                No careers available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Careers;
