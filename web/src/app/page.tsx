'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import RaffleAPI from '@/api/api';
import './lib/setupAPI';
import React, { useRef } from 'react';
import Toaster, { ToasterRef } from './lib/toaster';
import { WelcomePage } from '@/api/types';
import styles from './page.module.css';

export default function Page() {
  // States:
  const [successfulUserLogin, setSuccessfulUserLogin] = useState<boolean>(false);

  const [boxState, setBoxState] = useState<number>(0);
  const [welcomePage, setWelcomePage] = useState<WelcomePage>();

  // Definitions:
  const router = useRouter();
  const toasterRef = useRef<ToasterRef>(null);

  const handleAddNotification = (message: string, type: 'info' | 'error' | 'success') => {
    if (toasterRef.current) {
        toasterRef.current.addNotification(message, type);
    }
}; 

  // Submits:
  const handleAccessPasswordSubmit = (event: React.FormEvent, password: string) => {
    event.preventDefault();

    RaffleAPI.Instance.checkRole(password)
      .then(async (result) => {
        if (result.role === 'Admin') {
          RaffleAPI.Instance.admin.setAccessPassword(password);
          router.push('/admin/dashboard');
        } else {
          if ((await RaffleAPI.Instance.passwordUsed(password)).value) {
            handleAddNotification('Dieses Zugangspasswort wurde bereits verwendet!', 'error');
            return;
          }
          else {
            RaffleAPI.Instance.user.setAccessPassword(password);
            setSuccessfulUserLogin(true);
          
            RaffleAPI.Instance.getWelcomePage()
              .then(result => {
                setWelcomePage(result);
              });

            setBoxState(1);
          }
        }
    }).
    catch(() => {
      handleAddNotification('Dieses Zugangspasswort existiert nicht!', 'error');
    });
  };

  const handleCreateUserSubmit = (event: React.FormEvent, name: string, email: string, mobile: string) => {
    event.preventDefault();

    RaffleAPI.Instance.user.createUser({
      name: name,
      email: email,
      mobile: mobile
    }).
      then(() => {
        setBoxState(2);
      }).
      catch(() => {
        handleAddNotification('Es ist ein Fehler aufgetreten. Bitte versuche es erneut.', 'error');
      });
  };

  const renderBoxContent = () => {
    switch (boxState) {
      case 0: // Enter access password
        return (
          <div>
            <form onSubmit={(e) => handleAccessPasswordSubmit(e, (document.getElementById('accessPassword') as HTMLInputElement).value)}>
              <div className={styles.inputGroup}>
                <label htmlFor="accessPassword">Zugangspasswort:</label>
                <input type="password" id="accessPassword" className={styles.inputField} />
              </div>
              <button type="submit" className={styles.submitButton}>Bestätigen</button>
              <Toaster ref={toasterRef}/>
            </form>
          </div>
        );
      case 1: // Register new user
        return (
          <div>
            <p className={styles.title}>{welcomePage?.title}</p>
            <p>{welcomePage?.description?.split('\n').map((line, index) => (
              <React.Fragment key={index}>
                {line}
                <br />
              </React.Fragment>
            ))}</p>
            <hr/>
            <form onSubmit={(e) => handleCreateUserSubmit(e, (document.getElementById('name') as HTMLInputElement).value, (document.getElementById('email') as HTMLInputElement).value, (document.getElementById('mobile') as HTMLInputElement).value)}>
              <div className={styles.inputGroup}>
                <label htmlFor="name">Vor- & Nachname:</label>
                <input type="text" id="name" placeholder="Max Mustermann" className={styles.inputField} />
                <label htmlFor="email">E-Mail:</label>
                <input type="text" id="email" placeholder="example@example.com" className={styles.inputField} />
                <label htmlFor="mobile">Telefonnummer:</label>
                <input type="text" id="mobile" placeholder="+49 123 456789" className={styles.inputField} />
              </div>
              <button type="submit" className={styles.submitButton}>Bestätigen</button>
            </form>
          </div>
        );
      case 2: // Confirm registration
        return (
          <div className={styles.confirmationMessage}>
            <p>Du hast dich erfolgreich für das Gewinnspiel registriert.</p>
            <p className={styles.highlight}>Viel Glück!</p>
          </div>
        );
      default: // Invalid state
        return (
          <div>
            <button onClick={() => setBoxState(0)}>Zurück zur Startseite</button>
          </div>
        );
    }
  };

  return (
    <div className={styles.container} style={{ backgroundImage: successfulUserLogin ? `url(${welcomePage?.image})` : 'none', backgroundColor: successfulUserLogin ? 'transparent' : 'black', backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className={styles.box}>
        {renderBoxContent()}
      </div>
      <Toaster ref={toasterRef}/>
    </div>
  );
}