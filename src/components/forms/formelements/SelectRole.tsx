import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { type SelectChangeEvent } from '@mui/material/Select';
import FormHelperText from '@mui/material/FormHelperText';

interface SelectRoleProps {
  value: string;
  onChange: (event: SelectChangeEvent) => void;
  onBlur?: () => void;
  name?: string;
  error?: boolean;
  helperText?: string;
  disabled?: boolean;
}

const SelectRole: React.FC<SelectRoleProps> = ({
  value,
  onChange,
  onBlur,
  name,
  error,
  helperText,
  disabled
}) => {
  return (
    <FormControl
      variant="outlined"
      sx={{ minWidth: 120}}
      error={error}
      disabled={disabled}
    >
      <InputLabel id="select-role-label">Role</InputLabel>
      <Select
        labelId="select-role-label"
        id="select-role"
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        name={name}
        label="Role"
      >
        <MenuItem value="">
          <em>None</em>
        </MenuItem>
        <MenuItem value="admin">Admin</MenuItem>
        <MenuItem value="user">User</MenuItem>
        <MenuItem value="courier">Courier</MenuItem>
      </Select>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};

export default SelectRole;