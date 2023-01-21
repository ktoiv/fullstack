const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')

const api = supertest(app)


beforeEach(async () => {
    await User.deleteMany({})
})

afterAll(() => {
    mongoose.connection.close()
})


test('users can be created', async () => {
    const newUser = {
        'username': 'root',
        'name': 'Superuser',
        'password': 'salainen'
    }

    await api
        .post('/api/users')
        .send(newUser)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const result = await api
        .get('/api/users')
        .expect(200)
        .expect('Content-Type', /application\/json/)

    const users = result.body

    expect(users.length).toEqual(1)
})


test('a User with too short username cant be saved', async () => {
    const newUser = {
        'username': 'r',
        'name': 'Superuser',
        'password': 'salainen'
    }

    await api
        .post('/api/users')
        .send(newUser)
        .expect(400)

    const result = await api
        .get('/api/users')
        .expect(200)
        .expect('Content-Type', /application\/json/)

    const users = result.body

    expect(users.length).toEqual(0)
})

test('a User with too short password cant be saved', async () => {
    const newUser = {
        'username': 'root',
        'name': 'Superuser',
        'password': 's'
    }

    await api
        .post('/api/users')
        .send(newUser)
        .expect(400)

    const result = await api
        .get('/api/users')
        .expect(200)
        .expect('Content-Type', /application\/json/)

    const users = result.body

    expect(users.length).toEqual(0)
})