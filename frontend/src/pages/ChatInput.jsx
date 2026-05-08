import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';

const inputWrap = {
  display: 'flex',
  gap: '10px',
};

const inputStyle = {
  flex: 1,
  borderRadius: '14px',
  border: '1px solid rgba(0,0,0,0.12)',
  padding: '12px 14px',
  outline: 'none',
  fontSize: '1rem',
};

const sendBtn = {
  borderRadius: '12px',
  background: '#1976d2',
  color: '#fff',
  border: 'none',
  padding: '10px 16px',
  cursor: 'pointer',
  transition: 'background 0.2s ease',
};

const ChatInput = ({ onSend, disabled }) => {
  const [value, setValue] = useState('');

  const handleSend = () => {
    const text = value.trim();
    if (!text) return;
    onSend(text);
    setValue('');
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div style={inputWrap}>
      <Form.Control
        as="textarea"
        style={inputStyle}
        rows={1}
        placeholder="Type your message..."
        value={value}
        disabled={disabled}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={onKeyDown}
      />
      <Button style={sendBtn} onClick={handleSend} disabled={disabled}>
        Send
      </Button>
    </div>
  );
};

export default ChatInput;


