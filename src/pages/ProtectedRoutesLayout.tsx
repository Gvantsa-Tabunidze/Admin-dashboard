import { Box, Typography } from '@mui/material'
import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext';

const ProtectedRoutesLayout:React.FC = () => {

  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return (
      <Box sx={{display:'flex', flexDirection:'column', alignItems:'center'}}>
      <h1><Typography sx={{fontSize:'32px'}}>Authorization page</Typography></h1>

      <Outlet />
    </Box>
  )
}

export default ProtectedRoutesLayout
