'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import styles from './nav.module.css';
import RaffleAPI from '@/api/api';

const Nav: React.FC = () => {
    const router = useRouter();
    const pathName = usePathname();

    const handleLogout = () => {
        RaffleAPI.Instance.admin.setAccessPassword(undefined);
        router.push('/');
    };
  
    return (
      <div className={styles.sidebar}>
        <div className={styles.logo}>
          <h1>Raffle - Admin</h1>
        </div>
        <nav className={styles.nav}>
          <ul>
            <li className={pathName === '/admin/dashboard' ? styles.active : ''}>
              <Link href="/admin/dashboard">
                Übersicht
              </Link>
            </li>
            <li className={pathName === '/admin/settings' ? styles.active : ''}>
              <Link href="/admin/settings">
                Einstellungen
              </Link>
            </li>
            <li className={pathName === '/admin/raffle' ? styles.active : ''}>
              <Link href="/admin/raffle">
                Auslosung
              </Link>
            </li>
          </ul>
        </nav>
        <div className={styles.logout}>
          <button onClick={handleLogout}>
            Abmelden
          </button>
        </div>
      </div>
    );
  };
  
  export default Nav;