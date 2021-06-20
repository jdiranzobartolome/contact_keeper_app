import React, { Fragment, useContext } from 'react'
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import AuthContext from '../../context/auth/authContext';
import ContactContext from '../../context/contact/contactContext';


export const Navbar = ({ title, icon }) => {
    const authContext = useContext(AuthContext);
    const contactContext = useContext(ContactContext);

    const { isAuthenticated, logout, user } = authContext;
    const { clearContacts } = contactContext; 
    const onLogout = () => {
        logout();
        // Important to clear contacts so they do not stay in the contactContextState.
        clearContacts();
    }

    // Variables with the JSX that defines the list of 
    // links that are shown for the authenticated, and unaunthenticated
    // user cases.
    const authLinks = (
        <Fragment> 
            <li>Hello { user && user.name }</li>
            <li>
                <a onClick={onLogout} href="#!">
                    <i className="fas fa-sign-out-alt"></i> 
                    {/*The span adds a "logout" word next to the logout icon, 
                    but the class hide-sm is a mediaquery css rule that turns its display
                    value into none for small screens, so only the icon is visible. */}
                    <span className="hide-sm">Logout</span>
                </a>
            </li>

        </Fragment>
    );

    const guestLinks = (
        <Fragment> 
            <li>
                <Link to='/register'>Register</Link>  
            </li>
            <li>
                <Link to='/login'>Login</Link>  
            </li>
        </Fragment>
    );

    return (
        <div className="navbar bg-primary">
            <h1>
                {// The css, based on boostrap and using fontawesome, can be used like this
                // For creating a text line next to an icon.  
                }
                <i className={icon}>  { title } </i>
            </h1>
            <ul>
                {isAuthenticated ? authLinks : guestLinks}
            </ul>
            
        </div>
    )
}

Navbar.propTypes = {
    title: PropTypes.string.isRequired,
    icon: PropTypes.string
}

Navbar.defaultProps = {
    title: 'Contact Keeper',
    icon: 'fas fa-id-card-alt'
}

export default Navbar;
