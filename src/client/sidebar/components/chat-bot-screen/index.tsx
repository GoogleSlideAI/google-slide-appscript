import { MainContainer, ChatContainer, MessageList, MessageInput, TypingIndicator, Button } from '@chatscope/chat-ui-kit-react';
import { useState } from 'react';
import { KEY } from './const';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import CopyButton from '../../../shared/components/copy-button';
import Markdown from '../../../shared/components/markdown';
import { serverFunctions } from '../../../utils/serverFunctions';
import { useServerFunction } from '../../../shared/hooks/useServerFunction';
  
const systemMessage = { //  Explain things like you're talking to a software professional with 5 years of experience.
  "role": "system", "content": "Explain things like you're talking to a software professional with 2 years of experience."
}


const ChatBotScreen = () => {
  const { isLoading,execute } = useServerFunction();

  const [messages, setMessages] = useState([
    {
      message: "Hello, I'm Jarvis! Ask me anything!",
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
    
    setMessages (newMessages as any);

    setIsTyping(true);
    await processMessageToChatGPT(newMessages);
  };

  const onAddTextToSlide = async (message: string) => {
     await execute(() => serverFunctions.addTextToSlide(message));
  }


  async function processMessageToChatGPT(chatMessages: any) {

    let apiMessages = chatMessages.map((messageObject: any) => {
      let role = "";
      if (messageObject.sender === "ChatGPT") {

        role = "assistant";
      } else {
        role = "user";
      }
      return { role: role, content: messageObject.message}
    });

    const apiRequestBody = {
      "model": "gpt-4o-mini",
      "messages": [
        systemMessage,
        ...apiMessages
      ]
    }


    await fetch("https://api.openai.com/v1/chat/completions", 
    {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(apiRequestBody)
    }).then((data) => {
      return data.json();
    }).then((data) => {
      console.log(data);
      setMessages([...chatMessages, {
        message: data.choices[0].message.content,
        sender: "ChatGPT"
      }]);
      setIsTyping(false);
    });
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