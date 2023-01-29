


const UserInfo = ({ user, setUserCallback }) => {

  const handleLogout = () => {
    setUserCallback(null)
    localStorage.removeItem('loggedBlogAppUser')
  }

  return (
    <div>
      <p>{user.name} logged in</p>
      <button onClick={handleLogout}>Log out</button>
    </div>
  )
}

export default UserInfo