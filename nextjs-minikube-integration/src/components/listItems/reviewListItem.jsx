import Rating from '@/components/rating';

const ReservationListItem = ({ review }) => {

  const timestampToDate = (unixTimestamp) => {
    const date = new Date(unixTimestamp);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  }

  return (
    <div key={review.id} className="bg-white shadow-lg rounded-lg p-4 space-y-4 border border-gray-100 text-gray-600">
      <div className='flex flex-row justify-between w-full'>
        <p>{timestampToDate(review.timestamp)}</p>
        <Rating rating={review.rating} />
      </div>
      <div>
        By: <span className='text-black'>{review.guestEmail}</span>
      </div>
    </div>
  );
};
export default ReservationListItem;
