const handleImage = (req, res, db) => {
    const { userId } = req.body;
    db('users')
        .where('id', '=', userId)
        .increment('entries', 1)
        .returning('*')
        .then(data => res.json(data[0].entries))
        .catch(err => res.status(400).json('unable to upload image'))
}

export { handleImage };