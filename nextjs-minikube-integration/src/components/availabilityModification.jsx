
import React, { useState, useEffect } from 'react';
import { patch } from '@/utils/httpRequests';
import { parseDate } from "@internationalized/date";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Tooltip, Input, Checkbox, Button, RangeCalendar } from '@nextui-org/react';
import { TrashIcon } from "@/icons/trash";
import { PlusIcon } from "@/icons/plus";
import { today, getLocalTimeZone } from "@internationalized/date";

const AvailabilityModification = ({ accommodation }) => {

  let [newAvailability, setNewAvailability] = useState({
    start: today(getLocalTimeZone()),
    end: today(getLocalTimeZone()),
  });
  const [availableRanges, setAvailableRanges] = useState([]);
  const [price, setPrice] = useState(accommodation.price);
  const [pricePerGuest, setPricePerGuest] = useState(accommodation.pricePerGuest);


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

  const handleChangePrice = async (e) => {
    const data = {
      accommodationId: accommodation.id,
      price: price,
      pricePerGuest: pricePerGuest,
    }
    try {
      const response = await patch('accommodation', `/accommodation/update-price-info`, data);
    } catch (error) {
      console.error('Failed to change price:', error.message);
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
            <TableColumn></TableColumn>
          </TableHeader>
          <TableBody emptyContent={"No availability periods to display."} items={availableRanges}>
            {(item) => (
              <TableRow key={`${formatDate(item.start)}-${formatDate(item.end)}`}>
                <TableCell>{formatDate(item.start)}</TableCell>
                <TableCell>{formatDate(item.end)}</TableCell>
                <TableCell>
                  <Tooltip color="danger" content="Delete user">
                    <span className="text-lg text-danger cursor-pointer active:opacity-50">
                      <TrashIcon />
                    </span>
                  </Tooltip>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <Input type="number"
          min="0"
          className="col-span-2"
          label="Price"
          id="price"
          name="price"
          value={price}
          onValueChange={setPrice} />

        <Checkbox className="col-span-2" isSelected={pricePerGuest} onValueChange={setPricePerGuest}>Price per guest</Checkbox>

        <Button color="primary" className="col-span-2 my-auto" onPress={handleChangePrice} >
          Save price
        </Button>

      </div>
    </div>
  );
};
export default AvailabilityModification;
