import { LoginBox } from './components/LoginBox'
import { MessageList } from './components/MessageList'

import styles from './App.module.scss'
import { useContext } from 'react'
import { AuthContext } from './provider/auth'
import { SendMessageForm } from './components/SendMessageForm'

export const App = () => {
  const { user } = useContext(AuthContext)

  return (
    <main className={`${styles.contentWrapper} ${!!user ? styles.contentSigned : ''}`}>
      <MessageList />
      {/* caso os usuario nao esteja nulo */}
      { !!user ? <SendMessageForm /> : <LoginBox />}
    </main>
  )
}
