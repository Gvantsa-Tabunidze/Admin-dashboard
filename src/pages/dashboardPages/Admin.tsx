import React from 'react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const Admin = () => {
const {logout} = useAuth()
const navigate = useNavigate()

const logMeOut = ()=>{
    logout()
    navigate('/auth')
}

  return (
    <div>
      <h1>Hey! Admin dahsboard here!</h1>
      <Button onClick={logMeOut}variant='outlined' >Logout</Button>
    </div>
  )
}

export default Admin
