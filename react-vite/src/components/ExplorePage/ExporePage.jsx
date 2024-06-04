import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { thunkGetUser } from '../../redux/session';
import { FaPinterest } from 'react-icons/fa';
export default function ExplorePage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [following, setFollowing] = useState([]);
    const [loaded, setLoaded] = useState(false);
    const [pins, setPins] = useState([]);
    const user = useSelector(state => state.session.user);
    const userId = user?.id;

    async function getFollowing(userId) {
        const response = await fetch(`/api/users/${userId}`);
        const data = await response.json();
        return data;
    };

    const pinArr = async (following) => {
        const allPins = [];
        const pinIds = new Set(); 

        for (const id of following) {
            const data = await thunkGetUser(id);
            data.pins.forEach(pin => {
                if (!pinIds.has(pin.id)) {
                    pinIds.add(pin.id);
                    allPins.push(pin);
                }
            });
        }

        setPins(allPins);
        setLoaded(true);
    };

    useEffect(() => {
        if (userId) {
            getFollowing(userId).then((data) => {
                setFollowing(data.following);
                pinArr(data.following);
            });
        }
    }, [dispatch, userId]);

    return (
        <div className="explore-page">
            {loaded ? (
                pins.length > 0 ? (
                    <div className="pin-container">
                        {pins.slice(0).reverse().map((pin) => (
                            <div key={pin.id} className="pin" onClick={() => navigate(`/pins/${pin.id}`)}>
                                <img src={pin.content_url} alt={pin.title} className="pin-image" />
                                <div className="pin-title">{pin.title}</div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="no-following">
                        <h2>You don't follow anyone. Go connect!</h2>
                    </div>
                )
            ) :(
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <FaPinterest style={{ color: '#E60023', fontSize: '2rem' }} />
              </div>
            )}
        </div>
    );
}
