const express = require('express');
const connectDB = require('./config/db');
const path = require('path');

const app = express();

// Connect Database
connectDB();

// Init Middleware
app.use(express.json({ extended: false } ));


//THIS IS NOT GOOD PRACTICE, SINCE YOU TECHNICALLY ALLOW ANY SOURCE TO TALK TO YOUR SERVER. YOU SOLVED THIS BY CREATING A PROXY BETWEEN YOUR SERVER
// AND YOUR FRONT END.
// This Middleware set CORS so cross-origin shared asswets are allowed (needed for websites to access or send assets to websites that are not
// in the same origin. So with this, websites will be able to access the database of this server. It could also be done 
// we a dependency: 
//var cors = require('cors')
//app.use(cors());
// Read more about this in the following links: 
//https://stackoverflow.com/questions/23751914/how-can-i-set-response-header-on-express-js-assets
//https://stackoverflow.com/questions/20035101/why-does-my-javascript-code-receive-a-no-access-control-allow-origin-header-i
//https://developer.mozilla.org/es/docs/Web/HTTP/CORS/Errors/CORSMissingAllowOrigin
// app.use((req, res, next) => {
//     res.append('Access-Control-Allow-Origin', ['*']);
//     res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
//     res.append('Access-Control-Allow-Headers', 'Content-Type');
//     next();
// });

// Define Routes
app.use('/api/users', require('./routes/users'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/contacts', require('./routes/contacts'));

// Serve static assets in production
if(process.env.NODE_ENV === 'production') {
    // Set static folder 
    app.use(express.static('client/build'));

    // Any route that are not the ones above, will redirecto
    // to thei index.html
    app.get('*', (req, res) =>
     res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html')));
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));