
import React from 'react';
import Navbar from './Navbar';
import WhoImg from '../assets/img/Awareness/WhoImg.jpg';
import TyphoidImg from '../assets/img/Awareness/TyphoidImg.png';
import HandwashImg from '../assets/img/Awareness/HandwashImg.jpg';
import CholeraImg from '../assets/img/Awareness/CholeraImg.png';
import WaterstorageImg from '../assets/img/Awareness/WaterstorageImg.jpg';
import WaterPurifyImg from '../assets/img/Awareness/WaterPurifyImg.jpg';

const resources = [
    {
        img: HandwashImg,
        tags: ['Hygiene', 'Prevention'],
        title: 'Handwashing: The First Line of Defense',
        desc: 'Proper handwashing technique is crucial. This infographic shows the 6 steps for effective hand hygiene.',
        btn: 'Watch Video',
        btnIcon: '📹',
        link: '#https://www.google.com/search?sca_esv=4e89ca1d2fd0e141&rlz=1C1CHBD_enIN991IN991&q=10+importance+of+hand+washing&sa=X&ved=2ahUKEwjYhuCA7N2PAxVt1jgGHSUwBx84ChDVAnoECCUQAQ&biw=1536&bih=730&dpr=1.25#fpstate=ive&vld=cid:d8a955d4,vid:OonS3CKN2SE,st:0',
        type: 'read',
    },
    {
        img: TyphoidImg,
        tags: ['Disease Info', 'Typhoid'],
        title: 'Typhoid Fever: Causes and Prevention',
        desc: 'Explore how Typhoid spreads and what you can do to protect your family from this common water-borne illness.',
        btn: 'Read More',
        btnIcon: '→',
        link: '#https://my.clevelandclinic.org/health/diseases/17730-typhoid-fever',
        type: 'read',
    },
    {
        img: WhoImg,
        tags: ['Community', 'Expert Talk'],
        title: 'Community Health Worker Explains',
        desc: 'Listen to an ASHA worker discuss the importance of community vigilance in preventing disease outbreaks.',
        btn: 'Watch Video',
        btnIcon: '📹',
        link: '#https://youtu.be/tupJDf13jBo?si=_74xtX9PBWNPvt86',
        type: 'video',
    },
    {
        img: WaterstorageImg,
        tags: ['Water Safety', 'Hygiene'],
        title: 'Safe Water Handling and Storage',
        desc: 'Learn the best practices for collecting, storing, and handling water to prevent contamination at home.',
        btn: 'Read More',
        btnIcon: '→',
        link: '#https://www.grida.no/resources/13744',
        type: 'read',
    },
    {
        img: WaterPurifyImg,
        tags: ['DIY', 'Health Tip'],
        title: 'How to Purify Water at Home',
        desc: 'A step-by-step video guide on simple and effective methods like boiling, filtering, and using purification tablets.',
        btn: 'Raed More',
        btnIcon: '→',
        link: '#https://www.wikihow.com/Purify-Water',
        type: 'video',
    },
    {
        img: CholeraImg,
        tags: ['Disease Info', 'Cholera'],
        title: 'Recognizing Symptoms of Cholera',
        desc: 'Understand the key symptoms of Cholera and when to seek immediate medical help. Early detection saves lives.',
        btn: 'Read More',
        btnIcon: '→',
        link: 'https://my.clevelandclinic.org/health/diseases/16636-cholera',
        type: 'read',
    },
];


const Awareness = () => {
    // Track toggle state for each card
    // const [] = useState(Array(resources.length).fill(false));


    const handleClick = (link) => {
        if (link) {
            const url = link.startsWith('#') ? link.slice(1) : link;
            window.open(url, '_blank');
        }
    };

    return (
        <>
            <Navbar />
            &nbsp;&nbsp;
            <div className="awareness-bg" style={{ minHeight: '100vh', background: '#f5f7f5' }}>
                &nbsp;&nbsp;
                <div className="awareness-header" style={{ padding: '40px 0 0 0', maxWidth: '1200px', margin: '0 auto' }}>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 700, color: '#23422c', marginBottom: '0.2rem' }}>Awareness & Educational Resources</h1>
                    <div style={{ color: '#3d6c4a', fontSize: '1.18rem', marginBottom: '2.2rem' }}>
                        Knowledge is the first step towards prevention. Explore these resources to protect yourself and your community.
                    </div>
                </div>
                <div className="awareness-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(370px, 1fr))', gap: '32px', maxWidth: '1200px', margin: '0 auto', paddingBottom: '40px' }}>
                    {resources.map((r, idx) => (
                        <div key={idx} className="awareness-card" style={{ background: '#fff', borderRadius: '14px', boxShadow: '0 2px 16px rgba(44,62,80,0.08)', border: '1px solid #e3e7e3', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                            <img src={r.img} alt={r.title} style={{ width: '100%', height: '220px', objectFit: 'cover' }} />
                            <div style={{ padding: '28px 24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                <div style={{ marginBottom: '12px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                    {r.tags.map((tag, i) => (
                                        <span key={i} style={{ background: '#e3e7e3', color: '#23422c', fontWeight: 600, fontSize: '1rem', borderRadius: '8px', padding: '4px 14px' }}>{tag}</span>
                                    ))}
                                </div>
                                <div style={{ fontWeight: 700, fontSize: '1.35rem', color: '#23422c', marginBottom: '0.5rem' }}>{r.title}</div>
                                <div style={{ color: '#3d6c4a', fontSize: '1.08rem', marginBottom: '1.5rem' }}>{r.desc}</div>
                                <div style={{ marginTop: 'auto' }}>
                                    <button
                                        onClick={() => handleClick(r.link)}
                                        className="awareness-btn"
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '10px',
                                            background: '#f5f7f5',
                                            borderRadius: '10px',
                                            padding: '18px 0',
                                            fontWeight: 600,
                                            fontSize: '1.15rem',
                                            color: '#23422c',
                                            textDecoration: 'none',
                                            boxShadow: '0 2px 8px rgba(44,62,80,0.08)',
                                            border: 'none',
                                            width: '100%',
                                            cursor: 'pointer',
                                            transition: 'all 0.3s cubic-bezier(.4,0,.2,1)',
                                        }}
                                        onMouseEnter={e => {
                                            e.currentTarget.style.background = '#356c3c';
                                            e.currentTarget.style.color = '#fff';
                                            e.currentTarget.style.transform = 'scale(1.05)';
                                        }}
                                        onMouseLeave={e => {
                                            e.currentTarget.style.background = '#f5f7f5';
                                            e.currentTarget.style.color = '#23422c';
                                            e.currentTarget.style.transform = 'scale(1)';
                                        }}
                                    >
                                        <span style={{ transition: 'transform 0.3s' }}>{r.btnIcon}</span>
                                        {r.btn}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default Awareness;


