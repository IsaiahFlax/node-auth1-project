const router = require("express").Router();
const restricted = require('../auth/restricted-middleware')

const Users = require("./users-model.js");

router.get("/", restricted, (req, res) => {
  Users.find()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(err => res.send(err));
});

router.get('/logout'), (req, res) => {
  if(req.session){
    req.session.destroy( err => {
      if (err) {
        res.send('you can checkout anytime you like, but you can never leave')
      } else {
        res.send('good-bye')
      }
    })
  } else {
    res.end()
  }
}

module.exports = router;
