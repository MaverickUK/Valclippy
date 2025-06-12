import { useState, useEffect } from 'react';
import { GREETING_MESSAGES, DEFAULT_GREETING } from '@/constants/greetings';

export function useRandomGreeting() {
  const [greeting, setGreeting] = useState(DEFAULT_GREETING);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(true);
      
      // Wait for fade out animation to complete before changing the text
      setTimeout(() => {
        const randomGreeting = GREETING_MESSAGES[Math.floor(Math.random() * GREETING_MESSAGES.length)];
        setGreeting(randomGreeting);
        setIsAnimating(false);
      }, 500); // Match the fade out animation duration
    }, 1000); // Show default greeting for 1 second

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return {
    greeting,
    isAnimating
  };
}