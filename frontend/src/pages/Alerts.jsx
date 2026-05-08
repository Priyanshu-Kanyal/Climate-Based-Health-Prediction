
import React from 'react';
import Navbar from './Navbar';

const alerts = [
    {
        type: 'high',
        icon: '⚠️',
        title: 'High-Risk Alert: Potential Cholera Outbreak in Nongstoin',
        desc: 'Multiple reports of severe diarrhea and vomiting have been received from Nongstoin village. Residents are advised to boil all drinking water and seek medical attention immediately if symptoms appear. Health workers have been dispatched.',
        time: '2 hours ago',
    },
    {
        type: 'high',
        icon: '⚠️',
        title: 'Water Quality Warning: Tura River',
        desc: 'Recent tests of the Tura River show elevated levels of bacteria. Avoid using this water for drinking or cooking until further notice. Water tankers will be available near the community hall.',
        time: '1 day ago',
    },
    {
        type: 'advisory',
        icon: 'ℹ️',
        title: 'Advisory: Monsoon Season Precautions',
        desc: 'With the onset of monsoon, the risk of water contamination increases. Ensure all water storage containers are covered and clean your surroundings to prevent waterlogging. Report any signs of illness promptly.',
        time: '3 days ago',
    },
    {
        type: 'clear',
        icon: '✅',
        title: 'All Clear: Mawphlang Water Source',
        desc: 'Following chlorination and re-testing, the main well in Mawphlang is now safe for use. The previous advisory has been lifted.',
        time: '5 days ago',
    },
];

const getAlertStyle = (type) => {
    if (type === 'high') {
        return {
            border: '1.5px solid #f5bcbc',
            background: '#fff',
            color: '#d32f2f',
            marginBottom: '24px',
            borderRadius: '12px',
            padding: '22px 28px',
            boxSizing: 'border-box',
            display: 'flex',
            alignItems: 'flex-start',
            position: 'relative',
        };
    }
    if (type === 'advisory') {
        return {
            border: '1.5px solid #dbeee3',
            background: '#fff',
            color: '#23422c',
            marginBottom: '24px',
            borderRadius: '12px',
            padding: '22px 28px',
            boxSizing: 'border-box',
            display: 'flex',
            alignItems: 'flex-start',
            position: 'relative',
        };
    }
    // clear
    return {
        border: '1.5px solid #dbeee3',
        background: '#fff',
        color: '#23422c',
        marginBottom: '24px',
        borderRadius: '12px',
        padding: '22px 28px',
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'flex-start',
        position: 'relative',
    };
};

const getIconStyle = (type) => ({
    fontSize: '1.6rem',
    marginRight: '18px',
    marginTop: '2px',
    color: type === 'high' ? '#d32f2f' : '#23422c',
});

const Alerts = () => (
    <>
        <Navbar />
        &nbsp;&nbsp;
        <div style={{ minHeight: '100vh', background: '#f5f7f5' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 0 0 0' }}>
                &nbsp;&nbsp;
                <h1 style={{ fontSize: '2.5rem', fontWeight: 700, color: '#23422c', marginBottom: '0.2rem' }}>Alerts & Notifications</h1>
                <div style={{ color: '#3d6c4a', fontSize: '1.18rem', marginBottom: '2.2rem' }}>
                    Stay updated with the latest health advisories and warnings for your area.
                </div>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    {alerts.map((a, idx) => (
                        <div key={idx} style={getAlertStyle(a.type)}>
                            <span style={getIconStyle(a.type)}>{a.icon}</span>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 600, fontSize: '1.25rem', color: a.type === 'high' ? '#d32f2f' : '#23422c', marginBottom: '2px' }}>{a.title}</div>
                                <div style={{ color: a.type === 'high' ? '#d32f2f' : '#23422c', fontSize: '1.08rem', marginBottom: '2px' }}>{a.desc}</div>
                            </div>
                            <div style={{ position: 'absolute', right: '24px', top: '18px', color: '#23422c', fontSize: '1rem', fontWeight: 500 }}>{a.time}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </>
);

export default Alerts;


