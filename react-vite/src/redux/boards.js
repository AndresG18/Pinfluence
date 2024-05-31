const GET_ALL_BOARDS = 'boards/GET_ALL_BOARDS';
const GET_USER_BOARDS = 'boards/GET_USER_BOARDS';

const getAllBoards = (boards) => ({
    type: GET_ALL_BOARDS,
    boards
});

const getUserBoards = (boards) => ({
    type: GET_USER_BOARDS,
    boards
});

export const thunkGetAllBoards = () => async (dispatch) => {
    const response = await fetch('/api/boards');
    const data = await response.json();
    if (response.ok) dispatch(getAllBoards(data.Boards));
    return data;
};

export const thunkGetUserBoards = (userId) => async (dispatch) => {
    const response = await fetch(`/api/users/${userId}/boards`);
    if (response.ok) {
        const data = await response.json();
        dispatch(getUserBoards(data.Boards));
    }
};

const initialState = {
    allBoards: [],
    myBoards: []
};

const boardsReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_ALL_BOARDS:
            return { ...state, allBoards: action.boards, myBoards: [...state.myBoards] };
        case GET_USER_BOARDS:
            return { ...state, allBoards: [...state.allBoards], myBoards: action.boards };
        default:
            return state;
    }
}

export default boardsReducer;

