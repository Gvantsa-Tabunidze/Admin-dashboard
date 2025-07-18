import React from 'react'
import AdminForm from '../components/forms/formComponents/AdminForm'
import { Box } from '@mui/material'



const UnprotectedRoute:React.FC = () => {
  return (
    <Box sx={{display:'flex', flexDirection:'column', alignItems:'center'}}>
      <h1>Authorization page</h1>
      <AdminForm />
     
    </Box>
  )
}

export default UnprotectedRoute
