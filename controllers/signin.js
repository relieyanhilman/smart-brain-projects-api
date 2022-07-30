const handleSignin = async (req, res, db, bcrypt) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json("incorrect form submission");
  }
  db.from("login")
    .where("email", email)
    .then((userSignIn) => {
      const compareSync = bcrypt.compareSync(password, userSignIn[0].hash);
      if (compareSync) {
        db.select("*")
          .from("users")
          .where("email", userSignIn[0].email)
          .then((users) => {
            res.json(users[0]);
          })
          .catch((err) => {
            res.status(404).json("users not found");
          });
      } else {
        res.status(404).json("wrong credentials");
      }
    })
    .catch((err) => {
      res.status(404).json("user not found");
    });
};

export { handleSignin };
