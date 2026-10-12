'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import Dashborad from '@/components/ui/dashborad';

const fetcher = async (url) => {
  const res = await fetch(url);
  if (!res.ok) {
    const err = new Error('Failed to fetch student data');
    err.status = res.status;
    throw err;
  }
  const json = await res.json();
  return json.data;
};

export default function DashboardPage() {
  const router = useRouter();
  const [userId, setUserId] = useState(null);

  // Read localStorage after mount (avoids server/client hydration mismatch)
  useEffect(() => {
    const id = localStorage.getItem('userId');
    if (!id) {
      router.push('/login');
      return;
    }
    setUserId(id);
  }, [router]);

  const { data } = useSWR(
    userId ? `/api/user-data?userId=${userId}` : null,
    fetcher,
    {
      // Only kick the user out for bad ID / missing user, not for a flaky network
      onError: (err) => {
        if (err.status === 400 || err.status === 404) router.push('/login');
      },
    }
  );

  if (!data) return <p className="p-6">Loading...</p>;
  return <Dashborad studentdata={data} />;
}