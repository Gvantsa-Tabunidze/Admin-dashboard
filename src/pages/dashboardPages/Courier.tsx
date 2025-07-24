import { Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const Courier = () => {

const {logout} = useAuth()
const navigate = useNavigate()

const logMeOut = ()=>{
    logout()
    navigate('/auth')
}

  return (
    <div>
      <h1>Hey! Courier dashboard here!</h1>
      <Button onClick={logMeOut}variant='outlined' >Logout</Button>
    </div>
  )
}

export default Courier
