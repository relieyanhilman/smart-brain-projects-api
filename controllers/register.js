const handleRegister = (req, res, db, bcrypt) => {
    const { email, name, password } = req.body;
    if (!email || !name || !password) {
        return res.status(400).json('incorrect form submission');
    }
    const saltRounds = 10;
    const hash = bcrypt.hashSync(password, saltRounds);
    db.transaction(trx => {
        trx('login').insert({
                hash: hash,
                email: email
            }).returning('email')
            .then(loginEmail => {
                return trx('users').insert({
                    name: name,
                    email: loginEmail[0],
                    joined: new Date()
                }).returning('*').then(data => res.json(data[0]))
            }).then(trx.commit)
            .catch(trx.rollback)
    }).catch(err => res.status(400).json('unable to register'))

}

export { handleRegister };