"use client";

import React, { useState, useCallback } from "react";
import { IconButton, Tooltip } from "@radix-ui/themes";
import { FaMicrophone, FaStopCircle } from "react-icons/fa";
import toast from "react-hot-toast";

interface SpeechToTextProps {
  onTranscript: (text: string) => void;
  isLoading?: boolean;
  className?: string;
}

const SpeechToText = ({
  onTranscript,
  isLoading,
  className,
}: SpeechToTextProps) => {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);

  const startListening = useCallback(() => {
    try {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();

      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onstart = () => {
        setIsListening(true);
        toast.success("Listening...");
      };

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result) => result.transcript)
          .join("");

        onTranscript(transcript);
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error", event);
        toast.error("Speech recognition failed. Please try again.");
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognition);
      recognition.start();
    } catch (error) {
      console.error("Speech recognition not supported", error);
      toast.error("Speech recognition is not supported in your browser");
    }
  }, [onTranscript]);

  const stopListening = useCallback(() => {
    if (recognition) {
      recognition.stop();
      setIsListening(false);
    }
  }, [recognition]);

  return (
    <Tooltip
      content={isListening ? "Stop Recording" : "Start Speech Recognition"}
    >
      <IconButton
        variant="soft"
        disabled={isLoading}
        color={isListening ? "red" : "gray"}
        size="2"
        className={`rounded-xl cursor-pointer ${className} ${isListening ? "dark:bg-[#C8102E]" : "dark:bg-[#1a1a1a]"} dark:text-[#F1BE48] dark:border dark:border-[#C8102E] dark:hover:bg-[#242424]`}
        onClick={isListening ? stopListening : startListening}
      >
        {isListening ? (
          <FaStopCircle className="size-4" />
        ) : (
          <FaMicrophone className="size-4" />
        )}
      </IconButton>
    </Tooltip>
  );
};

export default SpeechToText;
