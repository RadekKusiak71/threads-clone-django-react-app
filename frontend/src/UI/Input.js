import React from 'react'
import classes from './Input.module.css'

const Input = (props) => {
  return (
    <input
        className={classes['input']}
        type={props.type}
        placeholder={props.placeholder}
        name={props.name}
        onChange={props.onChange}
    />
  )
}

export default Input