'use client'
import React from 'react';
import { useState, useEffect } from 'react';
import { Input, Button, Avatar, Select, SelectItem } from '@nextui-org/react';
import { useDisclosure, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@nextui-org/react';
import { get, post } from "@/utils/httpRequests";

const AccommodationRegistration = ({ rating }) => {
  const [locations, setLocations] = useState([]);
  const [tags, setTags] = useState([]);
  const modal = useDisclosure();
  const [formData, setFormData] = useState({
    name: '',
    tags: [],
    minGuests: '',
    maxGuests: '',
    location: '',
  });

  const [image, setImage] = useState(null);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await get("accommodation", "/location/get");
        let locationStrings = response.data.map(({ city, country }) => `${city}, ${country}`);
        setLocations(locationStrings);
      } catch (error) {
        console.error('Failed to fetch locations:', error.message);
      }
    };
    const fetchTags = async () => {
      try {
        const response = await get("accommodation", "/accommodation-feature/get");
        let tagStrings = response.data.map((tag) => tag.feature);
        setTags(tagStrings);
      } catch (error) {
        console.error('Failed to fetch tags:', error.message);
      }
    };

    fetchLocations();
    fetchTags();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleLocationChange = (e) => {
    const location = e.target.value;
    setFormData({
      ...formData,
      location,
    });
  };

  const handleTagsChange = (e) => {
    const tags = e.target.value;
    setFormData({
      ...formData,
      tags,
    });
  };

  const handleImageChange = (event) => {
    setImage(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(formData.tags)
    const data = {
      name: formData.name,
      location: {
        city: formData.location.split(", ")[0],
        country: formData.location.split(", ")[1],
      },
      accommodationFeatures: formData.tags.split(",").map((tag) => ({ feature: tag })),
      minimumNoGuests: formData.minGuests,
      maximumNoGuests: formData.maxGuests,
      photographs: [],
    }

    try {
      const response = await post("accommodation", "/accommodation/create", data);
      modal.onOpen();
    } catch (error) {
      console.error('Failed to fetch cities:', error.message);
    }
  };

  return (

    <div>
      <h2 className="text-2xl font-bold mb-4">Register a new accommodation</h2>
      <form className="w-full" onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-4">
          <Input
            className="col-span-2"
            label="Name"
            name="name"
            type="text"
            placeholder=""
            value={formData.name}
            onChange={handleChange}
            required
          />

          <Select
            label="Location"
            placeholder=""
            value={formData.location}
            onChange={(e) => handleLocationChange(e)}
            required
          >
            {locations.map((city) => (
              <SelectItem key={city} value={city}>
                {city}
              </SelectItem>
            ))}
          </Select>

          <Select
            label="Tags"
            placeholder=""
            value={formData.tags}
            onChange={(e) => handleTagsChange(e)}
            selectionMode="multiple"
          >
            {tags.map((tag) => (
              <SelectItem key={tag} value={tag}>
                {tag}
              </SelectItem>
            ))}
          </Select>

          <Input
            label="Minimum Number of Guests"
            type="number"
            name="minGuests"
            placeholder=""
            value={formData.minGuests}
            onChange={handleChange}
            required
          />

          <Input
            label="Maximum Number of Guests"
            type="number"
            name="maxGuests"
            placeholder=""
            value={formData.maxGuests}
            onChange={handleChange}
            required
          />

          <div className="flex col-span-2 space-x-4">
            <input type="file" accept="image/*" onChange={handleImageChange} required
              className="text-sm text-slate-500 file:mr-4 file:p-4 file:rounded-lg my-auto file:border-0 file:text-sm file:text-gray-700 hover:file:cursor-pointer hover:file:bg-gray-200"
            />
            {image && <Avatar src={URL.createObjectURL(image)} size="lg" radius="lg" />}
          </div>
        </div>

        <div className="w-full flex justify-end mt-4">
          <Button type="submit" color="primary" >Register</Button>
        </div>
      </form>
      <>
        <Modal backdrop="blur" isOpen={modal.isOpen} onOpenChange={modal.onOpenChange}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">Success</ModalHeader>
                <ModalBody>
                  <p>You have successfully created a new accommodation.</p>
                </ModalBody>
                <ModalFooter>
                  <Button color="primary" variant="light" onPress={onClose}>
                    Close
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </>
    </div>
  );
};

export default AccommodationRegistration;
