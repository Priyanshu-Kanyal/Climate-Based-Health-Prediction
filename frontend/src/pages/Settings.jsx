
import Navbar from '../pages/Navbar';
import { FaUser, FaLanguage, FaShieldAlt } from 'react-icons/fa';

const Settings = () => {
    return (
        <div className="settings-bg">
            <Navbar />
            <div className="container settings-main">
                &nbsp;&nbsp;
                <h1 className="settings-header">Settings</h1>
                &nbsp;&nbsp;
                &nbsp;&nbsp;
                <p className="settings-sub">Manage your account settings, language preferences, and sign-in options.</p>
                <div className="settings-flex-row">
                    {/* Left: Profile Settings Card */}
                    <div className="settings-flex-left">
                        <div className="settings-card">
                            <div className="settings-card-title">
                                <FaUser className="settings-card-icon" />
                                <span>Profile Settings</span>
                            </div>
                            <p className="settings-card-desc">Update your personal information.</p>
                            <div className="settings-profile-row">
                                <img className="settings-avatar" src="https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=facearea&w=256&h=256" alt="Profile" />
                                <div>
                                    <button className="settings-btn-green">Change Photo</button>
                                    <div className="settings-card-hint">JPG, GIF or PNG. 1MB max.</div>
                                </div>
                            </div>
                            <form className="settings-form">
                                <div className="settings-form-row">
                                    <div className="settings-form-col">
                                        <label className="settings-label">Full Name</label>
                                        <input className="settings-input" type="text" value="Government Authorities Only !!" />
                                    </div>
                                    <div className="settings-form-col">
                                        <label className="settings-label">Email Address</label>
                                        <input className="settings-input" type="email" value="authority@example.com" />
                                    </div>
                                </div>
                                <button className="settings-btn-green" type="button">Update Profile</button>
                            </form>
                        </div>
                    </div>
                    {/* Right: Language and Sign-in & Security Cards side-by-side */}
                    <div className="settings-flex-right">
                        <div className="settings-flex-right-top">
                            <div className="settings-card">
                                <div className="settings-card-title">
                                    <FaLanguage className="settings-card-icon" />
                                    <span>Language</span>
                                </div>
                                <p className="settings-card-desc">Choose your preferred language.</p>
                                <select className="settings-input settings-select">
                                    <option>English</option>
                                    <option>हिन्दी (Hindi)</option>
                                    <option>मराठी (Marathi)</option>
                                    <option>অসমীয়া (Assamese)</option>
                                    <option>ଓଡ଼ିଆ (Odia)</option>
                                    <option>বাংলা (Bengali)</option>
                                    <option>ગુજરાતી (Gujarati)</option>
                                    <option>ಕನ್ನಡ (Kannada)</option>
                                    <option>മലയാളം (Malayalam)</option>
                                    <option>தமிழ் (Tamil)</option>
                                    <option>తెలుగు (Telugu)</option>
                                    <option>ਪੰਜਾਬੀ (Punjabi)</option>
                                    <option>ꯃꯩꯇꯩ (Meitei)</option>
                                    <option>Khasi</option>
                                    <option>Mizo</option>
                                    <option>Naga</option>
                                    <option>Garo</option>
                                    <option>Bodo</option>
                                    <option>Tripuri</option>
                                    <option>Ao</option>
                                    <option>Konyak</option>
                                    <option>Dimasa</option>
                                    <option>Hmar</option>
                                </select>
                            </div>
                        </div>
                        <div className="settings-flex-right-bottom">
                            <div className="settings-card">
                                <div className="settings-card-title">
                                    <FaShieldAlt className="settings-card-icon" />
                                    <span>Sign-in & Security</span>
                                </div>
                                <p className="settings-card-desc">Manage your login options.</p>
                                <input className="settings-input mb-2" type="password" />
                                <button className="settings-btn-green w-100" type="button">
                                    <span style={{ marginRight: 8 }}><FaShieldAlt /></span>Sign In
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Settings;