import { api } from "./api";
import type { ClinicAppointment } from "@/types";

export interface NotificationItem {
  id: string;
  type: "APPOINTMENT_REQUEST";
  appointment: ClinicAppointment;
  createdAt: string;
}

export const notificationService = {
  async getNotifications(): Promise<NotificationItem[]> {
    try {
      const { data } = await api.get<NotificationItem[] | ClinicAppointment[]>("notifications");
      if (Array.isArray(data) && data.length > 0 && "type" in data[0]) {
        return data as NotificationItem[];
      }
      return this.mapAppointmentsToNotifications(data as ClinicAppointment[]);
    } catch {
      return this.getPendingAppointments();
    }
  },

  async getPendingAppointments(): Promise<NotificationItem[]> {
    const { data } = await api.get<ClinicAppointment[] | { data: ClinicAppointment[] }>(
      "appointments",
      { params: { status: "PENDING", page: 1, pageSize: 50 } },
    );
    const appointments = Array.isArray(data) ? data : data?.data || [];
    return this.mapAppointmentsToNotifications(appointments);
  },

  mapAppointmentsToNotifications(appointments: ClinicAppointment[]): NotificationItem[] {
    return appointments
      .filter((a) => a.status === "PENDING")
      .map((a) => ({
        id: a.id,
        type: "APPOINTMENT_REQUEST" as const,
        appointment: a,
        createdAt: a.dateTime,
      }));
  },
};
