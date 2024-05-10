// import dayjs from 'dayjs'
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
  const { year, month } = req.query

  if (!year || !month) {
    return res.status(400).json({ message: 'Year or Mother no specified.' })
  }

  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  })

  if (!user) {
    return res.status(404).json({ message: 'User does not exist' })
  }

  const availableWeekDays = await prisma.userTimeInterval.findMany({
    select: {
      weekday: true,
    },
    where: {
      user_id: user.id,
    },
  })

  const blockedWeekdays = [0, 1, 2, 3, 4, 5, 6].filter((weekDay) => {
    return !availableWeekDays.some(
      (availableWeekDay) => availableWeekDay.weekday === weekDay,
    )
  })

  const blockedDatesRaw: Array<{ date: number }> = await prisma.$queryRaw`
    SELECT 
      EXTRACT(DAY FROM  S.date) AS Date,
      SUBSTR(COUNT(S.date), -1, 1) AS amount,
      ((UTI.time_end_in_minutes - UTI.time_start_in_minutes) / '60n') AS size
    FROM schedulings S

    LEFT JOIN user_time_intervals UTI
      ON UTI.weekday = WEEKDAY(DATE_ADD(S.date, INTERVAL 1 DAY))
    WHERE S.user_id = ${user.id}
      AND DATE_FORMAT(S.date, "%Y-%m") =  ${`${year}-${month}`}
    GROUP BY EXTRACT(DAY FROM  S.date),
      ((UTI.time_end_in_minutes - UTI.time_start_in_minutes) / '60n')
    HAVING amount >= size
  `

  const blockedDates = blockedDatesRaw.map((blockedDate) => blockedDate.date)

  return res.json({ blockedWeekdays, blockedDates })
}
