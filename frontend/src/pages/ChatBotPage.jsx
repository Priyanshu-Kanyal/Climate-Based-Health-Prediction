import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import axios from 'axios';

const containerStyle = {
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #e6f3ff 0%, #f6fff6 100%)',
  paddingTop: '100px'
};

const cardStyle = {
  background: '#ffffffcc',
  backdropFilter: 'blur(6px)',
  borderRadius: '24px',
  boxShadow: '0 12px 30px rgba(0,0,0,0.12)',
  maxWidth: '1080px',
  margin: '0 auto',
  height: '70vh',
  display: 'flex',
  flexDirection: 'column',
};

const messagesStyle = {
  padding: '18px 18px 6px 18px',
  overflowY: 'auto',
  flex: 1,
};

const headerStyle = {
  padding: '16px 22px',
  borderBottom: '1px solid rgba(0,0,0,0.06)',
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
};

const ChatBotPage = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [chatContext, setChatContext] = useState(null);
  const listRef = useRef(null);

  const sendMessage = async (text, contextData = null, skipUserMessage = false) => {
    if (!text || loading) return;
    
    // Use provided context or fall back to state
    const contextToUse = contextData || chatContext;
    
    // Add user message to chat (unless we're skipping it for auto-prompt)
    if (!skipUserMessage) {
      const userMsg = { id: Date.now(), role: 'user', text };
      setMessages((prev) => [...prev, userMsg]);
    }
    
    setLoading(true);
    try {
      // Include chat context (prediction, location, language) in the request
      const requestData = {
        message: text,
        context: contextToUse ? {
          prediction: contextToUse.prediction,
          location: contextToUse.location,
          weather: contextToUse.weather,
          language: contextToUse.language
        } : null
      };

      const { data } = await axios.post('http://localhost:5000/api/chat', requestData);
      const replyText = data?.reply || 'Sorry, I could not generate a response right now.';
      setMessages((prev) => [...prev, { id: Date.now() + 1, role: 'bot', text: replyText }]);
    } catch (e) {
      const msg = e?.response?.data?.error || e?.message || 'Network error. Please try again.';
      setMessages((prev) => [...prev, { id: Date.now() + 2, role: 'bot', text: String(msg) }]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Load chat context from localStorage (prediction data from dashboard)
    const storedContext = localStorage.getItem('chatContext');
    if (storedContext) {
      try {
        const context = JSON.parse(storedContext);
        setChatContext(context);
        
        // Create automatic prompt based on prediction
        const { prediction, language } = context;
        const category = prediction?.category || 'Unknown';
        const langName = language?.name || 'English';
        const langNative = language?.native || 'English';
        
        // Create the auto-prompt
        const autoPrompt = `Explain me '${category}' in English and ${langName} (${langNative})`;
        
        // Add welcome message
        const welcomeMessage = {
          id: 1,
          role: 'bot',
          text: `Hello! I'm here to help you understand the disease prediction.\n\n` +
                `**Predicted Category:** ${category}\n\n` +
                `I'll explain this prediction in both **English** and **${langName} (${langNative})**. ` +
                `Please wait while I generate the explanation...`
        };
        
        setMessages([welcomeMessage]);
        
        // Automatically send the explanation prompt after a short delay
        setTimeout(() => {
          // Add user message (the auto-prompt)
          const userMsg = { id: Date.now(), role: 'user', text: autoPrompt };
          setMessages((prev) => [...prev, userMsg]);
          
          // Send the message to get the explanation (pass context directly)
          sendMessage(autoPrompt, context, true); // Skip adding user message again since we just added it
        }, 500);
        
      } catch (error) {
        console.error('Error loading chat context:', error);
        setMessages([{
          id: 1,
          role: 'bot',
          text: 'Hello! I am your AI Health Assistant. Ask me about diseases, symptoms, and precautionary measures. I provide general guidance, not medical prescriptions.'
        }]);
      }
    } else {
      // Default welcome message
      setMessages([{
        id: 1,
        role: 'bot',
        text: 'Hello! I am your AI Health Assistant. Ask me about diseases, symptoms, and precautionary measures. I provide general guidance, not medical prescriptions.'
      }]);
    }
  }, []);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, loading]);

  // Handle manual message sending (user input)
  const handleSendMessage = (text) => {
    sendMessage(text, null, false);
  };

  return (
    <>
      <Navbar />
      
        <div style={{ maxWidth: '1080px', margin: '0 auto', padding: '40px' }}>
          <div style={cardStyle}>
            <div style={headerStyle}>
              <span style={{ fontSize: '1.4rem' }}>💬</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, color: '#123', fontSize: '1.15rem' }}>AI Health Chatbot</div>
                <div style={{ color: '#345', fontSize: '0.95rem' }}>
                  {chatContext ? (
                    <>
                      Explaining prediction: <strong>{chatContext.prediction?.category}</strong> | 
                      Language: <strong>{chatContext.language?.name} ({chatContext.language?.native})</strong>
                    </>
                  ) : (
                    'Ask about symptoms, diseases, and precautions'
                  )}
                </div>
              </div>
              {chatContext && (
                <div style={{ marginLeft: '10px' }}>
                  <Link to="/dashboard" className="btn btn-sm btn-outline-primary">
                    ← Back to Dashboard
                  </Link>
                </div>
              )}
            </div>

            <div ref={listRef} style={messagesStyle}>
              {messages.map((m) => (
                <ChatMessage key={m.id} role={m.role} text={m.text} />
              ))}
              {loading && <ChatMessage role="bot" text="Typing…" typing />}
              <div style={{ height: '6px' }} />
            </div>

            <div style={{ padding: '12px 14px', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
              <ChatInput onSend={handleSendMessage} disabled={loading} />
            </div>
          </div>
        </div>
      
    </>
  );
};

export default ChatBotPage;


