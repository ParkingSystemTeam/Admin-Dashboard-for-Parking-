import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { LogOut, Car, Clock, Calendar, RefreshCw } from 'lucide-react';
import React from 'react';
import { getAllParkingHistories, type ParkingHistoryDto } from '../api/parking';

interface VehicleRecord {
  id: string;
  plateNumber: string;
  entryTime: string;
  exitTime: string | null;
  fee: number;
  status: 'parked' | 'exited';
}

interface DashboardProps {
  onLogout: () => void;
}

function formatDateTime(value: string | null | undefined) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function toVehicleRecord(history: ParkingHistoryDto): VehicleRecord {
  const statusRaw = (history.status ?? '').toUpperCase();
  const isExited = Boolean(history.endTime) || statusRaw === 'COMPLETED' || statusRaw === 'ENDED';

  return {
    id: String(history.id ?? `${history.licensePlate}-${history.startTime}`),
    plateNumber: history.licensePlate,
    entryTime: formatDateTime(history.startTime) ?? history.startTime,
    exitTime: formatDateTime(history.endTime) ?? history.endTime ?? null,
    fee: history.cost ?? 0,
    status: isExited ? 'exited' : 'parked',
  };
}

export function Dashboard({ onLogout }: DashboardProps) {
  const [vehicles, setVehicles] = useState<VehicleRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isMountedRef = useRef(true);

  const reloadVehicles = useCallback(async () => {
    try {
      setIsLoading(true);
      setErrorMessage(null);
      const histories = await getAllParkingHistories();
      if (!isMountedRef.current) return;
      const nextVehicles = histories
        .slice()
        .sort((a, b) => {
          const aTime = new Date(a.startTime).getTime();
          const bTime = new Date(b.startTime).getTime();
          return (Number.isNaN(bTime) ? 0 : bTime) - (Number.isNaN(aTime) ? 0 : aTime);
        })
        .map(toVehicleRecord);
      setVehicles(nextVehicles);
    } catch (error) {
      if (!isMountedRef.current) return;
      const message = error instanceof Error ? error.message : '데이터를 불러오지 못했습니다.';
      setErrorMessage(message);
    } finally {
      if (!isMountedRef.current) return;
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    void reloadVehicles();
    return () => {
      isMountedRef.current = false;
    };
  }, [reloadVehicles]);

  const { parkedCount, exitedCount, totalRevenue } = useMemo(() => {
    const parked = vehicles.filter(v => v.status === 'parked').length;
    const exited = vehicles.filter(v => v.status === 'exited').length;
    const revenue = vehicles.reduce((sum, v) => sum + v.fee, 0);
    return { parkedCount: parked, exitedCount: exited, totalRevenue: revenue };
  }, [vehicles]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Car className="h-8 w-8 text-blue-600" />
              <h1>주차장 관리 시스템</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => void reloadVehicles()} disabled={isLoading}>
                <RefreshCw className="mr-2 h-4 w-4" />
                새로고침
              </Button>
              <Button variant="outline" onClick={onLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                로그아웃
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle>현재 주차 중</CardTitle>
              <Car className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl">{parkedCount}대</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle>출차 완료</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl">{exitedCount}대</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle>총 수익</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl">{totalRevenue.toLocaleString()}원</div>
            </CardContent>
          </Card>
        </div>

        {/* Vehicle Records Table */}
        <Card>
          <CardHeader>
            <CardTitle>차량 기록</CardTitle>
            <CardDescription>
              오늘 등록된 모든 차량의 입출차 기록입니다.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {errorMessage && (
              <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
                {errorMessage}
              </div>
            )}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="bg-gray-200">차량 번호</TableHead>
                  <TableHead className="bg-gray-200">입차 시간</TableHead>
                  <TableHead className="bg-gray-200">출차 시간</TableHead>
                  <TableHead className="bg-gray-200">주차 요금</TableHead>
                  <TableHead className="bg-gray-200">상태</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5}>불러오는 중...</TableCell>
                  </TableRow>
                ) : vehicles.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5}>표시할 데이터가 없습니다.</TableCell>
                  </TableRow>
                ) : (
                  vehicles.map((vehicle) => (
                    <TableRow key={vehicle.id}>
                      <TableCell>{vehicle.plateNumber}</TableCell>
                      <TableCell>{vehicle.entryTime}</TableCell>
                      <TableCell>{vehicle.exitTime || '-'}</TableCell>
                      <TableCell>{vehicle.fee > 0 ? `${vehicle.fee.toLocaleString()}원` : '-'}</TableCell>
                      <TableCell>
                        <Badge
                          variant={vehicle.status === 'parked' ? 'default' : 'secondary'}
                          className={vehicle.status === 'parked' ? 'bg-red-500' : 'bg-green-500'}
                        >
                          {vehicle.status === 'parked' ? '주차 중' : '출차 완료'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
