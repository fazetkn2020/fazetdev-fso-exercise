import mongoose from 'mongoose'

const url = 'mongodb+srv://fazetkn2020:kankarofi0@cluster0.9gsyh1v.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=Cluster0'

mongoose.connect(url)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log('Connection error:', err.message))

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

export default Person
