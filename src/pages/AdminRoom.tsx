import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

import { database, ref, remove, update } from '../services/firebase';
import { useRoom } from '../hooks/useRoom';

import logoImg from '../assets/images/logo.svg';
import deleteImg from '../assets/images/delete.svg';
import checkImg from '../assets/images/check.svg';
import answerImg from '../assets/images/answer.svg';
import { FiXCircle } from 'react-icons/fi';

import { Button } from '../Components/Button';
import { RoomCode } from '../Components/RoomCode'
import { Question } from '../Components/Question';
import { MessageShare } from '../Components/MessageShare';
import { Popup } from '../Components/Popup';

import '../styles/room.scss';


type RoomParams = {
    id: string;
}

export function AdminRoom() {
    // conseguir pegar um parâmetro da url e usar
    const params = useParams<RoomParams>(); 
    // id da sala
    const roomId = String(params.id);
    const navigate = useNavigate();

    const {title, questions} = useRoom(roomId);
    // const para mostrar ou não o popup de confirmação
    const [ showPopup, setShowPopup ] = useState(false)
    const [ showEndPopup, setShowEndPopup ] = useState(false)

    // abrir popup
    function handleOpenPopup(){
        setShowPopup(true)
    }
    // fechar popup
    function handleClosePopup(){
        setShowPopup(false)
    }
    // abrir popup
    function handleOpenEndPopup(){
        setShowEndPopup(true)
    }
    // fechar popup
    function handleCloseEndPopup(){
        setShowEndPopup(false)
    }
    
    // encerrar sala
    async function handleEndRoom() {
        const db = database;
        const roomRef = ref(db, `rooms/${roomId}`)
        // atualiza o database colocando mais uma info que será usada para verificar se a sala está ou não ativa.
        await update(roomRef, {
            endedAt: new Date(),
        })

        setShowEndPopup(false)
        
        navigate('/')
    }

    async function handleDeleteQuestion(questionId: string){
        // deletar pergunta
        const db = database;
        const questionRef = ref(db, `rooms/${roomId}/questions/${questionId}`);
        // remove é do database/firebase, passa somente a referência do que você quer remover do seu database realtime
        await remove(questionRef);

        // fechar popup
        handleClosePopup();
        
    }

    async function handleCheckQuestionAsAnswered(questionId: string){

        // atualizar a propriedade de isAnswered para true no firebase
        const db = database;
        const questionRef = ref(db, `rooms/${roomId}/questions/${questionId}`);
        await update(questionRef, {
            isAnswered: true,   
        });
    }
    async function handleRemoveCheckQuestionAsAnswered(questionId: string){
        
        // atualizar a propriedade de isAnswered para false no firebase
        const db = database;
        const questionRef = ref(db, `rooms/${roomId}/questions/${questionId}`);
        await update(questionRef, {
            isAnswered: false,   
        });
    }

    async function handleHighlightQuestion(questionId: string){
        // atualizar a propriedade de isHighlighted para true no firebase
        const db = database;
        const questionRef = ref(db, `rooms/${roomId}/questions/${questionId}`);
        await update(questionRef, {
            isHighlighted: true,   
        });
    }

    async function handleRemoveHighlightQuestion(questionId: string){
        // atualizar a propriedade de isHighlighted para true no firebase
        const db = database;
        const questionRef = ref(db, `rooms/${roomId}/questions/${questionId}`);
        await update(questionRef, {
            isHighlighted: false,   
        });
    }

    return(
        <div id="page-room">
            <header>
                <div className="content">
                    <Link to="/"><img src={logoImg} alt="Letmeask" /></Link>
                    
                    <div >
                        <RoomCode code={roomId} />
                        <Button isOutlined onClick={handleOpenEndPopup}>Encerrar sala</Button>
                    </div>
                </div>
            </header>

            <main>
                <div className="room-title">
                    <h1>Sala {title}</h1>
                    {
                        questions.length > 0 &&  <span>{questions.length} pergunta(s)</span>
                    }
                </div>
                
                <div className="question-list">
                    {   
                        // basicamente um forEach, porém tem um retorno
                        questions.map(question => {
                            return(
                                <Question 
                                    key={question.id}
                                    content={question.content}
                                    author={question.author}
                                    isAnswered={question.isAnswered}
                                    isHighlighted={question.isHighlighted}
                                >
                                    <button
                                        type='button'
                                        onClick={() => {question.isAnswered ? handleRemoveCheckQuestionAsAnswered(question.id) : handleCheckQuestionAsAnswered(question.id)}}           
                                    >
                                        { question.isAnswered ? 
                                            <FiXCircle size={24} color="#737380" />
                                            : 
                                            <img src={checkImg} alt="Marcar pergunta como respondida" />
                                        }
                                        
                                    </button>
                                    { !question.isAnswered && (
                                        <>
                                           
                                            <button
                                                type='button'
                                                onClick={() => {question.isHighlighted ? handleRemoveHighlightQuestion(question.id) : handleHighlightQuestion(question.id)}}
                                            >
                                                <img src={answerImg} alt="Dar destaque a pergunta" />
                                            </button>
                                        </>
                                    )}
                                    <button
                                        type='button'
                                        onClick={handleOpenPopup}
                                    >
                                        <img src={deleteImg} alt="Remover pergunta" />
                                    </button>
                                    {
                                        showPopup && (
                                            <Popup 
                                                question 
                                                functionCancel={handleClosePopup}
                                                functionConfirm={() => {handleDeleteQuestion(question.id)}} 
                                            />
                                        )
                                    }
                                </Question>
                            )
                        })
                    }    
                </div>
                
                { questions.length < 1 && (<MessageShare admin/>) }
            </main>

            {   
                // outro popup para o encerrar sala
                showEndPopup && (
                    <Popup 
                        functionCancel={handleCloseEndPopup}
                        functionConfirm={handleEndRoom} 
                    />
                )
            }

        </div>
    )
}
