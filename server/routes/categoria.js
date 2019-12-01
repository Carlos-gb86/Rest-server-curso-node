

const express = require('express');

let {verificaToken, verificaAdmin_Role} = require('../middlewares/autenticacion');

let app = express();

let Categoria = require('../models/categoria');


// ==============================
// Mostrar todas las categorias
// ==============================

app.get('/categoria', verificaToken, (req,res) =>{
    
    Categoria.find()
    .sort('descripcion')
    .populate('usuario', 'nombre email')
    .exec((err, categorias) =>{

       if (err) {
           return res.status(500).json({
               ok: false,
               err
           });
       }

       res.json({
           ok: true,
           categorias
       })

    })

});

// ==============================
// Mostrar una categoria por ID
// ==============================

app.get('/categoria/:id', verificaToken, (req,res) =>{
    //Categoria.findById()
    let id = req.params.id;

    Categoria.findById(id, (err, categoriaDB) =>{

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El id no es válido'
                }
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        })

    });
    

});

// ==============================
// Crear una nueva categoria
// ==============================

app.post('/categoria', verificaToken, (req,res) =>{
    // regresa la nueva categoria
    // req.usuario._id

    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save( (err, categoriaDB)=>{

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        })

    });

});

// ==============================
// Actualiza una categoria
// ==============================

app.put('/categoria/:id', verificaToken, (req,res) =>{
    //Categoria.findById()

    let id = req.params.id;
    let body = req.body;

    console.log({id, body});

    let descCategoria = {
        descripcion: body.descripcion
    }

    Categoria.findByIdAndUpdate(id, descCategoria, {new: true}, (err, categoriaDB)=>{

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        })

    });

});


// ==============================
// Elimina una categoria
// ==============================

app.delete('/categoria/:id', [verificaToken, verificaAdmin_Role], (req,res) =>{
    //Categoria.findById()

    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El id no existe'
                }
            });
        }

        res.json({
            ok: true,
            message: `la categoria <<${categoriaDB.descripcion}>> ha sido borrada`
        })

    })

});




module.exports = app;