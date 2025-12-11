import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import Person from './models/person.js'

const app = express()
app.use(cors())
app.use(express.json())
app.use(morgan('tiny'))

// GET all persons
app.get('/api/persons', (req, res) => {
  Person.find({}).then(people => res.json(people))
})

// GET one person
app.get('/api/persons/:id', (req, res) => {
  Person.findById(req.params.id)
    .then(person => {
      if (person) res.json(person)
      else res.status(404).end()
    })
    .catch(() => res.status(400).send({ error: 'malformatted id' }))
})

// POST new person
app.post('/api/persons', (req, res) => {
  const { name, number } = req.body
  if (!name || !number) return res.status(400).json({ error: 'name or number missing' })

  const person = new Person({ name, number })
  person.save()
    .then(saved => res.json(saved))
    .catch(err => res.status(400).json({ error: err.message }))
})

// DELETE person
app.delete('/api/persons/:id', (req, res) => {
  Person.findByIdAndRemove(req.params.id)
    .then(() => res.status(204).end())
    .catch(() => res.status(400).send({ error: 'malformatted id' }))
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
