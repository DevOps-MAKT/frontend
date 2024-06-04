
import { useState, useEffect } from 'react';
import AccommodationSearchItem from './accommodationSearchItem';
import { get } from '@/utils/httpRequests';

const AccommodationHostSearch = () => {
  const [accommodations, setAccommodations] = useState([]);

  useEffect(() => {
    const fetchAccommodations = async () => {
      try {
        const queryParams = window.location.href.split('?')[1] || '';
        const response = await get('accommodation', '/accommodation/my-accommodations');
        setAccommodations(response.data)
      } catch (error) {
        console.error('Failed to fetch accommodation:', error.message);
      }
    };
    fetchAccommodations();
  }, []);

  return (
    <div className="w-full flex flex-col items-center justify-center">
      {accommodations.length === 0 ? (
      <div className="text-gray-300 py-8">You don't have any accommodations.</div>
      ) : (
      <div className="min-h-screen flex flex-col items-center space-y-6 w-full">
        <h2 className="text-2xl font-bold w-full">View your accommodations</h2>
        {accommodations.map((accommodation, index) => (
          <AccommodationSearchItem key={index} accommodation={accommodation} />
        ))}
      </div>
      )}
    </div>
  );
};
export default AccommodationHostSearch;
