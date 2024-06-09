
import { useState, useMemo } from 'react';
import { post } from '@/utils/httpRequests';
import { parseDate } from "@internationalized/date";
import { Input, Button, DateRangePicker } from '@nextui-org/react';

const Booking = ({ accommodation }) => {

  const [range, setRange] = useState();
  const [noGuests, setNoGuests] = useState();

  const timestampToDate = (unixTimestamp) => {
    const date = new Date(unixTimestamp);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return parseDate(`${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`);
  }

  const dateToTimestamp = (calendarDate) => {
    const date = new Date(calendarDate.year, calendarDate.month - 1, calendarDate.day);
    const timestamp = Math.floor(date.getTime() / 1000);
    return timestamp;
  }

  const [availableRanges, setAvailableRanges] = useState(
    accommodation.availabilityPeriods.map(date => ({
      start: timestampToDate(date.startDate),
      end: timestampToDate(date.endDate),
    }))
  );

  const [reservations, setReservations] = useState(
    accommodation.reservations.map(reservation => ({
      start: timestampToDate(reservation.startDate),
      end: timestampToDate(reservation.endDate),
    }))
  );

  let isDateUnavailable = (date) => {
    const isInAvailability = availableRanges.some(
      (interval) => date.compare(interval.start) >= 0 && date.compare(interval.end) <= 0,
    )
    const isInReservation = reservations.some(
      (interval) => date.compare(interval.start) >= 0 && date.compare(interval.end) <= 0,
    )
    return !isInAvailability || isInReservation;
  };

  const handleBook = async () => {
    const data = {
      accommodationId: accommodation.id,
      hostEmail: accommodation.hostEmail,
      startDate: dateToTimestamp(range.start),
      endDate: dateToTimestamp(range.end),
      noGuests: noGuests,
    };
    console.log(data)
    return;
    try {
      await post('reservation', `/reservation/create`, data);
    } catch (error) {
      console.error('Failed to make a reservation:', error.message);
    }
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-2 gap-4">

        <DateRangePicker
          label="Date range"
          value={range}
          onChange={setRange}
          isDateUnavailable={isDateUnavailable}
        />

        <Input
          label="Number of guests"
          type="number"
          placeholder="0"
          min={accommodation.minimumNoGuests}
          max={accommodation.maximumNoGuests}
          name="noGuests"
          value={noGuests}
          onValueChange={setNoGuests}
        />

        <div className="col-span-2 flex align-items-end justify-end">
          <Button color="primary" className="my-auto" onPress={handleBook} >
            Book
          </Button>
        </div>

      </div>
    </div>
  );
};
export default Booking;
