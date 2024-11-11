"use client";

import {
  useState,
  useCallback,
  useEffect,
  useRef,
  useReducer,
  useContext,
  forwardRef,
  useImperativeHandle,
} from "react";
import {
  Flex,
  IconButton,
  ScrollArea,
  Tooltip,
} from "@radix-ui/themes";
import ContentEditable from "react-contenteditable";
import toast from "react-hot-toast";
import {
  AiOutlineClear,
  AiOutlineLoading3Quarters,
  AiOutlineUnorderedList,
} from "react-icons/ai";
import { FiSend } from "react-icons/fi";
import ChatContext from "./chatContext";
import type { Chat as ChatType, ChatMessage, ChatGPInstance } from './interface';
import Message from "./Message";
import { useTheme } from "../Themes";
import "./index.scss";

const HTML_REGULAR =
  /<(?!img|table|\/table|thead|\/thead|tbody|\/tbody|tr|\/tr|td|\/td|th|\/th|br|\/br).*?>/gi;

export interface ChatProps {}

const postChatOrQuestion = async (chat: ChatType, messages: ChatMessage[], input: string) => {
  var url = "/chat";
  const proxy_url = process.env.NEXT_PUBLIC_HOST;
  if (proxy_url) {
    url = proxy_url + url;
  }

  const data = {
    id: chat?.id,
    prompt: chat?.persona?.prompt,
    messages: [...messages],
    input,
  };

  return await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      accept: "text/event-stream",
    },
    body: JSON.stringify(data),
  });
};

