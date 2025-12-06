import { useState, useEffect } from 'react'
import personService from './services/persons'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [message, setMessage] = useState(null)        // ← success message
  const [errorMessage, setErrorMessage] = useState(null) // ← error message

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => setPersons(initialPersons))
  }, [])

  const addPerson = (event) => {
    event.preventDefault()
    const existingPerson = persons.find(p => p.name === newName)

    if (existingPerson) {
      if (!window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        return
      }

      const updatedPerson = { ...existingPerson, number: newNumber }

      personService
        .update(existingPerson.id, updatedPerson)
        .then(returnedPerson => {
          setPersons(persons.map(p => p.id !== existingPerson.id ? p : returnedPerson))
          setMessage(`Updated ${newName}'s number`)
          setTimeout(() => setMessage(null), 5000)
          setNewName('')
          setNewNumber('')
        })
        .catch(error => {
          // This covers 404 (person already deleted) and validation errors
          setErrorMessage(
            error.response?.data?.error ||
            `Information of ${newName} has already been removed from server`
          )
          setTimeout(() => setErrorMessage(null), 5000)
          setPersons(persons.filter(p => p.id !== existingPerson.id))
        })

      return
    }

    // completely new person
    const personObject = { name: newName, number: newNumber }

    personService
      .create(personObject)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        setMessage(`Added ${newName}`)
        setTimeout(() => setMessage(null), 5000)
        setNewName('')
        setNewNumber('')
      })
      .catch(error => {
        setErrorMessage(error.response?.data?.error || 'Something went wrong')
        setTimeout(() => setErrorMessage(null), 5000)
      })
  }

  const personsToShow = filter === ''
    ? persons
    : persons.filter(p => p.name.toLowerCase().includes(filter.toLowerCase()))

  return (
    <div>
      <h2>Phonebook</h2>

      <Notification message={message} type="success" />
      <Notification message={errorMessage} type="error" />

      <div>
        filter shown with <input value={filter} onChange={e => setFilter(e.target.value)} />
      </div>

      <h3>add a new</h3>
      <form onSubmit={addPerson}>
        <div>name: <input value={newName} onChange={e => setNewName(e.target.value)} /></div>
        <div>number: <input value={newNumber} onChange={e => setNewNumber(e.target.value)} /></div>
        <div><button type="submit">add</button></div>
      </form>

      <h3>Numbers</h3>
      {personsToShow.map(person =>
        <p key={person.id}>
          {person.name} {person.number}
        </p>
      )}
    </div>
  )
}

export default App
