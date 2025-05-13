import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstnace";
import { Modal, Button } from "react-bootstrap";

function ContactQuery() {
  const [contactQuery, setContactQuery] = useState([]);
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchQueries = async () => {
      try {
        const response = await axiosInstance.get("/contact-us");
        setContactQuery(response.data);
      } catch (error) {
        console.error("Error fetching career queries:", error);
      }
    };
    fetchQueries();
  }, []);

  const handleViewQuery = (query) => {
    setSelectedQuery(query);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedQuery(null);
  };

  return (
    <div className="query-section">
      <div className="heading-query">
        <h2 className="section-heading">Contact Query</h2>
      </div>
      <div className="main-section">
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Index</th>
              <th scope="col">Name</th>
              <th scope="col">Email</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {contactQuery.length > 0 ? (
              contactQuery.map((query, index) => (
                <tr key={query._id}>
                  <th scope="row">{index + 1}</th>
                  <td>{query.name}</td>
                  <td>{query.email}</td>
                  <td>
                    <button
                      className="w-auto btn btn-primary"
                      onClick={() => handleViewQuery(query)}
                    >
                      View Full Query
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">No queries available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal for Full Query Details */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Query Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedQuery && (
            <div>
              <p><strong>Name:</strong> {selectedQuery.name}</p>
              <p><strong>Email:</strong> {selectedQuery.email}</p>
              <p><strong>Mobile:</strong> {selectedQuery.mobile}</p>
              <p><strong>Message:</strong> {selectedQuery.message}</p>
            </div>
          )}
        </Modal.Body>
        {/* <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer> */}
      </Modal>
    </div>
  );
}

export default ContactQuery;
