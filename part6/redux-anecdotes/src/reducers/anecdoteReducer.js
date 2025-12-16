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
    createAnecdote(state, action) {
      const content = action.payload
      state.push({
        content,
        id: (100000 * Math.random()).toFixed(0),
        votes: 0
      })
    },
    setAnecdotes(state, action) {
      return action.payload
    }
  }
})

export const { voteAnecdote, createAnecdote, setAnecdotes } = anecdoteSlice.actions

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

export default anecdoteSlice.reducer
