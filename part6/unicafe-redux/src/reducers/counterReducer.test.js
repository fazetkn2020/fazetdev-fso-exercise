import deepFreeze from 'deep-freeze'
import { describe, expect, test } from 'vitest'
import counterReducer from './counterReducer'

describe('unicafe reducer', () => {
  const initialState = {
    good: 0,
    ok: 0,
    bad: 0
  }

  test('should return a proper initial state when called with undefined state', () => {
    const action = {
      type: 'DO_NOTHING'
    }

    const newState = counterReducer(undefined, action)
    expect(newState).toEqual(initialState)
  })

  test('good is incremented', () => {
    const action = {
      type: 'GOOD'
    }
    const state = initialState

    deepFreeze(state)
    const newState = counterReducer(state, action)
    expect(newState).toEqual({
      good: 1,
      ok: 0,
      bad: 0
    })
  })

  test('ok is incremented', () => {
    const action = {
      type: 'OK'
    }
    const state = initialState

    // Make sure state is immutable
    deepFreeze(state)
    
    const newState = counterReducer(state, action)
    expect(newState).toEqual({
      good: 0,
      ok: 1,
      bad: 0
    })
  })

  test('bad is incremented', () => {
    const action = {
      type: 'BAD'
    }
    const state = initialState

    // Freeze to test immutability
    deepFreeze(state)
    
    const newState = counterReducer(state, action)
    expect(newState).toEqual({
      good: 0,
      ok: 0,
      bad: 1
    })
  })

  test('reset returns initial state', () => {
    // First create a state with some values
    const stateWithValues = {
      good: 5,
      ok: 3,
      bad: 2
    }
    const action = {
      type: 'RESET'
    }

    // Test with non-zero state
    deepFreeze(stateWithValues)
    
    const newState = counterReducer(stateWithValues, action)
    expect(newState).toEqual(initialState)
  })

  test('multiple actions work correctly', () => {
    // Test sequence of actions
    let state = initialState
    const actions = [
      { type: 'GOOD' },
      { type: 'GOOD' },
      { type: 'BAD' },
      { type: 'OK' },
      { type: 'BAD' }
    ]

    // Apply each action
    actions.forEach(action => {
      state = counterReducer(state, action)
    })

    // Check final state
    expect(state).toEqual({
      good: 2,
      ok: 1,
      bad: 2
    })
  })
})
