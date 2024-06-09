
import { useState, useEffect } from 'react';
import CancellableReservationListItem from '@/components/cancellableReservationListItem';
import ConfirmationModal from '@/components/confirmationModal';
import { useDisclosure } from '@nextui-org/react';
import { get, patch } from '@/utils/httpRequests';

const UpcomingGuestReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [chosenReservation, setChosenReservation] = useState();
  const modal = useDisclosure();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await get('reservation', '/reservation/active-reservations');
        setReservations(response.data);
      } catch (error) {
        console.error('Failed to fetch resercations:', error.message);
      }
    };
    fetchData();
  }, []);

  const removeReservation = (id) => {
    setReservations((prevReservations) =>
      prevReservations.filter((reservation) => reservation.id !== id)
    );
  };

  const handleCancelReservation = async (e) => {
    try {
      await patch('reservation', `/reservation/deactivate/${chosenReservation}`);
      removeReservation(chosenReservation);
      modal.onClose();
    } catch (error) {
      console.error('Reservation approval failed:', error.message);
    }
  };

  return (
    <div className="max-w-4xl w-full rounded flex flex-col items-center">
      {reservations.length === 0 ? (
      <div className="text-gray-300 py-8">You don&apos;t have any pending reservations.</div>
      ) : (
      <div className="flex flex-col items-center space-y-6 w-full">
      {reservations.map((reservation, index) => (
        <CancellableReservationListItem key={index} reservation={reservation} modal={modal} setChosenReservation={setChosenReservation} />
      ))}
      </div>
      )}
      
      <ConfirmationModal modalObject={modal} title="Warning" callback={handleCancelReservation} callbackStyle="danger" buttonContent="Cancel"
        message="Are you sure you want to cancel this reservation?" />

    </div>
  );
};
export default UpcomingGuestReservations;
