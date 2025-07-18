import React from 'react'
import { Route, Routes } from 'react-router-dom'
import UnprotectedRoute from '../pages/UnprotectedRoute'
import AuthTabs from '../components/AuthTabs'

const Router:React.FC= () => {
  return (
   <Routes>
      <Route path='/auth' element={<UnprotectedRoute />}>
          <Route index element={<AuthTabs />}/>
      </Route>
   </Routes>
  )
}

export default Router

