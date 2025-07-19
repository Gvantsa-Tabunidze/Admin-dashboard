import React from 'react'
import TextFieldItem from "../formelements/TextFieldItem"
import BaseForm from './BaseForm'
import { Box, Button } from '@mui/material'
import { Controller, useForm } from 'react-hook-form'
import type { AuthProps } from '../../../interfaces/AuthProps'
import { useAuth } from '../../../context/AuthContext'



const UserForm:React.FC = () => {
  const {submitForm} = useAuth()

  const {control, handleSubmit}= useForm<AuthProps>({
    mode: 'onChange',
    defaultValues:{
      first_name: '',
      last_name: '',
      id: '',
      password: '',
      phone:'',
      email:'',
      profile_image: undefined,
      role:'',
      address:'string'
    }
  })
  
  
  const onSubmit = (formData: AuthProps) => {
  console.log(formData)
  submitForm(formData)
  }
  
  return (

     <Box component = 'form' onSubmit={handleSubmit(onSubmit)} sx={{display:'flex', flexDirection:'column', 
    width:'600px', gap:'56px'}}>
      <BaseForm control={control} />
      <Controller  name='address' control={control}  rules={{required: 'required field'}}
      render={({field, fieldState})=>(<TextFieldItem {...field} label='Address' variant='standard' fullWidth
      error={!!fieldState.error} helperText={fieldState.error?.message} />)} />
      <Button type='submit' variant = 'contained' sx={{ mt: 2, marginTop:6 , height:'48px'}}>Submit</Button>
    </Box>
   
  )
}

export default UserForm
