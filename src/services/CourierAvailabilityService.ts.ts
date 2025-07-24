// services/CourierAvailabilityService.ts
import type { AuthProps, WeekDay } from "../interfaces/AuthProps";

interface CourierCall {
  id: string;
  userId: string;
  courierId: string;
  callTime: string;
  status: "active" | "completed";
  userName: string;
  courierName: string;
}

export class CourierAvailabilityService {
  static isCourierWorkingToday(courier: AuthProps): boolean {
    const today = new Date()
      .toLocaleDateString("en-US", { weekday: "long" })
      .toLowerCase() as WeekDay;

    return courier.working_days === today;
  }

  static isTimeSlotAvailable(
    courier: AuthProps,
    requestedDate: string,
    requestedTime: string,
    existingCalls: CourierCall[]
  ): boolean {
    if (!courier.working_hours || !requestedTime || !requestedDate)
      return false;

    // Check if it's the courier's working day
    const dayName = new Date(requestedDate)
      .toLocaleDateString("en-US", { weekday: "long" })
      .toLowerCase() as WeekDay;

    if (courier.working_days !== dayName) return false;

    // Check if time is within working hours
    const [reqHour, reqMin] = requestedTime.split(":").map(Number);
    const reqMinutes = reqHour * 60 + reqMin;

    const [startHour, startMin] = courier.working_hours.start
      .split(":")
      .map(Number);
    const [endHour, endMin] = courier.working_hours.end.split(":").map(Number);
    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;

    if (reqMinutes < startMinutes || reqMinutes > endMinutes) {
      return false;
    }

    // Check if courier is already busy at this time (30-minute buffer)
    const requestedDateTime = `${requestedDate}T${requestedTime}:00`;
    const busyCalls = existingCalls.filter(
      (call) =>
        call.courierId === courier.id &&
        call.status === "active" &&
        Math.abs(
          new Date(call.callTime).getTime() -
            new Date(requestedDateTime).getTime()
        ) <
          30 * 60 * 1000 // 30 min buffer
    );

    return busyCalls.length === 0;
  }

  static hasUserConflict(
    userId: string,
    requestedDate: string,
    requestedTime: string,
    userCalls: CourierCall[]
  ): boolean {
    const requestedDateTime = `${requestedDate}T${requestedTime}:00`;
    const conflictingCalls = userCalls.filter(
      (call) =>
        call.userId === userId &&
        call.status === "active" &&
        Math.abs(
          new Date(call.callTime).getTime() -
            new Date(requestedDateTime).getTime()
        ) <
          30 * 60 * 1000
    );

    return conflictingCalls.length > 0;
  }

  static getAvailableCouriers(
    couriers: AuthProps[],
    allCalls: CourierCall[],
    date?: string
  ): AuthProps[] {
    const checkDate = date || new Date().toISOString().split("T")[0];
    const dayName = new Date(checkDate)
      .toLocaleDateString("en-US", { weekday: "long" })
      .toLowerCase() as WeekDay;

    return couriers.filter((courier) => courier.working_days === dayName);
  }

  static getCourierCallsCount(courierId: string, calls: CourierCall[]): number {
    return calls.filter((call) => call.courierId === courierId).length;
  }

  static getTodayCalls(calls: CourierCall[]): CourierCall[] {
    const today = new Date().toISOString().split("T")[0];
    return calls.filter((call) => call.callTime.startsWith(today));
  }
}
