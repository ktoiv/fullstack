import { useState } from 'react'
import LoginService from '../services/login'

const LoginForm = ({ setUserCallback }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await LoginService.login({
        username, password,
      })
      setUserCallback(user)
      setUsername('')
      setPassword('')

      localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))
    } catch (exception) {
      setErrorMessage('Wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  return (
    <form onSubmit={handleLogin}>

      {
        errorMessage !== null && <h2>{errorMessage}</h2>
      }

      <div>
                username
        <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
                password
        <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>
  )
}

export default LoginForm