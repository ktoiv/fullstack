import axios from 'axios'
const baseUrl = '/api/blogs'

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}


const createNewBlog = async (user, blogName, blogAuthor, blogUrl) => {
  let config = {
    headers: {
      'Authorization': `bearer ${user.token}`,
    }
  }

  const newBlog = {
    'title': blogName,
    'author': blogAuthor,
    'url': blogUrl
  }

  const response = await axios.post(baseUrl, newBlog, config)
  return response.data
}

const addLikeToBlog = async (user, blogObject) => {
  let config = {
    headers: {
      'Authorization': `bearer ${user.token}`,
    }
  }

  const updatedBlog = {
    ...blogObject,
    likes: blogObject.likes + 1
  }

  const response = await axios.put(baseUrl + '/' + blogObject.id, updatedBlog, config)
  return response.data
}

const deleteBlog = async (user, blogObject) => {
  let config = {
    headers: {
      'Authorization': `bearer ${user.token}`,
    }
  }

  if (window.confirm(`Remove blog '${blogObject.title}' by ${blogObject.author}`)) {
    await axios.delete(baseUrl + '/' + blogObject.id, config)
    return true
  }

  return false
}

export default { getAll, createNewBlog, addLikeToBlog, deleteBlog }