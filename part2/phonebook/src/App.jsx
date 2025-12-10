import { useState, useEffect } from 'react'
import personService from './services/persons'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [message, setMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => setPersons(initialPersons))
  }, [])

  // --- addPerson rewritten for 3.9 student style ---
  const addPerson = (event) => {
    event.preventDefault()

    // simple duplicate check
    if (persons.some(p => p.name === newName)) {
      alert(`${newName} is already added to phonebook`)
      return
    }

    const personObject = {
      name: newName,
      number: newNumber
    }

    personService
      .create(personObject)
      .then(newPerson => {
        setPersons(persons.concat(newPerson))
        setNewName('')
        setNewNumber('')
      })
      .catch(error => {
        console.log(error)
      })
  }

  // --- delete handler added for 3.9 ---
  const handleDelete = (id) => {
    const person = persons.find(p => p.id === id)
    if (window.confirm(`Delete ${person?.name}?`)) {
      personService
        .remove(id)
        .then(() => {
          setPersons(persons.filter(p => p.id !== id))
        })
    }
  }

  const personsToShow =
    filter === ''
      ? persons
      : persons.filter(p =>
          p.name.toLowerCase().includes(filter.toLowerCase())
        )

  return (
    <div>
      <h2>Phonebook</h2>

      <Notification message={message} type="success" />
      <Notification message={errorMessage} type="error" />

      <div>
        filter shown with{' '}
        <input value={filter} onChange={e => setFilter(e.target.value)} />
      </div>

      <h3>add a new</h3>
      <form onSubmit={addPerson}>
        <div>
          name:{' '}
          <input value={newName} onChange={e => setNewName(e.target.value)} />
        </div>
        <div>
          number:{' '}
          <input
            value={newNumber}
            onChange={e => setNewNumber(e.target.value)}
          />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>

      <h3>Numbers</h3>
      {personsToShow.map(person => (
        <p key={person.id}>
          {person.name} {person.number}{' '}
          <button onClick={() => handleDelete(person.id)}>delete</button>
        </p>
      ))}
    </div>
  )
}

export default App
