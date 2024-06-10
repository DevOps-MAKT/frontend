
import { PlusIcon } from "@/icons/plus";
import ReviewModal from "@/components/reviewModal";
import ReviewListItem from "@/components/listItems/reviewListItem";
import { Button, useDisclosure } from "@nextui-org/react";
import { put } from "@/utils/httpRequests";

const HostReviews = ({ hostEmail, canReview, reviews }) => {

  const modal = useDisclosure();

  const addReview = async (rating) => {
    try {
      const data = {
        hostEmail: hostEmail,
        rating: rating
      }
      await put('user', '/user/add-host-review', data);
      modal.onClose();
      window.location.reload();
    } catch (error) {
      console.error('Failed to add review for host:', error.message);
    }
  }

  return (
    <>
      <div className="w-full">
        < div className={canReview === true ? 'w-full flex justify-center py-4' : 'hidden'}>
          <Button onPress={modal.onOpen} color="primary" >Add your review <PlusIcon /></Button>
        </div>

        {reviews.length === 0 ? (
          <div className="text-gray-300 mt-4 w-full flex justify-center">This host doesn&apos;t have any reviews.</div>
        ) : (
          <div className="grid grid-cols-2 mt-4 gap-4">
          {reviews.map((review, index) => (
            <ReviewListItem key={index} review={review} />
          ))}
          </div>
        )}
      </div>

      <ReviewModal modalObject={modal} addReviewCallback={addReview} />
    </>
  );
};
export default HostReviews;
