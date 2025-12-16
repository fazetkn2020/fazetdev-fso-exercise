import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { createAnecdote } from '../reducers/anecdoteReducer'
import { showNotification } from '../reducers/notificationReducer'

const AnecdoteForm = () => {
  const dispatch = useDispatch()
  const [newAnecdote, setNewAnecdote] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (newAnecdote.trim() === '') {
      return
    }

    // Dispatch create action
    dispatch(createAnecdote(newAnecdote))
    
    // Show notification for 5 seconds (using seconds parameter)
    dispatch(showNotification(`New anecdote created: "${newAnecdote}"`, 5))
    
    // Clear input field
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
