import { useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SearchContext } from '../../context/SearchContext';
import { thunkGetAllPins } from '../../redux/pins';
// import PinList from '../PinComponents/PinList';
import { useNavigate } from 'react-router-dom';
import '../HomePage/HomePage.css'
const Search = () => {
  const { query } = useContext(SearchContext);
  const navigate = useNavigate('/')
  const dispatch = useDispatch();
  const [filteredPins, setFilteredPins] = useState([]);
  const pins = useSelector(state => state.pins.allPins);

  useEffect(() => {
    if(query.trim().length < 1) navigate('/home')
    if (query) {
      dispatch(thunkGetAllPins());
    }
  }, [dispatch, query,navigate]);

  useEffect(() => {
    if (query) {
      const lowercasedQuery = query.toLowerCase();
      const filtered = pins.filter(pin =>
        pin.title.toLowerCase().includes(lowercasedQuery) ||
        pin.description.toLowerCase().includes(lowercasedQuery)
      );
      setFilteredPins(filtered);
    } else {
      setFilteredPins([]);
    }
  }, [query, pins]);

  return (
    <div className="homepage">
    <div className="pin-container">
      {filteredPins.slice(0).reverse().map((pin) => (
        <div onClick={()=>navigate(`/pins/${pin.id}`)} key={pin.id} className="pin">
          <img src={pin.content_url} alt={pin.title} className="pin-image" />
          <div className="pin-title">{pin.title}</div>
        </div>
      ))}
    </div>
    </div>
  )
};

export default Search;
