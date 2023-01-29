const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../src/app')
const Blog = require('../src/models/blog')
const User = require('../src/models/user')
const bcrypt = require('bcrypt')

const testData = require('./data/test_data')
const jwt = require('jsonwebtoken')

const api = supertest(app)

let token = ''
let user = null

beforeAll(async () => {
    const saltRounds = 10
    const test_password = process.env.TEST_PASSWORD
    const passwordHash = await bcrypt.hash(test_password, saltRounds)

    user = new User({
        username: 'tester',
        name: 'Tester',
        passwordHash,
    })

    user = await user.save()

    const userForToken = {
        username: user.username,
        id: user._id,
    }

    token = jwt.sign(userForToken, process.env.SECRET)
})

beforeEach(async () => {
    await Blog.deleteMany({})

    const blogObjects = testData.severalBlogs.map(blog => {
        return new Blog({...blog, user: user._id})
    })
    const blogPromises = blogObjects.map(blog => blog.save())

    await Promise.all(blogPromises)
})

afterAll(async () => {
    await User.deleteMany({})
    mongoose.connection.close()
})


test('correct amount of blogs are returned as json', async () => {
    const response = await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)

    expect(response.body).toHaveLength(testData.severalBlogs.length)
})

test('returned blogs have id defined instead of _id', async () => {
    const response = await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)

    const blogs = response.body
    blogs.forEach(blog => expect(blog.id).toBeDefined())
})

test('a valid blog can be added', async () => {
    const newBlog = {
        title: 'relativity blog',
        author: 'Einstein',
        url: 'http://relativity-blog.com',
        likes: 5,
    }

    await api
        .post('/api/blogs')
        .set('Authorization', 'bearer ' + token)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(testData.severalBlogs.length + 1)

})

test('a blog cant be added without login info', async () => {
    const newBlog = {
        title: 'relativity blog',
        author: 'Einstein',
        url: 'http://relativity-blog.com',
        likes: 5,
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(401)
        .expect('Content-Type', /application\/json/)
})

test('a blog without likes defaults to 0 likes', async () => {
    const newBlog = {
        title: 'relativity blog',
        author: 'Einstein',
        url: 'http://relativity-blog.com',
    }

    const result = await api
        .post('/api/blogs')
        .set('Authorization', 'bearer ' + token)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    expect(result.body.likes).toEqual(0)
})

test('a blog without title cannot be created ', async () => {
    const newBlog = {
        author: 'Einstein',
        url: 'http://relativity-blog.com',
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .set('Authorization', 'bearer ' + token)
        .expect(400)
})

test('a blog without url cannot be created ', async () => {
    const newBlog = {
        title: 'relativity blog',
        author: 'Einstein',
    }

    await api
        .post('/api/blogs')
        .set('Authorization', 'bearer ' + token)
        .send(newBlog)
        .expect(400)
})


describe('updating a blog', () => {
    test('a blog can be succesfully updated', async () => {
        const getResponse = await api.get('/api/blogs')
        const blogsAtStart = getResponse.body
        const blogToUpdate = blogsAtStart[0]

        const newBlog = {
            ...blogToUpdate,
            user: blogToUpdate.user._id,
            likes: blogToUpdate.likes + 1,
        }

        const afterUpdateResponse =  await api
            .put(`/api/blogs/${newBlog.id}`)
            .set('Authorization', 'bearer ' + token)
            .send(newBlog)
            .expect(200)

        const updatedBlog = afterUpdateResponse.body

        expect(updatedBlog.id).toEqual(blogToUpdate.id)
        expect(updatedBlog.likes).toEqual(blogToUpdate.likes + 1)
    })



})


describe('deletion of a note', () => {
    test('a blog can be succesfully deleted', async () => {

        const getResponse = await api.get('/api/blogs')
        const blogsAtStart = getResponse.body
        const blogToDelete = blogsAtStart[0]

        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .set('Authorization', 'bearer ' + token)
            .expect(204)

        const afterDeletionGetResponse = await api.get('/api/blogs')
        const blogsAtTheEnd = afterDeletionGetResponse.body

        expect(blogsAtTheEnd).toHaveLength(
            blogsAtStart.length - 1
        )

        const ids = blogsAtTheEnd.map(r => r.id)

        expect(ids).not.toContain(blogToDelete.id)
    })
})