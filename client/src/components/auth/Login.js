import React, { useState, useContext, useEffect } from 'react'
import AlertContext from '../../context/alert/alertContext';
import AuthContext from '../../context/auth/authContext';

const Login = props => {
    const alertContext = useContext(AlertContext);
    const authContext = useContext(AuthContext);

    const { setAlert } = alertContext;
    const { login, error, clearErrors, isAuthenticated } = authContext;
    
    // will run everytime the value of "error" changes
    useEffect(() => {
        // If the user is authenticated we want to redirect him/her to "home". 
        if (isAuthenticated) {
            // Redirecting to the home directory.
            props.history.push('/');
        }
        // A better way would be to send the msg error and an error ID or error number. 
        // and here just check the id instead of whole text, 
        if ((error === 'Invalid email') || (error === 'Invalid password'))  {
            setAlert(error, 'danger');
            clearErrors();
        } 
        // eslint-disable-next-line
        // Comment for getting rid of warnings for not adding
        // setAlert dependencies, since we actually do not want 
        // this to run when setAlert is modified. Also, 
        // some dependencies can create a loop, and we might want the effect
        // to be use only in "componentDidMount" equivalent, not during
        // updates. Then we also get a warning so this comment disable them. 
    }, [error, isAuthenticated, props.history]);

    //useState state created for the form, for keeping track of the variables email,
    // and password from the login form, and send it to the authContext to be authenticated.
    const [user, setUser] = useState({
        email: '',
        password: ''
    });

    const { email, password } = user;
    
    const onChange = e => setUser({ ...user, [e.target.name]: e.target.value });

    const onSubmit = e => {
        e.preventDefault();
        if (email === '' || password === '') {
            setAlert('Please fill in all fields', 'danger');
        } else {
            login({
                email,
                password
            });
        }
    }

    return (
        <div className='form-container'>
            <h1>
                Account <span className="text-primary">Login</span>
            </h1>
            <form onSubmit={onSubmit}>
                <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <input type="email" name="email" value={email} onChange={onChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input autoComplete='new-password' type="password" name="password" value={password} onChange={onChange} required />
                </div>
                <input type="submit" value="Login" className="btn btn-primary btn-block" required/>
            </form>
        </div>
    )
}

export default Login;