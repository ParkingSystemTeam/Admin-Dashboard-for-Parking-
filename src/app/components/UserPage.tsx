import React from 'react';
import { Button } from './ui/button';

export function UserPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1>주차 시스템</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="rounded-lg border bg-white p-6">
          <div className="text-lg">User 페이지는 준비 중입니다.</div>
          <div className="mt-2 text-sm text-muted-foreground">
            관리자 페이지는 별도 경로 <code>/admin</code> 에서 접근합니다.
          </div>

          <div className="mt-6">
            <Button asChild>
              <a href="/admin">관리자 페이지로 이동</a>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}

