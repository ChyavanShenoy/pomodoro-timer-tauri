import {useState, useEffect} from 'react'
import {Button, Text, Flex} from '@chakra-ui/react' 
import { sendNotification } from "@tauri-apps/api/notification";
import { ask } from "@tauri-apps/api/dialog";
import { Input } from '@chakra-ui/react'

function App() {

  const [time, setTime] = useState(900)
  const [timerStart, setTimerStart] = useState(false)
  const timerButtons = [
    {value: 900, display: '15 min'},
    {value: 1800, display: '30 min'},
    {value: 2700, display: '45 min'},
    {value: 3600, display: '1 hr'},
    {value: 5400, display: '1.5 hr'},
    {value: 7200, display: '2 hr'},
  ]
  const toggleTimer = () => {
    setTimerStart(!timerStart)
  }
  useEffect(() => {
    const interval = setInterval(() => {
      if (timerStart) {
        if (time > 0) {
          setTime(time - 1)
        } else if (time === 0) {
          sendNotification({
            title: "Timer Complete",
            body: "Your timer has completed",
          })
          clearInterval(interval)
        }
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [timerStart, time])
  const triggerResetDialog = async () => {
    let shouldReset = await ask("Do you want to reset the timer?", {title: "Pomodoro Timer App", type: 'warning'});
    if (shouldReset) {
      setTime(900);
      setTimerStart(false);
    }
  }
  const manualTimeChange = (e: any) => {
    setTime(e.target.value)
  }
  return (
    <div className="App" style={{ height: "100vh" }}>
      {/* <Flex background="#C8A2C8" */}

      <Flex background="gray.700"
        height="100%"
        alignItems="center"
        flexDirection="column">
          <Text color="white" fontWeight="bold" marginTop="20" fontSize="35">
          Pomodoro Timer
        </Text>
        <Text fontWeight="bold" fontSize="7xl" color="white">
          {`${
            Math.floor(time / 60) < 10
              ? `0${Math.floor(time / 60)}`
              : `${Math.floor(time / 60)}`
          }:${time % 60 < 10 ? `0${time % 60}` : time % 60}`}
        </Text>
        <Flex>
          {!timerStart ? <Button width="7rem" background="green.300" color="white" onClick={toggleTimer}>Start</Button> : <Button width="7rem" background="tomato" color="white" onClick={toggleTimer}>Stop</Button>}
          <Button background="yellow.300" marginX={5} onClick={triggerResetDialog}>
            Reset
          </Button>
        </Flex>
        <Flex marginTop={10}>
          {timerButtons.map(({ value, display }) => (
            <Button
              marginX={4}
              background="blue.500"
              color="white"
              onClick={() => {
                setTimerStart(false);
                setTime(value);
              }}
            >
              {display}
            </Button>
          ))}
        </Flex>
        <Flex marginTop={10} alignItems="center">
          <Text color="white" marginX={5}>Custom timer: </Text>
          <Input placeholder="Enter your timer" variant='filled' color='white' onChange={manualTimeChange} width="10rem"/>
        </Flex>
        <Text color="white" marginTop={10} fontSize="sm">Numbers are converted to Minutes and Seconds</Text>
      </Flex>
    </div>
  )
}

export default App