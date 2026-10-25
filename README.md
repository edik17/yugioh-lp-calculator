# DUEL DISK PRO // Yu-Gi-Oh! Life Points & Duel Companion

Una Progressive Web App (PWA) moderna, responsive e completa per il calcolo dei Life Points e la gestione dei duelli ufficiali di **Yu-Gi-Oh! TCG / OCG / Speed Duel**.

Ottimizzata sia per smartphone (iOS / Android) che per tablet e desktop, con supporto per **Modalità Tavolo 180°** (Face-to-Face Tabletop) per duellare su un singolo dispositivo appoggiato tra i due giocatori.

---

## ⚡ Caratteristiche Principali

* **Calcolo Life Points (8000 LP Default + 4000 / 16000 / Custom)**
  * Tastierino stile Konami Neuron con pulsanti rapidi `00` e `000`.
  * Modifiche rapide (`-100`, `-500`, `-1000`, `-1500`, `-2000`, `+500`, `+1000`).
  * **Dimezza LP (`÷2`)** con arrotondamento per eccesso ufficiale TCG (*Math.ceil*) per carte come *Giudizio Solenne* o *Dinomorphia*.
  * **Raddoppia LP (`×2`)** e Calcolo automatico della Differenza di Danno da Battaglia (ATK vs ATK/DEF).
  * **Annulla / Ripeti (Undo / Redo)** con cronologia completa del duello.

* **🔊 Sound Effects Ufficiali Stile Anime Yu-Gi-Oh! (Web Audio API)**
  * Boato d'impatto ed esplosione ad ogni danno subito con scossa arena e flash visivo su schermo.
  * Taglio laser / ghigliottina elettrica per il dimezzamento dei Life Points (`÷2`).
  * Celebre cascata sonora ad alta velocità del contatore LP (*"Pi-ri-ri-ri-ri!"*) con 3 profili: **Anime DM Classico**, **GX / 5D's Duel Disk**, **Master Duel Moderno**.
  * Chime di blocco punteggio a fine scorrimento (*"PI-PI -> DING!"*).
  * Allarme LP Critici sotto i 2000 LP.
  * Suono drammatico di spegnimento e sconfitta a 0 LP.
  * **Soundboard Duello**: Attacco / Impatto, Attivazione Carta Trappola, Evocazione Boss, Distruzione Mostro Olografico.

* **🧿 Segnalini (Counters) & Segna-Mostro (Tokens)**
  * Segnalini preimpostati: *Magia*, *Kaiju*, *Bushido*, *Predatore*, *Orologio/Destino*, *A-Alieno/Veleno* + personalizzati.
  * Segna-Mostro preimpostati: *Token Nibiru*, *Token Spadafrantumata*, *Token Avventuriero*, *Token Capra*, con switch rapido posizione **⚔️ ATK / 🛡️ DEF**.

* **⏱️ Strumenti da Torneo & Tavolo**
  * **Modalità Tavolo 180° (`⇅`)**: capovolge la scheda del Giocatore 2 di 180° per duellare comodamente con il telefono sul tavolo.
  * **Contatore Evocazioni Nibiru (`☄️`)**: tiene traccia delle evocazioni nel turno e avverte al raggiungimento della 5ª evocazione.
  * **6 Fasi Ufficiali (`DP`, `SP`, `MP1`, `BP`, `MP2`, `EP`)** con blocco automatico della Battle Phase al Turno 1.
  * **Lancio Moneta & Dado D6** (singoli o multipli fino a 3).
  * **Timer Torneo 45:00** con notifica di fine tempo (*End of Match Procedure*).
  * Match Best of 3 (stelle vittoria G1 / G2).

* **📱 100% Offline & PWA per Smartphone**
  * Installabile come app nativa a schermo intero su iPhone e Android ("Aggiungi a schermata Home").
  * Funziona senza connessione internet grazie al Service Worker integrato.

---

## 📱 Come Installare su Smartphone

1. Apri il link nel browser del tuo smartphone (Safari su iOS, Chrome su Android).
2. Su iOS: tocca il pulsante **Condividi** e seleziona **"Aggiungi alla schermata Home"**.
3. Su Android: tocca il menu a tre puntini e seleziona **"Installa applicazione"** o **"Aggiungi a Home"**.
4. L'app si aprirà a schermo intero come una vera applicazione nativa, pronta per qualsiasi torneo o duello tra amici!
