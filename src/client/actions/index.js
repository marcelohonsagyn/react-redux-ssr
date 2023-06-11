export const FETCH_USERS = 'fetch_users';
export const fetchUsers = () => async (dispatch, getState, axiosInstanceAPI) => {

    const res = await axiosInstanceAPI.get('/users');

    dispatch({
        type: FETCH_USERS,
        payload: res
    });

}

export const FETCH_CURRENT_USER = 'fetch_current_user';
export const fetchCurrentUser = () => async (dispatch, getState, axiosInstanceAPI) => {
    
        const res = await axiosInstanceAPI.get('/current_user');
    
        dispatch({
            type: FETCH_CURRENT_USER,
            payload: res
        });
    
    }