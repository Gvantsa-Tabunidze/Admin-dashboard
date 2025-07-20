import { Controller, useForm } from 'react-hook-form'
import type { AuthProps, WeekDay, WorkingHours } from '../../../interfaces/AuthProps'
import BaseForm from './BaseForm'
import { Box, Button } from '@mui/material'
import DayPicker from './DayPicker'
import HourPicker from './HourPicker'
import { useAuth } from '../../../context/AuthContext'
import TextFieldItem from '../formelements/TextFieldItem'




const CourierForm = () => {
  const {submitForm} = useAuth()

const {control, handleSubmit}= useForm<AuthProps>({
mode: 'onChange',
reValidateMode: 'onSubmit',
defaultValues:{
    first_name: '',
    last_name: '',
    id: '',
    password: '',
    phone:'',
    email:'',
    profile_image: undefined,
    role:'',
    vehicle:'',
    working_days:'' as WeekDay,
    working_hours: { start: '', end: '' } as WorkingHours,
}
})



 const onSubmit = (formData: AuthProps) => {
 
  submitForm(formData)
  }


  return (
     <Box component = 'form' onSubmit={handleSubmit(onSubmit)} sx={{display:'flex', flexDirection:'column', 
    width:'600px', gap:'56px'}}>
      <BaseForm control={control} />
      
      <Controller name='vehicle' control={control}  
      render={({field, fieldState})=>(<TextFieldItem {...field} label='Vehicle' variant='outlined' fullWidth
      error={!!fieldState.error} helperText={fieldState.error?.message} />)} />

      <Box sx={{ minHeight: 80, display:'flex', flexDirection:'row', gap:2 }}>

        <Controller name="working_days" control={control} 
            rules={{ required: 'Day is required' }} render={({ field, fieldState}) => ( <DayPicker value={field.value ?? ''} 
            onChange={field.onChange} onBlur={field.onBlur} label="Working Day" error={!!fieldState.error} helperText={fieldState.error?.message}/> )} />


        <Controller name="working_hours"  control={control} 
             rules={{
                validate: (value) =>
                value?.start && value?.end ? true : 'Start and End time required',
            }} render={({ field, fieldState}) => ( <HourPicker value={field.value ?? {start:'', end:''}}  onChange={field.onChange} onBlur={field.onBlur}
               error={!!fieldState.error} helperText={fieldState.error?.message}/>)}
                />

      </Box>

      

      <Button type='submit' variant = 'contained' sx={{ mt: 2, marginTop:6 , height:'48px'}}>Submit</Button>
    </Box>
  )
}

export default CourierForm
