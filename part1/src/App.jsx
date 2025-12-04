import { useState } from 'react'  

const Header = (props) => {  
  return <h1>{props.course}</h1>  
}  

const Part = (props) => {  
  return <p>{props.part.name} {props.part.exercises}</p>  
}                                           
const Content = ({ parts }) => (            
  <>  
    {parts.map(part => (                        
      <Part key={part.name} part={part} />  
    ))}  
  </>  
)  

const Total = (props) => {  
  const total =  
    props.parts[0].exercises +  
    props.parts[1].exercises +  
    props.parts[2].exercises  

  return <p>Number of exercises {total}</p>  
}  

const CourseInfo = () => {  
  const course = 'Half Stack application development'  
  const parts = [  
    { name: 'Fundamentals of React', exercises: 10 },  
    { name: 'Using props to pass data', exercises: 7 },  
    { name: 'State of a component', exercises: 14 }  
  ]  

  return (  
    <div>  
      <Header course={course} />  
      <Content parts={parts} />  
      <Total parts={parts} />  
      <hr />  
    </div>  
  )  
} 

const StatisticLine = (props) => {
  return (
    <tr>
      <td>{props.text}</td>
      <td>{props.value}</td>
    </tr>
  )
}

const Statistics = ({ good, neutral, bad }) => {
  const all = good + neutral + bad

  if (all === 0) {
    return <p>No feedback given</p>
  }

  const average = (good - bad) / all
  const positive = (good / all) * 100

  return (
    <table>
      <tbody>
        <StatisticLine text="good" value={good} />
        <StatisticLine text="neutral" value={neutral} />
        <StatisticLine text="bad" value={bad} />
        <StatisticLine text="all" value={all} />
        <StatisticLine text="average" value={average} />
        <StatisticLine text="positive" value={positive + " %"} />
      </tbody>
    </table>
  )
}

const App = () => {
  
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const addGood = () => setGood(good + 1)
  const addNeutral = () => setNeutral(neutral + 1)
  const addBad = () => setBad(bad + 1)

  
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]

  const [selected, setSelected] = useState(0)

  const randomAnecdote = () => {
    const random = Math.floor(Math.random() * anecdotes.length)
    setSelected(random)
  }

  return (
    <div>
      {/* 1.1–1.5 */}
      <CourseInfo />
      <hr />

      {/* 1.6–1.11 Unicafe */}
      <h1>give feedback</h1>
      <button onClick={addGood}>good</button>
      <button onClick={addNeutral}>neutral</button>
      <button onClick={addBad}>bad</button>

      <h1>statistics</h1>
      <Statistics good={good} neutral={neutral} bad={bad} />
      <hr />

      {/* 1.12 Anecdotes */}
      <h1>Anecdote of the day</h1>
      <p>{anecdotes[selected]}</p>
      <button onClick={randomAnecdote}>next anecdote</button>
    </div>
  )
}

export default App
