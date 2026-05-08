import React from "react";
import { Link } from 'react-router-dom';
import '../assets/css/Landing.css';


function Auth({ userLoggedIn, setUserLoggedIn, setShowSignInModal, setShowSignUpModal }) {
    const [activeTab, setActiveTab] = useState('completed');
    const [activeFaq, setActiveFaq] = useState(null);
    const [showSignInModal, setShowSignInModal] = useState(false);
    const [showSignUpModal, setShowSignUpModal] = useState(false);
    const [userLoggedIn, setUserLoggedIn] = useState(false);

    const toggleFaq = (index) => {
        setActiveFaq(activeFaq === index ? null : index);
    };

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
        <div className="auth-buttons">
            {userLoggedIn ? (
                <div className="user-info">
                    <div className="user-avatar">U</div>
                    <button className="btn" onClick={() => setUserLoggedIn(false)}>Sign Out</button>
                </div>
            ) : (
                <>
                    <button className="btn" onClick={() => setShowSignInModal(true)}>Sign In</button>
                    <button className="btn btn-outline" onClick={() => setShowSignUpModal(true)}>Create Account</button>
                </>
            )}
        </div>
    )
}

export default Auth;