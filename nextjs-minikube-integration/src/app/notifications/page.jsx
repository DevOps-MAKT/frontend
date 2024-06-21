'use client'
import { useEffect, useState } from "react";
import NotificationListItem from "@/components/listItems/notificationListItem"
import { get } from "@/utils/httpRequests";

const NotificationsPage = () => {

  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await get('notification', '/notification/users-notifications');
        setNotifications(response.data);
      } catch (error) {
        console.error('Failed to fetch cities:', error.message);
      }
    };

    fetchNotifications();
  }, []);

  return (
    
    <div className="w-full flex justify-center min-h-[calc(100vh-56px)]">
      {notifications.length === 0 ? (
      <div className="text-gray-300 py-8">You don&apos;t have any notifications.</div>
      ) : (
      <div className=" py-8 flex flex-col space-y-6">
      {notifications.map((notification, index) => (
        <NotificationListItem key={index} notification={notification} />
      ))}
      </div>
      )}

    </div>
  );
};

export default NotificationsPage;