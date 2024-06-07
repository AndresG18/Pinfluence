
import { useNavigate } from "react-router-dom";
import { FaPinterest } from "react-icons/fa";
import './PInList.css'
import '../HomePage/HomePage.css'
const PinList = ({ pins }) => {
  const navigate = useNavigate();

  return (
    <div className="all-pins">
      {pins.length > 0 ? (
        <div className="pin-container">
          {pins.slice(0).reverse().map((pin) => (
            <div onClick={() => navigate(`/pins/${pin.id}`)} key={pin.id} className="pin">
              <img src={pin.content_url} alt={pin.title} className="pin-image" />
              <div className="pin-title">{pin.title}</div>
            </div>
          ))}
        </div>
      ) : <>({ pins.length < 1 ? <> You haven't saved any pins </>: (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <FaPinterest style={{ color: '#E60023', fontSize: '2rem' }} />
        </div>
      )} )</>}
    </div>
  );
};

export default PinList;
