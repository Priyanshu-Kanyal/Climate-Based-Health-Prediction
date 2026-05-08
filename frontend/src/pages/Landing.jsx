import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../assets/css/Landing.css';
import LandingImg from '../assets/img/Landing.jpg';
import AboutBg from '../assets/img/AboutBg.jpg';
import VisionBg from '../assets/img/VisionBg.png';
import AmanImg from '../assets/img/Team/AmanImg.jpg';
import AdityaImg from '../assets/img/Team/AdityaImg.jpg';
import SujalImg from '../assets/img/Team/SujalImg.jpg';
import KartikImg from '../assets/img/Team/KartikImg.jpg';
import SwayamImg from '../assets/img/Team/SwayamImg.jpg';
import Navbar from './Navbar';

function Landing() {
    const [activeTab, setActiveTab] = useState('completed');
    const [showSignInModal, setShowSignInModal] = useState(false);
    const [showSignUpModal, setShowSignUpModal] = useState(false);
    const [userLoggedIn, setUserLoggedIn] = useState(false);

    const handleSignIn = (e) => {
        e.preventDefault();
        setShowSignInModal(false);
        setUserLoggedIn(true);
    };

    const handleSignUp = (e) => {
        e.preventDefault();
        setShowSignUpModal(false);
        setUserLoggedIn(true);
    };

    const handleEnquirySubmit = (e) => {
        e.preventDefault();
        alert('Thank you for your enquiry! We will contact you soon.');
        e.target.reset();
    };

    return (
        <div className="d-flex flex-column min-vh-100">
            {/* Header */}
            <Navbar />

            {/* Hero Section (two-column) */}

            <section className="hero-split" id="home">
                <div className="container hero-split-container">
                    <div className="hero-left">
                        <h1>SevaSuraksha: Protecting India's Health</h1>
                        <p>A smart community health monitoring and early warning system for water-borne, vector-borne and air-borne diseases in Indian Territories. Report symptoms, get risk predictions, dynamic dashboards and access vital health information.</p>
                        <div className="hero-buttons" style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginTop: '24px' }}>
                            {/* <Link to="/dashboard" className="btn">Go to Dashboard</Link> */}
                            <Link to="/report" className="btn btn-primary">Report Symptoms</Link>
                        </div>

                    </div>
                    <div className="hero-right">
                        <img src={LandingImg} alt="River community" />
                    </div>
                </div>
            </section>

            {/* Key Features */}
            <section className="features" id="features">
                &nbsp;&nbsp;
                <div className="container">
                    {/* &nbsp;&nbsp; */}
                    <div className="features-title">Key Features</div>
                    <h2 className="features-heading">Empowering Community Health</h2>
                    <p className="features-sub">Our platform provides the tools and information necessary for communities and health officials to proactively manage public health risks related to water-borne diseases.</p>
                    <div className="features-grid">
                        <div className="feature-item">
                            <h3>Symptom Reporting & AI Risk Prediction</h3>
                            <p>Easily report symptoms and receive instant, AI-powered risk predictions for water-borne diseases.</p>
                        </div>
                        <div className="feature-item">
                            <h3>Health Dashboard</h3>
                            <p>Visualize health trends, outbreak hotspots, and water quality data through intuitive charts and graphs.</p>
                        </div>
                        <div className="feature-item">
                            <h3>Educational Resources</h3>
                            <p>Access multilingual educational content, including infographics and videos on preventive hygiene.</p>
                        </div>
                        <div className="feature-item">
                            <h3>Real-time Alerts</h3>
                            <p>Receive timely notifications about potential outbreaks and important health advisories.</p>
                        </div>
                        <div className="feature-item">
                            <h3>Multilingual Support</h3>
                            <p>Available in English, Hindi, and several regional languages of India.</p>
                        </div>
                        <div className="feature-item">
                            <h3>Offline Functionality</h3>
                            <p>Save reports offline in low-connectivity areas, and sync automatically when you're back online.</p>
                        </div>
                    </div>
                </div>
            </section>


            {/* About Section */}
            <section className="about" id="about">
                <div className="container">
                    <div className="section-title">
                        <h1>About the Health Monitoring Initiative</h1>
                    </div>
                    <div className="about-content">
                        <div className="about-text">
                            <p>We aim to detect and prevent diseases across rural India by combining community symptom reporting, Air and Water quality tracking, getting hourly based predictive analytics and providing dynamic dashboards to the users.</p>
                            <p>Community users, and district officials collaborate using simple tools, multilingual support, and accessible content to safeguard public health.</p>
                            <div className="stats">
                                <div className="stat-item">
                                    <h3>15000+</h3>
                                    <p>Villages Covered</p>
                                </div>
                                <div className="stat-item">
                                    <h3>120+</h3>
                                    <p>Outreach Sessions</p>
                                </div>
                                <div className="stat-item">
                                    <h3>50+</h3>
                                    <p>Awareness Campaigns</p>
                                </div>
                            </div>
                        </div>
                        <div className="about-image">
                            <img src={AboutBg} alt="Rural health awareness" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Projects Section */}


            {/* Vision Section (split) */}
            <section className="vision-split" id="vision">
                <div className="container vision-split-container">
                    <div className="vision-image">
                        <img src={VisionBg} alt="Community awareness" />
                    </div>
                    <div className="vision-text">
                        <h2>Our Vision</h2>
                        <p>Our vision is to make India a healthy and safe place to live in by providing a platform to the community to report symptoms, get risk predictions, dynamic dashboards and access vital health information.</p>
                    </div>
                </div>
            </section>

            {/* Team Section 
            <section className="team" id="team">
                <div className="container">
                    <div className="section-title">
                        <h1>NexusNovaz</h1>
                    </div>
                    <div className="team-grid">
                        <div className="team-member">
                            <div className="member-image">
                                <img src={KartikImg} alt="Raj Sharma" />
                            </div>
                            <div className="member-info">
                                <h3>Karik Chavan</h3>
                                <div className="member-position">UI Designer</div>
                                <p>Creating User Interface.</p>
                            </div>
                        </div>
                        <div className="team-member">
                            <div className="member-image">
                                <img src={AdityaImg} alt="Priya Patel" />
                            </div>
                            <div className="member-info">
                                <h3>Aditya Pandey</h3>
                                <div className="member-position">Backend Engineer</div>
                                <p>Builds outbreak prediction models and hotspot detection.</p>
                            </div>
                        </div>
                        <div className="team-member">
                            <div className="member-image">
                                <img src={SwayamImg} alt="Swayam Chaurasia" />
                            </div>
                            <div className="member-info">
                                <h3>Swayam Chaurasia</h3>
                                <div className="member-position">ML Engineer</div>
                                <p>Build outbreak prediction models and Hotspot detection</p>
                            </div>
                        </div>
                        <div className="team-member">
                            <div className="member-image">
                                <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" alt="Ananya Rao" />
                            </div>
                            <div className="member-info">
                                <h3>Nandini Mourya</h3>
                                <div className="member-position">Data Analyst </div>
                                <p>Cleaning, Testing Datasets and EDA </p>
                            </div>
                        </div>
                        <div className="team-member">
                            <div className="member-image">
                                <img src={SujalImg} alt="Amit Singh" />
                            </div>
                            <div className="member-info">
                                <h3>Sujal Ghonmode </h3>
                                <div className="member-position">Research Analyst</div>
                                <p>Reasearch and gathering the datasets and maintaining quality and reliability.</p>
                            </div>
                        </div>
                        <div className="team-member">
                            <div className="member-image">
                                <img src={AmanImg} alt="Aman Pratap Singh" />
                            </div>
                            <div className="member-info">
                                <h3>Aman Pratap Singh</h3>
                                <div className="member-position">Product Manager</div>
                                <p>Drives multilingual content and local partnerships.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            */}
            {/* Contact Section */}
            <section className="contact" id="contact">
                <div className="container">
                    <div className="section-title">
                        <h2>Contact Us</h2>
                    </div>
                    <div className="contact-container">
                        <div className="contact-info">
                            <div className="contact-info-item">
                                <div className="contact-icon">
                                    <i className="fas fa-map-marker-alt"></i>
                                </div>
                                <div className="contact-details text-white">
                                    <h3>College</h3>
                                    <p>VIT-AP University</p>
                                </div>
                            </div>

                            <div className="contact-info-item">
                                <div className="contact-icon">
                                    <i className="fas fa-phone"></i>
                                </div>
                                <div className="contact-details">
                                    <h3>Phone</h3>
                                    <p>+91 832 1234567</p>
                                    <p>+91 98765 43210</p>
                                </div>
                            </div>

                            <div className="contact-info-item">
                                <div className="contact-icon">
                                    <i className="fas fa-envelope"></i>
                                </div>
                                <div className="contact-details">
                                    <h3>Emails</h3>
                                    <p>swayam.22bce8346@vitapstudent.ac.in</p>
                                    <p>priyanshu.22bce7572@vitapstudent.ac.in</p>
                                    <p>laxmi.22bce8400@vitapstudent.ac.in</p>
                                </div>
                            </div>

                            <div className="contact-info-item">
                                <div className="contact-icon">
                                    <i className="fas fa-clock"></i>
                                </div>
                                <div className="contact-details">
                                    <h3>Working Hours</h3>
                                    <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                                    <p>Saturday: 10:00 AM - 2:00 PM</p>
                                </div>
                            </div>
                        </div>

                        <div className="contact-form">
                            <form id="enquiryForm" onSubmit={handleEnquirySubmit}>
                                <div className="form-group">
                                    <label htmlFor="name">Full Name</label>
                                    <input type="text" id="name" required />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="email">Email Address</label>
                                    <input type="email" id="email" required />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="phone">Phone Number</label>
                                    <input type="tel" id="phone" />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="subject">Subject</label>
                                    <input type="text" id="subject" required />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="message">Your Message</label>
                                    <textarea type="text" id="message" required />
                                </div>
                                <button type="submit" className="btn btn-success">Send Message</button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer>
                <div className="container footer-content">
                    <div className="copyright">
                        <p>&copy; 2025 SevaSuraksha. All Rights Reserved.</p>
                    </div>
                    <div className="social-links">
                        <a href="#"><i className="fab fa-facebook-f"></i></a>
                        <a href="#"><i className="fab fa-twitter"></i></a>
                        <a href="#"><i className="fab fa-instagram"></i></a>
                        <a href="#"><i className="fab fa-linkedin-in"></i></a>
                    </div>
                </div>
            </footer>

            {/* Sign In Modal */}
            {/* Connect the Authentication backend, It will be added in Feature Update */}
            {showSignInModal && (
                <div className="modal" id="signInModal">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>Sign In to Your Account</h3>
                            <button className="close-modal" onClick={() => setShowSignInModal(false)}>&times;</button>
                        </div>
                        <div className="modal-body">
                            <form id="signInForm" onSubmit={handleSignIn}>
                                <div className="form-group">
                                    <label htmlFor="loginEmail">Email Address</label>
                                    <input type="email" id="loginEmail" required />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="loginPassword">Password</label>
                                    <input type="password" id="loginPassword" required />
                                </div>
                                <button type="submit" className="btn">Sign In</button>
                                <div className="form-toggle">
                                    <p>Don't have an account? <a href="#" onClick={(e) => {
                                        e.preventDefault();
                                        setShowSignInModal(false);
                                        setShowSignUpModal(true);
                                    }}>Sign Up</a></p>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Sign Up Modal */}
            {showSignUpModal && (
                <div className="modal" id="signUpModal">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>Create New Account</h3>
                            <button className="close-modal" onClick={() => setShowSignUpModal(false)}>&times;</button>
                        </div>
                        <div className="modal-body">
                            <form id="signUpForm" onSubmit={handleSignUp}>
                                <div className="form-group">
                                    <label htmlFor="fullName">Full Name</label>
                                    <input type="text" id="fullName" className='form-input' required />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="signupEmail">Email Address</label>
                                    <input type="email" id="signupEmail" required />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="signupPhone">Phone Number</label>
                                    <input type="tel" id="signupPhone" required />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="signupPassword">Password</label>
                                    <input type="password" id="signupPassword" required />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="confirmPassword">Confirm Password</label>
                                    <input type="password" id="confirmPassword" required />
                                </div>
                                <button type="submit" className="btn">Create Account</button>
                                <div className="form-toggle">
                                    <p>Already have an account? <a href="#" onClick={(e) => {
                                        e.preventDefault();
                                        setShowSignUpModal(false);
                                        setShowSignInModal(true);
                                    }}>Sign In</a></p>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Landing;