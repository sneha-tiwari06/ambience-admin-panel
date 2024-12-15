import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance, { BASE_IMAGE_URL } from "../utils/axiosInstnace";

function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await axiosInstance.get("/testimonials");
        setTestimonials(response.data);
      } catch (err) {
        console.error("Error fetching testimonials:", err);
        setError("Failed to fetch testimonials.");
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  // Handle delete
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this testimonial?");
    if (!confirmDelete) {
      return; // If the user cancels, exit the function
    }
  
    try {
      await axiosInstance.delete(`/testimonials/${id}`);
      setTestimonials((prev) => prev.filter((item) => item._id !== id));
      alert("Testimonial deleted successfully.");
    } catch (err) {
      console.error("Error deleting testimonial:", err);
      alert("Failed to delete testimonial.");
    }
  };
  

  // Handle toggle active/inactive
  const handleToggleStatus = async (id, currentStatus) => {
    try {
      await axiosInstance.put(`/testimonials/${id}`, { isActive: !currentStatus });
      setTestimonials((prev) =>
        prev.map((item) =>
          item._id === id ? { ...item, isActive: !currentStatus } : item
        )
      );
    } catch (err) {
      console.error("Error toggling status:", err);
      alert("Failed to toggle status.");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="w-100 testimonials">
      <div className="section-heading">
        <h2>Testimonials</h2>
      </div>
      <div className="action-btn">
        <div className="add-btn">
          <Link to="/add-testimonials">
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
            <th scope="col">Logo Image</th>
            <th scope="col">Content</th>
            <th scope="col">Status</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody>
          {testimonials.length > 0 ? (
            testimonials.map((testimonial, index) => (
              <tr key={testimonial._id}>
                <th scope="row">{index + 1}</th>
                <td>
                  <img
                    src={`${BASE_IMAGE_URL}${testimonial.logo}`}
                    alt={testimonial.logoAltText}
                    style={{ width: "100px", height: "auto" }}
                  />
                </td>
                <td>{testimonial.content}</td>
                <td>
                  <button
                    type="button"
                    className={`w-auto btn ${testimonial.isActive ? "btn-success" : "btn-danger"}`}
                    onClick={() => handleToggleStatus(testimonial._id, testimonial.isActive)}
                  >
                    {testimonial.isActive ? "Active" : "Inactive"}
                  </button>
                </td>
                <td>
                    <div className="action-btn2">
                         <Link to={`/edit-testimonials/${testimonial._id}`}>
                    <button type="button" className="w-auto btn btn-warning">
                      Edit
                    </button>
                  </Link>
                  <button
                    type="button"
                    className="w-auto btn btn-danger"
                    onClick={() => handleDelete(testimonial._id)}
                  >
                    Delete
                  </button>
                    </div>
                 
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No testimonials found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Testimonials;
