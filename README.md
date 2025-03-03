# 🎟️ **RAFFLE**
**R.A.F.F.L.E.** ist ein Tool, um **Auslosungen** durchzuführen. \
Hierfür können sich die Nutzer auf einer dazugehörigen Webseite registrieren.
Ein Admin übernimmt die Ticketverwaltung und kann somit Nutzern individuell auch mehr Tickets zuweisen, z.B wenn diese Aufgaben durchführen.
Anschließend kann vom Administrator die Auslosung gestartet und ein Gewinner ermittelt werden.
## ⚙️ **Setup**
Aktuell ist es nur möglich, die Webseite mit **Docker Compose** aufzusetzen. Für Kubernetes, etc. stehen keine Konfigurationen zur Verfügung. 
Jedoch sollte es recht leicht möglich sein, diese Konfigurationen zu erstellen.

### 📋 **Voraussetzungen**
- **Linux Betriebssystem**
- **Docker** bzw. **Docker-Compose**
- **Eine Internetverbindung**

### 🛠️ **Konfiguration**
Um die Applikation zu konfigurieren, muss die Datei `deploy/.env` erstellt werden. Die Datei `deploy/.env.example` enthält Beispiele für die Konfiguration.
Die Datei muss folgende Informationen enthalten:
```env
ADMIN_ACCESS_PASSWORD=Das Administratorpasswort der Webseite
EMAIL=Die E-Mail, die benutzt wird, um ein neues Let's Encrypt Zertifikat zu beantragen
DOMAIN=Die Domain, auf der die Seite erreichbar sein wird (e.g. localhost:80)
NEXT_PUBLIC_API_URL=Die URL, auf der die API erreichbar sein wird (Meistens: http://${DOMAIN})
METADATA_TITLE=Der Titel der Webseite
METADATA_DESCRIPTION=Eine kurze Beschreibung der Webseite
```

Optional kann die `deploy/docker-compose.prod.yml` Datei angepasst werden. Es empfiehlt sich, den Speicherpfad für das Volume für die API zu ändern. Dort werden die Nutzer und die Welcome Page gespeichert.

Die Konfigurationsdateien für **nginx** sind unter `deploy/nginx/prod/app.conf.template` zu finden

## 🚀 **Ausführung**
### **Development**
Zum Testen kann **raffle** mit folgendem Befehl gestartet werden (im `deploy` Ordner):
```sh
docker compose -f docker-compose.dev.yml -p raffle up -d --build
```
Zum Beenden:
```sh
docker compose -f docker-compose.prod.yml -p raffle down
```

### **Production**
Bevor die Applikation gestartet werden kann, muss zuerst das **Let's Encrypt Zertifikat** beantragt werden. Dazu führt man das `deploy/init-letsencrypt.sh` Skript aus. \
Danach lässt sich die Applikation mit `deploy/run.sh` starten und mit `deploy/stop.sh` beenden.

## 🖥️ **Bedienung**
Nach dem Starten von **Raffle** sollte die Weboberfläche unter der zuvor konfigurierten Domain verfügbar sein.
Beim Aufrufen der Webseite wird man nach einem Passwort gefragt – Dort kann sowohl ein Nutzerpasswort, als auch das zuvor festgelegte Admin Passwort eingegeben werden.
Admins werden anschließend automatisch zur Admin Seite weitergeleitet und Nutzer zur Registrierungsseite.

### **Admin-Seite**
#### **Die Welcome Page anpassen**
Bevor die Auslosung beginnen kann, muss die **Welcome Page** angepasst werden. 
- Dazu auf der Admin-Seite in der linken Leiste auf den Tab **"Einstellungen"** klicken 
- Dort müssen der Titel, die Beschreibung und das Hintergrundbild für die Nutzerseite angegeben werden 
- Zum Speichern der Eingaben auf **"Ändern"** klicken

#### **Passwörter anlegen**
Im Reiter **"Übersicht"** auf der Admin-Seite können Passwörter, mit denen sich die Nutzer anmelden können angelegt werden. Dazu in der Box **"Zugangspasswörter"** auf **"Neues Zugangspasswort anlegen"** klicken. Dadurch wird ein neues Passwort erstellt und erscheint in der Liste unter dem Button an unterster Stelle.

