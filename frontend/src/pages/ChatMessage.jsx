import React from 'react';

const bubbleBase = {
  padding: '10px 14px',
  borderRadius: '16px',
  maxWidth: '80%',
  boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
  marginBottom: '10px',
  whiteSpace: 'pre-wrap',
  lineHeight: 1.45,
};

const rowStyle = {
  display: 'flex',
  width: '100%',
  marginBottom: '6px',
};

const typingDots = {
  display: 'inline-block',
  width: '36px',
  height: '10px',
  background: 'linear-gradient(90deg, rgba(0,0,0,0.15) 25%, rgba(0,0,0,0.25) 50%, rgba(0,0,0,0.15) 75%)',
  borderRadius: '8px',
  animation: 'pulse 1.2s infinite',
};

// Enhanced markdown renderer
const renderMarkdown = (text) => {
  if (!text) return '';
  
  const lines = text.split('\n');
  let html = '';
  let inList = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    
    // Headers
    if (trimmed.startsWith('### ')) {
      if (inList) { html += '</ul>'; inList = false; }
      html += `<h5 style="margin: 12px 0 6px 0; font-weight: 600; color: #333;">${trimmed.substring(4)}</h5>`;
    } else if (trimmed.startsWith('## ')) {
      if (inList) { html += '</ul>'; inList = false; }
      html += `<h4 style="margin: 16px 0 8px 0; font-weight: 700; color: #222;">${trimmed.substring(3)}</h4>`;
    } else if (trimmed.startsWith('# ')) {
      if (inList) { html += '</ul>'; inList = false; }
      html += `<h3 style="margin: 20px 0 10px 0; font-weight: 700; color: #111;">${trimmed.substring(2)}</h3>`;
    }
    // List items
    else if (trimmed.match(/^[-•*]\s+/)) {
      if (!inList) {
        html += '<ul style="margin: 8px 0; padding-left: 20px;">';
        inList = true;
      }
      const content = trimmed.replace(/^[-•*]\s+/, '');
      // Process bold and italic in list items
      const processed = content
        .replace(/\*\*(.*?)\*\*/g, '<strong style="font-weight: 600;">$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>');
      html += `<li style="margin: 4px 0;">${processed}</li>`;
    }
    // Empty line
    else if (trimmed === '') {
      if (inList) {
        html += '</ul>';
        inList = false;
      }
      html += '<br>';
    }
    // Regular text
    else {
      if (inList) {
        html += '</ul>';
        inList = false;
      }
      // Process bold and italic
      let processed = line
        .replace(/\*\*(.*?)\*\*/g, '<strong style="font-weight: 600;">$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>');
      html += processed + '<br>';
    }
  }
  
  // Close any open list
  if (inList) {
    html += '</ul>';
  }
  
  return html;
};

const ChatMessage = ({ role, text, typing }) => {
  const isUser = role === 'user';

  const container = {
    ...rowStyle,
    justifyContent: isUser ? 'flex-end' : 'flex-start',
  };

  const bubble = {
    ...bubbleBase,
    background: isUser ? '#fff' : '#e6f2ff',
    color: '#111',
    borderTopRightRadius: isUser ? '4px' : '16px',
    borderTopLeftRadius: isUser ? '16px' : '4px',
  };

  return (
    <div style={container}>
      <div style={bubble}>
        {typing ? (
          <span style={typingDots}> </span>
        ) : (
          <div dangerouslySetInnerHTML={{ __html: renderMarkdown(text) }} />
        )}
      </div>
    </div>
  );
};

export default ChatMessage;


