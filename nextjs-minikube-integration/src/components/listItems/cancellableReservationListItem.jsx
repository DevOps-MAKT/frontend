import { Button, Link } from '@nextui-org/react';
import Image from 'next/image';

const CancellableReservationListItem = ( {reservation, modal, setChosenReservation } ) => {

  const timestampToDate = (unixTimestamp) => {
    const date = new Date(unixTimestamp);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  }

  const cancelReservation = (id) => {
    setChosenReservation(id);
    modal.onOpen();
  }

  return (
    <div key={reservation.accommodation.id} className="flex flex-row justify-between bg-white shadow-lg rounded-lg w-[800px] p-4 space-x-4 border border-gray-100">
      <div className="flex flex-row space-x-4">
        <div className="w-64 h-64 rounded-lg flex-shrink-0">
          <Link href={`accommodation/${reservation.accommodation.id}`}><Image src="/apartment.webp" alt={reservation.accommodation.name} width={256} height={256} className="w-64 h-64 object-cover rounded-lg" /></Link>
        </div>
        <div className="h-64 flex flex-col">
          <div className="text-xl font-semibold">{reservation.accommodation.name}</div>
          <p className="text-gray-600">{reservation.accommodation.location.city}, {reservation.accommodation.location.country}</p>
          <p className="mt-4 text-gray-600">
            Number of guests: <span className='text-black'>{reservation.noGuests}</span>
          </p>
          <p className="mt-4 text-gray-600">
            From: <span className='text-black'>{timestampToDate(reservation.startDate)}</span><br/>
            To: <span className='text-black'>{timestampToDate(reservation.endDate)}</span>
          </p>
          
        </div>
      </div>
      <div className="h-64 flex flex-col justify-end items-end">
          <Button color='danger' onPress={() => cancelReservation(reservation.id)} >Cancel</Button>
      </div>
    </div>
  );
};
export default CancellableReservationListItem;
