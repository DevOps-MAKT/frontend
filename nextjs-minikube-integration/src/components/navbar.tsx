'use client'
import { Button, DateValue, Input, RangeValue, Select, SelectItem } from "@nextui-org/react";
import { DateRangePicker } from "@nextui-org/date-picker";
import { useEffect, useState } from "react";
import { Location } from "@/model/Location";
import { get } from "@/utils/httpRequests";
import { useRouter } from "next/navigation";
import { clearToken, getToken } from "@/utils/token";

const Navbar = () => {
  const router = useRouter();
  const [cities, setCities] = useState<string[]>([]);
  const [token, setToken] = useState<string>("");

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

    var token = getToken()
    if (token === null) {
      token = "";
    }
    setToken(token);
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
      router.push('/search?' + queryParams)
    } catch (error: any) {
      console.error('Failed to register:', error.message);
    }
  };

  return (
    <nav className="sticky top-0 bg-primary py-2 px-4 w-full">
      <div className="grid grid-cols-4">
        <div className="text-white my-auto">
          <a href="/">Baboon Bookings</a>
        </div>
        <form onSubmit={handleSubmit} className="flex justify-center space-x-1 col-span-2">
          <Select
            aria-label="Location"
            className="w-64"
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
        <div className="flex justify-end">
          <a href="/" className="text-white px-4 my-auto">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0M3.124 7.5A8.969 8.969 0 0 1 5.292 3m13.416 0a8.969 8.969 0 0 1 2.168 4.5" />
            </svg>
          </a>
          {token === "" ? (
            <a href="/login" className="text-white px-4 my-auto">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 12H4m12 0-4 4m4-4-4-4m3-4h2a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3h-2" />
              </svg>
            </a>
          ) : (
            <div className="flex">
            <a href="/profile" className="text-white px-4 my-auto">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
              </svg>
            </a>
            <a href="/login" className="text-white px-4 my-auto" onClick={logOut}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H8m12 0-4 4m4-4-4-4M9 4H7a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h2"/>
            </svg>

            </a>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
