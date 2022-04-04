import { signInWithPopup } from "firebase/auth";
import { createContext, ReactNode, useEffect, useState } from "react";
import { auth, GoogleAuthProvider } from "../services/firebase";

// tipagem para os dados do users
type User = {
    id: string,
    name: string,
    avatar: string
  }
  
// tipagem para os dados do contexto
type AuthContextType = {
    user: User | undefined,
    singInWithGoogle: () => Promise<void>,
    // uma função que não tem retorno, como é async tem q usar a Promise
}
//tipagem para o props
type AuthContextProviderProps = {
    children: ReactNode
}

export const AuthContext = createContext({} as AuthContextType);

export function AuthContextProvider(props : AuthContextProviderProps){

    const [user, setUser] = useState<User>();

    useEffect(() => {
      // ele detecta se já teve user conectado(se já teve dados presentes na variável)
      const unsubscribe = auth.onAuthStateChanged(user => {
        if (user){
          const { displayName, photoURL, uid } = user
          if (!displayName || !photoURL) {
            throw new Error('Missing information from Google Account.');
          }
    
          setUser({
            id: uid,
            name: displayName,
            avatar: photoURL
          })
        }
      })
  
      return () => {
        unsubscribe();
      }
    }, []) // vai disparar somente quando esse arquivo for chamado.
  
    async function singInWithGoogle(){
      // autenticação com o google
      const provider = new GoogleAuthProvider();
      
      const result = await signInWithPopup(auth, provider);
      // se retornar valor do user ...
      if(result.user) {
        const { displayName, photoURL, uid } = result.user
        // se o user não tiver um nome ou uma foto, vai disparar um erro.
        if (!displayName || !photoURL) {
          throw new Error('Missing information from Google Account.');
        }
  
        setUser({
          id: uid,
          name: displayName,
          avatar: photoURL
        })
  
      }
    }

    return(
        <AuthContext.Provider value={{ user, singInWithGoogle }}>
            {props.children}
        </AuthContext.Provider>
    );
}