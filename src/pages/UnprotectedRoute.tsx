import React from 'react'
import { Box, Typography } from '@mui/material'
import AuthTabs from '../components/AuthTabs'



const UnprotectedRoute:React.FC = () => {
  return (
    <Box sx={{display:'flex', flexDirection:'column', alignItems:'center'}}>
      <h1><Typography sx={{fontSize:'32px'}}>Authorization page</Typography></h1>
      <AuthTabs />
     
    </Box>
  )
}

export default UnprotectedRoute
