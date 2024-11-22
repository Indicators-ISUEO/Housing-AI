"use client";

import { useCallback, useState, useEffect } from "react";
import { Avatar, Flex, IconButton, Tooltip } from "@radix-ui/themes";
import { HiUser } from "react-icons/hi";
import { Markdown } from "@/components";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import { ChatMessage } from "./interface";
import TextToSpeech from "./TextToSpeech";

export interface MessageProps {
  message: ChatMessage;
  onAgentResponse: (response: ChatMessage) => void;
}

const Message = (props: MessageProps) => {
  const { role, content, sourceLink } = props.message;
  const { onAgentResponse } = props;
  const isUser = role === "user";
  const copy = useCopyToClipboard();
  const [tooltipOpen, setTooltipOpen] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState(false);

  const onCopy = useCallback(() => {
    copy(content, (isSuccess) => {
      if (isSuccess) {
        setTooltipOpen(true);
      }
    });
  }, [content, copy]);

  return (
    <Flex
      gap="4"
      className="mb-5 message-container"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Avatar
        fallback={<HiUser className="size-4" />}
        color={isUser ? undefined : "pink"}
        size="2"
        radius="full"
      />
      <div className="flex-1 pt-1 break-all">
        {isUser ? (
          <div
            className="userMessage"
            dangerouslySetInnerHTML={{
              __html: content.replace(
                /<(?!\/?br\/?.+?>|\/?img|\/?table|\/?thead|\/?tbody|\/?tr|\/?td|\/?th.+?>)[^<>]*>/gi,
                ""
              ),
            }}
          ></div>
        ) : (
          <Flex direction="column" gap="4">
            <div className="flex justify-between items-start">
              <div className="flex-grow">
                <Markdown>{content}</Markdown>
              </div>
              {isHovered && (
                <div className="flex-shrink-0 ml-4">
                  <TextToSpeech
                    text={content}
                    className="text-to-speech-button"
                  />
                </div>
              )}
            </div>
            {sourceLink && (
              <div
                dangerouslySetInnerHTML={{
                  __html: `Source: <a href="${sourceLink}" target="_blank"
                  class="source-link">${sourceLink}</a>`,
                }}
              ></div>
            )}
          </Flex>
        )}
      </div>
    </Flex>
  );
};

export default Message;
