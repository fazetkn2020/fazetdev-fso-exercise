import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { createAnecdote } from '../reducers/anecdoteReducer'

const AnecdoteForm = () => {
  const dispatch = useDispatch()
  const [newAnecdote, setNewAnecdote] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()

    // check if input is not empty
    if (newAnecdote.trim() === '') {
      return
    }

    // dispatch action to add new anecdote
    dispatch(createAnecdote(newAnecdote))

    // clear the input field
    setNewAnecdote('')
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            value={newAnecdote}
            onChange={(e) => setNewAnecdote(e.target.value)}
          />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
