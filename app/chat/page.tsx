'use client'

import { Suspense, useContext, useState } from 'react'
import { Flex, Box, Text, ScrollArea } from '@radix-ui/themes'
import { Chat, ChatContext, ChatSideBar, useChatHook, ChatMessage, ChatRole } from '@/components'
import { WelcomeScreen } from '@/components/Welcome'
import PersonaModal from './PersonaModal'
import PersonaPanel from './PersonaPanel'
import toast from 'react-hot-toast'

const ChatProvider = () => {
  const provider = useChatHook()
  const [showWelcome, setShowWelcome] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  var isWelcome = false
  if (provider.currentChatRef.current) {
    isWelcome = provider.currentChatRef.current.isWelcome ?? false
  }

  const handleSuggestionClick = async (prompt: string) => {
    if (isLoading) return;
    if (provider.currentChatRef) {
      console.log(provider.currentChatRef.current?.messages?.length)
      setShowWelcome(false)
      if (provider.currentChatRef.current) {
        provider.currentChatRef.current.isWelcome = false
        if(provider.currentChatRef.current.persona) {
          provider.currentChatRef.current.persona.prompt = prompt
        }
      }
    }
  }

  return (
    <Box style={{ height: 'calc(100vh - 56px)' }}>
      <ChatContext.Provider value={{
        ...provider,
        showWelcome,
        setShowWelcome,
        isLoading
      }}>
        <Flex direction="column" style={{ height: '100%' }}>
          {/* Main Content Area with fixed height */}
          <Box style={{ height: 'calc(100% - 100px)' }} className="relative">
            <Flex style={{ height: '100%' }}>
              <ChatSideBar />
              <div className="flex-1"> 
                {isWelcome ? (
                  <WelcomeScreen 
                    onSuggestionClick={handleSuggestionClick} 
                    isLoading={isLoading}
                  />
                ) : (
                  <Chat ref={provider.chatRef} />
                )}
                <PersonaPanel />
              </div>
            </Flex>
          </Box>

          <Box className="w-full px-4 py-6 bg-gray-100 dark:bg-[#1a1a1a] border-t border-gray-200 dark:border-[#C8102E]/20">
            <Flex direction="column" gap="2" className="max-w-5xl mx-auto text-center">
              <Text size="1" className="text-gray-600 dark:text-[#F1BE48] font-medium">
                Disclaimer: This AI assistant can make mistakes. Please check for accuracy!
              </Text>
              <Text size="1" className="text-gray-500 dark:text-[#e5e5e5]">
                © {new Date().getFullYear()} Iowa State University Extension and Outreach. All rights reserved.
              </Text>
            </Flex>
          </Box>
        </Flex>
        <PersonaModal />
      </ChatContext.Provider>
    </Box>
  )
}

const ChatPage = () => {
  return (
    <Suspense fallback={
      <div className="w-full h-full flex items-center justify-center">
        <div className="animate-pulse dark:text-[#F1BE48]">Loading chat interface...</div>
      </div>
    }>
      <ChatProvider />
    </Suspense>
  )
}

export default ChatPage