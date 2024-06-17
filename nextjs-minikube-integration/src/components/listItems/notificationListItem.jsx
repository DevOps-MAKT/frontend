import { patch } from "@/utils/httpRequests";
import { Badge } from "@nextui-org/react";
import { useState } from "react";

const NotificationListItem = ({ notification }) => {

  const [isRead, setIsRead] = useState(notification.read);

  const getNotificationTitle = () => {
    switch (notification.notificationType) {
      case "RESERVATION_REQUESTED":
        return `Booking requested`;
      case "RESERVATION_CANCELLED":
        return `Reservation cancelled`;
      case "HOST_RATED":
        return `You have a new rating`;
      case "ACCOMMODATION_RATED":
        return `Your accommodation has a new rating`;
      default:
        return `Response to your booking request`;
    }
  }

  const onHover = async () => {
    try {
      await patch('notification', `/notification/update-read-status/${notification.id}`);
      notification.read = true;
      setIsRead(true);
    } catch (error) {
      console.error('Failed to fetch cities:', error.message);
    }
  }

  return (
  <Badge content="new" color="danger" size="sm" isInvisible={isRead} >
    <div key={notification.id} onMouseEnter={onHover} className="bg-white shadow-lg rounded-lg p-4 space-y-4 border border-gray-100 w-96">
      <div className='flex flex-row justify-between w-full'>
        <p className="w-48 text-lg">{getNotificationTitle()}</p>
        <p className="w-32 text-gray-500 text-sm text-right">{notification.timestamp}</p>
      </div>
      <p className="text-sm">{notification.message}</p>
    </div>
  </Badge>
  );
};
export default NotificationListItem;