- Die Zahl links neben einem Passwort ist die jeweilige **ID** des Passwortes
- Der Haken bzw. das X rechts daneben gibt an, ob sich bereits ein Nutzer mit diesem Passwort registriert hat
- Der Hexadezimalwert ist das eigentliche Zugangspasswort
- Der blaue Button kopiert das Passwort in die Zwischenablage
- Der rote Button löscht das Passwort (**VORSICHT**: Löscht man ein benutztes Passwort, wird auch der Nutzer dazu gelöscht. Es gibt keine erneute Nachfrage vor dem Löschen)

Nun können die erstellten Passwörter an die Nutzer verteilt werden, welche sich mit diesen dann registrieren können.

#### **Nutzer verwalten**
Unter der Box für die Zugangspasswörter befindet sich die Box **"Registrierte Teilnehmer"**. Dort erscheinen die Nutzer, sobald sie sich auf der Seite registriert haben. 

- Mit den Buttons **+** und **–** kann die Anzahl der Tickets des Nutzers verändert werden
- Der rote Button löscht den Nutzer. Dabei bleibt jedoch das Anmeldepasswort bestehen und kann von da an erneut zum Registrieren benutzt werden

#### **Eine Auslosung starten**
Im Reiter **"Auslosung"** auf der Admin-Seite können Auslosungen gestartet werden. Dazu einfach auf den Button **"Auslosen"** klicken. 

- Danach erscheint der Gewinner der Auslosung über dem Button, sowie im Reiter **"Übersicht"** in der Box **"Beendete Auslosungen"**

**Auslosungen** funktionieren nach dem folgenden Prinzip:
1. Die Tickets aller registrierten Nutzer werden zusammengezählt
2. Aus diesen Tickets wird das Gewinner-Ticket zufällig ausgewählt
3. Der Nutzer mit diesem Ticket gewinnt die Auslosung

### **Nutzer-Seite**
Sobald ein Nutzer sich mit seinem Passwort angemeldet hat, wird er auf die **Welcome Page** weitergeleitet, welche vorher über die Admin-Seite angepasst bzw. personalisiert wurde.

- Dort wird der Nutzer gebeten, sich mit seinem Namen, seiner E-Mail-Adresse und seiner Telefonnummer zu registrieren
- Danach wird er auf eine Seite weitergeleitet, welche ihm zur erfolgreichen Registrierung gratuliert. Daraufhin kann sich der Nutzer auch nicht mehr mit seinem Passwort anmelden, es sei denn, sein Nutzer wird gelöscht

Durch die Registrierung erhält der Nutzer automatisch ein Ticket.

## 💡 **Bekannte Fehler & Mögliche Verbesserungen**
1. Wurde die **Welcome Page** im Admin-Menü nicht vorher angepasst, wird dem Nutzer beim Registrieren eine unvollständige Seite angezeigt
2. Der Hintergrund auf der **Welcome Page** sollte nicht zu groß sein (~1080p ist gut geeignet). Falls es einen Fehler beim Akzeptieren gibt, ist das Bild zu groß
3. Jegliche **Löschen Buttons** haben keine erneute Nachfrage vor dem Löschen
4. Löscht man ein Zugangspasswort, mit dem sich bereits ein Nutzer registriert hat, wird dieser ebenfalls gelöscht
5. Löscht man einen Nutzer, kann das Passwort, mit dem er sich registriert hat, erneut verwendet werden
6. Beim Neuladen der Seite wird man abgemeldet
7. Die **Admin-Seite** wird auf Smartphones nicht richtig dargestellt (Die Seiten für Nutzer sind davon nicht betroffen)
8. Das **Admin Passwort** kann nur in der Config-Datei geändert werden

## 👨‍💻 **Verantwortliche**
[@zTOJU](https://github.com/zTOJU) \
[@2000Dobby](https://github.com/2000Dobby)
