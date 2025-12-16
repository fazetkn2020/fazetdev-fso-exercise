import { useSelector, useDispatch } from 'react-redux'
import { useState } from 'react'

const App = () => {
  const anecdotes = useSelector(state => state)
  const dispatch = useDispatch()
  
  // state for new anecdote input
  const [newAnecdote, setNewAnecdote] = useState('')

  const vote = id => {
    console.log('vote', id)
    // dispatch vote action with the id
    dispatch({
      type: 'VOTE',
      payload: { id: id }
    })
  }
  
  const handleSubmit = (event) => {
    event.preventDefault()
    
    // check if input is not empty
    if (newAnecdote.trim() === '') {
      return
    }
    
    // dispatch action to add new anecdote
    dispatch({
      type: 'NEW_ANECDOTE',
      payload: { content: newAnecdote }
    })
    
    // clear the input field
    setNewAnecdote('')
  }

  return (
    <div>
      <h2>Anecdotes</h2>
      {anecdotes.map(anecdote => (
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
