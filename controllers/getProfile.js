const handleGetProfile = (req, res, db) => {
    const { userId } = req.params;
    db.select('*').from('users').where({ id: userId })
        .then(data => {
            console.log(data)
            res.json(data[0]);
        })
        .catch(err => {
            console.log(err)
            res.status(404).json('profile not found');
        })
}

export { handleGetProfile };