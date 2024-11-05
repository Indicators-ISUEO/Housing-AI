import React, { useState } from 'react';
import { Flex, Text, IconButton, ScrollArea } from '@radix-ui/themes';
import { Cross2Icon, PlusIcon, ChatBubbleIcon } from '@radix-ui/react-icons';
import { AiOutlineSearch, AiOutlineDelete } from 'react-icons/ai';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  chats: any[];
  currentChatId?: string;
  onChatSelect: (chat: any) => void;
  onDeleteChat: (chat: any) => void;
  onNewChat: () => void;
}

const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  chats,
  currentChatId,
  onChatSelect,
  onDeleteChat,
  onNewChat
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const filteredChats = chats.filter(chat => 
    chat.messages?.some((msg: any) => 
      msg.content.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed left-0 top-0 h-full w-80 bg-white dark:bg-gray-900 z-50 shadow-xl animate-drawer-slide">
        <Flex direction="column" className="h-full">
          {/* Header */}
          <Flex p="4" justify="between" align="center" className="border-b">
            <Text size="4" weight="medium">Conversations</Text>
            <IconButton size="2" variant="ghost" onClick={onClose}>
              <Cross2Icon />
            </IconButton>
          </Flex>

          {/* Search & New Chat */}
          <Flex p="4" gap="2" className="border-b">
            <div className="relative flex-1">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <AiOutlineSearch size={16} />
              </div>
              <input
                type="text"
                placeholder="Search chats..."
                className="w-full pl-9 pr-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-md"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <IconButton size="2" onClick={onNewChat}>
              <PlusIcon />
            </IconButton>
          </Flex>

          {/* Chat List */}
          <ScrollArea className="flex-1">
            <div className="p-2 space-y-1">
              {filteredChats.map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => onChatSelect(chat)}
                  className={`p-3 rounded-lg cursor-pointer flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-800 ${
                    chat.id === currentChatId ? 'bg-gray-100 dark:bg-gray-800' : ''
                  }`}
                >
                  <Flex gap="2" align="center">
                    <ChatBubbleIcon />
                    <Text size="2">
                      {chat.messages?.[0]?.content.substring(0, 30) || 'New Chat'}
                    </Text>
                  </Flex>
                  {chat.id === currentChatId && (
                    <IconButton
                      size="1"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteChat(chat);
                      }}
                    >
                      <AiOutlineDelete />
                    </IconButton>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        </Flex>
      </div>
    </>
  );
};

export default Drawer;