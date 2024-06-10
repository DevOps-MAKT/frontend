
import { useState, useEffect } from 'react';
import AccommodationSearchItem from '@/components/listItems/accommodationSearchItem';
import { get } from '@/utils/httpRequests';

const HostAccommodationsList = () => {
  const [accommodations, setAccommodations] = useState([]);

  useEffect(() => {
    const fetchAccommodations = async () => {
      try {
        const response = await get('accommodation', '/accommodation/my-accommodations');
        setAccommodations(response.data);
      } catch (error) {
        console.error('Failed to fetch accommodations:', error.message);
      }
    };
    fetchAccommodations();
  }, []);

  return (
    <div className="max-w-4xl w-full">
      <div className="w-full flex flex-col items-center justify-center">
        {accommodations.length === 0 ? (
          <div className="text-gray-300 py-8">You don&apos;t have any accommodations.</div>
        ) : (
          <div className="flex flex-col items-center w-full">
            {accommodations.map((accommodation, index) => (
              <AccommodationSearchItem key={index} accommodation={accommodation} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default HostAccommodationsList;
