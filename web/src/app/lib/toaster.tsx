/* 
HOW TO USE:

'use client';

import React, { useRef } from 'react';
import Toaster, { ToasterRef } from '../../lib/toaster';

export default function Page() {
  const toasterRef = useRef<ToasterRef>(null);

  const handleAddNotification = (message: string, type: 'info' | 'error' | 'success') => {
        if (toasterRef.current) {
            toasterRef.current.addNotification(message, type);
        }
    }; 

  return (
    <div>
      <button onClick={handleAddNotification('Hey whats up', 'info')}>Show Notification</button>
      <Toaster ref={toasterRef} />
    </div>
  );
  }
*/

import React, { useState, forwardRef, useImperativeHandle } from 'react';
import './toaster.css';

export interface ToasterRef {
  addNotification: (message: string, type: 'info' | 'error' | 'success') => void;
}

const Toaster = forwardRef<ToasterRef>((props, ref) => {
  const [notifications, setNotifications] = useState<{ id: number; message: string; type: 'info' | 'error' | 'success' }[]>([]);

  useImperativeHandle(ref, () => ({
    addNotification(message: string, type: 'info' | 'error' | 'success') {
      const id = Date.now();
      setNotifications((prevNotifications) => [
        ...prevNotifications,
        { id, message, type },
      ]);

      setTimeout(() => {
        removeNotification(id);
      }, 3000); // Notification will disappear after 3 seconds
    },
  }));

  const removeNotification = (id: number) => {
    setNotifications((prevNotifications) =>
      prevNotifications.filter((notification) => notification.id !== id)
    );
  };

  return (
    <div className="toaster-container">
      {notifications.map((notification) => (
        <div key={notification.id} className={`toast ${notification.type}`}>
          {notification.message}
        </div>
      ))}
    </div>
  );
});

Toaster.displayName = 'Toaster';

export default Toaster;