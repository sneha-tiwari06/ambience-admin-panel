import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstnace";
import "./dashboard.css";
import { Link } from "react-router-dom";

function Dashboard() {
  const [totalQueries, setTotalQueries] = useState(0);
  const [contactQueries, setContactQueries] = useState(0);
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [bannerImages, setProjectData] = useState([]);
  const [filteredData, setFilteredData] = useState([]); // State for filtered data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [careerResponse, contactResponse, projectResponse] = await Promise.all([
          axiosInstance.get('/career-queries/count'),
          axiosInstance.get('/contact-us/count'),
          axiosInstance.get('/projects/')
        ]);

        setTotalQueries(careerResponse.data.count);
        setContactQueries(contactResponse.data.count);

        const dataWithIndex = projectResponse.data.map((item, idx) => ({
          ...item,
          index: idx + 1,
        }));
        setProjects(dataWithIndex);
        setProjectData(dataWithIndex);
        setFilteredData(dataWithIndex);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);


  const formatNumber = (num) => {
    return num.toLocaleString();
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading Dashboard...</p>
        </div>
      </div>
    );
  }
 
  return (
    <div className="dashboard-container">
      {/* Header Section */}
      <div className="dashboard-header">
        <div className="header-content">
          <h1 className="dashboard-title">
            <span className="title-icon">🏠</span>
            Ambience Interiors
          </h1>
          <p className="dashboard-subtitle">
            Welcome back! Here's what's happening with your interior design business today.
          </p>
        </div>
        <div className="header-decoration">
          <div className="decoration-circle"></div>
          <div className="decoration-circle"></div>
          <div className="decoration-circle"></div>
        </div>
      </div>

      {/* Stats Cards Section */}
      <div className="stats-grid">
        {/* Career Queries Card */}
        <div className="stat-card career-card">
          <div className="card-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <div className="card-content">
            <h3 className="card-title">Career Queries</h3>
            <div className="card-number">{formatNumber(totalQueries)}</div>
            <p className="card-description">Job applications received</p>
          </div>
          <div className="card-decoration">
            <div className="card-bg-pattern"></div>
          </div>
        </div>

        {/* Contact Queries Card */}
        <div className="stat-card contact-card">
          <div className="card-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <div className="card-content">
            <h3 className="card-title">Contact Queries</h3>
            <div className="card-number">{formatNumber(contactQueries)}</div>
            <p className="card-description">Customer inquiries</p>
          </div>
          <div className="card-decoration">
            <div className="card-bg-pattern"></div>
          </div>
        </div>

        {/* Quick Actions Card */}
        <div className="stat-card actions-card">
          <div className="card-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <div className="card-content">
            <h3 className="card-title">Quick Actions</h3>
            <div className="quick-actions">
              <Link to="/projects" className="action-btn-dash" style={{ textDecoration: 'none' }}>
                <span>📝</span> Add Project
              </Link>

              <Link to="/gallery" className="action-btn-dash" style={{ textDecoration: 'none' }}>
                <span>📸</span> Upload Gallery
              </Link>
            </div>

          </div>
          <div className="card-decoration">
            <div className="card-bg-pattern"></div>
          </div>
        </div>

        {/* Recent Activity Card */}
        {/* <div className="stat-card activity-card">
          <div className="card-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
          </div>
          <div className="card-content">
            <h3 className="card-title">Recent Activity</h3>
            <div className="activity-list">
              <div className="activity-item">
                <span className="activity-dot"></span>
                <span>New career application received</span>
              </div>
              <div className="activity-item">
                <span className="activity-dot"></span>
                <span>Contact form submitted</span>
              </div>
            </div>
          </div>
          <div className="card-decoration">
            <div className="card-bg-pattern"></div>
          </div>
        </div> */}
      </div>

      {/* Welcome Message */}
      <div className="welcome-section">
        <div className="welcome-card">
          <div className="welcome-content">
            <h2>🎨 Interior Design Excellence</h2>
            <p>
              Transform spaces, create experiences, and build your portfolio.
              Your admin dashboard is here to help you manage your interior design business efficiently.
            </p>
            <div className="welcome-stats">
              <div className="welcome-stat">
                <span className="stat-label">Total Projects</span>
                <span className="stat-value">{projects.length}</span>
              </div>

              <div className="welcome-stat">
                <span className="stat-label">Happy Clients</span>
                <span className="stat-value">	250</span>
              </div>
              <div className="welcome-stat">
                <span className="stat-label">Deliverd Projects</span>
                <span className="stat-value">500</span>
              </div>
            </div>
          </div>
          <div className="welcome-illustration">
            <div className="design-elements">
              <div className="element element-1">🎨</div>
              <div className="element element-2">🏠</div>
              <div className="element element-3">✨</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
