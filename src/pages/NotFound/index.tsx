import { Link } from 'react-router-dom';
import logoImg from '../../assets/images/logo.svg';
import './styles.scss';

export function NotFound() {
    return (
        <div className='not-found'>
            <div className="content">
                <Link to="/"><img src={logoImg} alt="Letmeask" /></Link>
            </div>
            <span>404</span>
            <p>Página não encontrada :(</p>
        </div>
    )
}