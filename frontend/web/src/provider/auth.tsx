import { createContext, ReactNode, useEffect, useState } from "react";
import { api } from "../API";

type User = {
  id: string;
  name: string;
  login: string;
  avatar_url: string;
}

type AuthContextData = {
  user: User | null;
  signInURL: string;
  signOut: () => void;
}

export const AuthContext = createContext({} as AuthContextData);

type AuhtResponse = {
  token: string,
  user: {
    id: string,
    avatar_url: string,
    name: string,
    login: string
  }
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);

  const signInURL = `https://github.com/login/oauth/authorize?scope=user&client_id=758b6264efb21c99d1f0`;

  const signIn = async(githubCode: string) => {
    const response = await api.post<AuhtResponse>('auth', {
      code: githubCode
    })

    const { token, user } = response.data;
    //salva o token dentro do storage do navegador
    localStorage.setItem('@dowhile:token', token);

    api.defaults.headers.common.authorization = `Bearer ${token}`

    setUser(user);

  } 

  const signOut = () => {
    setUser(null);
    localStorage.removeItem('@dowhile:token')
  } 

  useEffect(() => {
    const token = localStorage.getItem('@dowhile:token');

    if(token){
      api.defaults.headers.common.authorization = `Bearer ${token}`

      api.get<User>('profile').then(res => {        
        setUser(res.data)
      })
    }
  }, [])

  useEffect(() => {
    const url = window.location.href;
    const hasGithubCode = url.includes('?code=');

    if(hasGithubCode) {
      /*o codigo abaixo vai criar um array com 2 items, o primeiro sendo tudo que vem antes de ?code= que e' a url;
        o segundo sendo tudo que vem depois de code ?code= que e' o codigo do github*/
      const [urlWithoutCode, githubCode] = url.split('?code=');

      //esconde do usuario o codigo do github na url
      window.history.pushState({}, '', urlWithoutCode);

      signIn(githubCode);
    }
  }, [])


  return (
    <AuthContext.Provider value={{ signInURL, user, signOut }}>
      { children }
    </AuthContext.Provider>
  )
}