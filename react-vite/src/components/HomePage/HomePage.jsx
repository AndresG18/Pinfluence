import { useSelector, useDispatch } from "react-redux"
import { useEffect, useState } from "react"
import {thunkGetAllPins} from '../../redux/pins'
import "./HomePage.css";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
const user = useSelector(state=> state.session.user)
const pins = useSelector(state => state.pins.allPins)
const navigate = useNavigate()
const [loaded,setLoaded] = useState(false)
const dispatch = useDispatch()
useEffect(()=>{
  dispatch(thunkGetAllPins()).then(() => setLoaded(true))
},[dispatch])

return (
  <div className="homepage">
    {pins.length > 0 ? (
      <div className="pin-container">
        {pins.map((pin) => (
          <div onClick={()=>navigate(`/pins/${pin.id}`)} key={pin.id} className="pin">
            <img src={pin.content_url} alt={pin.title} className="pin-image" />
            <div className="pin-title">{pin.title}</div>
          </div>
        ))}
      </div>
    ) : (
      <div className="loading">Loading...</div>
    )}
  </div>
);
}
