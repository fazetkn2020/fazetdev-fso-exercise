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

  return (  
    <div>  
      <CourseInfo />  

      {/* 1.6+ starts here */}  
      <h1>give feedback</h1>  
      <button onClick={addGood}>good</button>  
      <button onClick={addNeutral}>neutral</button>  
      <button onClick={addBad}>bad</button>  

      
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>  
  )  
}  

export default App
