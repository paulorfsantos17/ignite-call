import dayjs from 'dayjs'
import { NextApiRequest, NextApiResponse } from 'next'

import { prisma } from '../../../../lib/prisma'

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'GET') {
    return res.status(405).end()
  }

  const username = String(req.query.username)
  const { date } = req.query

  if (!date) {
    return res.status(400).json({ message: 'Date not provided.' })
  }

  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  })

  if (!user) {
    return res.status(404).json({ message: 'User does not exist' })
  }

  const referenceDate = dayjs(String(date))

  const isPastDate = referenceDate.endOf('day').isBefore(new Date())

  if (isPastDate) {
    return res.json({
      possibleTimes: [],
      availableTimes: [],
    })
  }

  const userAvailability = await prisma.userTimeInterval.findFirst({
    where: {
      user_id: user.id,
      weekday: referenceDate.get('day'),
    },
  })

  if (!userAvailability) {
    return res.json({
      possibleTimes: [],
      availableTimes: [],
    })
  }

  const {
    time_start_in_minutes: startTimeInMinutes,
    time_end_in_minutes: endTimeInMinutes,
  } = userAvailability

  const startHour = startTimeInMinutes / 60
  const endHour = endTimeInMinutes / 60

  const possibleTimes = Array.from({
    length: endHour - startHour,
  }).map((_, i) => {
    return startHour + i
  })

  const blockedTimes = await prisma.scheduling.findMany({
    where: {
      user_id: user.id,
      date: {
        gte: referenceDate.set('hour', startHour).toDate(),
        lte: referenceDate.set('hour', endHour).toDate(),
      },
    },
  })

  const availableTimes = possibleTimes.filter((time) => {
    const isTimeBlocked = !blockedTimes.some(
      (blockedTimes) => blockedTimes.date.getHours() === time,
    )

    const isTimeIsPast = referenceDate.set('hour', time).isBefore(new Date())

    return isTimeBlocked && !isTimeIsPast
  })

  return res.json({
    possibleTimes,
    availableTimes,
  })
}
