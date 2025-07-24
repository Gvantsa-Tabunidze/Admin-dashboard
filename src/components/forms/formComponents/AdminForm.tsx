import React from 'react'
import BaseForm from './BaseForm'
import { useForm } from 'react-hook-form'
import type { AuthProps } from '../../../interfaces/AuthProps'
import { Box, Button } from '@mui/material'
import { useAuth } from '../../../context/AuthContext'




const AdminForm:React.FC = () => {

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
    role:''
  }
})


const onSubmit = (formData: AuthProps) => {

submitForm(formData)
}

  return (
    <Box component = 'form' onSubmit={handleSubmit(onSubmit)} sx={{display:'flex', flexDirection:'column', 
    width:'600px', gap:'56px'}}>
      <BaseForm control={control} />
      <Button type='submit' variant = 'contained' sx={{ mt: 2, marginTop:6 , height:'48px'}}>Submit</Button>
    </Box>
  )
}

export default AdminForm
