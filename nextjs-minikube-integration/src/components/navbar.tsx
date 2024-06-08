'use client'
import { Button, DateValue, Input, RangeValue, Select, SelectItem, Link } from "@nextui-org/react";
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
import { PersonIcon } from "@/icons/person"
import { Logo } from "@/icons/logo";

const MyNavbar = () => {
  const router = useRouter();
  const [cities, setCities] = useState<string[]>([]);
  const [role, setRole] = useState<string>("");

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

    var role = getRole()
    if (role === null) {
      role = "";
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

    const unixTimestamp = Math.floor(date.getTime() / 1000);

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
      <div className="flex flex-row my-auto space-x-2">
        <Logo />
        <span className="font-bold text-inherit">Baboon Bookings</span>
      </div>

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

      <div className={role === "" ? 'my-auto flex flex-row space-x-4' : 'hidden'}>
        <Link className="text-white" href="login"><LogInIcon /></Link>

      </div>

      <div className={role === 'guest' ? 'my-auto flex flex-row space-x-4' : 'hidden'}>
        <Link className="text-white" href="notifications"><BellIcon /></Link>
        <Link className="text-white" href="profile"><PersonIcon /></Link>
        <Link className="text-white" href="login" onClick={logOut}><LogOutIcon /></Link>

      </div>

      <div className={role === "host" ? 'my-auto flex flex-row space-x-4' : 'hidden'}>
        <Link className="text-white" href="notifications"><BellIcon /></Link>
        <Link className="text-white" href="accommodation-management"><HouseIcon /></Link>
        <Link className="text-white" href="profile"><PersonIcon /></Link>
        <Link className="text-white" href="login" onClick={logOut}><LogOutIcon /></Link>
      </div>
    </nav>
  );
};

export default MyNavbar;
