'use client';

import React, { useEffect, useRef, useState } from 'react';
import styles from './page.module.css';
import RaffleAPI from '@/api/api';
import Toaster, { ToasterRef } from '../../lib/toaster';

interface ParticipantEntry {
    name: string;
    tickets: number;
}

const pickWinnerDelay: number = 2000;

const Raffle: React.FC = () => {
    const [participants, setParticipants] = useState<ParticipantEntry[]>([]);
    const [lastClickTime, setLastClickTime] = useState<number>(0);
    const toasterRef = useRef<ToasterRef>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleAddNotification = (message: string, type: 'info' | 'error' | 'success') => {
        if (toasterRef.current) {
            toasterRef.current.addNotification(message, type);
        }
    }; 

    const initializeParticipantEntries = () => {
        RaffleAPI.Instance.admin.getUsers()
            .then(users => {
                const newParticipants = users.map((user: ParticipantEntry) => ({
                    name: user.name,
                    tickets: user.tickets
                }));
                newParticipants.sort((a, b) => b.tickets - a.tickets); // Sort by ticket count descending
                setParticipants(newParticipants);
            })
    };

    const createEmojiEffect = () => {
        const containerElement = containerRef.current;
        if (!containerElement) return;

        const emojis = ['🎉', '🎊', '✨', '🎈', '🥳', '🎁', '🍾', '🍻', '🥂'];
        for (let i = 0; i < 15; i++) {
            const emoji = emojis[Math.floor(Math.random() * emojis.length)];
            const span = document.createElement('span');
            span.innerText = emoji;
            span.className = styles.emoji;
            span.style.left = `${Math.random() * 90}%`;
            span.style.top = `${Math.random() * 90}%`;
            containerElement.appendChild(span);

            setTimeout(() => {
                span.remove();
            }, 2000); // Remove emoji after 2 seconds
        }
    };

    const pickWinner = () => {
        const now = Date.now();

        if (now - lastClickTime < pickWinnerDelay) {
            handleAddNotification(`Bitte warte mindestens ${pickWinnerDelay / 1000} Sekunden, bevor du erneut einen Gewinner auslost.`, 'error');
            return;
        }

        setLastClickTime(now);

        RaffleAPI.Instance.admin.startRaffle()
            .then(winner => {
                const winnerNameElement = document.getElementById('winnerName');
                if (winnerNameElement) {
                    winnerNameElement.innerText = winner.winnerName;
                    winnerNameElement.classList.add(styles.rainbow);
                }
                handleAddNotification(`Der Gewinner ist ${winner.winnerName}!`, 'success');
                createEmojiEffect();
            })
            .catch(() => {
                handleAddNotification('Fehler beim Auslosen eines Gewinners. Bitte versuche es erneut!', 'error');
            });
    };

    useEffect(() => {
        initializeParticipantEntries();
    }, []);

    return (
        <div className={styles.wrapper}>
            <div className={styles.container} ref={containerRef}>
                <div className={styles.winnerBox}>
                    <h2>Gewinner</h2>
                    <h3 id="winnerName">Nicht verfügbar</h3>
                </div>
                <button className={styles.pickWinnerButton} onClick={pickWinner}>Auslosen</button>
                <div className={styles.entrySection}>
                    <div className={styles.containerTitle}>Teilnehmer</div>
                    <div className={styles.entryListContainer}>
                        <div className={styles.entryList}>
                            {participants.map((participant, index) => (
                                <div key={index} className={styles.entry}>
                                    <span className={`${styles.entryField} ${styles.entryNumber}`}>{index + 1}.</span>
                                    <span className={styles.entryField}>{participant.name}</span>
                                    <span className={`${styles.entryField} ${styles.ticketField}`}>
                                        {participant.tickets} {participant.tickets === 1 ? 'Ticket' : 'Tickets'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <Toaster ref={toasterRef} />
        </div>
    );
}

export default Raffle;