'use client'
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from 'react';
import { post, get } from "../../utils/httpRequests"

const RegistrationPage = () => {

  const router = useRouter();
  const [cities, setCities] = useState([])
  const [errors, setErrors] = useState({}); 

  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    role: 'host',
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
    const location = e.target.value;
    setFormData({
      ...formData,
      location,
    });
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
    return setErrors(!passwordsMatch())
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

    try{
      const data = {
        email: formData.email,
        username: formData.username,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        role: formData.role,
        city: formData.location.split(', ')[0],
        country: formData.location.split(', ')[1],
      }
      const response = await post('user' ,'/user/create', JSON.stringify(data))
      router.push("/login")
    } catch (error) {
      console.error('Failed to register:', error.message);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-3xl">
        <h2 className="text-2xl font-bold mb-4">Sign up for a new account</h2>
        <form onSubmit={handleSubmit} className="mt-8 grid grid-cols-2 gap-x-4 gap-y-6" noValidate={true} onChange={checkElementsForError} >
          <div>
            <label htmlFor="username">Username
              <input type="text" 
                      id="username" 
                      name="username" 
                      value={formData.username} 
                      onChange={handleChange} 
                      placeholder=" " 
                      className="w-full border border-gray-300 rounded px-3 py-2 invalid:[&:not(:placeholder-shown):not(:focus)]:border-red-500 peer" 
                      pattern='[A-Za-z0-9]{6,}' 
                      required />
              <span className="mt-2 hidden text-sm text-red-500 peer-[&:not(:placeholder-shown):not(:focus):invalid]:block">
                Please enter a valid name
              </span>
            </label>
          </div>
          <div>
            <label htmlFor="email">Email
              <input type="email" 
                      id="email" 
                      name="email" 
                      value={formData.email} 
                      onChange={handleChange} 
                      placeholder=" " 
                      className="w-full border border-gray-300 rounded px-3 py-2 invalid:[&:not(:placeholder-shown):not(:focus)]:border-red-500 peer" 
                      pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
                      required />
              <span className="mt-2 hidden text-sm text-red-500 peer-[&:not(:placeholder-shown):not(:focus):invalid]:block">
                Please enter a valid email address
              </span>
            </label>
          </div>
          <div>
            <label htmlFor="firstName">First name
              <input type="text" 
                      id="firstName" 
                      name="firstName" 
                      value={formData.firstName} 
                      onChange={handleChange} 
                      placeholder=" " 
                      className="w-full border border-gray-300 rounded px-3 py-2 invalid:[&:not(:placeholder-shown):not(:focus)]:border-red-500 peer" 
                      pattern='([A-Z][a-z]+)+' 
                      required />
              <span className="mt-2 hidden text-sm text-red-500 peer-[&:not(:placeholder-shown):not(:focus):invalid]:block">
                Please enter a valid name
              </span>
            </label>
          </div>
          <div>
            <label htmlFor="lastName">Last name
              <input type="text" 
                      id="lastName" 
                      name="lastName" 
                      value={formData.lastName} 
                      onChange={handleChange} 
                      placeholder=" " 
                      className="w-full border border-gray-300 rounded px-3 py-2 invalid:[&:not(:placeholder-shown):not(:focus)]:border-red-500 peer" 
                      pattern='([A-Z][a-z]+)+' 
                      required />
              <span className="mt-2 hidden text-sm text-red-500 peer-[&:not(:placeholder-shown):not(:focus):invalid]:block">
                Please enter a valid last name
              </span>
            </label>
          </div>
          <div>
            <label htmlFor="password">Password
              <input type="password" 
                      id="password" 
                      name="password" 
                      value={formData.password} 
                      onChange={handleChange} 
                      placeholder=" " 
                      className="w-full border border-gray-300 rounded px-3 py-2 invalid:[&:not(:placeholder-shown):not(:focus)]:border-red-500 peer" 
                      pattern='[A-Za-z0-9]{6,}' 
                      required />
              <span className="mt-2 hidden text-sm text-red-500 peer-[&:not(:placeholder-shown):not(:focus):invalid]:block">
                Please enter a valid password
              </span>
            </label>
          </div>
          <div>
            <label htmlFor="confirmPassword">Confirm Password
            <input type="password" 
                    id="confirmPassword" 
                    name="confirmPassword" 
                    value={formData.confirmPassword} 
                    onChange={handleChange} 
                    placeholder=" " 
                    className="w-full border border-gray-300 rounded px-3 py-2 invalid:[&:not(:placeholder-shown):not(:focus)]:border-red-500 peer" 
                    pattern='[A-Za-z0-9]{6,}' 
                    required />
            </label>
          </div>
          <div>
            <label htmlFor="selectedCity" className="block mb-1">City</label>
            <select id="selectedCity" name="selectedCity" value={formData.location} onChange={handleCityChange} placeholder=" " className="w-full border border-gray-300 rounded px-3 py-2 invalid:[&:not(:placeholder-shown):not(:focus)]:border-red-500 peer" required >
              <option value="">Select a location</option>
              {cities.map(location => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>
          </div>
          <div>
            <label>Role
            <div className="mt-2">
              <label className="inline-flex items-center">
                <input type="radio" name="role" value="host" onChange={handleChange} checked={formData.role === 'host'} className="form-radio h-5 w-5 text-blue-600" />
                <span className="ml-2">Host</span>
              </label>
              <label className="inline-flex items-center ml-6">
                <input type="radio" name="role" value="guest" onChange={handleChange} checked={formData.role === 'guest'} className="form-radio h-5 w-5 text-blue-600" />
                <span className="ml-2">Guest</span>
              </label>
            </div></label>
          </div>
          <button type="submit" className={`col-span-2 group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${errors ? 'pointer-events-none opacity-30' : ''} `} disabled={errors} >
            Sign up
          </button>
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
