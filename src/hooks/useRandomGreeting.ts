import { useState, useEffect } from 'react';
import { GREETING_MESSAGES, DEFAULT_GREETING } from '@/constants/greetings';

export function useRandomGreeting() {
  const [greeting, setGreeting] = useState(DEFAULT_GREETING);

  useEffect(() => {
    const randomGreeting = GREETING_MESSAGES[Math.floor(Math.random() * GREETING_MESSAGES.length)];
    setGreeting(randomGreeting);
  }, []);

  return greeting;
}