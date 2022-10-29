const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

//imports
const personRoutes = require('./routes/person-rotes');
const userRoutes = require('./routes/user-route');

//settings
app.set('port', 5000);

//middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors(
    [
        {
            origin: "localhost:5000",
            Credential: true
        }
    ]
));

//routes
app.use(userRoutes);

app.use(express.static('./src/assets'));


//run
app.listen(PORT, () => {
    console.log('Server on Port 5000')
})