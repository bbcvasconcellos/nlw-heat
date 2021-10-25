import { useContext } from 'react'
import { AuthContext } from '../../provider/auth'
import { VscGithubInverted } from 'react-icons/vsc'
import styles from './style.module.scss'


export const LoginBox = () => {
  const { signInURL } = useContext(AuthContext)
  
  return(
    <div className={styles.loginBoxWrapper}>
      <strong>Entre e compartilhe sua mensagem</strong>
      <a href={signInURL} className={styles.signInWithGithub}>
        <VscGithubInverted size="24"/>
        Entrar com Github
      </a>
    </div>
    
  )
}