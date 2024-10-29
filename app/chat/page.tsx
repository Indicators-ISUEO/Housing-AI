'use client'

import { Suspense, useState } from 'react'
import { Flex } from '@radix-ui/themes'
import { Chat, ChatContext, ChatSideBar, useChatHook } from '@/components'
import { WelcomeScreen } from '@/components/Welcome'
import PersonaModal from './PersonaModal'
import PersonaPanel from './PersonaPanel'

const ChatProvider = () => {
  const provider = useChatHook()
  const [showWelcome, setShowWelcome] = useState(true)

  const handleSuggestionClick = (prompt: string) => {
    // Create new chat if needed
    if (!provider.currentChatRef?.current) {
      provider.onCreateChat?.(provider.DefaultPersonas[0])
    }
    
    // Hide welcome screen
    setShowWelcome(false)
    
    // Add the prompt to the conversation
    setTimeout(() => {
      const textArea = document.querySelector('.chat-textarea .rt-TextAreaInput') as HTMLElement;
      if (textArea) {
        textArea.innerHTML = prompt;
        // Trigger enter key press to send message
        const event = new KeyboardEvent('keydown', {
          key: 'Enter',
          code: 'Enter',
          keyCode: 13,
          which: 13,
          bubbles: true
        });
        textArea.dispatchEvent(event);
      }
    }, 100) // Small delay to ensure chat is mounted
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