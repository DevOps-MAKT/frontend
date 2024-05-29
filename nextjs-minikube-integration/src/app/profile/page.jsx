'use client'
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { get, post } from "../../utils/httpRequests";
import { Button, Input, Select, SelectItem, Divider } from "@nextui-org/react";

const ProfilePage = () => {

  const [cities, setCities] = useState([]);
  const [errors, setErrors] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    location: '',
  });

  const [passwordFormData, setPasswordFormData] = useState({
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordFormData({
      ...passwordFormData,
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

  const checkElementsForError = () => {
    const inputs = document.querySelectorAll('Input');
    for (const Input of inputs) {
      if (!Input.checkValidity()) {
        return setErrors(true);
      }
    }
    return setErrors(false);
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
    const fetchUserData = async () => {
      try {
        const response = await get("user", "/user/retrieve-current-user-info");
        setFormData({
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          location: response.data.city + ", " + response.data.country,
        });
      } catch (error) {
        console.error('Failed to fetch cities:', error.message);
      }
    };
    fetchUserData();
    fetchCities();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData)
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-3xl">
        <h2 className="text-2xl font-bold mb-8">Account management</h2>
        <div className="text-lg text-gray-500 mb-4">Change your information</div>
        <form onSubmit={handleSubmit} noValidate={true} onChange={checkElementsForError} >
          <div className="mb-4 grid grid-cols-3 gap-x-4 gap-y-6">
            <Input type="text"
              label="First name"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              pattern='[A-Za-z\s]+'
              required />
            <Input type="text"
              label="Last name"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              pattern='[A-Za-z\s]+'
              required />
            <Select
              selectedKeys={[formData.location]}
              onChange={handleCityChange}
              label="Location"
            >
              {cities.map((location) => (
                <SelectItem key={location} value={location}>
                  {location}
                </SelectItem>
              ))}
            </Select>
          </div>
          <div className="flex flex-row-reverse">
            <Button type="submit" color="primary" disabled={errors} >
              Confirm changes
            </Button>
          </div>
        </form>

        <Divider orientation="horizontal" className="my-8" />

        <div className="text-lg text-gray-500 mb-4">Change password</div>
        <form onSubmit={handlePasswordSubmit} noValidate={true} >
          <div className="mb-4 grid grid-cols-2 gap-x-4 gap-y-6">
            <Input type="password"
              label="Password"
              id="password"
              name="password"
              value={passwordFormData.password}
              onChange={handlePasswordChange}
              pattern='[A-Za-z0-9]{6,}'
              required />
            <Input type="password"
              label="Confirm password"
              id="confirmPassword"
              name="confirmPassword"
              value={passwordFormData.confirmPassword}
              onChange={handlePasswordChange}
              pattern='[A-Za-z0-9]{6,}'
              required />
          </div>
          <div className="flex flex-row-reverse">
            <Button type="submit" color="primary" disabled={errors} >
              Change password
            </Button>
          </div>
        </form>

        <Divider orientation="horizontal" className="my-8" />
        <div className="text-lg text-gray-500 mb-4">Delete your account</div>
        <div className="flex flex-row justify-between">
          <div className="text-gray-700 text-sm pr-4">
            Warning! This action is irreversible. You won&apos;t be able to access your account if you terminate it.
          </div>
          <Button type="submit" color="danger" disabled={errors} >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;