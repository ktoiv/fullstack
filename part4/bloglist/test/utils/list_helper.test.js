const listHelper = require('../../src/utils/list_helper')
const testData = require('../data/test_data')


test('dummy returns one', () => {
    const blogs = []

    const result = listHelper.dummy(blogs)
    expect(result).toBe(1)
})

describe('total likes', () => {

    test('when list is empty, total likes is 0', () => {
        const result = listHelper.totalLikes([])
        expect(result).toBe(0)
    })

    test('when list has only one blog, equals the likes of that', () => {
        const result = listHelper.totalLikes(testData.listWithOneBlog)
        expect(result).toBe(5)
    })

    test('when list has several blogs, equals the likes of those combined', () => {
        const result = listHelper.totalLikes(testData.severalBlogs)
        expect(result).toBe(36)
    })
})


describe('favorite blog', () => {


    test('when list is empty, return null', () => {
        const result = listHelper.favoriteBlog([])
        expect(result).toBe(null)
    })

    test('when list has only one blog, return that', () => {
        const desiredResult = {
            _id: '5a422aa71b54a676234d17f8',
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
            likes: 5,
            __v: 0
        }

        const result = listHelper.favoriteBlog(testData.listWithOneBlog)
        expect(result).toEqual(desiredResult)
    })

    test('when list has several blogs, returns the correct favorite', () => {
        const desiredResult = {
            _id: '5a422b3a1b54a676234d17f9',
            title: 'Canonical string reduction',
            author: 'Edsger W. Dijkstra',
            url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
            likes: 12,
            __v: 0
        }

        const result = listHelper.favoriteBlog(testData.severalBlogs)
        expect(result).toEqual(desiredResult)
    })


})

describe('most blogs', () => {


    test('when list is empty, return null', () => {
        const result = listHelper.mostBlogs([])
        expect(result).toBe(null)
    })

    test('when list has only one blog, return that', () => {
        const result = listHelper.mostBlogs(testData.listWithOneBlog)
        const desiredResult = {
            author: 'Edsger W. Dijkstra',
            blogs: 1
        }
        expect(result).toEqual(desiredResult)    })

    test('when list has several blogs, returns the correct author with most blogs', () => {
        const result = listHelper.mostBlogs(testData.severalBlogs)
        const desiredResult = {
            author: 'Robert C. Martin',
            blogs: 3
        }
        expect(result).toEqual(desiredResult)
    })
})


describe('most likes', () => {


    test('when list is empty, return null', () => {
        const result = listHelper.mostLikes([])
        expect(result).toBe(null)
    })

    test('when list has only one blog, return that', () => {
        const result = listHelper.mostLikes(testData.listWithOneBlog)

        const desiredResult = {
            author: 'Edsger W. Dijkstra',
            likes: 5
        }

        expect(result).toEqual(desiredResult)
    })

    test('when list has several blogs, returns the correct author with most blogs', () => {
        const result = listHelper.mostLikes(testData.severalBlogs)
        const desiredResult = {
            author: 'Edsger W. Dijkstra',
            likes: 17
        }

        expect(result).toEqual(desiredResult)
    })
})