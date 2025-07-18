import React, { useState } from 'react'
import TextFieldItem from '../formelements/TextFieldItem'
import ImageInput from '../formelements/ImageInput'
import { Controller, type Control} from 'react-hook-form'
import { Box, IconButton, InputAdornment } from '@mui/material'
import SelectRole from '../formelements/SelectRole'
import type { AuthProps } from '../../../interfaces/AuthProps'
import { VisibilityOffOutlined, VisibilityOutlined } from '@mui/icons-material'



interface BaseFormProps {
  control:Control<AuthProps>;
}


const BaseForm:React.FC<BaseFormProps> = ({control}) => {
  const [show, setShow] = useState(false)


  return (
    <Box sx={{display:'flex', flexDirection:'column', gap:1}}>
      <Controller name='first_name' control={control} rules={{required: 'required field'}} 
      render={({field, fieldState})=>(<TextFieldItem {...field}  label='First name' variant='standard' fullWidth
      error={!!fieldState.error} helperText={fieldState.error?.message} />)} />
      
      <Controller name='last_name' control={control}  
      render={({field, fieldState})=>(<TextFieldItem {...field} label='Last name' variant='standard' fullWidth
      error={!!fieldState.error} helperText={fieldState.error?.message} />)} />
      
      <Controller name='id' control={control} rules={{required: 'required field'}} 
      render={({field, fieldState})=>(<TextFieldItem {...field} label='ID' variant='standard' fullWidth
      error={!!fieldState.error} helperText={fieldState.error?.message} />)} />
    
      
      <Controller name='password' control={control} rules={{required: 'required field', minLength:{value:5, message: 'Password should contain at least 5 characters'}}} 
      render={({field, fieldState})=>(<TextFieldItem {...field} label='Password' type={show ? 'text' : 'password'} variant='standard' fullWidth
      error={!!fieldState.error} helperText={fieldState.error?.message} 
      InputProps={{ endAdornment:(<InputAdornment position='end'><IconButton onClick={()=>setShow(prev=>!prev)}>{show ? <VisibilityOutlined /> : <VisibilityOffOutlined />}</IconButton></InputAdornment>)}} />)} />
    
      
      <Controller name='phone' control={control} rules={{required: 'required field',  
      validate: (value) => {
      if (!/^\d*$/.test(value)) {
        return 'Only numbers are allowed';
      }
      if (value.length < 5) {
        return 'Phone number should contain at least 5 digits';
      }
      return true;
    }
      }} 
      render={({field, fieldState})=>(<TextFieldItem {...field} label='Phone' type='tel' variant='standard' fullWidth
      error={!!fieldState.error} helperText={fieldState.error?.message} />)} />
    
    
      <Controller name='email' control={control} rules={{required: 'required field', pattern:{value:/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, message: 'Invalid email'}}} 
      render={({field, fieldState})=>(<TextFieldItem {...field} label='Email' variant='standard' fullWidth
      error={!!fieldState.error} helperText={fieldState.error?.message} />)} />
    

      <Box component={Box} sx={{display:'flex',flexDirection:'column', height:48, gap:6, marginTop:2}} >
      <Controller name="role" control={control} rules={{ required: 'Role is required' }}
        render={({ field, fieldState }) => ( <SelectRole {...field} 
        error={!!fieldState.error} helperText={fieldState.error?.message}/>)} />

      <Controller name='profile_image' control={control}
      render={({field}) => (<ImageInput  onChange={field.onChange} name={field.name} />)}/>
      </Box>
    </Box>
  )
}

export default BaseForm
