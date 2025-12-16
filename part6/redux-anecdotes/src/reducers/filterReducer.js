// Action creator for setting filter
export const setFilter = (filter) => {
  return {
    type: 'SET_FILTER',
    payload: { filter }
  }
}

// Reducer for filter state
const filterReducer = (state = '', action) => {
  switch (action.type) {
    case 'SET_FILTER':
      return action.payload.filter
    default:
      return state
  }
}

export default filterReducer
