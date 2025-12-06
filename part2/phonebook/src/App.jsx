import { useState, useEffect } from 'react'
import axios from 'axios'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

  // Load initial data from server
  useEffect(() => {
    axios.get('http://localhost:3001/persons')
      .then(response => setPersons(response.data))
  }, [])

  const addPerson = (event) => {
    event.preventDefault()

    if (persons.find(p => p.name === newName)) {
      alert(`${newName} is already added to phonebook`)
      return
    }

    const personObject = { name: newName, number: newNumber }

    // Save to backend
    axios.post('http://localhost:3001/persons', personObject)
      .then(response => {
        setPersons(persons.concat(response.data))
        setNewName('')
        setNewNumber('')
      })
  }

  const personsToShow = filter === ''
    ? persons
    : persons.filter(p => p.name.toLowerCase().includes(filter.toLowerCase()))

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter filter={filter} handleFilterChange={(e) => setFilter(e.target.value)} />

      <h3>Add a new</h3>
      <PersonForm
        newName={newName}
        newNumber={newNumber}
        handleNameChange={(e) => setNewName(e.target.value)}
        handleNumberChange={(e) => setNewNumber(e.target.value)}
        handleSubmit={addPerson}
      />

      <h3>Numbers</h3>
      <Persons persons={personsToShow} />
    </div>
  )
}

export default App
