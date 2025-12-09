const express = require('express')
const app = express()

// for db
let persons = [
  { id: 1, name: 'Arto Hellas', number: '040-123456' },
  { id: 2, name: 'Ada Lovelace', number: '39-44-5323523' },
  { id: 3, name: 'Dan Abramov', number: '12-43-234345' },
  { id: 4, name: 'Mary Poppendieck', number: '39-23-6423122' }
]

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/info', (req, res) => {
  const total = persons.length
  const now = new Date()
  
  res.send(`
    <div>Phonebook has info for ${total} people</div>
    <div>${now.toString()}</div>
  `)
})


app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(p => p.id === id)
  
  if (person) {
    res.json(person)
  } else {
    res.status(404).send({ error: 'no such person, sorry mate' })
    
  }
})

// deleteing person
app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  
  if (persons.some(p => p.id === id)) {
    persons = persons.filter(p => p.id !== id)
    res.status(204).end()  // gone, no body, perfect
  } else {
    res.status(404).end()
  }
})

// nwver change this
const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server up and running on port ${PORT} 🚀`)
  console.log(`http://localhost:${PORT}`)
})
