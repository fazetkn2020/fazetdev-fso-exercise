const Header = (props) => <h1>{props.name}</h1>

const Part = (props) => (
  <p>
    {props.part.name} {props.part.exercises}
  </p>
)

const Content = (props) => (
  <div>
    {props.parts.map(part => (
      <Part key={part.id} part={part} />
    ))}
  </div>
)

const Total = ({ parts }) => {
  const total = parts.reduce((sum, part) => sum + part.exercises, 0)
  return <p>Total number of exercises: {total}</p>
}

const Course = (props) => (
  <div>
    <Header name={props.course.name} />
    <Content parts={props.course.parts} />
    <Total parts={props.course.parts} />
  </div>
)
