import React, { useContext, useRef, useEffect } from 'react'
import ContactContext from '../../context/contact/contactContext';

const ContactFilter = () => {
    const contactContext = useContext(ContactContext);
    
    // useRef is another one of the Hooks which can be used to create
    // a reference to mutable objects accesing, in that way, the "current" value.
    // It can be done in other ways, like the other form we did. 
    // But it can be useful many times. 
    const text = useRef('');

    const { filterContacts, clearFilter, filtered } = contactContext;

    useEffect(() => {
        if(filtered === null) {
            text.current.value = '';
        }
    });

    const onChange = e => {
        if (text.current.value !== '') {
            filterContacts(e.target.value);
        } else {
            clearFilter();
        }
    };

    return (
        <form>
            <input ref={text} type="text" placeholder='Filter Contacts...' onChange={onChange} />
        </form>
    )
}
export default ContactFilter;
