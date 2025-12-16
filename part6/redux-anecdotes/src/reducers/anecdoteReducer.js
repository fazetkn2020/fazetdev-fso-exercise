import { createSlice } from '@reduxjs/toolkit'

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    voteAnecdote(state, action) {
      const id = action.payload
      const anecdoteToChange = state.find(a => a.id === id)
      if (anecdoteToChange) {
        anecdoteToChange.votes += 1
      }
    },
    appendAnecdote(state, action) {
      state.push(action.payload)
    },
    setAnecdotes(state, action) {
      return action.payload
    }
  }
})

export const { voteAnecdote, appendAnecdote, setAnecdotes } = anecdoteSlice.actions

// Thunk action creator to fetch anecdotes from backend
export const initializeAnecdotes = () => {
  return async dispatch => {
    try {
      const response = await fetch('http://localhost:3001/anecdotes')
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const anecdotes = await response.json()
      dispatch(setAnecdotes(anecdotes))
    } catch (error) {
      console.error('Error fetching anecdotes:', error)
    }
  }
}

// Thunk action creator to create new anecdote in backend
export const createAnecdote = (content) => {
  return async dispatch => {
    try {
      const newAnecdote = {
        content,
        votes: 0
      }
      
      const response = await fetch('http://localhost:3001/anecdotes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newAnecdote)
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const createdAnecdote = await response.json()
      dispatch(appendAnecdote(createdAnecdote))
      return createdAnecdote
      
    } catch (error) {
      console.error('Error creating anecdote:', error)
      throw error
    }
  }
}

export default anecdoteSlice.reducer
