import {
    ADD_CONTACT,
    DELETE_CONTACT,
    SET_CURRENT,
    CLEAR_CURRENT,
    CLEAR_CONTACTS,
    UPDATE_CONTACT,
    FILTER_CONTACTS,
    CLEAR_FILTER,
    CONTACT_ERROR,
    GET_CONTACTS
} from '../types';

export default (state, action) => {
    switch(action.type) {
        case GET_CONTACTS:
            return {
                ...state,
                contacts: action.payload,
                loading: false
            }
        case ADD_CONTACT:
            return {
                ...state,
                contacts: state.contacts ? [action.payload, ...state.contacts, ] : action.payload,
                loading: false
            };
        case UPDATE_CONTACT:
            return {
                ...state,
                contacts: state.contacts.map(contact => contact._id === action.payload._id ? action.payload : contact),
                loading: false
            };
        case DELETE_CONTACT:
            return {
                ...state,
                contacts: state.contacts.filter(contact => contact._id !== action.payload),
                // Added so the contacts dissapeared also if the user deletes them while on a filtering state. 
                // Need ternary operator because of the filtered state is null, it will give an error
                // when trying to run the operation .filter on it
                filtered: (state.filtered ? (state.filtered.filter(contact => contact._id !== action.payload)) : state.filtered),
                loading: false
            };
        case CLEAR_CONTACTS:
            return {
                ...state,
                contacts: null,
                filtered: null,
                error: null,
                current: null
            }
        case SET_CURRENT:
            return {
                ...state,
                current: action.payload
            };
        case CLEAR_CURRENT:
            return {
                ...state,
                current: null
            };
        case FILTER_CONTACTS:
        return {
            ...state,
            filtered: state.contacts.filter(contact => {
                //We create a regex with the parameters g and i (global and case insensitive)
                // which will be use for filtering.
                const regex = new RegExp(`${action.payload}`, 'gi');
                return contact.name.match(regex) || contact.email.match(regex);
            })
        };
        case CLEAR_FILTER:
            return {
                ...state,
                filtered: null
            };
        case CONTACT_ERROR:
            return {
                ...state,
                error: action.payload
            }
        default:
            return state;
    }
}