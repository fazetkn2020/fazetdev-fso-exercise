import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import Person from './models/person.js'

const app = express()
app.use(cors())
app.use(express.json())
app.use(morgan('tiny'))

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
app.use(express.static(path.join(__dirname, 'build')))

app.get('/api/persons', async (req, res, next) => {
  try {
    const people = await Person.find({})
    res.json(people)
  } catch (error) {
    next(error)
  }
})

app.get('/api/persons/:id', async (req, res, next) => {
  try {
    const person = await Person.findById(req.params.id)
    if (person) res.json(person)
    else res.status(404).end()
  } catch (error) {
    next(error)
  }
})

app.post('/api/persons', async (req, res, next) => {
  const { name, number } = req.body
  if (!name || !number) return res.status(400).json({ error: 'name or number missing' })

  const person = new Person({ name, number })
  try {
    const saved = await person.save()
    res.status(201).json(saved)
  } catch (error) {
    next(error)
  }
})

app.put('/api/persons/:id', async (req, res, next) => {
  const { name, number } = req.body
  if (!name || !number) return res.status(400).json({ error: 'name or number missing' })

  try {
    const updated = await Person.findByIdAndUpdate(
      req.params.id,
      { name, number },
      { new: true, runValidators: true, context: 'query' }
    )
    if (updated) res.json(updated)
    else res.status(404).end()
  } catch (error) {
    next(error)
  }
})

app.delete('/api/persons/:id', async (req, res, next) => {
  try {
    await Person.findByIdAndRemove(req.params.id)
    res.status(204).end()
  } catch (error) {
    next(error)
  }
})


app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'))
})

app.use((error, req, res, next) => {
  if (error.name === 'CastError') return res.status(400).json({ error: 'malformatted id' })
  if (error.name === 'ValidationError') return res.status(400).json({ error: error.message })
  next(error)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
