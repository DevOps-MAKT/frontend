'use client'
import React, { useState } from 'react';
import AccommodationRegistration from "@/components/accommodationRegistration";
import AccommodationHostSearch from '@/components/accommodationHostSearch';
import { Button } from '@nextui-org/react';

const AccommodationManagementPage = () => {

  const [selected, setSelected] = useState('view');
  const menuItems = [["view", "View your accommodations"], ["new", "Register new accommodation"]];

  return (
    <div className="min-h-screen space-x-10 flex items-start justify-center bg-gray-50 py-12 px-4">
      <div className="space-y-4 flex flex-col justify-left ">
        {menuItems.map(([key, item]) => (
          <Button
            key={key}
            color="light"
            onPress={() => setSelected(key)}
            className={`text-xl flex ${selected === key ? 'text-primary' : 'text-gray-400'} transition duration-100 ease-in-out`}
          >
            <svg className={`w-6 h-6 mr-2 transition duration-100 ease-in-out ${selected === key ? 'text-primary' : 'text-transparent'}`}
              xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="m9 5 7 7-7 7" />
            </svg>
            {item}
          </Button>
        ))}

      </div>
      <div className="max-w-4xl w-full bg-white p-8 rounded shadow-md">
        {selected === "view" ?
          <AccommodationHostSearch />
          :
          <AccommodationRegistration />
        }
      </div>
    </div>
  );
};

export default AccommodationManagementPage;
