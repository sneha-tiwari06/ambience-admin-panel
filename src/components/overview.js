import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../utils/axiosInstnace";

function Overview() {
  const [overviews, setOverviews] = useState([]); // State to store fetched overviews
  const [loading, setLoading] = useState(true); // State to manage loading status
  const [error, setError] = useState(null); // State to manage errors

  // Fetch overviews from the API
  useEffect(() => {
    const fetchOverviews = async () => {
      try {
        const response = await axiosInstance.get("/overview"); // Use Axios instance
        setOverviews(response.data); // Set the fetched data to state
      } catch (err) {
        setError(err.message); // Set error message
      } finally {
        setLoading(false); // Set loading to false after fetch
      }
    };

    fetchOverviews();
  }, []); // Empty dependency array to run only on mount

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this overview?"
    );
    if (confirmed) {
      try {
        const response = await axiosInstance.delete(`/overview/${id}`); // Use Axios instance
        if (response.status === 200) {
          // Remove the deleted overview from the state
          setOverviews(overviews.filter((overview) => overview._id !== id));
        }
      } catch (err) {
        console.error(err);
        alert("Error deleting overview: " + err.message); // Show error message if deletion fails
      }
    }
  };
  if (loading) {
    return <div>Loading...</div>; // Show loading message while fetching
  }

  if (error) {
    return <div>Error: {error}</div>; // Show error message if any
  }

  return (
    <div className="w-100 overview">
      <div className="section-heading">
        <h2>Overview</h2>
      </div>
      <div className="action-btn">
        <div className="add-btn">
          <Link to="/add-overview">
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
            <th scope="col">Area</th>
            <th scope="col">Delivered Projects</th>
            <th scope="col">Happy Customers</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody>
          {overviews.length > 0 ? (
            overviews.map((overview, index) => (
              <tr key={overview._id}>
                <th scope="row">{index + 1}</th>
                <td>{overview.area}</td>
                <td>{overview.deliveredProjects}</td>
                <td>{overview.happyCustomers}</td>
                <td>
                  <div className="action-btn2">
                    <Link to={`/edit-overview/${overview._id}`}>
                      <button type="button" className="w-auto btn btn-warning">
                        Edit
                      </button>
                    </Link>
                    <button
                      type="button"
                      className="w-auto btn btn-danger"
                      onClick={() => handleDelete(overview._id)} // Call delete function
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center">
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Overview;
