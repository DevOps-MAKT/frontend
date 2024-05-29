'use client'
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from 'react';
import { get } from "@/utils/httpRequests";
import AccommodationRegistration from "@/components/accommodationRegistration";

const AccommodationManagementPage = () => {

  const router = useRouter();
  const [selected, setSelected] = useState('new');
  const menuItems = [["view", "View your accommodations"], ["new", "Register new accommodation"]];

  useEffect(() => {
  }, []);

  return (
    <div className="min-h-screen space-x-10 flex items-start justify-center bg-gray-50 py-12 px-4">
      <div className="space-y-4 flex flex-col justify-left ">
        {menuItems.map(([key, item]) => (
          <button
            key={key}
            onClick={() => setSelected(key)}
            className={`text-xl flex ${selected === key ? 'text-primary' : 'text-gray-400'} transition duration-100 ease-in-out`}
          >
            <svg className={`w-6 h-6 mr-2 transition duration-100 ease-in-out ${selected === key ? 'text-primary' : 'text-transparent'}`}
               xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" 
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="m9 5 7 7-7 7" />
            </svg>
            {item}
          </button>
        ))}

      </div>
      <div className="max-w-3xl w-full bg-white p-8 rounded shadow-md">
        {selected === "view" ?
          <div>
            <h2 className="text-2xl font-bold mb-4">View your accommodations</h2>
          </div>
          :
          <AccommodationRegistration />
        }
      </div>
    </div>
  );
};

export default AccommodationManagementPage;
