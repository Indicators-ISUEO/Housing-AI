'use client'

import { Suspense, useState } from 'react'
import { Flex, Box, Text } from '@radix-ui/themes'
import { Chat, ChatContext, ChatSideBar, useChatHook, ChatMessage, ChatRole } from '@/components'
import { WelcomeScreen } from '@/components/Welcome'
import PersonaModal from './PersonaModal'
import PersonaPanel from './PersonaPanel'
import toast from 'react-hot-toast'

const ChatProvider = () => {
  const provider = useChatHook()
  const [showWelcome, setShowWelcome] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  const handleSuggestionClick = async (prompt: string) => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      const newChat = {
        ...provider.DefaultPersonas[0],
        name: `Chat - ${prompt.substring(0, 20)}...`
      }
      await provider.onCreateChat?.(newChat)

      const userMessage: ChatMessage = {
        role: 'user' as ChatRole,
        content: prompt
      }

      if (provider.chatRef?.current) {
        provider.chatRef.current.setConversation([userMessage])
      }

      setShowWelcome(false)

      let url = '/chat'
      const proxy_url = window.location.href
      if (proxy_url) {
        url = proxy_url.replace("3000", "8080")
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'text/event-stream'
        },
        body: JSON.stringify({
          prompt: provider.DefaultPersonas[0].prompt,
          messages: [userMessage],
          input: prompt
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error('Stream reader not available');
      }

      const assistantMessage: ChatMessage = {
        role: 'assistant' as ChatRole,
        content: ''
      }

      let assistantResponse = '';

      if (provider.chatRef?.current) {
        provider.chatRef.current.setConversation([
          userMessage,
          assistantMessage
        ])
      }

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        assistantResponse += chunk;

        if (provider.chatRef?.current) {
          provider.chatRef.current.setConversation([
            userMessage,
            { ...assistantMessage, content: assistantResponse }
          ])
        }
      }

      const finalMessages: ChatMessage[] = [
        userMessage,
        { ...assistantMessage, content: assistantResponse }
      ]
      await provider.saveMessages?.(finalMessages)
      provider.forceUpdate?.()

    } catch (error) {
      console.error('Error:', error)
      toast.error('An error occurred. Please try again.')
      setShowWelcome(true)
      
      if (provider.currentChatRef?.current) {
        provider.currentChatRef.current = undefined
      }
    } finally {
      setIsLoading(false)
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
                {showWelcome ? (
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

          {/* Footer with fixed height */}
          <Box className="w-full px-4 py-6 bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
            <Flex direction="column" gap="2" className="max-w-5xl mx-auto text-center">
              <Text size="1" className="text-gray-600 dark:text-gray-400">
                Disclaimer: This AI assistant can make mistakes. Please check for accuracy!
              </Text>
              <Text size="1" className="text-gray-500 dark:text-gray-500">
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
        <div className="animate-pulse">Loading chat interface...</div>
      </div>
    }>
      <ChatProvider />
    </Suspense>
  )
}

export default ChatPage