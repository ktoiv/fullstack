import { useState, useEffect, useRef } from 'react'
import BlogList from './components/BlogList'
import LoginForm from './components/LoginForm'
import NewBlogForm from './components/NewBlogForm'
import Togglable from './components/Togglable'
import UserInfo from './components/UserInfo'
import blogService from './services/blogs'

const App = () => {

  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
    }
  }, [])

  const setUserCallback = (newUser) => setUser(newUser)

  const addBlog = async (title, author, url) => {
    blogFormRef.current.toggleVisibility()
    const createdBlog = await blogService.createNewBlog(user, title, author, url)
    setBlogs(blogs.concat(createdBlog))

    return createdBlog
  }

  const likeBlog = async (blogObject) => {
    await blogService.addLikeToBlog(user, blogObject)
    const blogs = await blogService.getAll()
    setBlogs(blogs)
  }

  const deleteBlog = async (blogObject) => {
    await blogService.deleteBlog(user, blogObject)
    const blogs = await blogService.getAll()
    setBlogs(blogs)
  }

  return (
    <div>
      {
        user === null ?
          <LoginForm setUserCallback={setUserCallback} />
          :
          <div>
            <UserInfo user={user} setUserCallback={setUserCallback} />
            <Togglable buttonLabel={'new blog'} hideButtonLabel={'cancel'} ref={blogFormRef}>
              <NewBlogForm addBlogCallback={addBlog} />
            </Togglable>
            <BlogList user={user} blogs={blogs} likeBlogCallBack={likeBlog} deleteBlogCallback={deleteBlog} />
          </div>
      }
    </div>
  )
}

export default App