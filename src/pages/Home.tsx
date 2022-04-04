import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../hooks/useAuth';
import { database, ref, child, get } from '../services/firebase';

import illustrationImg from '../assets/images/illustration.svg';
import logoImg from '../assets/images/logo.svg';
import googleIconImg from '../assets/images/google-icon.svg';

import { Button } from '../Components/Button';

import '../styles/auth.scss';




export function Home(){

    const navigate = useNavigate();
    // armazenar o código da sala que o user quer entrar
    const [roomCode, setRoomCode] = useState('')
    const { user, singInWithGoogle } = useAuth();

    async function handleCreateRoom(){
        if (!user) {
            await singInWithGoogle()
        }

        navigate('rooms/new');  
    }

    async function handleJoinRoom(event: FormEvent) {
        event.preventDefault();

        if (roomCode.trim() === ''){
            return
        }

        // Pegar o código da sala no firebase v9
        const db = ref(database);
        const roomRef = await get(child(db, `rooms/${roomCode}`))

        /* 
            Pegar o código da sala no firebase v8

            const roomRef = await database.ref(`rooms/${roomCode}`).get();

        */
        
        // verificar se sala existe
        if (!roomRef.exists()) {
            alert('Sala não esxiste.');
            return
        }
        // verificar se a sala já foi encerrada
        if (roomRef.val().endedAt){
            alert('A sala já foi encerrada.');
            return
        }

        // Se o user for dono da sala, ele vai entrar como admin, se não vai no padrão
        if (roomRef.val().authorId === user?.id){
            navigate(`admin/rooms/${roomCode}`);
        } else {
            navigate(`rooms/${roomCode}`);
        }
        
    }


    return(
        <div id="page-auth">
            <aside>
                <img src={illustrationImg} alt="Ilustração simbolizando perguntas e respostas" />
                <strong>Crie salas de Q&amp;A ao vivo</strong>
                <p>Tire as dúvidas da sua audiência em tempo-real</p>
            </aside>
            <main>
                <div className='main-content'>
                    <img src={logoImg} alt="Letmeask" />
                    <button onClick={handleCreateRoom} className="create-room">
                        <img src={googleIconImg} alt="Logo do Google" />
                        Crie sua sala com o Google
                    </button>
                    <div className="separator">ou entre em uma sala</div>
                    <form onSubmit={handleJoinRoom}>
                        <input 
                            type="text" 
                            placeholder='Digite o código da sala'
                            onChange={(event) => setRoomCode(event.target.value)}
                            value={roomCode}
                        />
                        <Button>
                            Entrar na sala
                        </Button>
                    </form>
                </div>
            </main>
        </div>
    )
}