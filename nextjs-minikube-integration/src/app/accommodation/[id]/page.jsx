'use client'
import { Tabs, Tab, Chip, Skeleton } from "@nextui-org/react";
import { useEffect, useState } from "react";
import Rating from '@/components/rating';
import { get } from "@/utils/httpRequests";
import { env } from 'next-runtime-env';
import AvailabilityCreation from "@/components/availabilityCreation"
import AvailabilityModification from "@/components/availabilityModification"
import PriceModification from "@/components/priceModificaiton"
import AccommodationReviews from "@/components/accommodationReviews"
import HostReviews from "@/components/hostReviews"
import Booking from "@/components/book"
import { getEmail, getRole } from "@/utils/token";

const AccommodationPage = ({ params }) => {
  const { id } = params;
  const [isOwner, setIsOwner] = useState(false);
  const [isGuest, setIsGuest] = useState(false);
  const [canReviewAcc, setCanReviewAcc] = useState(false);
  const [canReviewHost, setCanReviewHost] = useState(false);
  const [accommodationReviews, setAccommodationReviews] = useState([]);
  const [hostReviews, setHostReviews] = useState([]);
  const [selected, setSelected] = useState("accommodationReviews");
  const [accommodation, setAccommodation] = useState({
    id: 0,
    name: '',
    location: { city: '', country: '' },
    price: '',
    accommodationFeatures: [],
    availabilityPeriods: [],
    avgRating: 0,
    imageUrl: '',
  });

  useEffect(() => {

    setIsGuest(getRole === "guest");

    const fetchMyAccommodations = async () => {
      try {
        if (getRole() !== 'host') return;
        const response = await get('accommodation', '/accommodation/my-accommodations');
        response.data.forEach(element => {
          if (element.id == id) {
            setIsOwner(true);
          }
        });
        console.log(response.data)
      } catch (error) {
        console.error('Failed to fetch accommodations:', error.message);
      }
    };

    const fetchAccommodation = async () => {
      try {
        const response = await get('accommodation', `/accommodation/${id}`);
        setAccommodation(response.data);
      } catch (error) {
        console.error('Failed to fetch accommodations:', error.message);
      }
    };

    const fetchAccommodationReviews = async () => {
      try {
        const response = await get('user', `/user/accommodation-reviews-info/${id}`);
        setAccommodationReviews(response.data.reviews);
        if (getRole() === 'guest' && !response.data.reviews.some(review => review.guestEmail === getEmail())) {
          setCanReviewAcc(true);
        }
      } catch (error) {
        console.error('Failed to fetch accommodation reviews:', error.message);
      }
    };

    fetchMyAccommodations();
    fetchAccommodation();
    fetchAccommodationReviews();
  }, []);

  useEffect(() => {
    if (accommodation.imageUrl === '') return;
    const fetchHostReviews = async () => {
      try {
        const response = await get('user', `/user/host-reviews-info/${accommodation.hostEmail}`);
        setHostReviews(response.data.reviews);
        if (getRole() === 'guest' && !response.data.reviews.some(review => review.guestEmail === getEmail())) {
          setCanReviewHost(true);
        }
      } catch (error) {
        console.error('Failed to fetch accommodation reviews:', error.message);
      }
    };

    fetchHostReviews();
  }, [accommodation]);

  return (
    <div className="flex justify-center items-start min-h-[calc(100vh-56px)] py-12">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-3xl space-y-4">
        <Skeleton className="w-full space-y-4" isLoaded={accommodation.imageUrl !== ''}>
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

          <img src={env('NEXT_PUBLIC_ACCOMMODATION_SERVICE_API') + '/photo/' + accommodation.photographURL} alt="" className="w-full h-96 object-cover rounded-lg" />
        </Skeleton>

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
              <Tab key="accommodationReviews" title="Accommodation Reviews" >
                <AccommodationReviews accommodationId={id} hostEmail={accommodation.hostEmail} canReview={canReviewAcc} reviews={accommodationReviews} />
              </Tab>
              <Tab key="hostReviews" title="Host Reviews" >
                <HostReviews hostEmail={accommodation.hostEmail} canReview={canReviewHost} reviews={hostReviews} />
              </Tab>
              <Tab key="price" title="Modify Price" >
                <PriceModification accommodation={accommodation} ></PriceModification>
              </Tab>
              <Tab key="create-availability" title="New Availability" >
                <AvailabilityCreation accommodation={accommodation} ></AvailabilityCreation>
              </Tab>
              <Tab key="modify-availability" title="New Special Price" >
                <AvailabilityModification accommodation={accommodation} ></AvailabilityModification>
              </Tab>
            </Tabs>
          ) : (
            <>
              {isGuest ? (
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
                  <Tab key="accommodationReviews" title="Accommodation Reviews" >
                    <AccommodationReviews accommodationId={id} hostEmail={accommodation.hostEmail} canReview={canReviewAcc} reviews={accommodationReviews} />
                  </Tab>
                  <Tab key="hostReviews" title="Host Reviews" >
                    <HostReviews hostEmail={accommodation.hostEmail} canReview={canReviewHost} reviews={hostReviews} />
                  </Tab>
                  <Tab key="book" title="Book" >
                    <Booking accommodation={accommodation} />
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
                  <Tab key="accommodationReviews" title="Accommodation Reviews" >
                    <AccommodationReviews accommodationId={id} hostEmail={accommodation.hostEmail} canReview={canReviewAcc} reviews={accommodationReviews} />
                  </Tab>
                  <Tab key="hostReviews" title="Host Reviews" >
                    <HostReviews hostEmail={accommodation.hostEmail} canReview={canReviewHost} reviews={hostReviews} />
                  </Tab>
                </Tabs>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccommodationPage;