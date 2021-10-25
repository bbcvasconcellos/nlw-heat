import { FormEvent, useContext, useState } from 'react';
import { VscGithubInverted, VscSignOut } from 'react-icons/vsc';
import { api } from '../../API';
import { AuthContext } from '../../provider/auth';
import styles from './style.module.scss';

export const SendMessageForm = () => {
  const { user, signOut } = useContext(AuthContext);
  const [message, setMessage] = useState('');

  const handleSendMsg = async(event: FormEvent) => {
    event.preventDefault()

    if(!message.trim()) return;

    await api.post('message', { message })

    //limpa o textarea depois de submission
    setMessage('');
  }

  return (
    <div className={styles.sendMessageFormWrapper}>
      <button className={styles.signOutButton} onClick={signOut}>
        <VscSignOut size='32'/>
      </button>

      <header className={styles.userInformation}>
        <div className={styles.userImage}>
          <img src={user?.avatar_url} alt={user?.name} />
        </div>
        <strong className={styles.userName}>{user?.name}</strong>
        <span className={styles.userGithub}>
          <VscGithubInverted size='16' />
          {user?.login}
        </span>
      </header>

      <form 
        className={styles.sendMensageForm} 
        onSubmit={handleSendMsg}
      >
        <label htmlFor='message'>Mensagem</label>
        <textarea 
          name='message'
          id='message'
          placeholder='Qual sua experiencia para o evento'
          onChange={(event) => setMessage(event.target.value)}
          value={message}
        />
        <button type='submit'>Enviar Mensagem</button>        
      </form>
    </div>
  )
}