const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', (request, response) => {
    Blog
        .find({})
        .populate('user', { username: 1, name: 1 })
        .then(blogs => {
            response.json(blogs)
        })
})

blogsRouter.post('/', async (request, response) => {
    const user = request.user

    if (!user) {
        return response.status(401).json({
            error: 'invalid username or password'
        })
    }

    const blog = new Blog({
        title: request.body.title,
        author: request.body.author,
        url: request.body.url,
        likes: request.body.likes,
        user: user._id
    })

    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    response.status(201).json(savedBlog)
})


blogsRouter.put('/:id', async (request, response) => {
    const user = request.user
    const savedBlog = await Blog.findByIdAndUpdate(
        request.params.id,
        {
            title: request.body.title,
            author: request.body.author,
            url: request.body.url,
            likes: request.body.likes,
            user: user._id
        },
        { new: true, runValidators: true, context: 'query' }
    )

    response.json(savedBlog)
})


blogsRouter.delete('/:id', async (request, response) => {
    const user = request.user

    if (!user) {
        return response.status(401).json({
            error: 'invalid username or password'
        })
    }
    
    const blogToBeDeleted = await Blog.findById(request.params.id)

    if (!blogToBeDeleted) {
        response.status(404).end()
        return
    }

    if (blogToBeDeleted.user.toString() === user.id.toString()) {
        await blogToBeDeleted.delete()
        response.status(204).end()
        return
    }

    response.status(403).end()
})

module.exports = blogsRouter