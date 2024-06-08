'use client'
import AccommodationRegistration from "@/components/accommodationRegistration";
import AccommodationHostSearch from '@/components/accommodationHostSearch';
import UpcomingHostReservations from '@/components/upcomingHostReservations';
import { Tabs, Tab } from "@nextui-org/react";

const AccommodationManagementPage = () => {

  return (
    <div className="min-h-screen flex items-start justify-center bg-gray-50 py-12">
      <div className="flex w-full flex-col max-w-4xl">
        <Tabs
          aria-label="Options"
          variant='underlined'
          classNames={{
            tabList: "gap-6 w-full relative rounded-none p-0 border-b border-divider",
            cursor: "w-full bg-primary",
            tab: "max-w-fit px-0 h-12",
          }}
        >
          <Tab title="Your accommodations">
            <AccommodationHostSearch />
          </Tab>
          <Tab  title="New accommodation">
            <AccommodationRegistration />
          </Tab>
          <Tab title="Upcoming reservations">
            <UpcomingHostReservations />
          </Tab>
        </Tabs>
      </div>
    </div>
  );
};

export default AccommodationManagementPage;
