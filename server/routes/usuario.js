const express = require('express');

const bcrypt = require('bcryptjs');
const _ = require('underscore');

const Usuario = require('../models/usuario');
const { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');

const app = express();



app.get('/usuario', verificaToken, (req, res) => {

   
    
    let desde = Number(req.query.desde)-1 || 0;

    let limite = Number(req.query.limite) || 5;

    Usuario.find({estado: true})
        .limit(limite)
        .skip(desde)
        .exec( (err, usuarios) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }
                Usuario.countDocuments( {estado: true}, (err, conteo) => {
                    
                    res.json({
                        ok: true,
                        cuantos: conteo,
                        usuarios
                    });

                });

        });
    

  });
  
  app.post('/usuario', [verificaToken, verificaAdmin_Role], function (req, res) {
  
      let body = req.body;

      let usuario = new Usuario({
          nombre: body.nombre,
          email: body.email,
          password: bcrypt.hashSync( body.password, 10),
          role: body.role
      });
  
      usuario.save( (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });

      });

  
    });
  
    app.put('/usuario/:id', [verificaToken, verificaAdmin_Role], function (req, res) {
  
      let id = req.params.id;
      let body = _.pick( req.body, ['nombre', 'email', 'img', 'estado','estado']);
      
      
      Usuario.findByIdAndUpdate( id, body, {new: true, runValidators: true}, (err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });

      });
  
    });
    
    app.delete('/usuario/:id', [verificaToken, verificaAdmin_Role], function (req, res) {
    
        let id = req.params.id;
        let cambiaEstado = {
            estado: false
        };

        // Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
        //     if (err) {
        //         return res.status(400).json({
        //             ok: false,
        //             err
        //         });
        //     };


        Usuario.findByIdAndUpdate( id, cambiaEstado, {new: true}, (err, usuarioBorrado) => {

            if (err){
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                usuario: usuarioBorrado
            });

        });

     });

      module.exports = app;