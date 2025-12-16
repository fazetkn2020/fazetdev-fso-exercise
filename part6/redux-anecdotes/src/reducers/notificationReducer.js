import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: '',
  reducers: {
    setNotification(state, action) {
      return action.payload
    },
    clearNotification(state) {
      return ''
    }
  }
})

export const { setNotification, clearNotification } = notificationSlice.actions

let timeoutId = null

// Improved thunk action creator for showing notification
// Takes: message (string) and time in seconds (number)
export const showNotification = (message, seconds = 5) => {
  return async dispatch => {
    // Clear any previous timeout to avoid overlapping notifications
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    
    // Set new notification
    dispatch(setNotification(message))
    
    // Set timeout to clear notification (convert seconds to milliseconds)
    timeoutId = setTimeout(() => {
      dispatch(clearNotification())
      timeoutId = null
    }, seconds * 1000)
  }
}

export default notificationSlice.reducer
