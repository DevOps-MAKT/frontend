'use client'
import Link from 'next/link';
import { Button, Card } from '@nextui-org/react';

export default function Home() {
  return (
    <div className="bg-gray-100 min-h-[calc(100vh-56px)] flex flex-col items-center pt-10">
      <header className="text-center mb-10">
        <h1 className="text-5xl font-bold text-gray-800 flex flex-row gap-4">
          <img src="just-monkey.png" height={48} width={48} />
          <span>Baboon Bookings</span>
          <img src="just-monkey.png" height={48} width={48} className="scale-x-[-1]" />
        </h1>
        <p className="text-lg text-gray-600 mt-2">Where every reservation is monkey business</p>
      </header>
      <main className="flex flex-col items-center space-y-6 px-4 w-1/2">
        <Card className="w-full p-6 shadow-lg">
          <h2 className="text-3xl font-semibold text-gray-800 mb-4">Discover Amazing Places</h2>
          <p className="text-gray-600 mb-4">
            Explore our extensive list of hotels, resorts, and more. Book your next stay with us and experience the best in hospitality.
          </p>
        </Card>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          <Card className="p-4 shadow-lg">
            <h3 className="text-2xl font-semibold text-gray-800">Hotels</h3>
            <p className="text-gray-600">
              Find the best hotels at the best prices.
            </p>
          </Card>
          <Card className="p-4 shadow-lg">
            <h3 className="text-2xl font-semibold text-gray-800">Resorts</h3>
            <p className="text-gray-600">
              Experience luxury and relaxation at our top resorts.
            </p>
          </Card>
          <Card className="p-4 shadow-lg">
            <h3 className="text-2xl font-semibold text-gray-800">Apartments</h3>
            <p className="text-gray-600">
              Feel at home in our well-equipped apartments.
            </p>
          </Card>
          <Card className="p-4 shadow-lg">
            <h3 className="text-2xl font-semibold text-gray-800">Villas</h3>
            <p className="text-gray-600">
              Enjoy privacy and comfort in our beautiful villas.
            </p>
          </Card>
        </div>
      </main>
      <footer className="mt-10 text-center text-gray-600">
        © 2024 Baboon Bookings. All rights reserved.
      </footer>
    </div>
  );
}
