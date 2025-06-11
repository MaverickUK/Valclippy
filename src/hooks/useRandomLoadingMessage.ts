import { useState, useEffect } from 'react';
import { loadingMessages } from '@/constants/loadingMessages';

export function useRandomLoadingMessage() {
  const [message, setMessage] = useState(loadingMessages[0]);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * loadingMessages.length);
    setMessage(loadingMessages[randomIndex]);
  }, []);

  return message;
}