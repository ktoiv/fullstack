import Togglable from './Togglable'

const Blog = ({ user, blog, likeBlogCallBack, deleteBlogCallback }) => (
  <div>
    <h3>{blog.title}</h3>
    <Togglable buttonLabel={'view'} hideButtonLabel={'hide'}>
      <p>{blog.author}</p>
      <p>{blog.url}</p>
      <p style={{ display: 'inline' }}>likes: {blog.likes}</p> <button onClick={() => likeBlogCallBack(blog)}style={{ display: 'inline' }}>like</button>
      <br/>

      {
        blog.user.username === user.username &&  <button onClick={() => deleteBlogCallback(blog)}>Delete</button>
      }

      <br/>
    </Togglable>
  </div>
)

export default Blog