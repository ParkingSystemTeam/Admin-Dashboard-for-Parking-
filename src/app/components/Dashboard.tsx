import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { LogOut, Car, Clock, Calendar } from 'lucide-react';
import React from 'react';

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

// 모의 데이터
const mockVehicleData: VehicleRecord[] = [
  {
    id: '1',
    plateNumber: '12가3456',
    entryTime: '2024-12-17 09:30',
    exitTime: '2024-12-17 12:45',
    fee: 6000,
    status: 'exited',
  },
  {
    id: '2',
    plateNumber: '34나5678',
    entryTime: '2024-12-17 10:15',
    exitTime: null,
    fee: 0,
    status: 'parked',
  },
  {
    id: '3',
    plateNumber: '56다7890',
    entryTime: '2024-12-17 11:20',
    exitTime: '2024-12-17 14:30',
    fee: 9000,
    status: 'exited',
  },
  {
    id: '4',
    plateNumber: '78라1234',
    entryTime: '2024-12-17 13:00',
    exitTime: null,
    fee: 0,
    status: 'parked',
  },
  {
    id: '5',
    plateNumber: '90마5678',
    entryTime: '2024-12-17 14:45',
    exitTime: '2024-12-17 16:20',
    fee: 4500,
    status: 'exited',
  },
];

export function Dashboard({ onLogout }: DashboardProps) {
  const [vehicles] = useState<VehicleRecord[]>(mockVehicleData);

  const parkedCount = vehicles.filter(v => v.status === 'parked').length;
  const exitedCount = vehicles.filter(v => v.status === 'exited').length;
  const totalRevenue = vehicles.reduce((sum, v) => sum + v.fee, 0);

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
            <Button variant="outline" onClick={onLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              로그아웃
            </Button>
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
                {vehicles.map((vehicle) => (
                  <TableRow key={vehicle.id}>
                    <TableCell>{vehicle.plateNumber}</TableCell>
                    <TableCell>{vehicle.entryTime}</TableCell>
                    <TableCell>
                      {vehicle.exitTime || '-'}
                    </TableCell>
                    <TableCell>
                      {vehicle.fee > 0 ? `${vehicle.fee.toLocaleString()}원` : '-'}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={vehicle.status === 'parked' ? 'default' : 'secondary'}
                        className={vehicle.status === 'parked' ? 'bg-red-500' : 'bg-green-500'}
                      >
                        {vehicle.status === 'parked' ? '주차 중' : '출차 완료'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}