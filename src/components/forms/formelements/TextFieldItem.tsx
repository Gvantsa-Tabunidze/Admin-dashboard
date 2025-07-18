import { TextField, type TextFieldProps } from '@mui/material'
import React from 'react'


const TextFieldItem:React.FC<TextFieldProps> = ({ ...rest}) => {
  return (
    <div>
      <TextField  {...rest} />
    </div>
  )
}

export default TextFieldItem
