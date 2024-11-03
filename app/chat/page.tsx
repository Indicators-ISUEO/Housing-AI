'use client'

import { Suspense, useState } from 'react'
import { Flex } from '@radix-ui/themes'
import { Chat, ChatContext, ChatSideBar, useChatHook, ChatMessage, ChatRole } from '@/components'
import { WelcomeScreen } from '@/components/Welcome'
import PersonaModal from './PersonaModal'
import PersonaPanel from './PersonaPanel'

const ChatProvider = () => {
  const provider = useChatHook()
  const [showWelcome, setShowWelcome] = useState(true)

  const handleSuggestionClick = async (prompt: string) => {
    const newChat = {
      ...provider.DefaultPersonas[0],
      name: `Chat - ${prompt.substring(0, 20)}...`
    }
    await provider.onCreateChat?.(newChat)
    
    setShowWelcome(false)

    // Adding assistant message immediately to show loading state
    if (provider.currentChatRef?.current) {
      const initialMessage: ChatMessage = {
        role: 'assistant' as ChatRole,
        content: 'Let me help you with that...'
      }
      
      provider.currentChatRef.current.messages = [initialMessage]
      provider.forceUpdate?.()
    }

    // Adding the user's prompt as a message
    if (provider.chatRef?.current) {
      const userMessage: ChatMessage = {
        role: 'user' as ChatRole,
        content: prompt
      }
      provider.chatRef.current.setConversation([userMessage])

      setTimeout(() => {
        const textArea = document.querySelector('.chat-textarea .rt-TextAreaInput') as HTMLElement
        if (textArea) {
          textArea.innerHTML = prompt
          const enterEvent = new KeyboardEvent('keydown', {
            key: 'Enter',
            code: 'Enter',
            keyCode: 13,
            which: 13,
            bubbles: true,
            cancelable: true
          })
          textArea.dispatchEvent(enterEvent)
        }
      }, 100)
    }
  }

  return (
    <ChatContext.Provider value={provider}>
      <Flex style={{ height: 'calc(100% - 56px)' }} className="relative">
        {/* Chat Sidebar */}
        <ChatSideBar />
        
        {/* Main Content */}
        <div className="flex-1 relative">
          {showWelcome ? (
            <WelcomeScreen onSuggestionClick={handleSuggestionClick} />
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
    <Suspense>
      <ChatProvider />
    </Suspense>
  )
}

export default ChatPage