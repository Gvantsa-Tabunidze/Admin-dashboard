import React from 'react'
import { Route, Routes } from 'react-router-dom'
import UnprotectedRoute from '../pages/UnprotectedRoute'


const Router:React.FC= () => {
  return (
   <Routes>
      <Route path='/auth' element={<UnprotectedRoute />}>
          
      </Route>
   </Routes>
  )
}

export default Router

