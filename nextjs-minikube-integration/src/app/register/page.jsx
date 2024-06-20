'use client'
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from 'react';
import { post, get } from "@/utils/httpRequests"
import { Button, Input, Select, SelectItem, Radio, RadioGroup } from "@nextui-org/react";

const RegistrationPage = () => {

  const router = useRouter();
  const [cities, setCities] = useState([]);
  const [errors, setErrors] = useState({});
  const [role, setRole] = useState("guest");

  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    role: 'guest',
    location: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCityChange = (e) => {
    setFormData({
      ...formData,
      location: e.target.value,
    });
  };

  const handleRoleChange = (e) => {
    setRole(e.target.value);
  };

  const passwordsMatch = () => {
    const passwordInput = document.getElementById('password');
    const passwordConfInput = document.getElementById('confirmPassword');

    return passwordInput.value === passwordConfInput.value;
  }

  const checkElementsForError = () => {
    const inputs = document.querySelectorAll('input');
    for (const input of inputs) {
      if (!input.checkValidity()) {
        return setErrors(true);
      }
    }
    return setErrors(!passwordsMatch());
  };

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await get("accommodation", "/location/get");
        let cityStrings = response.data.map(({ city, country }) => `${city}, ${country}`);
        setCities(cityStrings);
      } catch (error) {
        console.error('Failed to fetch cities:', error.message);
      }
    };

    fetchCities();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = {
        email: formData.email,
        username: formData.username,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        role: role,
        city: formData.location.split(', ')[0],
        country: formData.location.split(', ')[1],
      }
      console.log(data)
      await post('user', '/user/create', JSON.stringify(data));
      router.push("/login");
    } catch (error) {
      console.error('Failed to register:', error.message);
    }
  };

  return (
    <div className="flex justify-center items-center h-[calc(100vh-56px)]">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-3xl">
        <h2 className="text-2xl font-bold mb-4">Sign up for a new account</h2>
        <form onSubmit={handleSubmit} className="mt-8 grid grid-cols-2 gap-x-4 gap-y-6" noValidate={true} onChange={checkElementsForError} >
          <Input type="text"
            id="username"
            name="username"
            label="Username"
            value={formData.username}
            onChange={handleChange}
            pattern='[A-Za-z0-9]{6,}'
            required />
          <Input type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            label="Email"
            pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
            required />
          <Input type="text"
            id="firstName"
            name="firstName"
            label="First name"
            value={formData.firstName}
            onChange={handleChange}
            pattern='([A-Z][a-z]+)+'
            required />
          <Input type="text"
            id="lastName"
            name="lastName"
            label="Last name"
            value={formData.lastName}
            onChange={handleChange}
            pattern='([A-Z][a-z]+)+'
            required />
          <Input type="password"
            id="password"
            name="password"
            label="Password"
            value={formData.password}
            onChange={handleChange}
            pattern='[A-Za-z0-9]{6,}'
            required />
          <Input type="password"
            id="confirmPassword"
            name="confirmPassword"
            label="Confirm password"
            value={formData.confirmPassword}
            onChange={handleChange}
            pattern='[A-Za-z0-9]{6,}'
            required />
          <Select
            label="Select a location"
            value={formData.location}
            onChange={handleCityChange}
          >
            {cities.map((city) => (
              <SelectItem key={city} value={city}>
                {city}
              </SelectItem>
            ))}
          </Select>
          <RadioGroup
            label="Role"
            value={role}
            onChange={handleRoleChange}
            orientation="horizontal"
          >
            <Radio value="guest">Guest</Radio>
            <Radio value="host">Host</Radio>
          </RadioGroup>
          <Button type="submit" color="primary" className={`col-span-2 ${errors ? 'pointer-events-none opacity-30' : ''} `} disabled={errors} >
            Sign up
          </Button>
        </form>

        <div className="text-sm text-center mt-4">
          Already have an account? Sign in&nbsp;
          <a href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
            here
          </a>
          .
        </div>
      </div>
    </div>
  );
};

export default RegistrationPage;
