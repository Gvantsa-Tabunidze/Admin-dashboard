import React from 'react'
import BaseForm from './BaseForm'
import { Box, Button } from '@mui/material'
import { Controller, useForm } from 'react-hook-form'
import type { AuthProps } from '../../../interfaces/AuthProps'
import { useAuth } from '../../../context/AuthContext'
import AddressInput from './AddressInput'



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
      address: '' 
    }
  })
  
  
  const onSubmit = (formData: AuthProps) => {  
  submitForm(formData)
  }

  const getLocation = (location:{ lat: number; lng: number }, fullAddress: string)=> {
     console.log("Latitude:", location.lat);
      console.log("Longitude:", location.lng);
      console.log("Full address:", fullAddress);
  }
  
  return (

     <Box component = 'form' onSubmit={handleSubmit(onSubmit)} sx={{display:'flex', flexDirection:'column', 
    width:'600px', gap:'56px'}}>
      <BaseForm control={control} />
      <Controller
        name="address"
        control={control}
        render={({ field }) => (
          <AddressInput
            value={field.value}
            onChange={field.onChange}
            onLocation={getLocation}
          />
        )}
      />

      
      <Button type='submit' variant = 'contained' sx={{ mt: 2, marginTop:6 , height:'48px'}}>Submit</Button>
    </Box>
   
  )
}

export default UserForm
