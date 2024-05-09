import dayjs from 'dayjs'
import { useRouter } from 'next/router'
import {  useState } from 'react'

import { Calendar } from '../../../../../components/Calendar'
import { api } from '../../../../../lib/axios'
import {
  Container,
  TimePicker,
  TimePickerHeader,
  TimePickerItem,
  TimePickerList,
} from './style'
import { useQuery } from '@tanstack/react-query'

interface Availability {
  possibleTimes: number[]
  availableTimes: number[]
}

export function CalendarStep() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

    const selectedDateWithoutTime = selectedDate ?  dayjs(selectedDate).format('YYYY-MM-DD') : null

  const {data: availability} = useQuery<Availability>({
    queryKey: ['availability', selectedDateWithoutTime],
    queryFn:  async () => {
      const response =  await  api.get(`/users/${username}/availability`, {
          params: {
            date: selectedDateWithoutTime,
          },
        })

        return response.data
    }, 
    enabled:  !!selectedDate
  })



  const router = useRouter()

  const isDateSelected = !!selectedDate

  const username = String(router.query.username)



  return (
    <Container isTimePickerOn={isDateSelected}>
      <Calendar selectedDate={selectedDate} onDateSelected={setSelectedDate} />
      {isDateSelected && (
        <TimePicker>
          <TimePickerHeader>
            terça-feira <span>20 de setembro</span>
          </TimePickerHeader>
          <TimePickerList>
            {availability?.possibleTimes.map((hour) => {
              return (
                <TimePickerItem
                  key={hour}
                  disabled={!availability?.availableTimes.includes(hour)}
                >
                  {String(hour).padStart(2, '0')}:00h
                </TimePickerItem>
              )
            })}
          </TimePickerList>
        </TimePicker>
      )}
    </Container>
  )
}
