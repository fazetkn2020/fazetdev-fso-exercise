const express = require('express')
const app = express()

app.use(express.json())

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
  res.send(`<div>Phonebook has info for ${total} people</div><div>${now.toString()}</div>`)
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(p => p.id === id)
  if (person) {
    res.json(person)
  } else {
    res.status(404).json({ error: 'Person not found' })
  }
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  if (persons.some(p => p.id === id)) {
    persons = persons.filter(p => p.id !== id)
    res.status(204).end()
  } else {
    res.status(404).end()
  }
})

app.post('/api/persons', (req, res) => {
  const { name, number } = req.body

  if (!name || !number) {
    return res.status(400).json({ error: 'name or number is missing' })
  }

  if (persons.some(p => p.name === name)) {
    return res.status(400).json({ error: 'name must be unique' })
  }

  const person = {
    id: Math.floor(Math.random() * 1000000),
    name,
    number
  }

  persons.push(person)
  res.status(201).json(person)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
