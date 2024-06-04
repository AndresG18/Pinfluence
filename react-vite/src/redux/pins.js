const GET_ALL_PINS = 'pins/GET_ALL_PINS';
const GET_USER_PINS = 'pins/GET_USER_PINS';

const getAllPins = (pins) => ({
    type: GET_ALL_PINS,
    pins
});

const getUserPins = (pins) => ({
    type: GET_USER_PINS,
    pins
});

export const thunkGetAllPins = () => async (dispatch) => {
    const response = await fetch('/api/pins');
    const data = await response.json();
    if (response.ok) dispatch(getAllPins(data.Pins));
    return data;
};

export const thunkGetUserPins = () => async (dispatch) => {
    const response = await fetch(`/api/pins/current`);
    const data = await response.json();
    if (response.ok) dispatch(getUserPins(data.Pins));
    return data;
};

export const thunkGetFollowingPins = () => async (dispatch) => {
    const response = await fetch('/api/pins/following');
    const data = await response.json();
    if (response.ok) {
        dispatch(getPins(data.pins));
    }
    return data;
};


const initialState = {
    allPins: [],
    myPins: []
};

const pinsReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_ALL_PINS:
            return { ...state, allPins: action.pins, myPins: [...state.myPins] };
        case GET_USER_PINS:
            return { ...state, allPins: [...state.allPins], myPins: action.pins };
        default:
            return state;
    }
}

export default pinsReducer;

