import { useState } from 'react'



const Button = ({text, onClickHandler}) => {
  return (
    <button onClick={onClickHandler}> {text} </button>

  )
}

const StatisticsLine = ({text, value}) => {

  return (
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  )
}

const Statistics = ({good, neutral, bad}) => {


  if (good === 0 && neutral === 0 && bad === 0) {
    return (
      <p>No feedback given</p>
    )
  }

  const all = good + neutral + bad
  const avg = ((good * 1) + (bad  * (-1))) / all
  const positive = (good / all) * 100


  return (
    <div>
      <h2>statistics</h2>
      <table>
        <tbody>
          <StatisticsLine text={"good"} value={good}/>
          <StatisticsLine text={"neutral"} value={neutral}/>
          <StatisticsLine text={"bad"} value={bad}/>
          <StatisticsLine text={"all"} value={all}/>
          <StatisticsLine text={"average"} value={avg.toFixed(1)}/>
          <StatisticsLine text={"positive"} value={positive.toFixed(1) + '%'}/>

        </tbody>
      </table>
    </div>
  )
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <h2>give feedback</h2>
      <Button text={"good"} onClickHandler={() => setGood(good + 1)}/>
      <Button text={"neutral"} onClickHandler={() => setNeutral(neutral + 1)}/>
      <Button text={"bad"} onClickHandler={() => setBad(bad + 1)}/>

      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App