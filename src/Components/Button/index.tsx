import { ButtonHTMLAttributes } from 'react';

import './styles.scss';

type ButtoProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    isOutlined?: boolean;
};

export function Button({isOutlined = false, ...props}:ButtoProps) {

    return (
        <button 
            // vai por a clase a mais só se isOutlined foi acionado
            className={`button ${isOutlined ? 'outlined' : ''}`} 
            {...props} 
        />
            
    )
}

