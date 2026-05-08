import '../../assets/css/Dashboard.css';
import Barplot from '../ChartsandGraphs/Barplot';
import DoughnutChart1 from '../ChartsandGraphs/DoughnutChart1';
import DoughnutChart2 from '../ChartsandGraphs/DoughnutChart2';
import AreaChartComponent from '../ChartsandGraphs/AreaChart';
import PieChart from '../ChartsandGraphs/Piechart';
import StackedLineChart from '../ChartsandGraphs/StackedLineChart';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../Navbar';
import LineRaceChart from '../ChartsandGraphs/LineRaceChart';
import { useState, useEffect, useRef } from 'react';
import { getDiseaseRecommendations } from '../../utils/diseaseRecommendations';
import { getStateLanguage } from '../../utils/stateLanguageMap';

const Dashboard = () => {
    const navigate = useNavigate();
    const [dashboardData, setDashboardData] = useState(null);
    const chartRef = useRef(null);

    useEffect(() => {
        // Load data from localStorage
        const loadDashboardData = () => {
            const storedData = localStorage.getItem('dashboardData');
            if (storedData) {
                try {
                    const data = JSON.parse(storedData);
                    setDashboardData(data);
                } catch (error) {
                    console.error('Error loading dashboard data:', error);
                }
            }
        };

        // Load initially
        loadDashboardData();

        // Listen for storage changes (when navigating from report form in different tab/window)
        const handleStorageChange = (e) => {
            if (e.key === 'dashboardData') {
                loadDashboardData();
            }
        };

        window.addEventListener('storage', handleStorageChange);
        
        // Also listen for custom event (for same-window updates)
        const handleCustomStorage = () => {
            loadDashboardData();
        };
        window.addEventListener('dashboardDataUpdated', handleCustomStorage);

        // Check for updates when window gains focus (user navigates back to dashboard)
        const handleFocus = () => {
            loadDashboardData();
        };
        window.addEventListener('focus', handleFocus);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('dashboardDataUpdated', handleCustomStorage);
            window.removeEventListener('focus', handleFocus);
        };
    }, []);

    return (
        <>
            <Navbar />

            <div className="container-fluid" style={{ backgroundColor: '#f7f7f7ff' }}>

                <main className="content">
                    <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">

                    </div>
                    &nbsp;&nbsp;

                    
                    <div className="row">
                        <div className="mb-4">
                            <div className="row">
                                
                                <div className="col-12 mb-4">
                                    <div className="card border-light shadow-sm">
                                        <div className="card-body d-flex flex-row align-items-center flex-0">
                                            <div className="d-block">
                                                <div className="h6 font-weight-bold text-black mb-2">
                                                    Disease Risk Prediction Over 24 Hours
                                                </div>
                                                {dashboardData && dashboardData.prediction && (
                                                    <div className="mt-3">
                                                        <div className="small mb-2">
                                                            <span className="badge bg-danger me-2 shadow-sm" style={{fontSize: '0.9rem'}}>
                                                                Highest Risk: {dashboardData.prediction.category}
                                                            </span>
                                                            <span className="text-muted fw-bold">
                                                                {dashboardData.location?.locationName || dashboardData.location?.cityVillage || 'Location'}
                                                            </span>
                                                        </div>
                                                        {dashboardData.prediction.cases && (
                                                            <div className="d-flex flex-wrap gap-2 mt-2">
                                                                {Object.entries(dashboardData.prediction.cases).map(([disease, cases]) => (
                                                                    <div key={disease} className="border rounded px-2 py-1 bg-white shadow-sm" style={{fontSize: '0.8rem'}}>
                                                                        <span className="fw-bold text-dark">{disease.replace('_Cases', '')}:</span> 
                                                                        <span className="ms-1 text-primary">{Math.round(cases * 10) / 10}</span> predicted cases
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="d-flex ml-auto align-items-center gap-2">
                                                {dashboardData && dashboardData.prediction && (
                                                    <button
                                                        className="btn btn-success btn-sm"
                                                        onClick={() => {
                                                            if (chartRef.current && chartRef.current.exportChartAsImage) {
                                                                chartRef.current.exportChartAsImage();
                                                            }
                                                        }}
                                                        title="Save chart as image"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-download me-1" viewBox="0 0 16 16">
                                                            <path d="M.5 9.9a.5.5 0 0 1 .5.5h2.5a.5.5 0 0 1 0 1H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v5.5a.5.5 0 0 1-1 0V4a.5.5 0 0 0-.5-.5H3a.5.5 0 0 0-.5.5v6.4z"/>
                                                            <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/>
                                                        </svg>
                                                        Save as Image
                                                    </button>
                                                )}
                                                <Link to="/report" className="btn btn-primary btn-sm">
                                                    New Prediction
                                                </Link>
                                            </div>
                                        </div>
                                        <div className="card-body p-2">
                                            <LineRaceChart ref={chartRef} dashboardData={dashboardData} />
                                        </div>
                                    </div>
                                </div>

                                {/* ML Insights Section */}
                                {dashboardData && dashboardData.prediction && (
                                    <div className="col-12 mb-4">
                                        <div className="card border-light shadow-sm">
                                            <div className="card-body">
                                                <h4 className="h5 mb-4 font-weight-bold">ML Insights &amp; Model Interpretability</h4>
                                                <p className="text-muted small mb-4">These charts are dynamically generated during the latest AI model training phase, demonstrating weather impacts on predicting disease spread.</p>
                                                <div className="row">
                                                    <div className="col-md-6 mb-4 text-center">
                                                        <h6 className="h6 mb-3">Weather-Disease Correlation Heatmap</h6>
                                                        <img src="http://localhost:5000/graphs/correlation_heatmap.png" alt="Correlation Heatmap" className="img-fluid rounded shadow-sm border" style={{ maxHeight: '350px', objectFit: 'contain' }} />
                                                    </div>
                                                    <div className="col-md-6 mb-4 text-center">
                                                        <h6 className="h6 mb-3">XGBoost Feature Importance</h6>
                                                        <img src="http://localhost:5000/graphs/xgboost_feature_importance.png" alt="Feature Importance" className="img-fluid rounded shadow-sm border" style={{ maxHeight: '350px', objectFit: 'contain' }} />
                                                    </div>
                                                    <div className="col-12 mb-4 text-center">
                                                        <h6 className="h6 mb-3 mt-3">SHAP Summary (How Weather Drives Predictions)</h6>
                                                        <img src="http://localhost:5000/graphs/shap_summary.png" alt="SHAP Summary" className="img-fluid rounded shadow-sm border" style={{ maxHeight: '450px', objectFit: 'contain' }} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Recommendations and Precautions Section */}
                                {dashboardData && dashboardData.prediction && (
                                    <div className="col-12 mb-4">
                                        <div className="card border-light shadow-sm">
                                            <div className="card-body">
                                                {(() => {
                                                    const recommendations = getDiseaseRecommendations(
                                                        dashboardData.prediction.category,
                                                        dashboardData.prediction.features
                                                    );
                                                    const stateLanguage = getStateLanguage(dashboardData.location?.state);
                                                    
                                                    return (
                                                        <div>
                                                            <div className="d-flex align-items-center mb-3">
                                                                <span style={{ fontSize: '2rem', marginRight: '15px' }}>
                                                                    {recommendations.icon}
                                                                </span>
                                                                <div>
                                                                    <h3 className="h5 mb-1">{recommendations.title}</h3>
                                                                    <small className="text-muted">
                                                                        Based on ML Model Prediction: <strong>{dashboardData.prediction.category}</strong>
                                                                    </small>
                                                                </div>
                                                            </div>

                                                            <div className="row">
                                                                <div className="col-md-6 mb-3">
                                                                    <h5 className="h6 text-primary mb-2">
                                                                        <strong>Precautionary Measures</strong>
                                                                    </h5>
                                                                    <ul className="list-unstyled">
                                                                        {recommendations.precautions.map((precaution, index) => (
                                                                            <li key={index} className="mb-2">
                                                                                <span className="text-primary me-2">✓</span>
                                                                                {precaution}
                                                                            </li>
                                                                        ))}
                                                                    </ul>
                                                                </div>

                                                                <div className="col-md-6 mb-3">
                                                                    <h5 className="h6 text-success mb-2">
                                                                        <strong>Suggestions & Best Practices</strong>
                                                                    </h5>
                                                                    <ul className="list-unstyled">
                                                                        {recommendations.suggestions.map((suggestion, index) => (
                                                                            <li key={index} className="mb-2">
                                                                                <span className="text-success me-2">•</span>
                                                                                {suggestion}
                                                                            </li>
                                                                        ))}
                                                                    </ul>
                                                                </div>
                                                            </div>

                                                            <div className="mt-3 p-3 bg-light rounded">
                                                                <h5 className="h6 text-info mb-2">
                                                                    <strong>Environmental Factors & Risk Assessment</strong>
                                                                </h5>
                                                                <ul className="list-unstyled mb-0">
                                                                    {recommendations.environmental.map((env, index) => (
                                                                        <li key={index} className="mb-1">
                                                                            <span className="text-info me-2">ℹ️</span>
                                                                            {env}
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            </div>

                                                            <div className="mt-4 text-center border-top pt-4">
                                                                <h5 className="h6 mb-3">Need More Information?</h5>
                                                                <button
                                                                    className="btn btn-primary btn-lg px-5"
                                                                    onClick={() => {
                                                                        // Store prediction context for chatbot
                                                                        const chatContext = {
                                                                            prediction: dashboardData.prediction,
                                                                            location: dashboardData.location,
                                                                            weather: dashboardData.weather,
                                                                            language: stateLanguage,
                                                                            timestamp: new Date().toISOString()
                                                                        };
                                                                        localStorage.setItem('chatContext', JSON.stringify(chatContext));
                                                                        navigate('/chat');
                                                                    }}
                                                                    style={{ minWidth: '300px' }}
                                                                >
                                                                    <span style={{ fontSize: '1.5rem', marginRight: '10px' }}>💬</span>
                                                                    Chat with AI Assistant
                                                                    <br />
                                                                    <small className="d-block mt-2" style={{ fontWeight: 'normal' }}>
                                                                        Get detailed explanation in <strong>{stateLanguage.name}</strong> ({stateLanguage.native}) and English
                                                                    </small>
                                                                </button>
                                                                <p className="text-muted small mt-3 mb-0">
                                                                    Ask questions about the prediction, prevention measures, symptoms, or any health-related queries
                                                                </p>
                                                            </div>
                                                        </div>
                                                    );
                                                })()}
                                            </div>
                                        </div>
                                    </div>
                                )}
                                
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </>
    )
}

export default Dashboard;