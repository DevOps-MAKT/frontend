'use client'
import { Tabs, Tab, Chip } from "@nextui-org/react";
import { useEffect, useState } from "react";
import Rating from '@/components/rating';
import { get } from "@/utils/httpRequests";

const AccommodationPage = ({ params }) => {
  const { id } = params;
  const [isOwner, setIsOwner] = useState(false);
  const [selected, setSelected] = useState("reviews");
  const [accommodation, setAccommodation] = useState({
    id: 0,
    name: '',
    location: { city: '', country: '' },
    price: '',
    accommodationFeatures: [],
    avgRating: 0,
    imageUrl: '',
  });
  /*
  const accommodation = {
    id: 1,
    name: 'Luxury Villa in Bali',
    location: { city: 'Bali', country: 'Indonesia' },
    price: '$250/night',
    accommodationFeatures: [{ feature: 'WiFi' }, { feature: 'Kitchen' }, { feature: 'Bedroom' }, { feature: 'Pool' }, { feature: 'Microwave' }, { feature: 'Bathroom' }, { feature: 'Room service' }],
    avgRating: 3.8,
    imageUrl: '/images/property1.jpg',
  };
  */

  useEffect(() => {

    const fetchMyAccommodations = async () => {
      try {
        const response = await get('accommodation', '/accommodation/my-accommodations');
        response.data.forEach(element => {
          if (element.id == id) {
            setIsOwner(true);
          }
        });
      } catch (error) {
        console.error('Failed to fetch accommodations:', error.message);
      }
    };

    const fetchAccommodation = async () => {
      try {
        const response = await get('accommodation', `/accommodation/${id}`);
        setAccommodation(response.data);
        console.log(response.data);
      } catch (error) {
        console.error('Failed to fetch accommodations:', error.message);
      }
    };

    fetchMyAccommodations();
    fetchAccommodation();
  }, []);

  return (
    <div className="flex justify-center items-start min-h-screen bg-gray-100 py-12">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-3xl space-y-4">
        <div className="flex flex-row justify-between">
          <div>
            <h1 className="text-3xl">{accommodation.name}</h1>
            <div className="flex flex-row text-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.8 13.938h-.011a7 7 0 1 0-11.464.144h-.016l.14.171c.1.127.2.251.3.371L12 21l5.13-6.248c.194-.209.374-.429.54-.659l.13-.155Z" />
              </svg>
              {accommodation.location.city}, {accommodation.location.country}
            </div>
          </div>

          <div className="flex flex-row space-x-2">
            <div className="">{accommodation.avgRating.toFixed(1)}</div>
            <Rating rating={accommodation.avgRating} />
          </div>

        </div>


        <img src="/apartment.webp" alt="" className="w-full h-96 object-cover rounded-lg" />


        <div className="flex flex-row flex-wrap gap-2">
          {accommodation.accommodationFeatures.map((feature) => (
            <Chip variant="bordered" radius="sm" size="lg" key={accommodation.id + feature.feature}>{feature.feature}</Chip>
          ))}
        </div>

        <div className="flex w-full flex-col">
          {isOwner ? (
            <Tabs
              aria-label="Options"
              variant="underlined"
              selectedKey={selected}
              onSelectionChange={setSelected}
              classNames={{
                tabList: "gap-6 w-full relative rounded-none p-0 border-b border-divider",
                cursor: "w-full bg-primary",
                tab: "max-w-fit px-0 h-12",
              }}
            >
              <Tab
                key="reviews"
                title={
                  <div className="flex items-center space-x-2">
                    <span>Reviews</span>
                  </div>
                }
              >
                Reviews
              </Tab>
              <Tab
                key="availability"
                title={
                  <div className="flex items-center space-x-2">
                    <span>Availability</span>
                  </div>
                }
              >
                Change availability
              </Tab>
              <Tab
                key="special-price"
                title={
                  <div className="flex items-center space-x-2">
                    <span>Special price</span>
                  </div>
                }
              >
                Modify special prices
              </Tab>
            </Tabs>
          ) : (
            <Tabs
              aria-label="Options"
              variant="underlined"
              selectedKey={selected}
              onSelectionChange={setSelected}
              classNames={{
                tabList: "gap-6 w-full relative rounded-none p-0 border-b border-divider",
                cursor: "w-full bg-primary",
                tab: "max-w-fit px-0 h-12",
              }}
            >
              <Tab
                key="reviews"
                title={
                  <div className="flex items-center space-x-2">
                    <span>Reviews</span>
                  </div>
                }
              >
                Reviews
              </Tab>
              <Tab
                key="book"
                title={
                  <div className="flex items-center space-x-2">
                    <span>Book</span>
                  </div>
                }
              >
                Make a booking
              </Tab>
            </Tabs>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccommodationPage;