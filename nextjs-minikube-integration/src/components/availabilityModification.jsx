
import React, { useState } from 'react';
import { patch } from '@/utils/httpRequests';
import { parseDate } from "@internationalized/date";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Button, RangeCalendar } from '@nextui-org/react';
import { PlusIcon } from "@/icons/plus";
import { today, getLocalTimeZone } from "@internationalized/date";

const AvailabilityModification = ({ accommodation }) => {

  let [newAvailability, setNewAvailability] = useState({
    start: today(getLocalTimeZone()),
    end: today(getLocalTimeZone()),
  });
  const [availableRanges, setAvailableRanges] = useState(accommodation.availabilityPeriods);


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
    const timestamp = Math.floor(date.getTime());
    return timestamp;
  }

  let isDateUnavailable = (date) =>
    availableRanges.some(
      (interval) => date.compare(interval.start) >= 0 && date.compare(interval.end) <= 0,
    );

  const handleAddRange = async () => {
    const newRange = { start: newAvailability.start, end: newAvailability.end };
    setAvailableRanges(prevRanges => [...prevRanges, newRange]);
    const data = {

    }
    try {
      const response = await patch('accommodation', `/accommodation/add-availability`, data);
      window.location.reload();
    } catch (error) {
      console.error('Failed to add availability period:', error.message);
    }
  };

  const bottomContent = React.useMemo(() => {
    return (
      <Button color="primary" onPress={handleAddRange} >
        <PlusIcon /> Add availability period
      </Button>
    );
  }, []);

  return (
    <div className="w-full">
      <div className="grid grid-cols-6 gap-4">

        <RangeCalendar
          className="col-span-3"
          aria-label="Date "
          onChange={setNewAvailability}
          value={newAvailability}
          isDateUnavailable={isDateUnavailable}
        />

        <Table
          className="col-span-3"
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
export default AvailabilityModification;
