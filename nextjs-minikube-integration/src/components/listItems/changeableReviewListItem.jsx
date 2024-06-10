import Rating from '@/components/rating';
import { Button } from '@nextui-org/react';

const ChangeableReservationListItem = ({ review, forWho, setReview, changeModal, deleteModal }) => {

  const timestampToDate = (unixTimestamp) => {
    const date = new Date(unixTimestamp);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  }

  const handleChange = () => {
    setReview(review);
    changeModal.onOpen();
  }

  const handleDelete = () => {
    setReview(review);
    deleteModal.onOpen();
  }

  return (
    <div key={review.id} className="bg-white shadow-lg rounded-lg p-4 space-y-4 border border-gray-100 text-gray-600">
      <div className='flex flex-row justify-between w-full'>
        <p>{timestampToDate(review.timestamp)}</p>
        <Rating rating={review.rating} />
      </div>
      <div>
        For: <span className='text-black'>{forWho}</span>
      </div>
      <div className='flex flex-row justify-end space-x-2'>
          <Button color='danger' onPress={handleDelete} >Delete</Button>
        <Button color='primary' onPress={handleChange} >Change</Button>
      </div>
    </div>
  );
};
export default ChangeableReservationListItem;
