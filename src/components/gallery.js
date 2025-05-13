import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DataTable from "react-data-table-component";
import axiosInstance, { BASE_IMAGE_URL } from "../utils/axiosInstnace";

function Gallery() {
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(""); 
  const [filteredData, setFilteredData] = useState([]); 
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGalleryItems = async () => {
      try {
        const response = await axiosInstance.get("/gallery");
        const dataWithIndex = response.data.map((item, idx) => ({
          ...item,
          index: idx + 1, 
        }));
        setGalleryItems(dataWithIndex);
        setFilteredData(dataWithIndex);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGalleryItems();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await axiosInstance.delete(`/gallery/${id}`);
        setGalleryItems((prevItems) => prevItems.filter((item) => item._id !== id));
        alert("Gallery item deleted successfully!");
      } catch (err) {
        setError(err.message);
        alert(`Error deleting item: ${err.message}`);
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error fetching data: {error}</div>;
  }

  // Define columns for the DataTable
  const columns = [
    {
      name: "Index",
      selector: (row) => row.index, // Use the precomputed index
      sortable: true, // Now sorting works
      width: "10%",
    },
    {
      name: "Image",
      cell: (row) => (
        <img
          src={`${BASE_IMAGE_URL}${row.image}`}
          alt="Thumbnail"
          style={{ width: "100px" }}
        />
      ),
      width: "20%",
    },
    {
      name: "Location",
      selector: (row) => row.location,
      sortable: true,
      width: "10%",
    },
    {
      name: "Project Name",
      selector: (row) => row.projectName,
      sortable: true,
      width: "30%",
    },
    {
      name: "Action",
      cell: (row) => (
        <div className="action-btn2">
          <Link to={`/add-gallery-image/${row._id}`}>
            <button className="w-auto btn btn-warning">Add Gallery</button>
          </Link>
          <Link to={`/project-image/${row._id}`}>
            <button className="w-auto btn btn-primary">View Gallery</button>
          </Link>
          <button
            className="w-auto btn btn-danger"
            onClick={() => handleDelete(row._id)}
          >
            Delete
          </button>
        </div>
      ),
      width: "40%",
    },
  ];
 const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);
    const filtered = galleryItems.filter((item) =>
      item.projectName.toLowerCase().includes(value)
    );
    setFilteredData(filtered);
  };

  return (
    <div className="w-100 gallery">
      <div className="section-heading">
        <h2>Gallery</h2>
      </div>
      <div className="action-btn">
        <div className="add-btn">
          <Link to="/add-gallery">
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
      <div className="action-btn d-flex justify-content-end align-items-end">
          <input
            type="text"
            placeholder="Search by project name"
            value={searchTerm}
            onChange={handleSearch}
            className="form-control"
            style={{ width: "300px", marginLeft: "10px" }}
          />
        </div>
      <DataTable
        columns={columns}
        data={filteredData}
        pagination
        responsive
        highlightOnHover
        striped
      />
    </div>
  );
}

export default Gallery;
