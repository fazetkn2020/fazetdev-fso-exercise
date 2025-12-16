const initialState = {
  good: 0,
  ok: 0,
  bad: 0
}

const counterReducer = (state = initialState, action) => {
  console.log(action)
  
  // Handle different action types
  switch (action.type) {
    case 'GOOD':
      // Increment good feedback
      return {
        ...state,
        good: state.good + 1
      }
    
    case 'OK':
      // Increment ok feedback  
      return {
        ...state,
        ok: state.ok + 1
      }
    
    case 'BAD':
      // Increment bad feedback
      return {
        ...state,
        bad: state.bad + 1
      }
    
    case 'RESET':
      // Reset all counters to zero
      return {
        good: 0,
        ok: 0,
        bad: 0
      }
    
    default:
      // Return current state for unknown actions
      return state
  }
}

export default counterReducer
