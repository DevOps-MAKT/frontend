import React from 'react';
import { ReviewStar } from "@/icons/reviewStar";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from '@nextui-org/react';
import { useState } from "react";

const ReviewModal = ({ modalObject, addReviewCallback }) => {

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  const handleStarClick = (index) => {
    setRating(index + 1);
  };

  const handleStarMouseEnter = (index) => {
    setHoverRating(index + 1);
  };

  const handleStarMouseLeave = () => {
    setHoverRating(0);
  };

  const handleAddReview = () => {
    addReviewCallback(rating);
  }

  return (
    <>
      <Modal backdrop="blur" isOpen={modalObject.isOpen} onOpenChange={modalObject.onOpenChange} onClose={modalObject.onClose}>
        <ModalContent>
          {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">Add your review</ModalHeader>
            <ModalBody>
              <div className="flex justify-center">
                {Array.from({ length: 5 }, (_, index) => (
                  <ReviewStar
                    key={index}
                    filled={index < (hoverRating || rating)}
                    onClick={() => handleStarClick(index)}
                    onMouseEnter={() => handleStarMouseEnter(index)}
                    onMouseLeave={handleStarMouseLeave}
                  />
                ))}
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onPress={handleAddReview}>
                Review
              </Button>
            </ModalFooter>
          </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default ReviewModal;