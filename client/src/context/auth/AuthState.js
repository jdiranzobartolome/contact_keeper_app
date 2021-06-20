import React, { useReducer } from 'react';
import axios from 'axios';
import AuthContext from './authContext';
import authReducer from './authReducer';
import setAuthToken from '../../utils/setAuthToken';

import {
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    USER_LOADED,
    AUTH_ERROR,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT,
    CLEAR_ERRORS
} from '../types';
import { STATES } from 'mongoose';

const AuthState = props => {
    // Defining the states of the context
    const initialState = {
        // The token is going to be stored in local storage
        // (vanilla javascript has access to what is called local storage)
        token: localStorage.getItem('token'),
        isAuthenticated: null,
        loading: true,
        user: null,
        error: null
    };
    
    //Bonding the context to the reducer to be able to read states and dispatch.
    const [state, dispatch] = useReducer(authReducer, initialState);

    // Load User
    const loadUser = async () => {
        // Set the token of the localstorage of the browser, if available, 
        // as a default header, so it is sent with every request axios performs.
        // or more safety, the token should not be stored on localStorage, which can be 
        // accesed through javascript by any website. Other methods should be used, 
        // such as cookies. 
        if (localStorage.token) {
            setAuthToken(localStorage.token);
        }

        // We make the get request to the server. REMEMBER! This get request
        // reads the header's authentication variable which has the token and
        // checks whether that is a valid token and then gives you the info 
        // of the user. This token has been just put into the headers of axio 
        // in the setAuthToken step just done. Of course, it could also be 
        // set directly in the headers of the axios request. But setting it as 
        // default header in other function helps us not have to repeat it 
        // in other cases where we might need to use it again. Just using the 
        // function will change the axio headers.
        // DUDA: Will axio default headers not be deleted then? Might it happen that
        // an old token gets stored there and accidently sent?  
        try {
            const res = await axios.get('/api/auth');

            dispatch({ type: USER_LOADED, payload: res.data });
        } catch (err) {
            dispatch({ type: AUTH_ERROR });
        }
    }

    // Register User
    const register = async formData => {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'crossorigin' : 'true'
            }
        }

        try {
            // Since we have a proxy value in our package.json we do not need to write the localhost:5000 for the requests.
            // But I am not sure why the proxy is not working. Check it out later.
            const res = await axios.post('/api/users', formData, config);
            
            dispatch({
                type: REGISTER_SUCCESS,
                //res.data will be the json web token sent back from the server.
                payload: res.data
            });

            loadUser();
        } catch (err) {
            dispatch({
                type: REGISTER_FAIL,
                //res.data will be the json web token sent back from the server.
                payload: err.response.data.msg
            });
        }
    }

    // Login User
    const login = async formData => {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'crossorigin' : 'true'
            }
        }

        try {
            // Since we have a proxy value in our package.json we do not need to write the localhost:5000 for the requests.
            // But I am not sure why the proxy is not working. Check it out later.
            const res = await axios.post('/api/auth', formData, config);
            
            dispatch({
                type: LOGIN_SUCCESS,
                //res.data will be the json web token sent back from the server.
                payload: res.data
            });

            // loadUser is called in several places to load
            // the logged in user (since the only thing we are saving is 
            // the token, for getting the rest of the info we need to load the
            // user by reaching the server with the token)
            loadUser();
        } catch (err) {
            console.log(err.response.data.msg);
            dispatch({
                type: LOGIN_FAIL,
                //res.data will be the json web token sent back from the server.
                payload: err.response.data.msg
            });
        }
     }

    // Logout
    const logout = () => dispatch({ type: LOGOUT });

    // Clear Errors
    const clearErrors = () => dispatch({ type: CLEAR_ERRORS });

    // Returning the context as a provider, with a set of defined
    // shareable values/actions of the state, so any component of the app can 
    // access those values/actions through the provider
    return (
        <AuthContext.Provider
            value={{
                token: state.token,
                isAuthenticated: state.isAuthenticated,
                loading: state.loading,
                user: state.user,
                error: state.error,
                register,
                loadUser,
                login,
                logout,
                clearErrors
            }}
        >
            { props.children }
        </AuthContext.Provider> 
    )
}

export default AuthState;
