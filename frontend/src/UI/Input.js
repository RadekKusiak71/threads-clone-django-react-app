import React from 'react'
import classes from './Input.module.css'
import classNames from 'classnames';

const Input = (props) => {
  const inputClasses = classNames(classes['input'], props.className);

  return (
    <input
      className={inputClasses}
      type={props.type}
      placeholder={props.placeholder}
      name={props.name}
      onChange={props.onChange}
    />
  )
}

export default Input