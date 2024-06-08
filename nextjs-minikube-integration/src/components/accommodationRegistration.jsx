'use client'
import React from 'react';
import InfoModal from "@/components/infoModal"
import { useState, useEffect } from 'react';
import { Input, Button, Avatar, Select, SelectItem } from '@nextui-org/react';
import { useDisclosure } from '@nextui-org/react';
import { get, postImage } from "@/utils/httpRequests";

const AccommodationRegistration = () => {
  const [locations, setLocations] = useState([]);
  const [errors, setErrors] = useState(true);
  const [tags, setTags] = useState([]);
  const modal = useDisclosure();
  const [formData, setFormData] = useState({
    name: '',
    tags: [],
    minGuests: '',
    maxGuests: '',
    location: '',
  });

  const [photo, setPhoto] = useState(null);

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

  const checkForErrors = () => {
    setErrors(formData.name === "" || formData.minGuests === "" || formData.maxGuests === "" || formData.location === "" || photo === null);
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    checkForErrors();
  };

  const handleLocationChange = (e) => {
    const location = e.target.value;
    setFormData({
      ...formData,
      location,
    });

    checkForErrors();
  };

  const handleTagsChange = (e) => {
    const tags = e.target.value;
    setFormData({
      ...formData,
      tags,
    });

    checkForErrors();
  };

  const handlePhotoChange = (event) => {
    setPhoto(event.target.files[0]);

    checkForErrors();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData();
    data.append('file', photo);
    data.append('fileName', photo.name);
    for (const [key, value] of Object.entries(formData)) {
      data.append(key, value);
    }
    try {
      await postImage("accommodation", "/accommodation/create", data);
      modal.onOpen();
    } catch (error) {
      console.error('Failed to create accommodation:', error.message);
    }
  };

  return (

    <div className="max-w-4xl w-full bg-white p-8 rounded shadow-md">
      <form className="w-full" onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-4">
          <Input
            className="col-span-2"
            label="Name"
            pattern="[A-za-z\s]{6,}"
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
            min="1"
            value={formData.minGuests}
            onChange={handleChange}
            required
          />

          <Input
            label="Maximum Number of Guests"
            type="number"
            name="maxGuests"
            placeholder=""
            min="1"
            value={formData.maxGuests}
            onChange={handleChange}
            required
          />

          <div className="flex col-span-2 space-x-4">
            <input type="file" accept="image/*" onChange={handlePhotoChange} required
              className="text-sm text-slate-500 file:mr-4 file:p-4 file:rounded-lg my-auto file:border-0 file:text-sm file:text-gray-700 hover:file:cursor-pointer hover:file:bg-gray-200"
            />
            {photo && <Avatar src={URL.createObjectURL(photo)} size="lg" radius="lg" />}
          </div>
        </div>

        <div className="w-full flex justify-end mt-4">
          <Button type="submit" color="primary" isDisabled={errors} >Register</Button>
        </div>
      </form>
      <InfoModal modalObject={modal} message="You have successfully created a new accommodation." title="Success" />
    </div>
  );
};

export default AccommodationRegistration;
