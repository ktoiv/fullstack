const Header = ({course}) => {
    return (
      <h1>{course}</h1>
    )
  }
  
  const Part = ({name, exercises}) => {
    return (
      <p>
      {name} {exercises}
    </p>
    )
  }
  
  const Content = ({parts}) => {
    return (
      <div>
        { parts.map(part => <Part key={part.name} name={part.name} exercises={part.exercises} />) }
      </div>
    )
  }
  
  
  const Total = ({parts}) => {
    return (
      <b>total number of exercises { parts.reduce((acc, curr) => acc + curr.exercises, 0) }</b>
    )
  }



  const Course = ({courseInfo}) => {
    return (
        <div>
            <Header course={courseInfo.name}/>
            <Content parts={courseInfo.parts}/>
            <Total parts={courseInfo.parts}/>
        </div>
    )
  }


export default Course