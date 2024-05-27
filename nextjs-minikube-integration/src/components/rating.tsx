// components/Rating.tsx
import React from 'react';

type RatingProps = {
  rating: number;
};

type StarProps = {
  filled: boolean;
};

const Star: React.FC<StarProps> = ({ filled }) => (
  <svg
    className={`w-6 h-6 ${filled ? 'text-yellow-500' : 'text-gray-300'}`}
    fill="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
    />
  </svg>
);

const Rating: React.FC<RatingProps> = ({ rating }) => {
  const roundedRating = Math.round(rating);
  return (
    <div className="flex">
      {Array.from({ length: 5 }, (_, index) => (
        <Star key={index} filled={index < roundedRating} />
      ))}
    </div>
  );
};

export default Rating;
