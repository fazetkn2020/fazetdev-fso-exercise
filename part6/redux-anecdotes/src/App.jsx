import { useSelector, useDispatch } from 'react-redux'
import { useState } from 'react'
import { voteAnecdote, createAnecdote } from './reducers/anecdoteReducer'

const App = () => {
  const anecdotes = useSelector(state => state)
  const dispatch = useDispatch()
  
  // state for new anecdote input
  const [newAnecdote, setNewAnecdote] = useState('')

  const vote = id => {
    console.log('vote', id)
    // use action creator instead of creating action object manually
    dispatch(voteAnecdote(id))
  }
  
  const handleSubmit = (event) => {
    event.preventDefault()
    
    // check if input is not empty
    if (newAnecdote.trim() === '') {
      return
    }
    
    // use action creator instead of creating action object manually
    dispatch(createAnecdote(newAnecdote))
    
    // clear the input field
    setNewAnecdote('')
  }
  
  // Sort anecdotes by votes (descending - most votes first)
  const sortedAnecdotes = [...anecdotes].sort((a, b) => b.votes - a.votes)

  return (
    <div>
      <h2>Anecdotes</h2>
      {sortedAnecdotes.map(anecdote => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote.id)}>vote</button>
          </div>
        </div>
      ))}
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

export default App
