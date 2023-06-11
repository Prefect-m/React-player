import React from 'react'
import { ITimeProps } from './Time.props'
import styles from './Time.module.scss'

export const TimeElapsed = ({ elapsedSec, totalSec }: ITimeProps) => {
  const elapsedMinute = Math.floor(elapsedSec / 60)
  const elapsedSecond = Math.floor(elapsedSec % 60)
  const totalMinute = Math.floor(totalSec / 60)
  const totalSecond = Math.floor(totalSec % 60)
  return (
    <div className={styles.time}>
      <div>
        {elapsedMinute}:{elapsedSecond.toString().padStart(2, '0')} -
      </div>
      <div>
        {totalMinute}:{totalSecond}
      </div>
    </div>
  )
}
