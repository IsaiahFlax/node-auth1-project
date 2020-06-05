const router = require('express').Router()
const Users = require('../users/users-model.js')
const bcrypt = require('bcryptjs')


router.post('/register', async (req, res) => {
    const user = req.body
    const hash = bcrypt.hashSync(user.password, 10)
    user.password = hash
    try {
        const saved = await Users.add(user)
        res.status(201).json(saved)
    }   catch (err) {
        console.log(err)
        res.status(500).json(err)

    }
})

router.post('/login', async (req, res) => {
    const {username, password} = req.body
    const hash = bcrypt.hashSync(password, 10)
    try {
        const user = await Users.findBy({username}).first()
        if (user && bcrypt.compareSync(password, user.password)){
        req.session.user = user
        res.status(200).json({message: `welcome ${username}`})
        } else {
            res.status(400).json({ message: 'invalid creds'})
        }
    }   catch (err) {
        console.log(err)
        res.status(500).json(err)

    }
})

module.exports = router