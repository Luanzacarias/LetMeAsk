import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { database, set, ref, push } from '../services/firebase';
import { useAuth } from '../hooks/useAuth';

import illustrationImg from '../assets/images/illustration.svg';
import logoImg from '../assets/images/logo.svg';

import { Button } from '../Components/Button';

import '../styles/auth.scss';


export function NewRoom(){
    
    const { user } = useAuth();
    const [newRoom, setNewRoom] = useState('');
    const navigate = useNavigate();

    async function handleCreateRoom(event: FormEvent){
        event.preventDefault();
        
        // se tiver vazio, retorna.
        if (newRoom.trim() === '') {
            return
        }
        
        // adicionar ao database realtime firebase V.9
        const db = database;
        const roomRef = ref(db, 'rooms');
        // database.ref('rooms');
        const newPostRef = push(roomRef);
        await set (newPostRef, {
            title: newRoom,
            authorId: user?.id
        })
        
        /* 
            adicionar item a lista do realtime na versão 8 do firebase:

            const roomRef = firebase.database().ref('rooms');
            const firebaseRoom = await roomRef.push({
                title: newRoom,
                authorId: user?.id
            });
        */

        // key é o id da sala criada no banco de dados do firebase
        // abre a págida de admin, uma vez que a sala criada é dele.
        navigate(`/admin/rooms/${newPostRef.key}`);
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
                    <h2>Criar uma nova sala</h2>
                    <form onSubmit={handleCreateRoom}>
                        <input 
                            type="text" 
                            placeholder='Nome da sala'
                            onChange={(event) => setNewRoom(event.target.value)}
                            value={newRoom}
                        />
                        <Button>
                            Criar sala
                        </Button>
                    </form>
                    <p>
                        Quer entrar em uma sala existente? <Link to="/">Clique aqui</Link>
                    </p>
                </div>
            </main>
        </div>
    )
}