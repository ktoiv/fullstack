const _ = require('lodash')

const dummy = (_) => {
    return 1
}

const totalLikes = (blogs) => {
    const likes = blogs.map(blog => blog.likes)
    return likes.reduce((agg, curr) => agg + curr, 0)
}

const favoriteBlog = (blogs) => {
    if (blogs.length === 0) return null

    return blogs.reduce((prev, current) => {
        return current.likes > prev.likes ? current : prev
    }, blogs[0])
}

const mostBlogs = (blogs) => {
    if (blogs.length === 0) return null
    
    const blogsByAuthor = Object.entries(_.countBy(blogs, blog => blog.author))

    const mostBlogs = blogsByAuthor.reduce((prev, curr) => {
        return curr[1] > prev[1] ? curr : prev

    }, blogsByAuthor[0])

    return {
        author: mostBlogs[0],
        blogs: mostBlogs[1]
    }
}

const mostLikes = (blogs) => {
    if (blogs.length === 0) return null
    
    const blogsByAuthor = Object.entries(_.groupBy(blogs, blog => blog.author))

    const authorsWithLikes = blogsByAuthor.map(([author, blogs]) => {
        const likeCount = blogs
            .map(blog => blog.likes)
            .reduce((acc, curr) => acc + curr, 0)
        
        return [author, likeCount]
    })

    const mostLikes = authorsWithLikes.reduce((prev, curr) => {
        return curr[1] > prev[1] ? curr : prev

    }, authorsWithLikes[0])

    return {
        author: mostLikes[0],
        likes: mostLikes[1]
    }
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}