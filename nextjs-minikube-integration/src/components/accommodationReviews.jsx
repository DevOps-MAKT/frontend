
import { PlusIcon } from "@/icons/plus";
import ReviewModal from "@/components/reviewModal";
import ReviewListItem from "@/components/listItems/reviewListItem";
import { Button, useDisclosure } from "@nextui-org/react";
import { put } from "@/utils/httpRequests";

const AccommodationReviews = ({ accommodationId, hostEmail, canReviewAccommodation, reviews }) => {

  const modal = useDisclosure();

  const addReview = async (rating) => {
    try {
      const data = {
        accommodationId: accommodationId,
        hostEmail: hostEmail,
        rating: rating
      }
      await put('user', '/user/add-accommodation-review', data);
      modal.onClose();
      window.location.reload();
    } catch (error) {
      console.error('Failed to fetch accommodationReviews:', error.message);
    }
  }

  return (
    <>
      <div className="w-full">
        < div className={canReviewAccommodation === true ? 'w-full flex justify-center my-4' : 'hidden'}>
          <Button onPress={modal.onOpen} color="primary" >Add your review <PlusIcon /></Button>
        </div>

        {reviews.length === 0 ? (
          <div className="text-gray-300 pt-8 w-full flex justify-center">This accommodation doesn&apos;t have any reviews.</div>
        ) : (
          <div className="grid grid-cols-2 pt-4 gap-4">
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
export default AccommodationReviews;
