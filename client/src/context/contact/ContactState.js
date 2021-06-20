import React, { useReducer } from 'react';
import axios from 'axios';
import {v4 as uuidv4} from 'uuid';
import ContactContext from './contactContext';
import contactReducer from './contactReducer';
import {
    GET_CONTACTS,
    ADD_CONTACT,
    DELETE_CONTACT,
    SET_CURRENT,
    CLEAR_CURRENT,
    UPDATE_CONTACT,
    FILTER_CONTACTS,
    CLEAR_CONTACTS,
    CLEAR_FILTER,
    CONTACT_ERROR
} from '../types';
import { STATES } from 'mongoose';

const ContactState = props => {
    // Defining the states of the context
    const initialState = {
        contacts: null,
        current: null,
        filtered: null,
        error: null
    };
    
    //Bonding the context to the reducer to be able to read states and dispatch.
    const [state, dispatch] = useReducer(contactReducer, initialState);

    // Get contacts
    const getContacts = async () => {
        // Remember that the token is getting sent by default.
        // (Maybe it would be better to make it more explicit and just
        // add a header with the token for each request, instead of making
        // it into a default header)
        try {
            const res = await axios.get('/api/contacts');

            dispatch({ type: GET_CONTACTS, payload: res.data })        
        } catch (err) {
            dispatch({ type: CONTACT_ERROR , payload: err.response.data.msg });
        }
        
    }

    // Add Contact
    const addContact = async contact => {
        // We do not add the token header here because we added it
        // by default by calling it in loadUser and the app.js itself,
        // so as long as there is a token in localstorage, the token
        // header is sent by default with any axio request. 
        const config = {
            header: {
                'Content-Type': 'application/json'
            }
        };

        try {
            const res = await axios.post('/api/contacts', contact, config);

            dispatch({ type: ADD_CONTACT, payload: res.data })        
        } catch (err) {
            //CAREFUL!! IF err.response.data.msg FAILS, USE err.response.msg
            dispatch({ type: CONTACT_ERROR , payload: err.response.data.msg});
        }
    }

    // Update Contact
    const updateContact = async contact => {
        // We do not add the token header here because we added it
        // by default by calling it in loadUser and the app.js itself,
        // so as long as there is a token in localstorage, the token
        // header is sent by default with any axio request. 
        const config = {
            header: {
                'Content-Type': 'application/json'
            }
        };

        try {
            const res = await axios.put(`/api/contacts/${contact._id}`, contact, config);

            dispatch({ type: UPDATE_CONTACT, payload: res.data })        
        } catch (err) {
            //CAREFUL!! IF err.response.data.msg FAILS, USE err.response.msg
            dispatch({ type: CONTACT_ERROR , payload: err.response.data.msg });
        }
    }

    // Delete Contact
    const deleteContact = async id => {
        try {
            await axios.delete(`api/contacts/${id}`);

            dispatch({ type: DELETE_CONTACT, payload: id })        
        } catch (err) {
            //CAREFUL!! IF err.response.data.msg FAILS, USE err.response.msg
            dispatch({ type: CONTACT_ERROR , payload: err.response.data.msg});
        }
    }

    // Clear Contacts
    const clearContacts = () => {
        dispatch({ type: CLEAR_CONTACTS })
    }

    // Set Current Contact
    const setCurrent = contact => {
        dispatch({ type: SET_CURRENT, payload: contact})
    }

    // Clear Current Contact
    const clearCurrent = () => {
        dispatch({ type: CLEAR_CURRENT })
    }

    // Filter Contacts
    const filterContacts = text => {
        dispatch({ type: FILTER_CONTACTS, payload: text})
    }
    // Clear Filter
    const clearFilter = () => {
        dispatch({ type: CLEAR_FILTER })
    }

    // Returning the context as a provider, with a set of defined
    // shareable values/actions of the state, so any component of the app can 
    // access those values/actions through the provider
    return (
        <ContactContext.Provider
            value={{
                contacts: state.contacts,
                current: state.current,
                filtered: state.filtered,
                error: state.error,
                getContacts,
                addContact,
                deleteContact,
                setCurrent,
                clearContacts,
                clearCurrent,
                updateContact,
                filterContacts,
                clearFilter
            }}
        >
            { props.children }
        </ContactContext.Provider> 
    )
}

export default ContactState;
