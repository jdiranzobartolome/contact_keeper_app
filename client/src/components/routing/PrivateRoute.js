//Standard way of creating a private route in React. 
// It basically consists on adding an extra layer to the 
// normal React Route component. The basic idea is to
// create a functional component which takes the props
// {component: Component, ...rest }, which takes the 
// component variable of the Route (basically, the component page that
// it renders from our page components) The ...rest is used to 
// access special props from the parents of Routes (in our case is not necessary but it might
// be in the future, and in any casi, the official documentation uses it).
// REALLY IMPORTANT the concept of RENDER PROPS:
// Render props are function props that a component uses to know what to render.
// They are function props which returns a react element and calls it, instead of the component
// implementing its own render logic. So basically, they are 
// useful for when, like here, we need conditionals for rendering 
// diferent things. In Render props, the "props" and "...props" have a similar use
// as the "...rest" variable for Route components, it is just a way of keep
// passing on the parent's props and parameters.
// More infor here: https://reactrouter.com/web/api/Route/route-props
// And  here: https://reactjs.org/docs/render-props.html
import React, { useContext } from 'react'
import { Route, Redirect } from 'react-router-dom';
import AuthContext from '../../context/auth/authContext';

// 
const PrivateRoute = ({ component: Component, ...rest }) => {
    const authContext = useContext(AuthContext);
    const { isAuthenticated, loading } = authContext;
    
    return (
        <Route { ...rest } render={props => !isAuthenticated && !loading ? (
            <Redirect to='/login' />
        ) : (
            <Component {...props} />
        )}
        />
    );
}

export default PrivateRoute;
