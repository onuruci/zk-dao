import React from 'react'
import Tooltip from './Tooltip'

import User from '../contexts/User'


type Props = {
}

export default ({ }: Props) => {
  const userContext = React.useContext(User)
  const [remainingTime, setRemainingTime] = React.useState<number | string>(0)

  const updateTimer = () => {
    if (!userContext.userState) {
      setRemainingTime('Loading...')
      return
    }
    const time = userContext.userState.sync.calcEpochRemainingTime()
    setRemainingTime(time)
  }

  React.useEffect(() => {
    const timer = setInterval(() => {
      updateTimer()
    }, 1000)

    return () => clearTimeout(timer);
  }, [])

  return (
    <div>
      <div className="info-item">
        <h3>Epoch</h3>
        <Tooltip
          text={`An epoch is a unit of time, defined by the attester, with a state tree and epoch tree. User epoch keys are valid for 1 epoch before they change.`}
        />
      </div>
      <div className="info-item">
        <div>Current epoch #</div>
        <div className="stat">
          {userContext.userState?.sync.calcCurrentEpoch()}
        </div>
      </div>
      <div className="info-item">
        <div>Remaining time</div>
        <div className="stat">{remainingTime}</div>
      </div>
      <div className="info-item">
        <div>Latest transition epoch</div>
        <div className="stat">
          {userContext.latestTransitionedEpoch}
        </div>
      </div>
    </div>
  );
}
