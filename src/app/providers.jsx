'use client';
import { SWRConfig } from 'swr';

function localStorageProvider() {
  if (typeof window === 'undefined') return new Map();

  let map;
  try {
    map = new Map(JSON.parse(localStorage.getItem('app-cache') || '[]'));
  } catch {
    map = new Map();
  }

  window.addEventListener('beforeunload', () => {
    try {
      localStorage.setItem('app-cache', JSON.stringify(Array.from(map.entries())));
    } catch {}
  });

  return map;
}

export default function Providers({ children }) {
  return (
    <SWRConfig
      value={{
        provider: localStorageProvider,
        revalidateOnFocus: false,
        revalidateIfStale: false,
        dedupingInterval: 60000,
      }}
    >
      {children}
    </SWRConfig>
  );
}