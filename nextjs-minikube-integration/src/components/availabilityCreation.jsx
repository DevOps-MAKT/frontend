
import { useState, useMemo } from 'react';
import { post } from '@/utils/httpRequests';
import { parseDate } from "@internationalized/date";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Button, RangeCalendar } from '@nextui-org/react';
import { PlusIcon } from "@/icons/plus";

const AvailabilityCreation = ({ accommodation }) => {

  const formatDate = (date) => {
    return `${date.year}-${String(date.month).padStart(2, '0')}-${String(date.day).padStart(2, '0')}`
  }

  const timestampToDate = (unixTimestamp) => {
    const date = new Date(unixTimestamp * 1000);
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

  const [range, setRange] = useState();

  const [availableRanges, setAvailableRanges] = useState(
    accommodation.availabilityPeriods.map( date => ({
      start: timestampToDate(date.startDate),
      end: timestampToDate(date.endDate),
    }))
  );

  let isDateUnavailable = (date) =>
    availableRanges.some(
      (interval) => date.compare(interval.start) >= 0 && date.compare(interval.end) <= 0,
    );

  const handleAddRange = async () => {
    const data = {
      isAvailabilityPeriodBeingUpdated: false,
      availabilityPeriod: {
        id: 0,
        startDate: dateToTimestamp(range.start),
        endDate: dateToTimestamp(range.end),
        accommodationId: accommodation.id,
        specialAccommodationPricePeriods: [],
      }
    }
    try {
      setAvailableRanges(prevRanges => [...prevRanges, range]);
      await post('accommodation', `/accommodation/change-availability-info`, data);
    } catch (error) {
      console.error('Failed to add availability period:', error.message);
    }
  };

  const bottomContent = useMemo(() => {
    return (
      <Button color="primary" className='min-h-10' onPress={handleAddRange} disabled={range === null} >
        <PlusIcon /> Add availability period
      </Button>
    );
  }, [range, setRange]);

  return (
    <div className="w-full">
      <div className="grid grid-cols-2 gap-4">

        <RangeCalendar
          aria-label="Date"
          value={range} 
          onChange={setRange} 
          isDateUnavailable={isDateUnavailable}
        />

        <Table
          isHeaderSticky
          color="primary"
          selectionMode="single"
          defaultSelectedKeys={[]}
          aria-label="Availability periods"
          topContent={bottomContent}
          topContentPlacement="outside"
          classNames={{
            base: "max-h-[325px]",
          }}
        >
          <TableHeader>
            <TableColumn>Start date</TableColumn>
            <TableColumn>End date</TableColumn>
          </TableHeader>
          <TableBody emptyContent={"No availability periods to display."} items={availableRanges}>
            {(item) => (
              <TableRow key={`${formatDate(item.start)}-${formatDate(item.end)}`}>
                <TableCell>{formatDate(item.start)}</TableCell>
                <TableCell>{formatDate(item.end)}</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

      </div>
    </div>
  );
};
export default AvailabilityCreation;
