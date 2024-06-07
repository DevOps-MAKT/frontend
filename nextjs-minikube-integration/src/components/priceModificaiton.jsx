
import React, { useState } from 'react';
import { patch } from '@/utils/httpRequests';
import { Input, Checkbox, Button } from '@nextui-org/react';

const PriceModification = ({ accommodation }) => {

  const [price, setPrice] = useState(accommodation.price);
  const [pricePerGuest, setPricePerGuest] = useState(accommodation.pricePerGuest);

  const handleChangePrice = async (e) => {
    const data = {
      accommodationId: accommodation.id,
      price: price,
      pricePerGuest: pricePerGuest,
    }
    try {
      await patch('accommodation', `/accommodation/update-price-info`, data);
    } catch (error) {
      console.error('Failed to change price:', error.message);
    }
  };

  return (
    <div className="w-full grid grid-cols-3 gap-4">

      <Input type="number"
        min="0"
        label="Price"
        id="price"
        name="price"
        value={price}
        onValueChange={setPrice} />

      <Checkbox isSelected={pricePerGuest} onValueChange={setPricePerGuest}>Price per guest</Checkbox>

      <Button color="primary" className="my-auto" onPress={handleChangePrice} >
        Save price
      </Button>

    </div>
  );
};
export default PriceModification;
