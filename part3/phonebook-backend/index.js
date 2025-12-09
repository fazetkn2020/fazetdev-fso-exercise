const express = require('express')
const morgan = require('morgan')
const app = express()

app.use(express.json())

morgan.token('body', (req) => req.method === 'POST' ? JSON.stringify(req.body) : ' ')
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

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
    res.send(`
        <p>Phonebook has info for ${persons.length} people</p>
        <p>Server Time: ${new Date()}</p>
    `)
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

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(person => person.id !== id) 
  res.status(204).end()
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
