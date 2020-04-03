const express = require('express');
const bcrypt = require('bcrypt');
const Usuario = require('../model/usuario');

const app = express();

/**
 * GET ROUTE
 */
app.get('/', function(req, res) {

    const all = getAll().then(u => {
        res.json(u)
    }).catch(er => {
        console.log(er);
    });

});

/**
 * ASYNC FUNCTION TO GET ALL DOCUMENTS IN USUARIOS COLLECTION
 */
async function getAll() {
    let usrs = await Usuario.find();
    return usrs;

}

/**
 * POSRT ROUTE USUARIO TO CREATE A NEW REGISTER UN DB
 */
app.post('/usuario', function(req, res) {
    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });


    usuario.save((err, usuarioDB) => {

        if (err) {
            res.status(400).json({
                ok: false,
                err
            });
            return;
        }

        res.json({
            ok: true,
            usuarioDB
        });

    });



});

//EXPORT APP 
module.exports = app;