'use client';

import React, { useState, useRef, useEffect } from 'react';
import RaffleAPI from '@/api/api';
import '../../lib/setupAPI';
import Toaster, { ToasterRef } from '../../lib/toaster';
import styles from './page.module.css';

const Settings: React.FC = () => {
    const [title, setTitle] = useState<string | null>(null);
    const [description, setDescription] = useState<string | null>(null);
    const [base64Image, setBase64Image] = useState<string | null>(null);
    const toasterRef = useRef<ToasterRef>(null);

    const handleAddNotification = (message: string, type: 'info' | 'error' | 'success') => {
        if (toasterRef.current) {
            toasterRef.current.addNotification(message, type);
        }
    };

    const initializeWelcomePage = () => {
        RaffleAPI.Instance.getWelcomePage()
            .then(welcomePage => {
                setTitle(welcomePage.title);
                setDescription(welcomePage.description);
                setBase64Image(welcomePage.image);
            })
            .catch(() => {
                handleAddNotification('Fehler beim Laden der Willkommensseite!', 'error');
            });
    }
    
    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setBase64Image(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (event: React.FormEvent, title: string, description: string, image: string) => {
        event.preventDefault();

        RaffleAPI.Instance.admin.updateWelcomePage({title, description, image})
            .then(() => {
                handleAddNotification('Erfolgreich gespeichert!', 'success');
            })
            .catch(() => {
                handleAddNotification('Fehler beim Speichern!', 'error');
            });
    };

    useEffect(() => {
        initializeWelcomePage();
    }, []);

    return (
        <div className={styles['settings-container']}>
            <form className={styles['settings-form']} onSubmit={(e) => handleSubmit(e, (document.getElementById('title') as HTMLInputElement).value, (document.getElementById('description') as HTMLInputElement).value, base64Image || '')}>
                <label htmlFor="title">Titel:</label>
                <input type="text" id="title" placeholder="Gebe hier den neuen Titel ein!" className={styles['input-field']} defaultValue={title || ''}/>
                <label htmlFor="description">Beschreibung:</label>
                <textarea id="description" placeholder="Gebe hier deine neue Beschreibung ein!" className={styles['textarea-field']} defaultValue={description || ''}></textarea>
                <label htmlFor="image">Hintergrundbild:</label>
                <div>
                    <input type="file" id="image" accept="image/*" onChange={handleImageChange} className={styles['input-file']}/>
                    {base64Image && <img src={base64Image} alt="Selected" className={styles['selected-image']}/>}
                </div>
                <button type="submit" className={styles['submit-button']}>Ändern</button>
                <Toaster ref={toasterRef} />
            </form>
        </div>
    );
}

export default Settings;