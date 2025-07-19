import React from 'react';
import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  type SelectChangeEvent,
} from '@mui/material';
import type { WorkingHours } from '../../../interfaces/AuthProps';

const hours = Array.from({ length: 24 * 2 }, (_, i) => {
  const hour = Math.floor(i / 2);
  const min = (i % 2) * 30;
  return `${String(hour).padStart(2, '0')}:${String(min).padStart(2, '0')}`;
});

export interface TimeRange {
  start: string;
  end: string;
}

interface HourPickerProps {
  value: WorkingHours;
  onChange: (value: WorkingHours) => void;
  error?: boolean;
  helperText?: string;
  onBlur?: () => void;
}


const HourPicker: React.FC<HourPickerProps> = ({ value, onChange, onBlur, helperText, error, ...rest }) => {
  const handleStartChange = (event: SelectChangeEvent<string>) => {
    onChange({ ...value, start: event.target.value });
  };

  const handleEndChange = (event: SelectChangeEvent<string>) => {
    onChange({ ...value, end: event.target.value });
  };

  return (
    <>
      <FormControl fullWidth size="small" error={error} >
        <InputLabel id="start-time-label">Start Time</InputLabel>
        <Select
          labelId="start-time-label"
          value={value.start}
          label="Start Time"
          onChange={handleStartChange}
          onBlur={onBlur}
          {...rest}
        >
          {hours.map((time) => (
            <MenuItem key={time} value={time}>
              {time}
            </MenuItem>
          ))}
        </Select>
        {helperText && <FormHelperText>{helperText}</FormHelperText>}
      </FormControl>

      <FormControl fullWidth size="small" error={error}>
        <InputLabel id="end-time-label">End Time</InputLabel>
        <Select
          labelId="end-time-label"
          value={value.end}
          label="End Time"
          onChange={handleEndChange}
          onBlur={onBlur}
          {...rest}
        >
          {hours.map((time) => (
            <MenuItem key={time} value={time}>
              {time}
            </MenuItem>
          ))}
        </Select>
        {helperText && <FormHelperText>{helperText}</FormHelperText>}
      </FormControl>
    </>
  );
};

export default HourPicker;