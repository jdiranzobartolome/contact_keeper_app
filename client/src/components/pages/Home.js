import React, { useContext, useEffect } from 'react'
import Contacts from '../contacts/Contacts';
import ContactForm from '../contacts/ContactForm';
import ContactFilter from '../contacts/ContactFilter';
import AuthContext from '../../context/auth/authContext';

export const Home = () => {
    const authContext = useContext(AuthContext);

    // Will run only when mounting so we can always check if there is
    // a logged in user and load it and its token. This will
    // need to be done in all pages if they are protected. 
    useEffect(() => {
        authContext.loadUser();
        // eslint-disable-next-line
    }, []);

    return (
        <div className="grid-2">
           <div>
            <ContactForm />   
            </div> 
            <div>
                <ContactFilter />
                <Contacts />
            </div>
        </div>
    )
}

export default Home
