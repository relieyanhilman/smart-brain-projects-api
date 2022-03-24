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
import { handleRegister } from './controllers/register.js';
import { handleSignin } from './controllers/signin.js';
import { handleGetProfile } from './controllers/getProfile.js';
import { handleImage } from './controllers/image.js';

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
    res.send('beyblade gila');
})

app.post('/signin', async(req, res) => { handleSignin(req, res, db, bcrypt) })
app.post('/register', (req, res) => { handleRegister(req, res, db, bcrypt) })
app.get('/profile/:userId', (req, res) => { handleGetProfile(req, res, db) })
app.put('/image', (req, res) => { handleImage(req, res, db) })
app.get('/', (req, res) => { res.send('bekerja brow') })

app.listen(process.env.PORT, () => {
    console.log(`app is running on port ${process.env.PORT}`);
})