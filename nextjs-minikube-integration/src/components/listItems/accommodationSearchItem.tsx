import { Button, Chip } from '@nextui-org/react';
import { useRouter } from "next/navigation";
import { env } from 'next-runtime-env';
import Rating from '@/components/rating';

const AccommodationSearchItem = ({accommodation}: any) => {
  const router = useRouter();

  return (
    <div key={accommodation.id} className="flex flex-row justify-between bg-white shadow-lg rounded-lg w-[800px] p-4 space-x-4 border border-gray-100">
      <div className="flex flex-row space-x-4">
        <div className="w-64 h-64 rounded-lg flex-shrink-0">
        <img src={env('NEXT_PUBLIC_ACCOMMODATION_SERVICE_API') + '/photo/' + accommodation.photographURL} alt={accommodation.name} width={256} height={256} className="w-64 h-64 object-cover rounded-lg" />
        </div>
        <div className="h-64 flex flex-col">
          <div className="text-xl font-semibold">{accommodation.name}</div>
          <p className="text-gray-600">{accommodation.location.city}, {accommodation.location.country}</p>
          <div className="text-gray-700 space-x-2 space-y-2">
            {accommodation.accommodationFeatures.map((feature: any) => (
              <Chip key={accommodation.id + feature.feature}>{feature.feature}</Chip>
            ))}
          </div>
        </div>
      </div>
      <div className="h-64 flex flex-col justify-between items-end">
        <Rating rating={accommodation.avgRating} />
        <div>
          <div className="text-lg font-bold text-primary text-right">${accommodation.price.toFixed(2)}</div>
          <Button color='primary' onPress={() => {router.push(`/accommodation/${accommodation.id}`)}}>View Details</Button>
        </div>
      </div>
    </div>
  );
};
export default AccommodationSearchItem;
