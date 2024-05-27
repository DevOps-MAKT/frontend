'use client'
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from 'react';
import { get } from "../../utils/httpRequests"
import Accommodation from "@/components/accommodation";

const SearchPage = () => {

  const router = useRouter();
  const [accommodations, setAccommodations] = useState([])

  useEffect(() => {
    const fetchAccommodations = async () => {
      try {
        const queryParams = window.location.href.split('?')[1] || '';
        const response = await get('accommodation', '/accommodation/filter?' + queryParams);
        setAccommodations(response.data)
      } catch (error) {
        console.error('Failed to fetch accommodation:', error.message);
      }
    };
    fetchAccommodations();
  }, []);

  return (
    <div className="w-full flex flex-col items-center justify-center">
      {accommodations.length === 0 ? (
      <div className="text-gray-300 py-8">No accommodations match your search.</div>
      ) : (
      <div className="min-h-screen py-8 flex flex-col items-center space-y-6">
        {accommodations.map((accommodation, index) => (
          <Accommodation key={index} accommodation={accommodation} />
        ))}
      </div>
      )}
    </div>
  );
};

export default SearchPage;
