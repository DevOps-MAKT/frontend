
import { useState, useEffect } from 'react';
import ReservationListItem from '@/components/reservationListItem';
import ConfirmationModal from '@/components/confirmationModal';
import { useDisclosure } from '@nextui-org/react';
import { get, patch } from '@/utils/httpRequests';

const UpcomingHostReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [chosenReservation, setChosenReservation] = useState();
  const cancelReservationModal = useDisclosure();
  const approveReservationModal = useDisclosure();

  const mapAccommodations = (acc, res) => {
    const accommodationMap = new Map();
    acc.forEach(accommodation => {
        accommodationMap.set(accommodation.id, accommodation);
    });
    res.forEach(reservation => {
        if (accommodationMap.has(reservation.accommodationId)) {
            reservation.accommodation = accommodationMap.get(reservation.accommodationId);
            delete reservation.accommodationId;
        }
    });
    return res;
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accResponse = await get('accommodation', '/accommodation/my-accommodations');
        const resResponse = await get('reservation', '/reservation/requested-reservations');
        setReservations(mapAccommodations(accResponse.data, resResponse.data));
      } catch (error) {
        console.error('Failed to fetch data:', error.message);
      }
    };
    fetchData();
  }, []);

  const removeReservation = (id) => {
    setReservations((prevReservations) =>
      prevReservations.filter((reservation) => reservation.id !== id)
    );
  };

  const handleApproveReservation = async (e) => {
    try {
      await patch('reservation', `/reservation/${chosenReservation}/accept`);
      removeReservation(chosenReservation);
      approveReservationModal.onClose();
    } catch (error) {
      console.error('Reservation approval failed:', error.message);
    }
  };

  const handleCancelReservation = async (e) => {
    try {
      await patch('reservation', `/reservation/${chosenReservation}/reject`);
      removeReservation(chosenReservation);
      cancelReservationModal.onClose();
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
        <h2 className="text-2xl font-bold w-full">Upcoming reservations</h2>
        {reservations.map((reservation, index) => (
          <ReservationListItem key={index} reservation={reservation} cancelReservationModal={cancelReservationModal} approveReservationModal={approveReservationModal} setChosenReservation={setChosenReservation} />
        ))}
      </div>
      )}
      
      <ConfirmationModal modalObject={cancelReservationModal} title="Warning" callback={handleCancelReservation} callbackStyle="danger" buttonContent="Cancel"
        message="Are you sure you want to cancel this reservation?" />
      <ConfirmationModal modalObject={approveReservationModal} title="Warning" callback={handleApproveReservation} callbackStyle="primary" buttonContent="Approve"
              message="Are you sure you want to approve this reservation?" />

    </div>
  );
};
export default UpcomingHostReservations;
