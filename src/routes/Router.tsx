import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import UnprotectedRoute from '../pages/UnprotectedRoute'
import ProtectedRoutesLayout from '../pages/ProtectedRoutesLayout'
import Admin from '../pages/dashboardPages/Admin'
import User from '../pages/dashboardPages/User'
import Courier from '../pages/dashboardPages/Courier'


const Router:React.FC= () => {
  return (
   <Routes>
      <Route path="/" element={<Navigate to="/auth" replace />} />
      <Route path='/auth' element={<UnprotectedRoute />} />
      <Route element={<ProtectedRoutesLayout />}>
         <Route path='/admin'  element={<Admin />}/>
         <Route path='/user' element={<User />}/>
         <Route path='/courier' element={<Courier />}/>
      </Route>
      
   </Routes>
  )
}

export default Router

