import React from 'react'
import classes from './Button.module.css'

const Button = (props) => {
    const buttonClass = props.areInputsFilled() ? `${classes.button} ${classes['button-active']}` : classes.button;

    return (
        <button
            className={buttonClass}
            type={props.type}
            disabled={!props.areInputsFilled()}
        >
            {props.children}
        </button>
    )
}

export default Button