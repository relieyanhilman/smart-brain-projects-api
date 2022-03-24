// import express from 'express';
// import bcrypt from 'bcrypt';
// import cors from 'cors';
// import { nanoid } from 'nanoid';
// import knex from 'knex';
// import { handleRegister } from './controllers/register.js';
// import { handleSignin } from './controllers/signin.js';
// import { handleGetProfile } from './controllers/getProfile.js';
// import { handleImage } from './controllers/image.js';
// const db = knex({
// client: 'pg',
//     connection: {
//         host: '127.0.0.1',
//         port: 5432,
//         user: 'postgres',
//         password: 'password',
//         database: 'smart-brain'
//     }
// });

// const app = express();

// app.use(cors())
// app.use(express.urlencoded({ extended: false }))
// app.use(express.json());
// const PORT = process.env.PORT || 3000


// app.post('/signin', async(req, res) => { handleSignin(req, res, db, bcrypt) })
// app.post('/register', (req, res) => { handleRegister(req, res, db, bcrypt) })
// app.get('/profile/:userId', (req, res) => { handleGetProfile(req, res, db) })
// app.put('/image', (req, res) => { handleImage(req, res, db) })
// app.get('/', (req, res) => { res.send('bekerja brow') })


// app.listen(PORT, () => {
//     console.log(`app listen on port ${PORT}`)
// })

// /*

// /signin --> POST = success/fail
// /register --> POST = user
// /profile/:userId --> GET = user
// /image --> PUT --> user


// */

const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex')

const db = knex({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        port: 5432,
        user: 'postgres',
        password: 'password',
        database: 'smart-brain'
    }
});

const app = express();
app.use(cors())
app.use(express.json());

app.get('/', (req, res) => {
    res.send('beyblade');
})

app.post('/signin', (req, res) => {
    db.select('email', 'hash').from('login')
        .where('email', '=', req.body.email)
        .then(data => {
            const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
            if (isValid) {
                return db.select('*').from('users')
                    .where('email', '=', req.body.email)
                    .then(user => {
                        res.json(user[0])
                    })
                    .catch(err => res.status(400).json('unable to get user'))
            } else {
                res.status(400).json('wrong credentials')
            }
        })
        .catch(err => res.status(400).json('wrong credentials'))
})

app.post('/register', (req, res) => {
    const { email, name, password } = req.body;
    const hash = bcrypt.hashSync(password);
    db.transaction(trx => {
            trx.insert({
                    hash: hash,
                    email: email
                })
                .into('login')
                .returning('email')
                .then(loginEmail => {
                    return trx('users')
                        .returning('*')
                        .insert({
                            // If you are using knex.js version 1.0.0 or higher this now returns an array of objects. Therefore, the code goes from:
                            // loginEmail[0] --> this used to return the email
                            // TO
                            // loginEmail[0].email --> this now returns the email
                            email: loginEmail[0].email,
                            name: name,
                            joined: new Date()
                        })
                        .then(user => {
                            res.json(user[0]);
                        })
                })
                .then(trx.commit)
                .catch(trx.rollback)
        })
        .catch(err => res.status(400).json('unable to register'))
})

app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    db.select('*').from('users').where({ id })
        .then(user => {
            if (user.length) {
                res.json(user[0])
            } else {
                res.status(400).json('Not found')
            }
        })
        .catch(err => res.status(400).json('error getting user'))
})

app.put('/image', (req, res) => {
    const { id } = req.body;
    db('users').where('id', '=', id)
        .increment('entries', 1)
        .returning('entries')
        .then(entries => {
            // If you are using knex.js version 1.0.0 or higher this now returns an array of objects. Therefore, the code goes from:
            // entries[0] --> this used to return the entries
            // TO
            // entries[0].entries --> this now returns the entries
            res.json(entries[0].entries);
        })
        .catch(err => res.status(400).json('unable to get entries'))
})

app.listen(process.env.PORT, () => {
    console.log(`app is running on port ${process.env.PORT}`);
})