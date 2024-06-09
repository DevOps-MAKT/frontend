'use client'
import UpcomingGuestReservations from '@/components/upcomingGuestReservations';
import { Tabs, Tab } from "@nextui-org/react";

const MyBookingsPage = () => {

  return (
    <div className="min-h-[calc(100vh-56px)] flex items-start justify-center py-12">
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
          <Tab title="Upcoming bookings">
            <UpcomingGuestReservations />
          </Tab>
          <Tab  title="Pending accommodation reviews">
            Pending accommodation review
          </Tab>
          <Tab  title="Pending host reviews">
            Pending host review
          </Tab>
        </Tabs>
      </div>
    </div>
  );
};

export default MyBookingsPage;
