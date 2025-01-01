import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstnace";

function Dashboard() {
  const [totalQueries, setTotalQueries] = useState(0);

  useEffect(() => {
    const fetchTotalQueries = async () => {
      try {
        const response = await axiosInstance.get('/career-queries/count');
        setTotalQueries(response.data.count);
      } catch (error) {
        console.error('Error fetching total queries:', error);
      }
    };

    fetchTotalQueries();
  }, []);

  return (
    <div className="dashboard-container">
      <h2>Welcome to the Dashboard!</h2>
      <div className="card-container">
        <div className="card">
          <h3>Career Query</h3>
          <p>Total Queries: {totalQueries}</p>
        </div>       
        <div className="card">
          <h3>Contact Query</h3>
          <p>Total Queries: {totalQueries}</p>
        </div>       
      </div>
    </div>
  );
}

export default Dashboard;
