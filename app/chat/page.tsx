'use client'

import { Suspense, useState } from 'react'
import { Flex } from '@radix-ui/themes'
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
        // url = proxy_url.replace("3000", "5000")
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

      // Add initial assistant message
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
    <ChatContext.Provider value={{
      ...provider,
      showWelcome,
      setShowWelcome,
      isLoading
    }}>
      <Flex style={{ height: 'calc(100% - 56px)' }} className="relative">
        <ChatSideBar />
        <div className="flex-1 relative">
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
      <PersonaModal />
    </ChatContext.Provider>
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