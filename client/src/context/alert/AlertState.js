import React, { useReducer } from 'react';
import {v4 as uuidv4} from 'uuid';
import AlertContext from './alertContext';
import alertReducer from './alertReducer';
import {
    SET_ALERT,
    REMOVE_ALERT
} from '../types';
import { STATES } from 'mongoose';

const AlertState = props => {
    // Defining the states of the context
    const initialState = [];
    
    //Bonding the context to the reducer to be able to read states and dispatch.
    const [state, dispatch] = useReducer(alertReducer, initialState);

    // Set Alert
    const setAlert = (msg, type, timeout = 5000) => {
        const id = uuidv4(); 
        dispatch({
            type: SET_ALERT,
            payload: { msg, type, id }
        });

        setTimeout(() => dispatch({ type: REMOVE_ALERT, payload: id }), timeout);

    }

    // Returning the context as a provider, with a set of defined
    // shareable values/actions of the state, so any component of the app can 
    // access those values/actions through the provider
    return (
        <AlertContext.Provider
            value={{
                alerts: state,
                setAlert
            }}
        >
            { props.children }
        </AlertContext.Provider> 
    )
}

export default AlertState;
