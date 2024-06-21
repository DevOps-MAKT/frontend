
import { useState } from 'react';
import { post } from '@/utils/httpRequests';
import { parseDate } from "@internationalized/date";
import { Input, Button, DateRangePicker, useDisclosure } from '@nextui-org/react';
import InfoModal from "@/components/infoModal"

const Booking = ({ accommodation }) => {

  const [range, setRange] = useState();
  const [noGuests, setNoGuests] = useState();
  const modal = useDisclosure();

  const timestampToDate = (unixTimestamp) => {
    const date = new Date(unixTimestamp);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return parseDate(`${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`);
  }

  const dateToTimestamp = (calendarDate) => {
    const date = new Date(calendarDate.year, calendarDate.month - 1, calendarDate.day);
    const timestamp = Math.floor(date.getTime());
    return timestamp;
  }

  const availableRanges = accommodation.availabilityPeriods.map(date => ({
    startDate: timestampToDate(date.startDate),
    endDate: timestampToDate(date.endDate),
  }));

  const reservations = accommodation.reservations.map(reservation => ({
    startDate: timestampToDate(reservation.startDate),
    endDate: timestampToDate(reservation.endDate),
  }));

  let isDateUnavailable = (date) => {
    const isInAvailability = availableRanges.some(
      (interval) => date.compare(interval.startDate) >= 0 && date.compare(interval.endDate) <= 0,
    )
    const isInReservation = reservations.some(
      (interval) => date.compare(interval.startDate) >= 0 && date.compare(interval.endDate) <= 0,
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
    try {
      await post('reservation', `/reservation/create`, data);
      modal.onOpen();
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
      <InfoModal modalObject={modal} message="You have successfully requested a booking for this accommodation." title="Success" />
    </div>
  );
};
export default Booking;
