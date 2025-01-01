import React, { useEffect, useState } from "react";
import axiosInstance, { BASE_IMAGE_URL } from "../utils/axiosInstnace";
function CareerQuery() {
  const [queries, setQueries] = useState([]);
  useEffect(() => {
    const fetchQueries = async () => {
      try {
        const response = await axiosInstance.get('/career-queries');
        const validQueries = response.data.filter(query => query.car_name && query.car_email && query.car_resume);
        setQueries(validQueries);
      } catch (error) {
        console.error('Error fetching career queries:', error);
      }
    };  
    fetchQueries();
  }, []);
  const handleViewResume = (resumeUrl) => {
    window.open(resumeUrl, '_blank');
  };
  return (
    <div className="query-section">
      <div className="heading-query">
        <h2 className="section-heading">Career Query</h2>
      </div>
      <div className="main-section">
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Index</th>
              <th scope="col">Name</th>
              <th scope="col">Job Location</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {queries.length > 0 ? (
              queries.map((query, index) => (
                <tr key={query._id}>
                  <th scope="row">{index + 1}</th>
                  <td>{query.car_name}</td>
                  <td>{query.car_location}</td>
                  <td>
                    <button
                      className="w-auto btn btn-primary"
                      onClick={() => handleViewResume(`${BASE_IMAGE_URL}/${query.car_resume}`)} 
                      >
                      View Resume
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
    </div>
  );
}
export default CareerQuery;
