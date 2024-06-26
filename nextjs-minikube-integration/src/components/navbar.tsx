'use client'
import { Button, DateValue, Input, RangeValue, Select, SelectItem, Link, Badge, Image } from "@nextui-org/react";
import { DateRangePicker } from "@nextui-org/date-picker";
import { useEffect, useState } from "react";
import { Location } from "@/model/Location";
import { get } from "@/utils/httpRequests";
import { useRouter } from "next/navigation";
import { clearToken, getRole } from "@/utils/token";
import { BellIcon } from "@/icons/bell";
import { HouseIcon } from "@/icons/house";
import { LogInIcon } from "@/icons/logIn";
import { LogOutIcon } from "@/icons/logOut";
import { PersonIcon } from "@/icons/person";
import { MessageIcon } from "@/icons/message";
import { Logo } from "@/icons/logo";

const MyNavbar = () => {
  const router = useRouter();
  const [cities, setCities] = useState<string[]>([]);
  const [role, setRole] = useState<string>("");
  const [notifications, setNotifications] = useState<number>(0);

  const [formData, setFormData] = useState({
    noGuests: '',
    endDate: 0,
    startDate: 0,
    location: '',
  });

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await get("accommodation", "/location/get");
        const cityStrings = response.data.map(({ city, country }: Location) => `${city}, ${country}`);
        setCities(cityStrings);
      } catch (error: any) {
        console.error('Failed to fetch cities:', error.message);
      }
    };

    const fetchNotifications = async () => {
      try {
        const response = await get('notification', '/notification/users-notifications');
        setNotifications(response.data.filter((item: any) => !item.read).length);
      } catch (error: any) {
        console.error('Failed to fetch cities:', error.message);
      }
    };

    var role = getRole();
    if (role === null) {
      role = "";
    }
    else {
      fetchNotifications();
    }

    setRole(role);
    fetchCities();
  }, []);

  const handleCityChange = (value: any) => {
    setFormData({
      ...formData,
      location: value.target.value,
    });
  };

  const logOut = (e: any) => {
    clearToken();
    window.location.reload();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const convertToTimestamp = (dateString: string) => {
    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
      throw new Error("Invalid date format");
    }

    const unixTimestamp = Math.floor(date.getTime());

    return unixTimestamp;
  }

  const handleDateChange = (value: RangeValue<DateValue>) => {

    const startDate = `${value.start.year}-${value.start.month}-${value.start.day}`
    const endDate = `${value.end.year}-${value.end.month}-${value.end.day}`
    setFormData({
      ...formData,
      startDate: convertToTimestamp(startDate),
      endDate: convertToTimestamp(endDate),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = {
        endDate: formData.endDate,
        startDate: formData.startDate,
        noGuests: formData.noGuests === '' ? 0 : formData.noGuests,
        city: formData.location === '' ? '' : formData.location.split(', ')[0],
        country: formData.location === '' ? '' : formData.location.split(', ')[1],
      };
      const queryParams = new URLSearchParams(data as any).toString();
      router.push('/search?' + queryParams);
    } catch (error: any) {
      console.error('Failed to register:', error.message);
    }
  };

  return (
    <nav className="bg-primary text-white flex flex-row justify-between px-20 py-2 sticky top-0 z-10">
      <a className="text-white flex my-auto gap-2" href="/">
        <img src="monkey.png" width={36} height={36}  />
        <span className="my-auto text-2xl ">Baboon Bookings</span>
      </a>

      <form onSubmit={handleSubmit} className="flex justify-center space-x-1 col-span-2">
        <Select
          aria-label="Location"
          className="w-48"
          placeholder="Where are you going?"
          value={formData.location}
          onChange={(e) => handleCityChange(e as unknown as string)}
        >
          {cities.map((city) => (
            <SelectItem key={city} value={city}>
              {city}
            </SelectItem>
          ))}
        </Select>
        <Input
          aria-label="Guests"
          type="number"
          min={1}
          placeholder="Guests"
          className="w-24"
          name="noGuests"
          value={formData.noGuests}
          onChange={handleChange}
        />
        <DateRangePicker
          aria-label="Date range"
          className="w-64"
          labelPlacement="outside"
          label=""
          onChange={handleDateChange}
        />
        <Button color="secondary" type="submit">
          Search
        </Button>
      </form>

      <div className={role === "" ? 'my-auto flex flex-row justify-end space-x-4 w-52' : 'hidden'}>
        <Link className="text-white" href="/login"><LogInIcon /></Link>

      </div>

      <div className={role === 'guest' ? 'my-auto flex flex-row justify-end space-x-4 w-52' : 'hidden'}>
        <Badge color="danger" content={notifications} isInvisible={notifications === 0} shape="circle">
          <Link className="text-white" href="/notifications"><BellIcon /></Link>
        </Badge>
        <Link className="text-white" href="/my-reviews"><MessageIcon /></Link>
        <Link className="text-white" href="/my-bookings"><HouseIcon /></Link>
        <Link className="text-white" href="/profile"><PersonIcon /></Link>
        <Link className="text-white" href="/login" onClick={logOut}><LogOutIcon /></Link>

      </div>

      <div className={role === "host" ? 'my-auto flex flex-row justify-end space-x-4 w-52' : 'hidden'}>
        <Badge color="danger" content={notifications} isInvisible={notifications === 0} shape="circle">
          <Link className="text-white" href="/notifications"><BellIcon /></Link>
        </Badge>
        <Link className="text-white" href="/accommodation-management"><HouseIcon /></Link>
        <Link className="text-white" href="/profile"><PersonIcon /></Link>
        <Link className="text-white" href="/login" onClick={logOut}><LogOutIcon /></Link>
      </div>
    </nav>
  );
};

export default MyNavbar;
