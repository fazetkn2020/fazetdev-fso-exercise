import { useSelector, useDispatch } from 'react-redux'
import { voteAnecdote } from '../reducers/anecdoteReducer'
import { showNotification } from '../reducers/notificationReducer'

const AnecdoteList = () => {
  const anecdotes = useSelector(state => state.anecdotes)
  const filter = useSelector(state => state.filter)
  const dispatch = useDispatch()

  const vote = async (id, content) => {
    console.log('vote', id)
    
    // Find the anecdote to get its content for notification
    const anecdoteToVote = anecdotes.find(a => a.id === id)
    if (!anecdoteToVote) return
    
    // Dispatch vote action
    dispatch(voteAnecdote(id))
    
    // Show notification
    dispatch(showNotification(`You voted for: "${anecdoteToVote.content}"`, 5000))
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
            <button onClick={() => vote(anecdote.id, anecdote.content)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default AnecdoteList
