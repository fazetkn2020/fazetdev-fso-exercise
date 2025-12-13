const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/user')

const api = supertest(app)

const initialUsersArray = [
  {
    username: 'user1',
    name: 'First Test User',
    password: 'pass1'
  }
]

beforeAll(async () => {
  await mongoose.connect(process.env.TEST_MONGODB_URI)
  // console.log('connected to test db')
}, 30000) // 30 second timeout for connection

beforeEach(async () => {
  await User.deleteMany({})
  
  // Set up one user via the API
  await api.post('/api/users').send(initialUsersArray[0])
}, 10000) // 10 second timeout

describe('User Creation (POST /api/users)', () => {
  test('a completely valid new user can be created', async () => {
    const newUserObject = {
      username: 'new_valid_guy',
      name: 'New Valid Guy',
      password: 'mysecurepassword'
    }

    await api
      .post('/api/users')
      .send(newUserObject)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const allUsers = await api.get('/api/users')
    expect(allUsers.body).toHaveLength(initialUsersArray.length + 1)
  }, 10000)

  test('short username should fail gracefully with 400', async () => {
    const shortUsernameTest = {
      username: 'ab',
      name: 'Short Username Test',
      password: 'longpassword'
    }

    const response = await api
      .post('/api/users')
      .send(shortUsernameTest)
      .expect(400)

    expect(response.body.error).toContain('username')
  }, 10000)

  test('short password should fail with 400', async () => {
    const shortPasswordTest = {
      username: 'ok_username',
      name: 'Test',
      password: '12'
    }

    await api
      .post('/api/users')
      .send(shortPasswordTest)
      .expect(400)
  }, 10000)

  test('duplicate username must return 400', async () => {
    const response = await api
      .post('/api/users')
      .send(initialUsersArray[0])
      .expect(400)

    expect(response.body.error).toMatch(/taken|unique/i)
  }, 10000)
})

afterAll(async () => {
  await mongoose.connection.close()
})
