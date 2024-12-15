import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance, { BASE_IMAGE_URL } from "../utils/axiosInstnace"; // Adjust the import according to your project structure

function ValuableClients() {
  const [clients, setClients] = useState([]); // State to store the client data
  const [loading, setLoading] = useState(true); // State to manage loading state

  // Fetch client data from the backend
  const fetchClients = async () => {
    try {
      const response = await axiosInstance.get("/clients"); // Adjust the endpoint if needed
      setClients(response.data); // Set the client data in state
    } catch (error) {
      console.error("Error fetching clients:", error);
    } finally {
      setLoading(false); 
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this client?")) {
      try {
        await axiosInstance.delete(`/clients/${id}`); 
        setClients(clients.filter((client) => client._id !== id)); 
        console.log("Client deleted successfully.");
      } catch (error) {
        console.error("Error deleting client:", error);
      }
    }
  };

  const handleToggleActive = async (id) => {
    const clientToUpdate = clients.find((client) => client._id === id);
    if (!clientToUpdate) return;

    try {
      const updatedClient = {
        ...clientToUpdate,
        active: !clientToUpdate.active,
      }; // Toggle active status
      await axiosInstance.put(`/clients/${id}`, updatedClient); // Update client status
      setClients(
        clients.map((client) => (client._id === id ? updatedClient : client))
      ); // Update state
      console.log("Client status updated successfully.");
    } catch (error) {
      console.error("Error updating client status:", error);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  // Render loading state or the client data
  return (
    <div>
      <div className="section-heading">
        <h2>Valuable Clients</h2>
      </div>
      <div className="action-btn">
        <div className="add-btn">
          <Link to="/add-clients">
            <button type="button" className="w-auto btn btn-success">
              Add Clients
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
      {loading ? ( // Show loading state while fetching data
        <p>Loading...</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Index</th>
              <th scope="col">Image</th>
              <th scope="col">Alt Text</th>
              <th scope="col">Created At</th>
              <th scope="col">Status</th> {/* New Status Column */}
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client, index) => (
              <tr key={client._id}>
                <th scope="row">{index + 1}</th>
                <td>
                  <img
                    src={`${BASE_IMAGE_URL}/${client.image}`}
                    alt={client.altText}
                    style={{ width: "100px", height: "auto" }}
                  />{" "}
                  {/* Display the image */}
                </td>
                <td>{client.altText}</td>
                <td>{new Date(client.createdAt).toLocaleDateString()}</td>{" "}
                {/* Format the created date */}
                <td>
                  <button
                    className={`w-auto btn ${
                      client.active ? "btn-success" : "btn-secondary"
                    }`}
                    onClick={() => handleToggleActive(client._id)}
                  >
                    {client.active ? "Active" : "Inactive"}
                  </button>
                </td>
                <td>
                    <div className="action-btn2">
                         <Link to={`/edit-clients/${client._id}`}>
                    <button className="w-auto btn btn-warning">Edit</button>
                  </Link>
                  <button
                    className="w-auto btn btn-danger"
                    onClick={() => handleDelete(client._id)}
                  >
                    Delete
                  </button>
                    </div>
                 
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ValuableClients;
