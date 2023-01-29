import Blog from './Blog'
import PropTypes from 'prop-types'

const BlogList = ({ user, blogs, likeBlogCallBack, deleteBlogCallback }) => {

  const blogList = blogs
    .sort((a, b) => b.likes - a.likes)
    .map(blog =>
      <Blog key={blog.id} user={user} blog={blog} likeBlogCallBack={likeBlogCallBack} deleteBlogCallback={deleteBlogCallback} />
    )


  return (
    <div>
      <h2>blogs</h2>
      {blogList}
    </div>
  )

}

BlogList.propTypes = {
  user: PropTypes.object.isRequired,
  blogs: PropTypes.array.isRequired,
  likeBlogCallBack: PropTypes.func.isRequired,
  deleteBlogCallback: PropTypes.func.isRequired,
}

export default BlogList