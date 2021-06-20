import React, { useState, useContext, useEffect } from 'react'
import AlertContext from '../../context/alert/alertContext';
import AuthContext from '../../context/auth/authContext';


const Register = props => {
    const alertContext = useContext(AlertContext);
    const authContext = useContext(AuthContext);
    
    const { setAlert } = alertContext;
    const { register, error, clearErrors, isAuthenticated } = authContext;

    // will run everytime the value of "error" changes
    useEffect(() => {
        // If the user is authenticated we want to redirect him/her to "home". 
        if (isAuthenticated) {
            // Redirecting to the home directory.
            props.history.push('/');
        }
        // A better way would be to send the msg error and an error ID or error number. 
        // and here just check the id instead of whole text, 
        if (error === 'User already exists') {
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
    
    const [user, setUser] = useState({
        name: '',
        email: '',
        password: '',
        password2: ''
    });

    const { name, email, password, password2 } = user;
    
    const onChange = e => setUser({ ...user, [e.target.name]: e.target.value });

    const onSubmit = e => {
        e.preventDefault();
        if (name === '' || email === '' || password === '' ) {
            setAlert('Please enter all fields', 'danger');
        } else if (password !== password2) {
            setAlert('Passwords do not match', 'danger');
        } else {
            register({
                name,
                email,
                password
            })
        }
        console.log('Register submit');
    }

    return (
        <div className='form-container'>
            <h1>
                Account <span className="text-primary">Register</span>
            </h1>
            <form onSubmit={onSubmit}>
                <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input type="text" name="name" value={name} onChange={onChange} />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <input type="email" name="email" value={email} onChange={onChange} />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input autoComplete='new-password' type="password" name="password" value={password} onChange={onChange} />
                </div>
                <div className="form-group">
                    <label htmlFor="password2">Confirm Password</label>
                    <input autoComplete='new-password' type="password" name="password2" value={password2} onChange={onChange} />
                </div>
                <input type="submit" value="Register" className="btn btn-primary btn-block" />
            </form>
        </div>
    )
}

export default Register;