'use client'
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { get, patch, put } from "../../utils/httpRequests";
import { Button, Input, Select, SelectItem, Divider, input } from "@nextui-org/react";
import { useDisclosure, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@nextui-org/react';
import { clearToken, getRole } from "@/utils/token";

const ProfilePage = () => {

  const router = useRouter();
  const [cities, setCities] = useState([]);
  const [errors, setErrors] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState(false);
  const [message, setMessage] = useState("");
  const okModal = useDisclosure();
  const errorModal = useDisclosure();

  const [formData, setFormData] = useState({
    username: '',
    firstName: '',
    lastName: '',
    location: '',
  });

  const [passwordFormData, setPasswordFormData] = useState({
    password: '',
    confirmationPassword: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    checkUserFormForError();
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordFormData({
      ...passwordFormData,
      [name]: value,
    });
    checkPasswordForError();
  };

  const handleCityChange = (e) => {
    const location = e.target.value;
    setFormData({
      ...formData,
      location,
    });
  };

  const checkUserFormForError = () => {
    const inputs = document.querySelectorAll('Input[type="text"]');
    for (const Input of inputs) {
      if (!Input.checkValidity()) {
        return setErrors(true);
      }
    }
    return setErrors(false);
  };

  const checkPasswordForError = () => {
    const inputs = document.querySelectorAll('Input[type="password"]');
    for (const Input of inputs) {
      if (!Input.checkValidity()) {
        return setPasswordErrors(true);
      }
    }
    return setPasswordErrors(inputs[0].value != inputs[1].value);
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
          username: response.data.username,
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
    try {
      const data = {
        username: formData.username,
        firstName: formData.firstName,
        lastName: formData.lastName,
        city: formData.location.split(', ')[0],
        country: formData.location.split(', ')[1],
      };
      await put('user', '/user/update', JSON.stringify(data));
      setMessage("You have successfully changed your account data.");
      okModal.onOpen();
      setPasswordFormData({ password: '', confirmationPassword: '' });
    } catch (error) {
      console.error('User data update failed:', error.message);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    try {
      await patch('user', '/user/update-password', JSON.stringify(passwordFormData));
      setMessage("You have successfully changed your password.");
      okModal.onOpen();
      setPasswordFormData({ password: '', confirmationPassword: '' });
    } catch (error) {
      console.error('Password update failed:', error.message);
    }
  };

  const handleDeleteSubmit = async (e) => {
    e.preventDefault();
    const role = getRole();
    try {
      if (role === 'host') {
        await patch('user', '/user/terminate-host', null);
      } else {
        await patch('user', '/user/terminate-guest', null);
      }
      clearToken();
      router.push('/login');
      window.location.reload();
    } catch (error) {
      console.error('Account termination failed:', error.message);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-3xl">
        <h2 className="text-2xl font-bold mb-8">Account management</h2>
        <div className="text-lg text-gray-500 mb-4">Change your information</div>
        <form onSubmit={handleSubmit} noValidate={true} >
          <div className="mb-4 grid grid-cols-3 gap-x-4 gap-y-6">
            <Input type="text"
              label="First name"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              pattern='[A-Za-z\s]+'
              errorMessage="Please enter a valid first name"
              required />
            <Input type="text"
              label="Last name"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              pattern='[A-Za-z\s]+'
              errorMessage="Please enter a valid last name"
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
            <Button type="submit" color="primary" isDisabled={errors} >
              Confirm changes
            </Button>
          </div>
        </form>

        <Divider orientation="horizontal" className="my-8" />

        <div className="text-lg text-gray-500 mb-4">Change your password</div>
        <form onSubmit={handlePasswordSubmit} noValidate={true} >
          <div className="mb-4 grid grid-cols-2 gap-x-4 gap-y-6">
            <Input type="password"
              label="Password"
              id="password"
              name="password"
              value={passwordFormData.password}
              onChange={handlePasswordChange}
              pattern='[A-Za-z0-9]{6,}'
              errorMessage="Please enter a valid password"
              required />
            <Input type="password"
              label="Confirm password"
              id="confirmationPassword"
              name="confirmationPassword"
              value={passwordFormData.confirmationPassword}
              onChange={handlePasswordChange}
              pattern='[A-Za-z0-9]{6,}'
              errorMessage="Please enter a valid password"
              required />
          </div>
          <div className="flex flex-row-reverse">
            <Button type="submit" color="primary" isDisabled={passwordErrors} >
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
          <Button color="danger" onClick={errorModal.onOpen} >
            Delete
          </Button>
        </div>
      </div>

      <>
        <Modal backdrop="blur" isOpen={okModal.isOpen} onOpenChange={okModal.onOpenChange}>
          <ModalContent>
            {(okOnClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">Modal Title</ModalHeader>
                <ModalBody>
                  <p>
                    {message}
                  </p>
                </ModalBody>
                <ModalFooter>
                  <Button color="primary" variant="light" onPress={okOnClose}>
                    Close
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </>
      <>
        <Modal backdrop="blur" isOpen={errorModal.isOpen} onOpenChange={errorModal.onOpenChange}>
          <ModalContent>
            {(errorOnClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">Warning</ModalHeader>
                <ModalBody>
                  <p>
                    This action is irreversible. You will be signed out and won&apos;t be able to access your account again. Are you sure you want to continue?
                  </p>
                </ModalBody>
                <ModalFooter>
                  <Button color="primary" variant="light" onPress={errorOnClose}>
                    Close
                  </Button>
                  <Button type="submit" color="danger" onClick={handleDeleteSubmit} >
                    Delete
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

export default ProfilePage;