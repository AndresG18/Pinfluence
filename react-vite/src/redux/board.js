const GET_BOARD = 'board/GET_BOARD';
const CREATE_BOARD = 'board/CREATE_BOARD';
const EDIT_BOARD = 'board/EDIT_BOARD';
const DELETE_BOARD = 'board/DELETE_BOARD';
const ADD_PIN_TO_BOARD = 'board/ADD_PIN_TO_BOARD';
const REMOVE_PIN_FROM_BOARD = 'board/REMOVE_PIN_FROM_BOARD';

const getBoard = (board) => ({
    type: GET_BOARD,
    board
});

const createBoard = (board) => ({
    type: CREATE_BOARD,
    board
});

const editBoard = (board) => ({
    type: EDIT_BOARD,
    board
});

const deleteBoard = (board) => ({
    type: DELETE_BOARD,
    board
});

const addPinToBoard = (board) => ({
    type: ADD_PIN_TO_BOARD,
    board
});

const removePinFromBoard = (board) => ({
    type: REMOVE_PIN_FROM_BOARD,
    board
});

export const thunkGetBoard = (id) => async (dispatch) => {
    const response = await fetch(`/api/boards/${id}`);
    const data = await response.json();
    if (response.ok) dispatch(getBoard(data));
    return data;
};

export const thunkCreateBoard = (board) => async (dispatch) => {
    const response = await fetch('/api/boards/new', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(board)
    });
    const data = await response.json();
    if (response.ok) dispatch(createBoard(data));
    return data;
};

export const thunkEditBoard = (id, board) => async (dispatch) => {
    const response = await fetch(`/api/boards/${id}/edit`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(board)
    });
    const data = await response.json();
    if (response.ok) dispatch(editBoard(data));
    return data;
};

export const thunkDeleteBoard = (boardId) => async (dispatch) => {
    const response = await fetch(`/api/boards/${boardId}/delete`, {
        method: 'DELETE'
    });
    const data = await response.json()
    if (response.ok) dispatch(deleteBoard(data));
    return data
};

export const thunkAddPinToBoard = (boardId, pinId) => async (dispatch) => {
    const response = await fetch(`/api/boards/${boardId}/pins/${pinId}`, {
        method: 'POST'
    });
    const data = await response.json();
    if (response.ok) dispatch(addPinToBoard(data));
    return data;
};

export const thunkRemovePinFromBoard = (boardId, pinId) => async (dispatch) => {
    const response = await fetch(`/api/boards/${boardId}/pins/${pinId}`, {
        method: 'DELETE'
    });
    const data = await response.json();
    if (response.ok) dispatch(removePinFromBoard(data));
    return data;
};

const initialState = {};

const boardReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_BOARD:
            return { ...state, board: action.board  };
        case CREATE_BOARD:
            return { ...state, board: action.board  };
        case EDIT_BOARD:
            return { ...state, board: action.board };
        case DELETE_BOARD:
            return { ...state, board: null };
        case ADD_PIN_TO_BOARD:
            return { ...state, board: action.board };
        case REMOVE_PIN_FROM_BOARD:
            return {  ...state, board: action.board };
        default:
            return state;
    }
}

export default boardReducer;
