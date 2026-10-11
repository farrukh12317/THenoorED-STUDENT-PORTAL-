'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Dashborad from '@/components/ui/dashborad';

export default function DashboardPage() {
  const router = useRouter();
  const [data, setData] = useState(null);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      router.push('/login');
      return;
    }

    fetch(`/api/user-data?userId=${userId}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch student data');
        return res.json();
      })
      .then((json) => setData(json.data))
      .catch((err) => {
        console.error('Fetch error:', err);
        router.push('/login');
      });
  }, [router]);

  if (!data) return <p className="p-6">Loading...</p>;
  return <Dashborad studentdata={data} />;
}