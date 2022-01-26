import express from 'express';
import bcrypt from 'bcrypt';
import cors from 'cors';
import { nanoid } from 'nanoid';
import knex from 'knex';
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

app.use(express.urlencoded({ extended: false }))
app.use(express.json());
app.use(cors())

app.post('/signin', async(req, res) => { handleSignin(req, res, db, bcrypt) })
app.post('/register', (req, res) => { handleRegister(req, res, db, bcrypt) })
app.get('/profile/:userId', (req, res) => { handleGetProfile(req, res, db) })
app.put('/image', (req, res) => { handleImage(req, res, db) })
app.get('/', (req, res) => { res.send('bekerja brow') })


app.listen(process.env.PORT || 3000, () => {
    console.log(`app listen on port ${process.env.PORT}`)
})

/*

/signin --> POST = success/fail
/register --> POST = user
/profile/:userId --> GET = user
/image --> PUT --> user


*/