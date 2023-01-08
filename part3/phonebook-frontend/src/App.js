import { useEffect, useState } from 'react'
import * as apiClient from './api-client'
import './index.css'


const Notification = ({ message, error }) => {
  if (message === null) {
    return null
  }

  const className = error ? 'error' : 'success'

  return (
    <div className={className}>
      {message}
    </div>
  )
}

const PersonForm = ({ addPersonCallback }) => {
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')


  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const addPerson = (event) => {
    event.preventDefault()
    addPersonCallback(newName, newNumber)
    setNewName('')
    setNewNumber('')

  }

  return (
    <div>
      <h2>add a new number to the phonebook</h2>
      <form onSubmit={addPerson}>
        <div>
          name: <input
            value={newName}
            onChange={handleNameChange} />
        </div>
        <div>
          number: <input
            value={newNumber}
            onChange={handleNumberChange} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    </div>
  )
}


const PersonInfo = ({ name, number, handleDelete }) => {

  return (
    <div>
      <p>  {name} {number} <button onClick={handleDelete}>delete</button> </p>
    </div>
  )
}



const Filter = ({ setFilterStringCallback }) => {

  const [filterString, setFilterString] = useState('')


  const handleChange = (event) => {
    setFilterString(event.target.value)
    setFilterStringCallback(event.target.value)
  }

  return (
    <div>
      filter shown with: <input
        value={filterString}
        onChange={handleChange} />
    </div>
  )

}

const App = () => {
  const [persons, setPersons] = useState([])
  const [message, setMessage] = useState(null)

  const fetchPersons = () => {
    apiClient.getAll().then(persons => setPersons(persons))
  }

  useEffect(fetchPersons, [])

  const [filter, setFilter] = useState('')

  const filterCallback = (filterString) => {
    setFilter(filterString)
  }


  const nameExists = name => {
    return persons
      .map(person => person.name.toLowerCase())
      .includes(name.toLowerCase())
  }


  const deletePerson = (person) => {
    alert(`Delete ${person.name}?`)
    apiClient.deletePerson(person.id)
      .then(_ => fetchPersons())
      .catch(_ => {
        setMessage(`Information of ${person.name} has already been removed`)
        fetchPersons()

        setTimeout(() => setMessage(null), 3000)
      })
  }

  const addPerson = (name, number) => {

    if (nameExists(name)) {
      alert(`${name} is already added to phonebook, replace the old number with a new one?`)

      const personId = persons.filter(person => person.name.toLowerCase() === name.toLowerCase())[0].id

      apiClient.updatePerson({id: personId, name, number}).then(_ =>{
        setMessage(`Successfully updated number of ${name}`)
        fetchPersons()
      } ).catch(err => setMessage(err.response.data.error))


    } else {
      const person = { name, number }
      apiClient.createPerson(person).then(_ =>{
        setMessage(`Successfully added ${name}`)
        fetchPersons()
      }).catch(err => setMessage(err.response.data.error))
    }

    setTimeout(() => setMessage(null), 3000)
  }

  return (
    <div>
      <h2>Phonebook</h2>

      {message &&
        <Notification message={message} error={!message.includes('Successfully')}/>
      }

      <Filter setFilterStringCallback={filterCallback}/>
      <PersonForm addPersonCallback={addPerson} />

      <h2>Numbers</h2>
      {persons
        .filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))
        .map(person => <PersonInfo key={person.name} name={person.name} number={person.number} handleDelete={() => deletePerson(person)}/>)}
    </div>
  )
}

export default App