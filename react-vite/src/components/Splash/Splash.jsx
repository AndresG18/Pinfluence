import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import SignupFormPage from '../SignupFormPage'
import './Splash.css'
export default function Splash() {
    const user = useSelector(state=> state.session.user)
    const navigate = useNavigate()
    useEffect(()=>{
        if(user)navigate('/home')
    })
  return (
    <div className='splashPage' >
        <img className='splashImage' src="https://pinfluence-2024.s3.us-east-2.amazonaws.com/splash.webp" alt="" />
        <SignupFormPage />
    {/* <LoginFormModal/> */}
    </div>
  )
}
