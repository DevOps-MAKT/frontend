
import { useState, useEffect } from 'react';
import PastReservationListItem from '@/components/pastReservationListItem';
import { get } from '@/utils/httpRequests';

const PastReservationsList = () => {
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await get('reservation', '/reservation/past-reservations');
        setReservations(response.data);
      } catch (error) {
        console.error('Failed to fetch resercations:', error.message);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="max-w-4xl w-full rounded flex flex-col items-center">
      {reservations.length === 0 ? (
      <div className="text-gray-300 py-8">You don&apos;t have any pending reservations.</div>
      ) : (
      <div className="flex flex-col items-center space-y-6 w-full">
      {reservations.map((reservation, index) => (
        <PastReservationListItem key={index} reservation={reservation} />
      ))}
      </div>
      )}

    </div>
  );
};
export default PastReservationsList;
