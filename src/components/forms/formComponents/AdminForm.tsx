import React from 'react'
import BaseForm from './BaseForm'
import { useForm } from 'react-hook-form'
import type { AuthProps } from '../../../interfaces/AuthProps'
import { Box, Button } from '@mui/material'




const AdminForm:React.FC = () => {
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
console.log(formData)
}



  return (
    <Box component = 'form' onSubmit={handleSubmit(onSubmit)} sx={{display:'flex', flexDirection:'column', 
    width:'600px', gap:'100px'}}>
      <BaseForm control={control} />
      <Button type='submit' variant = 'contained' sx={{ mt: 2, marginTop:6 , height:'48px'}}>Submit</Button>
    </Box>
  )
}

export default AdminForm
