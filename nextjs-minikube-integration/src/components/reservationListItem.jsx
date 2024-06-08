import { Button } from '@nextui-org/react';
import Image from 'next/image';

const ReservationListItem = ( {reservation, cancelReservationModal, approveReservationModal, setChosenReservation } ) => {

  const timestampToDate = (unixTimestamp) => {
    const date = new Date(unixTimestamp * 1000);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  }

  const approveReservation = (id) => {
    setChosenReservation(id);
    approveReservationModal.onOpen();
  }

  const cancelReservation = (id) => {
    setChosenReservation(id);
    cancelReservationModal.onOpen();
  }

  return (
    <div key={reservation.accommodation.id} className="flex flex-row justify-between bg-white shadow-lg rounded-lg w-[800px] p-4 space-x-4 border border-gray-100">
      <div className="flex flex-row space-x-4">
        <div className="w-64 h-64 rounded-lg flex-shrink-0">
          <Image src="/apartment.webp" alt={reservation.accommodation.name} width={256} height={256} className="w-64 h-64 object-cover rounded-lg" />
        </div>
        <div className="h-64 flex flex-col">
          <div className="text-xl font-semibold">{reservation.accommodation.name}</div>
          <p className="text-gray-600">{reservation.accommodation.location.city}, {reservation.accommodation.location.country}</p>
          <p className="mt-4 text-gray-600">
            Guest: <span className='text-black'>{reservation.guestEmail}</span>
          </p>
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
        <div className='flex flex-row space-x-4'>
          <Button color='danger' onPress={() => cancelReservation(reservation.id)} >Cancel</Button>
          <Button color='primary' onPress={() => approveReservation(reservation.id)} >Approve</Button>
        </div>
      </div>
    </div>
  );
};
export default ReservationListItem;
