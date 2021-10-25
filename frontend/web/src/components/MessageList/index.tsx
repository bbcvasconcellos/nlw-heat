import { useEffect, useState } from 'react';
import { api } from '../../API'; 
import io from 'socket.io-client';

import styles from './style.module.scss';
import logoImg from '../../assets/logo.svg';

type Message = {
  id: string,
  text: string,
  user: {
    name: string,
    avatar_url: string,
  }
}

const messageQueue: Message[] = [];

//conecta com o backend
const socket = io('http://localhost:4000')
//quando uma nova mensagem for recebida
socket.on('new-message', newMessage => {
  messageQueue.push(newMessage);
})

export const MessageList = () => {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    //leva 3 seg para atualizar as imagens
    const timer = setInterval(() => {
      if(messageQueue.length) {
        setMessages(prevState => [messageQueue[0], prevState[0], prevState[1]].filter(Boolean));
        messageQueue.shift();
      }
    }, 3000)
  }, [])

  useEffect(() => {
    api.get<Message[]>('messages/last3').then(res => {
      setMessages(res.data)
    })
  }, [])

  return (
    <div className={styles.messageListWrapper}>
      <img src={logoImg} alt='DoWhile 2021'/>
      <ul className={styles.messageList}>\
        {messages.map((message, key) => (
          <li key={key} className={styles.message}>
            <p className={styles.messageContent}>{message.text}</p>
            <div className={styles.messageUser}>
              <div className={styles.userImage}>
                <img src={message.user.avatar_url} alt={message.user.name}/>
              </div>
              <span>{message.user.name}</span>
            </div>
          </li>
        ))}
        
      </ul>
    </div>
  )
}
