import { apiFetch } from "./http";

export type ParkingHistoryStatus = string;

export type ParkingHistoryDto = {
  id: number;
  licensePlate: string;
  startTime: string;
  endTime?: string | null;
  cost?: number | null;
  status?: ParkingHistoryStatus;
};

export function getAllParkingHistories() {
  return apiFetch<ParkingHistoryDto[]>("/parking");
}

