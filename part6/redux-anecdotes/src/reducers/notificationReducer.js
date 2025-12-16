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

// Thunk action creator for showing notification with timeout
export const showNotification = (message, duration = 5000) => {
  return async dispatch => {
    dispatch(setNotification(message))
    
    // Clear notification after specified duration
    setTimeout(() => {
      dispatch(clearNotification())
    }, duration)
  }
}

export default notificationSlice.reducer
