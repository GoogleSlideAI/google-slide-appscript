import { MainContainer, ChatContainer, MessageList, MessageInput, TypingIndicator, Button } from '@chatscope/chat-ui-kit-react';
import { useState } from 'react';
import { KEY } from './const';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import CopyButton from '../../../shared/components/copy-button';
import Markdown from '../../../shared/components/markdown';
import { serverFunctions } from '../../../utils/serverFunctions';
import { useServerFunction } from '../../../shared/hooks/useServerFunction';
  
const systemMessage = {
  "role": "system",
  "content": "You are a concise slide content assistant. Keep all responses under 100 characters. Be clear and impactful. Avoid unnecessary words. Focus on key points that work well on slides."
}


const ChatBotScreen = () => {
  const { isLoading, execute } = useServerFunction();

  const [messages, setMessages] = useState([
    {
      message: "Hi! I'll help create concise slide content. What would you like to add?",
      sentTime: "just now",
      sender: "ChatGPT"
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async (message: string) => {
    const newMessage = {
      message,
      direction: 'outgoing',
      sender: "user"
    };

    const newMessages = [...messages, newMessage];
    setMessages(newMessages as any);
    setIsTyping(true);
    await processMessageToChatGPT(newMessages);
  };

  const onAddTextToSlide = async (message: string) => {
    await execute(() => serverFunctions.addTextToSlide(message));
  }

  async function processMessageToChatGPT(chatMessages: any) {
    let apiMessages = chatMessages.map((messageObject: any) => {
      let role = messageObject.sender === "ChatGPT" ? "assistant" : "user";
      return { role: role, content: messageObject.message }
    });

    const apiRequestBody = {
      "model": "gpt-4o-mini",
      "messages": [
        systemMessage,
        ...apiMessages
      ],
      "max_tokens": 50  // Limiting token count for shorter responses
    }

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": "Bearer " + KEY,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(apiRequestBody)
      });

      const data = await response.json();
      
      if (!data.choices || !data.choices[0]?.message?.content) {
        throw new Error('Invalid response from API');
      }

      let content = data.choices[0].message.content;
      
      // Ensure response is not longer than 100 characters
      if (content.length > 100) {
        content = content.substring(0, 97) + "...";
      }

      setMessages([...chatMessages, {
        message: content,
        sender: "ChatGPT"
      }]);
    } catch (error) {
      console.error('Error processing message:', error);
      setMessages([...chatMessages, {
        message: "Sorry, I couldn't process that request. Please try again with a simpler query.",
        sender: "ChatGPT"
      }]);
    } finally {
      setIsTyping(false);
    }
  }

  return (
    <div className="App" style={{ height: '100%', width: '100%' }}>
      <div style={{ 
        position: "relative", 
        height: "100vh", 
        maxHeight: "625px",
        width: "100%",
        maxWidth: "100%",
        margin: "0 auto"
      }}>
        <MainContainer style={{ border: 'none' }}>
          <ChatContainer>       
            <MessageList 
              scrollBehavior="smooth" 
              typingIndicator={isTyping ? <TypingIndicator content="ChatGPT is typing" /> : null}
              style={{
                padding: '8px',
                fontSize: '14px'
              }}
            >
              {messages.map((message: any, i: number) => {
                const isUser = message.sender === "user";
                return (
                  <div key={i} style={{
                    maxWidth: '85%',
                    ...(isUser ? {
                      marginLeft: 'auto',
                      marginRight: '8px'
                    } : {
                      marginLeft: '8px',
                      marginRight: 'auto'
                    })
                  }}>
                    <div style={{
                      padding: '8px',
                      backgroundColor: isUser ? '#CCE1FF' : '#f0f0f0',
                      color: isUser ? 'white' : 'black',
                      borderRadius: '12px',
                    }}>
                      <Markdown>
                        {message.message}
                      </Markdown>
                    </div>
                    <div className='flex align-center'>
                    <CopyButton className='mt-1' content={message.message} text={message.message} />
                    <Button 
                      className='self-end mt-1' 
                      onClick={() => onAddTextToSlide(message.message)}
                      disabled={isLoading}
                    >
                      {isLoading ? 'Adding to slide...' : 'Add to slide'}
                    </Button>
                    </div>
                  </div>

                )
              })}
            </MessageList>


            <MessageInput 
              placeholder="Type message here" 
              onSend={handleSend}
              style={{
                padding: '8px',
                borderTop: '1px solid #e5e5e5'
              }}
            />        
          </ChatContainer>
        </MainContainer>
      </div>
    </div>
  )
}

export default ChatBotScreen;