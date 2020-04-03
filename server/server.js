const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('./config/config');
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use(require('./routes/usuario'));


mongoose.connect('mongodb://localhost:27017/usuarios', (err, res) => {

    if (err) throw err;

    console.log(`Base de datos ONLINE.`);

});


app.listen(process.env.PORT, () => {
    console.log(`Escuchando puerto: `, process.env.PORT);
});