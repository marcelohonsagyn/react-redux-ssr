import { combineReducers } from "redux";
import usersReducers from "./usersReducers";
import authReducer from "./authReducer";
import adminReducer from "./adminReducer";

export default combineReducers({
    users: usersReducers,
    auth: authReducer,
    admins: adminReducer
});
