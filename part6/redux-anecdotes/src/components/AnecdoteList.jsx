import { useSelector, useDispatch } from 'react-redux'
import { voteAnecdote } from '../reducers/anecdoteReducer'
import { showNotification } from '../reducers/notificationReducer'

const AnecdoteList = () => {
  const anecdotes = useSelector(state => state.anecdotes)
  const filter = useSelector(state => state.filter)
  const dispatch = useDispatch()

  const handleVote = async (anecdote) => {
    console.log('vote', anecdote.id)
    
    // Dispatch vote thunk (sends to backend)
    dispatch(voteAnecdote(anecdote))
    
    // Show notification for 5 seconds (using seconds parameter)
    dispatch(showNotification(`You voted for: "${anecdote.content}"`, 5))
  }
  
  // Filter anecdotes based on filter text
  const filteredAnecdotes = anecdotes.filter(anecdote =>
    anecdote.content.toLowerCase().includes(filter.toLowerCase())
  )
  
  // Sort filtered anecdotes by votes (descending - most votes first)
  const sortedAnecdotes = [...filteredAnecdotes].sort((a, b) => b.votes - a.votes)

  return (
    <div>
      {sortedAnecdotes.map(anecdote => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default AnecdoteList
