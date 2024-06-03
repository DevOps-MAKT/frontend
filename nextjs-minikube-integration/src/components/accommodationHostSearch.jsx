
import { useState, useEffect } from 'react';
import AccommodationSearchItem from './accommodationSearchItem';
import { get } from '@/utils/httpRequests';

const AccommodationHostSearch = () => {
  const properties = [
    {
      id: 1,
      name: 'Luxury Villa in Bali',
      location: {city: 'Bali', country: 'Indonesia'},
      price: '$250/night',
      accommodationFeatures: [{feature: 'WiFi'}, {feature: 'Kitchen'}],
      avgRating: 3.8,
      imageUrl: '/images/property1.jpg',
    },
    {
      id: 2,
      name: 'Cozy Apartment in New York',
      location: {city: 'New York', country: 'USA'},
      accommodationFeatures: [{feature: 'Pool'}, {feature: 'Kitchen'}],
      price: '$180/night',
      avgRating: 1.5,
      imageUrl: '/images/property2.jpg',
    },
    {
      id: 3,
      name: 'Modern House in Tokyo',
      location: {city: 'Tokyo', country: 'Japan'},
      accommodationFeatures: [{feature: 'WiFi'}, {feature: 'TV'}],
      price: '$300/night',
      avgRating: 4.7,
      imageUrl: '/images/property3.jpg',
    },
  ];
  const [accommodations, setAccommodations] = useState([]);

  useEffect(() => {
    const fetchAccommodations = async () => {
      try {
        const queryParams = window.location.href.split('?')[1] || '';
        const response = await get('accommodation', '/accommodation/my-accommodations');
        //setAccommodations(response.data)
        setAccommodations(properties);
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