const Chat = forwardRef<ChatGPInstance, ChatProps>((props, ref) => {
  const { debug, currentChatRef, saveMessages, onToggleSidebar } = useContext(ChatContext);
  const [, forceUpdate] = useReducer((x) => x + 1, 0);
  const conversation = useRef<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightBoxURL, setIsLightBoxURL] = useState("");
  const conversationRef = useRef<ChatMessage[]>();
  const [message, setMessage] = useState("");
  const [currentMessage, setCurrentMessage] = useState("");
  const textAreaRef = useRef<HTMLElement>(null);
  const bottomOfChatRef = useRef<HTMLDivElement>(null);

  const handleAgentResponse = useCallback((response: ChatMessage) => {
    conversation.current = [...conversation.current, response];
    if (response.sourceLink) {
      const sourceLinkContent = `Source: <a href="${response.sourceLink}" target="_blank">${response.sourceLink}</a>`;
      conversation.current.push({
        content: sourceLinkContent,
        role: "assistant",
      });
    }
    forceUpdate();
  }, []);

  const processMessage = async (input: string) => {
    if (input.length < 1) {
      toast.error("Please type a message to continue.");
      return;
    }

    const messageHistory = [...conversation.current];
    conversation.current = [
      ...conversation.current,
      { content: input, role: "user" },
    ];
    setMessage("");
    setIsLoading(true);

    try {
      const response = await postChatOrQuestion(
        currentChatRef?.current!,
        messageHistory,
        input
      );

      if (response.ok) {
        const data = response.body;
        if (!data) {
          throw new Error("No data");
        }

        const reader = data.getReader();
        const decoder = new TextDecoder();
        let done = false;
        let resultContent = "";
        let sourceLink = "";

        while (!done) {
          try {
            const { value, done: readerDone } = await reader.read();
            const char = decoder.decode(value);
            if (char) {
              setCurrentMessage((state) => {
                let parts = char.split("||links ");
                if (parts.length > 1) {
                  resultContent += parts[0] + "\n";
                  try {
                    const links: string = parts[1].replaceAll("'", '"');
                    const linksJSON: any = JSON.parse(links);
                    if ("map_link" in linksJSON) {
                      resultContent += `<div class="iframe-container"><iframe src="${linksJSON["map_link"]}" frameborder="0"></iframe>`;
                      resultContent += `<button id="expand-map" class="expand-button">Expand</button></div>`;
                    } else if ("sattelite_image" in linksJSON) {
                      resultContent += ` <div style="display: flex; justify-content: space-between;">
                        <div style="text-align: center; max-width: 48%;">
                          <img id="expand-map" src="${linksJSON["sattelite_image"]}?${Date.now()}" alt="Sattelite image" style="width: 100%; height: auto;">
                          <div style="margin-top: 8px; font-size: 14px; color: #555;">Sattelite image</div>
                        </div>
                        <div style="text-align: center; max-width: 48%;">
                          <img id="expand-map" src="${linksJSON["sattelite_image_with_mask"]}?${Date.now()}" alt="Sattelite image with mask" style="width: 100%; height: auto;">
                          <div style="margin-top: 8px; font-size: 14px; color: #555;">Sattelite image with housing mask</div>
                        </div>
                      </div>`;
                    }
                    if ("src" in linksJSON) {
                      sourceLink = linksJSON["src"];
                    }
                  } catch (error) {
                    console.log(error);
                  }
                } else {
                  resultContent = state + char;
                }
                return resultContent;
              });
            }
            done = readerDone;
          } catch {
            done = true;
          }
        }

        setTimeout(() => {
          conversation.current = [
            ...conversation.current,
            { content: resultContent, role: "assistant", sourceLink },
          ];
          setCurrentMessage("");
        }, 1);
      } else {
        const result = await response.json();
        if (response.status === 401) {
          conversation.current.pop();
          location.href =
            result.redirect +
            `?callbackUrl=${encodeURIComponent(location.pathname + location.search)}`;
        } else {
          toast.error(result.error);
        }
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.message);
      conversation.current.pop();
    } finally {
      setIsLoading(false);
    }
  };

  const handleButtonClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    const input = textAreaRef.current?.innerHTML?.replace(HTML_REGULAR, "") || "";
    await processMessage(input);
  };

  const handleKeyPress = useCallback(
    async (e: React.KeyboardEvent) => {
      if (e.keyCode === 13 && !e.shiftKey) {
        e.preventDefault();
        const input = textAreaRef.current?.innerHTML?.replace(HTML_REGULAR, "") || "";
        await processMessage(input);
      }
    },
    []
  );

  const clearMessages = () => {
    conversation.current = [];
    forceUpdate();
    setMessage("");
    setCurrentMessage("");
    setIsLoading(false);
  };

  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = "50px";
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight + 2}px`;
    }
  }, [message]);

  useEffect(() => {
    if (bottomOfChatRef.current) {
      bottomOfChatRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [conversation.current, currentMessage]);

  useEffect(() => {
    conversationRef.current = conversation.current;
    if (currentChatRef?.current?.id) {
      saveMessages?.(conversation.current);
    }
  }, [currentChatRef, conversation.current, saveMessages]);

  useImperativeHandle<ChatGPInstance, ChatGPInstance>(
    ref,
    () => ({
      setConversation(messages: ChatMessage[]) {
        conversation.current = messages;
        forceUpdate();
      },
      getConversation() {
        return conversationRef.current;
      },
      focus() {
        textAreaRef.current?.focus();
      },
      async sendMessage(content: string) {
        await processMessage(content);
      },
    }),
    []
  );

  const { theme } = useTheme();

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "light") {
      root.setAttribute("data-theme", "light");
    } else if (theme === "dark") {
      root.setAttribute("data-theme", "dark");
    } else {
      root.removeAttribute("data-theme");
    }
  }, [theme]);

  useEffect(() => {
    const handleExpandButtonClick = () => {
      setIsLightboxOpen(true);
    };
    
    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (target?.id === "expand-map") {
        handleExpandButtonClick();
        let mapUrl = "";
        if (target instanceof HTMLImageElement) {
          mapUrl = target.src;
        } else if (target?.previousElementSibling) {
          mapUrl = target.previousElementSibling.getAttribute("src") || "";
        }
        setIsLightBoxURL(mapUrl);
      }
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  const Lightbox = ({ isOpen, onClose, url }: { isOpen: boolean; onClose: () => void; url: string }) => {
    if (!isOpen) return null;
    return (
      <div className="lightbox">
        <div className="lightbox-content">
          <iframe
            src={url}
            frameBorder="0"
            width="100%"
            height="100%"
            style={{ position: "relative", zIndex: 9999 }}
          />
          <button className="lightbox-close" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    );
  };

  return (
    <Flex direction="column" height="100%" className="relative" gap="3">
      <ScrollArea
        className="flex-1 px-4"
        type="auto"
        scrollbars="vertical"
        style={{ height: "100%" }}
      >
        {conversation.current.map((item, index) => (
          <Message
            key={index}
            message={item}
            onAgentResponse={handleAgentResponse}
          />
        ))}
        {currentMessage && (
          <Message
            message={{ content: currentMessage, role: "assistant" }}
            onAgentResponse={handleAgentResponse}
          />
        )}
        <div ref={bottomOfChatRef}></div>
      </ScrollArea>
      <div className="px-4 pb-3">
        <Flex align="end" justify="between" gap="3" className="relative">
          <div
            className="rt-TextAreaRoot rt-r-size-1 rt-variant-surface flex-1 rounded-3xl chat-textarea"
            style={{ position: "relative" }}
          >
            <ContentEditable
              innerRef={textAreaRef}
              style={{
                minHeight: "24px",
                maxHeight: "200px",
                overflowY: "auto",
              }}
              className="rt-TextAreaInput text-base"
              html={message}
              disabled={isLoading}
              onChange={(e) => {
                const value = e.target.value.replace(HTML_REGULAR, "");
                setMessage(value);
              }}
              onKeyDown={handleKeyPress}
            />
          </div>
          <Flex gap="3" className="absolute right-0 pr-4 bottom-2 pt">
            {isLoading && (
              <Flex
                width="6"
                height="6"
                align="center"
                justify="center"
                style={{ color: "var(--accent-11)" }}
              >
                <AiOutlineLoading3Quarters className="animate-spin size-4" />
              </Flex>
            )}
            <Tooltip content="Send Message">
              <IconButton
                variant="soft"
                disabled={isLoading}
                color="gray"
                size="2"
                className="rounded-xl cursor-pointer"
                onClick={handleButtonClick}
              >
                <FiSend className="size-4" />
              </IconButton>
            </Tooltip>
            <Tooltip content="Clear History">
              <IconButton
                variant="soft"
                color="gray"
                size="2"
                className="rounded-xl cursor-pointer"
                disabled={isLoading}
                onClick={clearMessages}
              >
                <AiOutlineClear className="size-4" />
              </IconButton>
            </Tooltip>
            <Tooltip content="Toggle Sidebar">
              <IconButton
                variant="soft"
                color="gray"
                size="2"
                className="rounded-xl md:hidden cursor-pointer"
                disabled={isLoading}
                onClick={onToggleSidebar}
              >
                <AiOutlineUnorderedList className="size-4" />
              </IconButton>
            </Tooltip>
          </Flex>
        </Flex>
      </div>
      <Lightbox
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        url={lightBoxURL}
      />
    </Flex>
  );
});

Chat.displayName = 'Chat';

export default Chat;