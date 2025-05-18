import React from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Tooltip,
} from '@mui/material';
import { VerifiedUser, Edit, Visibility } from '@mui/icons-material';

const roles = [
  { value: 'Admin', label: 'Admin', icon: <VerifiedUser fontSize="small" />, color: '#ef4444' }, // red
  { value: 'Editor', label: 'Editor', icon: <Edit fontSize="small" />, color: '#3b82f6' }, // blue
  { value: 'Viewer', label: 'Viewer', icon: <Visibility fontSize="small" />, color: '#10b981' }, // green
];

const RoleControl = () => {
  const [role, setRole] = React.useState('Editor');

  return (
    <div className="p-6 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 rounded-2xl shadow-md space-y-4 border border-gray-200 hover:shadow-lg transition-shadow duration-300">
      <FormControl fullWidth>
        <InputLabel>User Role</InputLabel>
        <Select
          value={role}
          label="User Role"
          onChange={(e) => setRole(e.target.value)}
          MenuProps={{
            PaperProps: {
              sx: { borderRadius: 2, mt: 1, boxShadow: '0 8px 20px rgba(0,0,0,0.12)' },
            },
            transformOrigin: 'top center',
            anchorOrigin: { vertical: 'bottom', horizontal: 'center' },
          }}
          sx={{
            '& .MuiSelect-select': {
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              fontWeight: '600',
            },
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: '#cbd5e1',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#3b82f6',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#3b82f6',
              boxShadow: '0 0 0 3px rgb(59 130 246 / 0.3)',
            },
          }}
        >
          {roles.map(({ value, label, icon, color }) => (
            <MenuItem
              key={value}
              value={value}
              sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
            >
              <Tooltip title={label}>
                <Box sx={{ color }}>{icon}</Box>
              </Tooltip>
              <Typography
                sx={{
                  fontWeight: role === value ? '700' : '400',
                  color: role === value ? color : 'inherit',
                }}
              >
                {label}
              </Typography>
            </MenuItem>
          ))}
        </Select>
        <Typography variant="caption" color="text.secondary" mt={1}>
          Select the user role to control access permissions.
        </Typography>
      </FormControl>
    </div>
  );
};

export default RoleControl;
