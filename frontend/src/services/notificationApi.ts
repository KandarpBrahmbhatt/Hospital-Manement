import api from "./axios";

// Change: Service function to retrieve recent notifications list from the backend
export const getNotificationsApi = () => {
  return api.get("/notifications");
};

// Change: Service function to mark a single notification as read by its MongoDB ID
export const markAsReadApi = (id: string) => {
  return api.put(`/notifications/${id}/read`);
};

// Change: Service function to mark all unread notifications in the system as read
export const markAllAsReadApi = () => {
  return api.put("/notifications/read-all");
};
