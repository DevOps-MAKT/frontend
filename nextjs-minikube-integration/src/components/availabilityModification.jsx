
import { useState, useMemo, useEffect } from 'react';
import { post } from '@/utils/httpRequests';
import { parseDate } from "@internationalized/date";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Button, RangeCalendar, Input } from '@nextui-org/react';
import { PlusIcon } from "@/icons/plus";
import { TrashIcon } from "@/icons/trash";

const AvailabilityModification = ({ accommodation }) => {

  const formatDate = (date) => {
    return `${date.year}-${String(date.month).padStart(2, '0')}-${String(date.day).padStart(2, '0')}`;
  }

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

  const [availabilities, setAvailabilities] = useState(
    accommodation.availabilityPeriods.map(date => ({
      id: date.id,
      startDate: timestampToDate(date.startDate),
      endDate: timestampToDate(date.endDate),
      specialAccommodationPricePeriods: date.specialAccommodationPricePeriods,
    }))
  );

  const [newRange, setNewRange] = useState();
  const [newPrice, setNewPrice] = useState();
  const [specialPrices, setSpecialPrices] = useState([]);
  const [selectedAvailability, setSelectedAvailability] = useState(null);
  const [selectedAvailabilityId, setSelectedAvailabilityId] = useState(null);

  const isBetween = (date, start, end) => {
    return date.compare(start) >= 0 && date.compare(end) <= 0;
  }

  let isDateUnavailable = (date) => {
    if (selectedAvailability === null) return true;
  
    const isWithinSelectedAvailability = isBetween(date, selectedAvailability.startDate, selectedAvailability.endDate);
    if (!isWithinSelectedAvailability) return true;
  
    const isWithinSpecialPrices = specialPrices.some(
      (interval) => isBetween(date, timestampToDate(interval.startDate), timestampToDate(interval.endDate))
    );
    return isWithinSpecialPrices;
  };

  useEffect(() => {
    if (selectedAvailabilityId !== null) {
      const availability = availabilities.find(a => a.id === selectedAvailabilityId);
      setSelectedAvailability(availability);
      if (availability) {
        setSpecialPrices(availability.specialAccommodationPricePeriods);
      }
    }
  }, [selectedAvailabilityId]);

  const handleRowClick = (id) => {
    setSelectedAvailabilityId(id);
  };

  const handleAddRange = async (e) => {
    e.preventDefault();
    const newSpecialPrice = {
      startDate: dateToTimestamp(newRange.start),
      endDate: dateToTimestamp(newRange.end),
      price: newPrice,
    }
    const data = {
      isAvailabilityPeriodBeingUpdated: true,
      availabilityPeriod: {
        id: selectedAvailability.id,
        startDate: dateToTimestamp(selectedAvailability.startDate),
        endDate: dateToTimestamp(selectedAvailability.endDate),
        accommodationId: accommodation.id,
        specialAccommodationPricePeriods: [...specialPrices, {
          startDate: dateToTimestamp(newRange.start),
          endDate: dateToTimestamp(newRange.end),
          price: newPrice,
        }],
      }
    }
    try {
      setSpecialPrices(prevRanges => [...prevRanges, newSpecialPrice]);
      await post('accommodation', `/accommodation/change-availability-info`, data);
    } catch (error) {
      console.error('Failed to add availability period:', error.message);
    }
  };

  const priceContent = useMemo(() => {
    return (
      <form className="flex" onSubmit={handleAddRange}>
        <Input
          aria-label="Price"
          type="number"
          min={0}
          name="price"
          placeholder="Price"
          value={newPrice}
          onValueChange={setNewPrice}
          className="w-36 mr-4"
          required
        />
        <Button color="primary" type="submit" className='min-h-10' >
          <PlusIcon /> Add special price
        </Button>
      </form>
    );
  }, [newRange, setNewRange, newPrice, setNewPrice]);

  return (
    <div className="w-full">
      <div className="grid grid-cols-2 gap-4">

        <Table
          isHeaderSticky
          color="primary"
          selectionMode="single"
          defaultSelectedKeys={[]}
          aria-label="Availability periods"
          classNames={{
            base: "max-h-[325px] col-span-2",
          }}
        >
          <TableHeader>
            <TableColumn>Start date</TableColumn>
            <TableColumn>End date</TableColumn>
          </TableHeader>
          <TableBody emptyContent={"No availability periods to display."} items={availabilities}>
            {(item) => (
              <TableRow key={item.id}
              selected={selectedAvailability && selectedAvailability.id === item.id}
              onClick={() => handleRowClick(item.id)}
              >
                <TableCell>{formatDate(item.startDate)}</TableCell>
                <TableCell>{formatDate(item.endDate)}</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <RangeCalendar
          aria-label="Date"
          value={newRange}
          onChange={setNewRange}
          isDateUnavailable={isDateUnavailable}
        />

        <Table
          isHeaderSticky
          color="primary"
          aria-label="Special prices"
          topContentPlacement="outside"
          topContent={priceContent}
          classNames={{
            base: "max-h-[325px]",
          }}
        >
          <TableHeader>
            <TableColumn>Start date</TableColumn>
            <TableColumn>End date</TableColumn>
            <TableColumn>Price</TableColumn>
          </TableHeader>
          <TableBody emptyContent={"No special prices to display."} items={specialPrices}>
            {(item) => (
              <TableRow key={`${formatDate(timestampToDate(item.startDate))}-${formatDate(timestampToDate(item.endDate))}`}>
                <TableCell>{formatDate(timestampToDate(item.startDate))}</TableCell>
                <TableCell>{formatDate(timestampToDate(item.endDate))}</TableCell>
                <TableCell>{item.price}</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>


      </div>
    </div>
  );
};
export default AvailabilityModification;
