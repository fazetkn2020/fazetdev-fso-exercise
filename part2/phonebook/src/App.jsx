const addPerson = (event) => {
  event.preventDefault()

  if (persons.find(p => p.name === newName)) {
    alert(newName + ' is already added to phonebook')
    return
  }

  const personObject = {
    name: newName,
    number: newNumber
  }

  setPersons(persons.concat(personObject))
  setNewName('')
  setNewNumber('')
}
