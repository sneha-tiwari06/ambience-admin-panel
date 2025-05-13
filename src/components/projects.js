import React, { useEffect, useState } from "react";
import axiosInstance, { BASE_IMAGE_URL } from "../utils/axiosInstnace";
import { Link, useNavigate } from "react-router-dom";
import DataTable from "react-data-table-component";

function Projects() {
  const [bannerImages, setBannerImages] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // State for the search term
  const [filteredData, setFilteredData] = useState([]); // State for filtered data
  const navigate = useNavigate();

  const fetchBannerImages = async () => {
    try {
      const response = await axiosInstance.get("/projects/");
      const dataWithIndex = response.data.map((item, idx) => ({
        ...item,
        index: idx + 1, // Add an index property
      }));
      setBannerImages(dataWithIndex);
      setFilteredData(dataWithIndex); // Initialize filtered data
    } catch (error) {
      console.error("Error fetching banner images:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/projects/${id}`);
      alert("Data deleted successfully.");
      fetchBannerImages();
    } catch (error) {
      console.error("Error deleting image:", error);
      alert("Error deleting image.");
    }
  };

  const handleEdit = (image) => {
    navigate("/add-projects", { state: { image, editMode: true } });
  };

  const toggleActiveStatus = async (project) => {
    try {
      await axiosInstance.put(`/projects/${project._id}`, {
        ...project,
        isActive: !project.isActive,
      });
      fetchBannerImages();
    } catch (error) {
      console.error("Error updating active status:", error);
    }
  };

  const toggleShowOnHomePage = async (project) => {
    try {
      await axiosInstance.put(`/projects/${project._id}`, {
        ...project,
        showOnHomePage: !project.showOnHomePage,
      });
      fetchBannerImages();
    } catch (error) {
      console.error("Error updating show on home status:", error);
    }
  };

  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);
    const filtered = bannerImages.filter((item) =>
      item.projectName.toLowerCase().includes(value)
    );
    setFilteredData(filtered);
  };

  useEffect(() => {
    fetchBannerImages();
  }, []);

  const columns = [
    {
      name: "Index",
      selector: (row) => row.index,
      sortable: true,
    },
    {
      name: "Project Image",
      cell: (row) => (
        <img
          src={`${BASE_IMAGE_URL}/${row.imagePath}`}
          alt={row.altText}
          style={{ width: "100px", height: "auto" }}
        />
      ),
    },
    {
      name: "Project Name",
      selector: (row) => row.projectName,
      sortable: true,
    },
    {
      name: "Category",
      selector: (row) => row.category,
      sortable: true,
    },
    {
      name: "Location",
selector: (row) => row.locations.join(", "),

      sortable: true,
    },
    {
      name: "Status",
      cell: (row) => (
        <button
          className={`w-auto btn btn-sm ${
            row.isActive ? "btn-success" : "btn-secondary"
          }`}
          onClick={() => toggleActiveStatus(row)}
        >
          {row.isActive ? "Active" : "Inactive"}
        </button>
      ),
      sortable: true,
      selector: (row) => (row.isActive ? "Active" : "Inactive"), // Enables sorting by status
    },
    {
      name: "Show on Home",
      cell: (row) => (
        <button
          className={`w-auto btn btn-sm ${
            row.showOnHomePage ? "btn-success" : "btn-secondary"
          }`}
          onClick={() => toggleShowOnHomePage(row)}
        >
          {row.showOnHomePage ? "Shown" : "Hidden"}
        </button>
      ),
      sortable: true,
      selector: (row) => (row.showOnHomePage ? "Shown" : "Hidden"), // Enables sorting by home visibility
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="action-btn">
          <button
            className="w-auto btn btn-warning btn-sm"
            onClick={() => handleEdit(row)}
          >
            Edit
          </button>
          <button
            className="w-auto btn btn-danger btn-sm"
            onClick={() => handleDelete(row._id)}
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="section-heading">
        <h2>Projects</h2>
      </div>
      <div className="action-btn d-flex justify-content-between align-items-center">
        <div className="add-btn">
          <Link to="/add-projects">
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
        highlightOnHover
        striped
      />
    </div>
  );
}

export default Projects;
