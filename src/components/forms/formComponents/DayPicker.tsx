import { FormControl, FormHelperText, InputLabel, MenuItem, Select, type SelectChangeEvent } from "@mui/material";

//create week days select box
const weekDays = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
];

interface WeekDayDropdownProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  error?: boolean;
  helperText?: string;
  onBlur?: () => void;
 
}

const DayPicker:React.FC<WeekDayDropdownProps> =({value, onChange, label, onBlur, helperText, error, ...rest})=>{

  return(
     <FormControl fullWidth size="small" variant="outlined" error={error} >
      <InputLabel id="weekday-label">{label}</InputLabel>
      <Select
        labelId="weekday-label"
        value={value}
        label={label}
        onChange={(e: SelectChangeEvent<string>) => onChange(e.target.value)}
        onBlur={onBlur} 
        {...rest}
      >
        {weekDays.map(day => (
          <MenuItem key={day} value={day}>{day}</MenuItem>
        ))}
      </Select>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  )
}

export default DayPicker



