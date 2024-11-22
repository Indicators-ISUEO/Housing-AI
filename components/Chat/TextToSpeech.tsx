
'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { IconButton, Tooltip } from '@radix-ui/themes';
import { FaVolumeUp, FaStop } from 'react-icons/fa';
import toast from 'react-hot-toast';

interface TextToSpeechProps {
  text: string;
  className?: string;
}

const TextToSpeech = ({ text, className }: TextToSpeechProps) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);
  const chunksRef = useRef<string[]>([]);
  const currentChunkRef = useRef(0);


  const prepareTextChunks = (text: string): string[] => {
    // Cleaning the text (removing HTML tags and markdown)
    const cleanText = text.replace(/<[^>]*>?/gm, '')
                         .replace(/\[(.*?)\]/g, '$1')
                         .replace(/\n/g, ' ');

    const sentences = cleanText.match(/[^.!?]+[.!?]+/g) || [cleanText];
    const chunks: string[] = [];
    let currentChunk = '';

    sentences.forEach(sentence => {
      if (currentChunk.length + sentence.length < 200) {
        currentChunk += sentence;
      } else {
        if (currentChunk) chunks.push(currentChunk);
        currentChunk = sentence;
      }
    });
    if (currentChunk) chunks.push(currentChunk);

    return chunks;
  };

  const stopSpeaking = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    currentChunkRef.current = 0;
  }, []);

  const speakChunk = useCallback((chunkIndex: number) => {
    if (chunkIndex >= chunksRef.current.length) {
      setIsSpeaking(false);
      currentChunkRef.current = 0;
      return;
    }

    const utterance = new SpeechSynthesisUtterance(chunksRef.current[chunkIndex]);
    utterance.lang = 'en-US';
    utterance.rate = 1;
    utterance.pitch = 1;

    // Getting available voices and setting a natural-sounding one if available
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(voice => 
      voice.name.includes('Samantha') || // macOS
      voice.name.includes('Google US English') || // Chrome
      voice.name.includes('Microsoft David') // Windows
    );
    
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onend = () => {
      currentChunkRef.current++;
      speakChunk(currentChunkRef.current);
    };

    utterance.onerror = (event) => {
      console.error('Speech synthesis error', event);
      toast.error('Speech synthesis failed. Please try again.');
      stopSpeaking();
    };

    speechRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [stopSpeaking]);

  const startSpeaking = useCallback(() => {
    if (isSpeaking) {
      stopSpeaking();
      return;
    }

    // Ensuring voices are loaded
    if (window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.onvoiceschanged = () => {
        chunksRef.current = prepareTextChunks(text);
        currentChunkRef.current = 0;
        setIsSpeaking(true);
        speakChunk(0);
      };
    } else {
      chunksRef.current = prepareTextChunks(text);
      currentChunkRef.current = 0;
      setIsSpeaking(true);
      speakChunk(0);
    }
  }, [isSpeaking, text, speakChunk, stopSpeaking]);

  // Resume speaking if browser pauses it
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && isSpeaking) {
        window.speechSynthesis.resume();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isSpeaking]);

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isSpeaking]);

  return (
    <Tooltip content={isSpeaking ? "Stop Speaking" : "Read Message"}>
      <IconButton
        variant="soft"
        color={isSpeaking ? "red" : "gray"}
        size="2"
        className={`rounded-xl cursor-pointer ${className} ${
          isSpeaking ? 'dark:bg-[#C8102E]' : 'dark:bg-[#1a1a1a]'
        } dark:text-[#F1BE48] dark:border dark:border-[#C8102E] dark:hover:bg-[#242424]`}
        onClick={startSpeaking}
      >
        {isSpeaking ? (
          <FaStop className="size-4" />
        ) : (
          <FaVolumeUp className="size-4" />
        )}
      </IconButton>
    </Tooltip>
  );
};

export default TextToSpeech;