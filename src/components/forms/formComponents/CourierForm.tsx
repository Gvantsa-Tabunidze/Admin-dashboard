import { Controller, useFieldArray, useForm } from 'react-hook-form'
import type { AuthProps, WeekDay, WorkingHours } from '../../../interfaces/AuthProps'
import BaseForm from './BaseForm'
import { Box, Button, FormHelperText, IconButton } from '@mui/material'
import DayPicker from './DayPicker'
import HourPicker from './HourPicker'
import { useAuth } from '../../../context/AuthContext'
import TextFieldItem from '../formelements/TextFieldItem'
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined'





const CourierForm = () => {
  const {submitForm} = useAuth()


const {control, handleSubmit, setError, formState:{errors}, clearErrors, getValues}= useForm<AuthProps>({
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
    working_time_slots: [{ working_days: '' as WeekDay, working_hours: { start: '', end: '' }  as WorkingHours}],
},
})

// f FOR DYNAMIC FILEDSETS
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'working_time_slots',
  });



 const onSubmit = (formData: AuthProps) => {
 
  const {working_time_slots} = formData
  if(working_time_slots.length <5){
    setError('working_time_slots', {
      type: 'manual',
      message: 'You must add at least 5 working days',
    })
    return
  }

    // Check for duplicate working days
  const selectedDays = working_time_slots.map(slot => slot.working_days);
  const duplicates = selectedDays.filter((day, index) => selectedDays.indexOf(day) !== index);

  if (duplicates.length > 0) {
    setError('working_time_slots', {
      type: 'manual',
      message: `Duplicate day(s) found: ${[...new Set(duplicates)].join(', ')}`,
    });
    return;
  }

  for (let i = 0; i < working_time_slots.length; i++){
    const slot = working_time_slots[i];
    if(slot.working_hours.end <= slot.working_hours.start){
      setError(`working_time_slots.${i}.working_hours`, {
      type: 'manual',
      message: 'End time must be after start time',
    })
     return;
    }
    clearErrors('working_time_slots');
  }

   // clear any existing error if passes
  clearErrors('working_time_slots');

   submitForm(formData)
  }


  return (
        <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{ display: 'flex', flexDirection: 'column', width: '600px', gap: '56px' }}
    >
      <BaseForm control={control} />

      <Controller
        name="vehicle"
        control={control}
        render={({ field, fieldState }) => (
          <TextFieldItem
            {...field}
            label="Vehicle"
            variant="outlined"
            fullWidth
            error={!!fieldState.error}
            helperText={fieldState.error?.message}
          />
        )}
      />

      {fields.map((item, index) => (
        <Box
          key={item.id}
          sx={{ minHeight: 80, display: 'flex', flexDirection: 'row', gap: 2, alignItems: 'center' }}
        >
          <Controller
            name={`working_time_slots.${index}.working_days`}
            control={control}
            rules={{ required: 'Day is required' }}
            render={({ field, fieldState }) => (
              <DayPicker
                value={field.value ?? ''}
                onChange={field.onChange}
                onBlur={field.onBlur}
                label="Working Day"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />

          <Controller
            name={`working_time_slots.${index}.working_hours`}
            control={control}
            rules={{
              validate: (value) =>
                value?.start && value?.end ? true : 'Start and End time required',
            }}
            render={({ field, fieldState }) => (
              <HourPicker
                value={field.value ?? { start: '', end: '' }}
                onChange={field.onChange}
                onBlur={field.onBlur}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />

          {index > 0 && (
            <IconButton onClick={() => remove(index)} sx={{ color: 'red' }}>
              <DeleteOutlineIcon />
            </IconButton>
          )}
        </Box>
      ))}
          {errors.working_time_slots?.message && (
        <FormHelperText error sx={{ mt: -4 }}>
          {errors.working_time_slots.message as string}
        </FormHelperText>
      )}
            

      <Button
        variant="outlined"
        startIcon={<AddOutlinedIcon />}
        onClick={() => append({ working_days: '' as WeekDay, working_hours: { start: '', end: '' } })}
      >
        Add fields
      </Button>




      <Button type="submit" variant="contained" sx={{ mt: 2, marginTop: 6, height: '48px' }}>
        Submit
      </Button>
    </Box>
  )
}

export default CourierForm
