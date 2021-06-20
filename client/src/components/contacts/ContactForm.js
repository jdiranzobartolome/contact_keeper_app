import React, { useState, useContext, useEffect } from 'react'
import ContactContext from '../../context/contact/contactContext';

const ContactForm = () => {
    const contactContext = useContext(ContactContext);

    const { addContact, clearCurrent, updateContact, current } = contactContext;

    // useEffect for modifying what is filling up the form
    // when contactContext or current changes. 
    useEffect(() => {
        if (current !== null) {
          // When this happens, the id of the database is also given to the contact object, evne though the 
          // useState contact, does not have an id field. In other words, the number of fields in a useState object, 
          // can change with setState. Basically, the rule is:
          // "THE SETSTATE OF A STATE CAN MODIFY ANY VARIABLE DEFINED ON THE USESTATE CALL AND ADD OTHER ONES IF THE STATE IS AN OBJECT"
          // so you can add info, not take it out. However, if you use setState and some of the information you defined in usestate does not 
          // appear in setState, an error arises. 
          // This is really useful for when working with databases, that add an id or _id extra field to the object. (Of course you could
          // define it here too and let the database overrise it, but this is simpler) 
          setContact(current);
          console.log(contact);
        } else {
          setContact({
            name: '',
            email: '',
            phone: '',
            type: 'personal'
        });
        }
    }, [contactContext, current]);

    // The ContactForm component need to have states to keep track of the 
    // form changes (like with one change) for dispatching it to the context.
    // In general, any component which dispatch data thoruhg actions without receiving the states before
    // will have to have its own set of states. 
    // Since we are using functional components, useState needs to be used. 
    const [contact, setContact] = useState({
        name: '',
        email: '',
        phone: '',
        type: 'personal',
      });

    const { name, email, phone, type } = contact;

    const onChange = e => setContact({ ...contact, [e.target.name]: e.target.value })
    
    const onSubmit = e => {
        e.preventDefault();
        if (current === null) {
            addContact(contact);
        } else {
            updateContact(contact);
        }
        setContact({
            name: '',
            email: '',
            phone: '',
            type: 'personal'
        });
    }

    const clearAll = () => {
        clearCurrent();
    }
    
    return (
        <form onSubmit={onSubmit}>
            <h2 className="text-primary">{current ? 'Update Contact' : 'Add Contact'}</h2>
            <input 
                type="text" 
                placeholder="Name" 
                name='name'
                value={name}
                onChange={onChange} 
            />
            <input 
                type="email" 
                placeholder="Email" 
                name='email'
                value={email}
                onChange={onChange} 
            />
            <input 
                type="text" 
                placeholder="Phone" 
                name='phone'
                value={phone}
                onChange={onChange} 
            />
            <h5>Contact Type</h5>
            <input 
                type="radio"  
                name='type'
                value='personal'
                checked={type === 'personal' } 
                onChange={onChange}
            /> Personal {'  '}
            <input 
                type="radio"  
                name='type'
                value='professional'
                checked={type === 'professional' }
                onChange={onChange} 
            /> Professional
            <div>
                <input type="submit" value={current ? 'Update Contact' : 'Add Contact'} className='btn btn-primary btn-block' />
            </div>
            {current && <div>
                <button className="btn btn-light btn-block" onClick={clearAll}>
                    Clear
                </button>    
            </div>}
        </form>
    )
}

export default ContactForm
