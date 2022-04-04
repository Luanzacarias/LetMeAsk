import './styles.scss';
import emptyQuestionImg from '../../assets/images/empty-questions.svg'

type Props = {
    admin?: boolean;
}

export function MessageShare(props: Props){
    return (
       <div className="message-share">
        <img src={emptyQuestionImg} alt="Sem perguntas" />
        <span>Nenhuma pergunta por aqui...</span>
        {
            props.admin ? (
                <p>Envie o código desta sala para seus amigos e <br/> comece a responder perguntas!</p>
            ) : (
                <p>Faça o seu login e seja a primeira pessoa a <br/> fazer uma pergunta!=</p>
            )
        }
        
    </div> 
    )
}