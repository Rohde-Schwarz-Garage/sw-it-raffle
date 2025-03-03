'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import styles from './page.module.css';
import Toaster, { ToasterRef } from '../../lib/toaster';
import RaffleAPI from '@/api/api';
import trashcanIcon from '/public/trashcan.svg';
import clipIcon from '/public/clip.svg';
import plusIcon from '/public/plus.svg';
import minusIcon from '/public/minus.svg';

interface PasswordEntry {
    id: number;
    used: boolean;
    password: string;
}

interface ParticipantEntry {
    id: number;
    userName: string;
    email: string;
    mobile: string;
    ticketCount: number;
}

interface RaffleHistoryEntry {
    id: number;
    winnerName: string;
    winnerTickets: number;
    date: string;
}

const Dashboard: React.FC = () => {
    const [entries, setEntries] = useState<PasswordEntry[]>([]);
    const [participants, setParticipants] = useState<ParticipantEntry[]>([]);
    const [raffleHistory, setRaffleHistory] = useState<RaffleHistoryEntry[]>([]);

    const initializeEntries = () => {
        RaffleAPI.Instance.admin.getPasswords()
            .then(result => {
                const newEntries = result.map(passwordDetail => ({
                    id: passwordDetail.accessPassword.id,
                    used: passwordDetail.isUsed,
                    password: passwordDetail.accessPassword.value
                }));
                setEntries(newEntries);
            })
            .catch(() => {
                handleAddNotification('Fehler beim Laden der Zugangspasswörter!', 'error');
            });
    };

    const addPasswordEntry = () => {
        RaffleAPI.Instance.admin.createPassword()
            .then(result => {
                setEntries(prevEntries => [...prevEntries, { id: result.id, used: false, password: result.value }]);
                handleAddNotification(`Zugangspasswort hinzugefügt!`, 'success');
            })
            .catch(() => {
                handleAddNotification('Fehler beim Erstellen des Zugangspassworts!', 'error');
            });
    };

    const deletePasswordEntry = (id: number) => {
        RaffleAPI.Instance.admin.deletePassword(id);
        setEntries(prevEntries => prevEntries.filter(entry => entry.id !== id));
        handleAddNotification(`Zugangspasswort gelöscht! (${id})`, 'success');
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        handleAddNotification('Passwort in die Zwischenablage kopiert!', 'info');
    };

    const initializeParticipantEntries = () => {
        RaffleAPI.Instance.admin.getUsers()
            .then(result => {
                const newParticipants = result.map(user => ({
                    id: user.id,
                    userName: user.name,
                    email: user.email,
                    mobile: user.mobile,
                    ticketCount: user.tickets
                }));
                setParticipants(newParticipants);
            })
            .catch(() => {
                handleAddNotification('Fehler beim Laden der Teilnehmer!', 'error');
            });
    };

    const deleteParticipantEntry = (id: number) => {
        RaffleAPI.Instance.admin.deleteUser(id);
        setParticipants(participants.filter(participant => participant.id !== id));
        handleAddNotification(`Teilnehmer gelöscht! (${id})`, 'success');
    };

    const incrementTicketCount = (id: number) => {
        setParticipants(participants.map(participant => {
            if (participant.id === id) {
                const updatedParticipant = { ...participant, ticketCount: participant.ticketCount + 1 };
                RaffleAPI.Instance.admin.updateTicketCount({ id: updatedParticipant.id, tickets: updatedParticipant.ticketCount });
                return updatedParticipant;
            }
            return participant;
        }));
    };

    const decrementTicketCount = (id: number) => {
        setParticipants(participants.map(participant => {
            if (participant.id === id && participant.ticketCount > 1) {
                const updatedParticipant = { ...participant, ticketCount: participant.ticketCount - 1 };
                RaffleAPI.Instance.admin.updateTicketCount({ id: updatedParticipant.id, tickets: updatedParticipant.ticketCount });
                return updatedParticipant;
            }
            return participant;
        }));
    };

    const initializeRaffleHistoryEntries = () => {
        RaffleAPI.Instance.admin.getRaffles()
            .then(result => {
                const newRaffleHistory = result.map(raffle => ({
                    id: raffle.id,
                    winnerName: raffle.winnerName,
                    winnerTickets: raffle.winnerTickets,
                    date: new Date(raffle.date).toLocaleDateString()
                })).reverse(); // Invert the order
                setRaffleHistory(newRaffleHistory);
            })
            .catch(() => {
                handleAddNotification('Fehler beim Laden der Auslosungshistorie!', 'error');
            });
    };

    const deleteRaffleHistoryEntry = (id: number) => {
        RaffleAPI.Instance.admin.deleteRaffle(id);
        setRaffleHistory(raffleHistory.filter(entry => entry.id !== id));
        handleAddNotification(`Auslosungseintrag gelöscht! (${id})`, 'success');
    };

    // Toaster Notifications
    const toasterRef = useRef<ToasterRef>(null);

    const handleAddNotification = (message: string, type: 'info' | 'error' | 'success') => {
        if (toasterRef.current) {
            toasterRef.current.addNotification(message, type);
        }
    };

    // Init
    React.useEffect(() => {
        initializeEntries();
        initializeParticipantEntries();
        initializeRaffleHistoryEntries();
    }, []);

    return (
        <div>
        <div className={styles.gridContainer}>
            <div className={styles.leftContainer}>
                <div className={styles.containerTitle}>Zugangspasswörter</div>
                <div className={styles.buttonContainer}>
                    <button className={styles.fullWidthButton} onClick={() => addPasswordEntry()}>Neues Zugangspasswort anlegen</button>
                </div>
                <div className={styles.entryListContainer} style={{ paddingTop: 0 }}>
                    <div className={styles.entryList}>
                        {entries.map(entry => (
                            <div key={entry.id} className={styles.entry}>
                                <p className={`${styles.entryField} ${styles.idField}`} title="ID">{entry.id}</p>
                                <p className={styles.entryCheckbox} title={entry.used ? "Registriert" : "Unregistriert"}>{entry.used ? "✔️" : "❌"}</p>
                                <p className={`${styles.entryField} ${styles.passwordField}`} title="Zugangspasswort">{entry.password}</p>
                                <button className={styles.entryButton} onClick={() => copyToClipboard(entry.password)}>
                                    <Image src={clipIcon} alt="Kopieren" width={25} height={25} />
                                </button>
                                <button className={styles.entryButton} onClick={() => deletePasswordEntry(entry.id)}>
                                    <Image src={trashcanIcon} alt="Löschen" width={25} height={25} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className={styles.rightContainer}>
                <div className={styles.containerTitle}>Beendete Auslosungen</div>
                <div className={styles.entryListContainer} style={{ height: "calc(100% - 2.5rem)"}}>
                    <div className={styles.entryList}>
                        {raffleHistory.map(entry => (
                            <div key={entry.id} className={styles.entry}>
                                <p className={`${styles.entryField} ${styles.idField}`} title="ID">{entry.id}</p>
                                <div className={styles.entryField} title="Details">
                                    Gewinner: {entry.winnerName}<br />
                                    Tickets: {entry.winnerTickets}<br />
                                    Datum: {entry.date}
                                </div>
                                <button className={styles.entryButton} onClick={() => deleteRaffleHistoryEntry(entry.id)}>
                                    <Image src={trashcanIcon} alt="Löschen" width={25} height={25} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className={styles.leftContainer}>
                <div className={styles.containerTitle}>Registrierte Teilnehmer</div>
                <div className={styles.entryListContainer} style={{ height: "calc(100% - 2.5rem)"}}>
                    <div className={styles.entryList}>
                        {participants.map(participant => (
                            <div key={participant.id} className={styles.entry}>
                                <p className={`${styles.entryField} ${styles.idField}`} title="ID">{participant.id}</p>
                                <p className={`${styles.entryField} ${styles.userNameField}`} title="Details">
                                    Name: {participant.userName}<br />
                                    E-Mail: {participant.email}<br />
                                    Mobil: {participant.mobile}
                                </p>
                                <p className={`${styles.entryField} ${styles.ticketCountField}`} title="Ticketanzahl">
                                    {participant.ticketCount} {participant.ticketCount === 1 ? 'Ticket' : 'Tickets'}
                                </p>
                                <button className={`${styles.entryButton} ${styles.increment}`} onClick={() => incrementTicketCount(participant.id)}>
                                    <Image src={plusIcon} alt="Erhöhen" width={25} height={25} />
                                </button>
                                <button className={`${styles.entryButton} ${styles.decrement}`} onClick={() => decrementTicketCount(participant.id)}>
                                    <Image src={minusIcon} alt="Verringern" width={25} height={25} />
                                </button>
                                <button className={styles.entryButton} onClick={() => deleteParticipantEntry(participant.id)}>
                                    <Image src={trashcanIcon} alt="Löschen" width={25} height={25} />
                                </button>
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

export default Dashboard;