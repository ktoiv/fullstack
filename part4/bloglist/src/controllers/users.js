const usersRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')


const invalidPassword = password => password.length < 3

usersRouter.get('/', async (request, response) => {
    const users = await User.find({}).populate('blogs', { title: 1, author: 1, url: 1 })
    response.status(200).json(users)
})


usersRouter.post('/', async (request, response) => {
    const { username, name, password } = request.body


    if (invalidPassword(password)) {
        response.status(400).send({ error: 'password has to be at least three characters long' })
        return
    } 


    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User({
        username,
        name,
        passwordHash,
    })


    const result = await user.save()
    response.status(201).json(result)
})


module.exports = usersRouter