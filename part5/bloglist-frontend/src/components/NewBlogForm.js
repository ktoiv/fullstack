import { useState } from 'react'

const NewBlogForm = ({ addBlogCallback }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const [message, setMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  const handleNewBlog = async (event) => {
    event.preventDefault()

    try {
      const newBlog = await addBlogCallback(title, author, url)
      setTitle('')
      setAuthor('')
      setUrl('')

      setMessage(`a new blog '${newBlog.title} by ${newBlog.author} added'`)
      setTimeout(() => {
        setMessage(null)
      }, 5000)

    } catch (exception) {
      console.log(exception)
      setErrorMessage('Invalid blog data')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  return (
    <form onSubmit={handleNewBlog}>

      {
        message !== null && <h2>{message}</h2>
      }
      {
        errorMessage !== null && <h2>{errorMessage}</h2>
      }

      <div>
                title:
        <input
          type="text"
          value={title}
          name="title"
          onChange={({ target }) => setTitle(target.value)}
        />
      </div>
      <div>
                author:
        <input
          type="text"
          value={author}
          name="author"
          onChange={({ target }) => setAuthor(target.value)}
        />
      </div>
      <div>
                url:
        <input
          type="text"
          value={url}
          name="author"
          onChange={({ target }) => setUrl(target.value)}
        />
      </div>
      <button type="submit">create</button>
    </form>
  )
}

export default NewBlogForm