import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../utils/axiosInstnace";

function BannerPointerPage() {
    const [pointers, setPointers] = useState([]);

  useEffect(() => {
    const fetchPointers = async () => {
      try {
        const response = await axiosInstance.get("/pointers");
        setPointers(response.data);
      } catch (error) {
        console.error("Error fetching careers data:", error);
      }
    };

    fetchPointers();
  }, []);
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this pointer?");
    
    if (!confirmDelete) {
      return;
    }
  
    try {
      await axiosInstance.delete(`/pointers/${id}`); 
      setPointers((prevPointers) => prevPointers.filter((pointers) => pointers._id !== id)); 
      alert("Pointer deleted successfully."); 
    } catch (error) {
      console.error("Error deleting pointer:", error);
      alert("Failed to delete pointer.");
    }
  };
  return (
    <div className="w-100 careers">
    <div className="section-heading">
      <h2>Banner Pointers</h2>
    </div>
    <div className="action-btn">
      <div className="add-btn">
        <Link to="/add-banner-pointers">
          <button type="button" className="w-auto btn btn-success">
            Add Pointers
          </button>
        </Link>
      </div>
      <div className="back-btn">
        <Link to="/add-banner-image">
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
          <th scope="col">Pointer 1</th>
          <th scope="col">pointer 2</th>
          <th scope="col">Pointer 3</th>
          <th scope="col">Pointer 4</th>
          <th scope="col">Action</th>
        </tr>
      </thead>
      <tbody>
        {pointers.length > 0 ? (
          pointers.map((pointer, index) => (
            <tr key={pointer._id}>
              <th scope="row">{index + 1}</th>
              <td>{pointer.pointer1}</td>
              <td>{pointer.pointer2}</td>
              <td>{pointer.pointer3}</td>
              <td>{pointer.pointer4}</td>
              <td>
                <div className="action-btn2">
                  <Link to={`/edit-pointers/${pointer._id}`}>
                    <button type="button" className="w-auto btn btn-warning me-2">
                      Edit
                    </button>
                  </Link>
                  <button
                    type="button"
                    className="w-auto btn btn-danger"
                    onClick={() => handleDelete(pointer._id)}
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
              No Pointers available.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
  )
}

export default BannerPointerPage