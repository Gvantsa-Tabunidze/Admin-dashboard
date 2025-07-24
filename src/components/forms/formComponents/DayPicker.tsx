// components/forms/DayPicker.tsx
import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  type SelectChangeEvent,
} from "@mui/material";

const weekDays = [
  { value: "monday", label: "Monday" },
  { value: "tuesday", label: "Tuesday" },
  { value: "wednesday", label: "Wednesday" },
  { value: "thursday", label: "Thursday" },
  { value: "friday", label: "Friday" },
  { value: "saturday", label: "Saturday" },
  { value: "sunday", label: "Sunday" },
];

interface WeekDayDropdownProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  error?: boolean;
  helperText?: string;
  onBlur?: () => void;
}

const DayPicker: React.FC<WeekDayDropdownProps> = ({
  value,
  onChange,
  label = "Working Day",
  onBlur,
  helperText,
  error,
  ...rest
}) => {
  return (
    <FormControl fullWidth size="small" variant="outlined" error={error}>
      <InputLabel id="weekday-label">{label}</InputLabel>
      <Select
        labelId="weekday-label"
        value={value}
        label={label}
        onChange={(e: SelectChangeEvent<string>) => onChange(e.target.value)}
        onBlur={onBlur}
        {...rest}
      >
        {weekDays.map((day) => (
          <MenuItem key={day.value} value={day.value}>
            {day.label}
          </MenuItem>
        ))}
      </Select>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};

export default DayPicker;
