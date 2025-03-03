'use client';

import React, { useEffect, useState } from 'react';
import Nav from '../ui/nav';
import styles from './layout.module.css';
import RaffleAPI from '@/api/api';
import { useRouter } from 'next/navigation';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAccessPassword = async () => {
      try {
        if (!RaffleAPI.Instance.admin.accessPassword) {
          router.replace('/404');
        } else {
          setIsLoading(false);
        }
      } catch (_) {
        router.replace('/404');
      }
    };

    checkAccessPassword();
  }, []);

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div className="lds-ring"><div></div><div></div><div></div><div></div></div>
      </div>
    );
  }

  return (
    <div className={styles.body}>
      <Nav />
      <main className={styles.main}>{children}</main>
    </div>
  );
};

export default Layout;
