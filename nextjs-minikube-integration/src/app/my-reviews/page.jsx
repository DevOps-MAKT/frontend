'use client'
import ConfirmationModal from "@/components/confirmationModal";
import ChangeableReviewListItem from "@/components/listItems/changeableReviewListItem";
import ReviewModal from "@/components/reviewModal";
import { get, put, deleteHttp } from "@/utils/httpRequests";
import { getEmail } from "@/utils/token";
import { Tabs, Tab, useDisclosure } from "@nextui-org/react";
import { useState, useEffect } from "react";

const MyBookingsPage = () => {

  const [accommodationReviews, setAccommodationReviews] = useState([]);
  const [hostReviews, setHostReviews] = useState([]);
  const [selectedReview, setSelectedReview] = useState([]);
  const changeModal = useDisclosure();
  const deleteModal = useDisclosure();

  useEffect(() => {

    const fetchReviews = async () => {
      try {
        const response = await get('user', `/user/reviews-by-user/${getEmail()}`);
        setHostReviews(response.data.hostReviews);
        setAccommodationReviews(response.data.accommodationReviews);
      } catch (error) {
        console.error('Failed to fetch reviews:', error.message);
      }
    };

    fetchReviews();
  }, []);

  const updateReview = async (newRating) => {
    if (Object.hasOwn(selectedReview, 'accommodationId')) {
      updateAccommodationReview(selectedReview, newRating);
    }
    else {
      updateHostReview(selectedReview, newRating);
    }
  }

  const updateAccommodationReview = async (review, newRating) => {
    try {
      const data = {
        accommodationId: review.accommodationId,
        hostEmail: review.hostEmail,
        guestEmail: review.guestEmail,
        timestamp: review.timestamp,
        rating: newRating
      }
      await put('user', '/user/add-accommodation-review', data);
      changeModal.onClose();
      window.location.reload();
    } catch (error) {
      console.error('Failed to change review for accommodation:', error.message);
    }
  }

  const updateHostReview = async (review, newRating) => {
    try {
      const data = {
        hostEmail: review.hostEmail,
        guestEmail: review.guestEmail,
        timestamp: review.timestamp,
        rating: newRating
      }
      await put('user', '/user/add-host-review', data);
      changeModal.onClose();
      window.location.reload();
    } catch (error) {
      console.error('Failed to add review for host:', error.message);
    }
  }

  const deleteReview = async () => {
    if (Object.hasOwn(selectedReview, 'accommodationId')) {
      deleteAccommodationReview(selectedReview);
    }
    else {
      deleteHostReview(selectedReview);
    }
  }

  const deleteAccommodationReview = async (review) => {
    try {
      await deleteHttp('user', `/user/delete-accommodation-review/${review.accommodationId}`);
      deleteModal.onClose();
      window.location.reload();
    } catch (error) {
      console.error('Failed to change review for accommodation:', error.message);
    }
  }

  const deleteHostReview = async (review) => {
    try {
      await deleteHttp('user', `/user/delete-host-review/${review.hostEmail}`);
      deleteModal.onClose();
      window.location.reload();
    } catch (error) {
      console.error('Failed to add review for host:', error.message);
    }
  }


  return (
    <div className="min-h-[calc(100vh-56px)] flex items-start justify-center py-12">
      <div className="flex w-full flex-col max-w-4xl">
        <Tabs
          aria-label="Options"
          variant='underlined'
          classNames={{
            tabList: "gap-6 w-full relative rounded-none p-0 border-b border-divider",
            cursor: "w-full bg-primary",
            tab: "max-w-fit px-0 h-12",
          }}
        >
          <Tab title="Accommodation reviews">
            {accommodationReviews.length === 0 ? (
              <div className="text-gray-300 mt-4 w-full flex justify-center">You don&apos;t have reviews for any accommodations.</div>
            ) : (
              <div className="grid grid-cols-2 mt-4 gap-4">
                {accommodationReviews.map((accommodationReview, index) => (
                  <ChangeableReviewListItem key={index} review={accommodationReview} forWho={accommodationReview.accommodationId} setReview={setSelectedReview} changeModal={changeModal} deleteModal={deleteModal} />
                ))}
              </div>
            )}
          </Tab>
          <Tab title="Host reviews">
            {hostReviews.length === 0 ? (
              <div className="text-gray-300 mt-4 w-full flex justify-center">You don&apos;t have reviews for any hosts.</div>
            ) : (
              <div className="grid grid-cols-2 mt-4 gap-4">
                {hostReviews.map((hostReview, index) => (
                  <ChangeableReviewListItem key={index} review={hostReview} forWho={hostReview.hostEmail} setReview={setSelectedReview} changeModal={changeModal} deleteModal={deleteModal} />
                ))}
              </div>
            )}
          </Tab>
        </Tabs>
      </div>

      <ReviewModal modalObject={changeModal} addReviewCallback={updateReview} />
      <ConfirmationModal modalObject={deleteModal} title={"Deleting a review"} message={"Are you sure you want to delete the review?"} callback={deleteReview} callbackStyle={"danger"} buttonContent={"Delete"} />
    </div>
  );
};

export default MyBookingsPage;
