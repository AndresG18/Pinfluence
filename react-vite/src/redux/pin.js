const GET_PIN = 'pin/GET_PIN';
const CREATE_PIN = 'pin/CREATE_PIN';
const EDIT_PIN = 'pin/EDIT_PIN';
const DELETE_PIN = 'pin/DELETE_PIN';
const DELETE_COMMENT = 'pin/DELETE_COMMENT';

const getPin = (pin) => ({
    type: GET_PIN,
    pin
});

const createPin = (pin) => ({
    type: CREATE_PIN,
    pin
});

const editPin = (pin) => ({
    type: EDIT_PIN,
    pin
});

const deletePin = () => ({
    type: DELETE_PIN
});

const deleteComment = (pin) => ({
    type: DELETE_COMMENT,
    pin
});

export const thunkGetPin = (pinId) => async (dispatch) => {
    const response = await fetch(`/api/pins/${pinId}`);
    const data = await response.json();
    if (response.ok) dispatch(getPin(data));
    return data;
};

export const thunkCreatePin = (pin) => async (dispatch) => {
    const response = await fetch('/api/pins/new', {
        method: 'POST',
        body: pin
    });
    const data = await response.json();
    if (response.ok) dispatch(createPin(data));
    return data;
};

export const thunkEditPin = (pinId, pin) => async (dispatch) => {
    const response = await fetch(`/api/pins/${pinId}/edit`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: pin
    });
    const data = await response.json();
    if (response.ok) dispatch(editPin(data));
    return data;
};

export const thunkDeletePin = (pinId) => async (dispatch) => {
    const response = await fetch(`/api/pins/${pinId}/delete`, {
        method: 'DELETE'
    });
    if (response.ok) dispatch(deletePin());
    return response.json();
};

export const thunkCreateComment = (pinId, comment) => async (dispatch) => {
    const response = await fetch(`/api/pins/${pinId}/comments/new`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(comment)
    });
    const data = await response.json();
    if (response.ok) dispatch(getPin(data)); 
    return data;
};

export const thunkDeleteComment = (pinId, commentId) => async (dispatch) => {
    const response = await fetch(`/api/pins/${pinId}/comments/${commentId}/delete`, {
        method: 'DELETE'
    });
    const data = await response.json();
    if (response.ok) dispatch(deleteComment(data));  
    return data;
};

export const thunkToggleLikePin = (pinId) => async (dispatch) => {
    const response = await fetch(`/api/pins/${pinId}/like`, {
        method: 'POST'
    });
    const data = await response.json();
    if (response.ok) dispatch(getPin(data)); 
    return data;
};


const initialState = {
    pin: null
};

const pinReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_PIN:
            return { ...state, pin: action.pin };
        case CREATE_PIN:
            return { ...state, pin: action.pin };
        case EDIT_PIN:
            return { ...state, pin: action.pin };
        case DELETE_PIN:
            return { ...state, pin: null };
        case DELETE_COMMENT:
            return { ...state, pin: action.pin }; 
        default:
            return state;
    }
}

export default pinReducer;
