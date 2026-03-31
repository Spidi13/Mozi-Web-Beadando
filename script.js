// script.js - A Vanilla JS CRUD logika

// 1. A nyers adatbázisod (film.txt alapján, az első kb. 15 filmmel, hogy átlátható legyen)
const nyersFilmAdatok = `1	Csókolj meg, édes!	1932	67
2	Repülő arany	1932	48
3	Piri mindent tud	1932	92
4	Az ellopott szerda	1933	72
5	Mindent a nőért	1933	57
6	Emmy	1934	83
7	Szerelmi álmok	1935	66
8	A titokzatos idegen	1936	59
9	Havi 200 fix	1936	86
10	Szerelemből nősültem	1937	67`;

// Itt tároljuk a filmeket (ez a mi "adatbázisunk" a memóriában)
let filmekTomb = [];

// 2. Beolvasó függvény: Feldolgozza a nyers szöveget és beteszi a tömbbe
function adatokBeolvasasa() {
    const sorok = nyersFilmAdatok.split('\n'); // Szétszedjük sorokra
    for (let sor of sorok) {
        if (sor.trim() !== '') {
            const adatok = sor.split('\t'); // Szétszedjük a tabulátorok mentén
            filmekTomb.push({
                id: parseInt(adatok[0]),
                cim: adatok[1],
                ev: parseInt(adatok[2]),
                hossz: parseInt(adatok[3])
            });
        }
    }
}

// 3. READ: Megjeleníti a filmeket a táblázatban
function tablaKirajzolasa() {
    const tbody = document.getElementById('film-tabla-body');
    tbody.innerHTML = ''; // Kiürítjük a régi tartalmat

    for (let film of filmekTomb) {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${film.id}</td>
            <td>${film.cim}</td>
            <td>${film.ev}</td>
            <td>${film.hossz}</td>
            <td>
                <button onclick="szerkesztesBetoltese(${film.id})">✏️ Szerkesztés</button>
                <button class="btn-delete" onclick="torles(${film.id})">🗑️ Törlés</button>
            </td>
        `;
        tbody.appendChild(tr);
    }
}

// 4. CREATE & UPDATE: Mentés gomb logikája
function mentes() {
    const idInput = document.getElementById('film-id').value;
    const cim = document.getElementById('film-cim').value;
    const ev = parseInt(document.getElementById('film-ev').value);
    const hossz = parseInt(document.getElementById('film-hossz').value);

    // Bemenet ellenőrzése
    if (cim === '' || isNaN(ev) || isNaN(hossz)) {
        alert("Kérlek tölts ki minden mezőt helyesen!");
        return;
    }

    if (idInput === '') {
        // --- CREATE: Új film hozzáadása ---
        // Megkeressük a legnagyobb ID-t, és ahhoz adunk egyet
        let maxId = 0;
        for (let f of filmekTomb) {
            if (f.id > maxId) maxId = f.id;
        }
        
        filmekTomb.push({ id: maxId + 1, cim: cim, ev: ev, hossz: hossz });
    } else {
        // --- UPDATE: Meglévő film módosítása ---
        const id = parseInt(idInput);
        const index = filmekTomb.findIndex(f => f.id === id);
        if (index !== -1) {
            filmekTomb[index].cim = cim;
            filmekTomb[index].ev = ev;
            filmekTomb[index].hossz = hossz;
        }
    }

    urlapTorles();
    tablaKirajzolasa();
}

// UPDATE (Előkészítés): Betölti a kiválasztott film adatait az űrlapba
function szerkesztesBetoltese(id) {
    const film = filmekTomb.find(f => f.id === id);
    if (film) {
        document.getElementById('form-title').innerText = "Film módosítása";
        document.getElementById('film-id').value = film.id;
        document.getElementById('film-cim').value = film.cim;
        document.getElementById('film-ev').value = film.ev;
        document.getElementById('film-hossz').value = film.hossz;
    }
}

// 5. DELETE: Film törlése
function torles(id) {
    if (confirm("Biztosan törölni szeretnéd ezt a filmet?")) {
        // Kiszűrjük azt az egy filmet, amit törölni akarunk
        filmekTomb = filmekTomb.filter(f => f.id !== id);
        tablaKirajzolasa();
    }
}

// Segédfüggvény: Kiüríti a beviteli mezőket
function urlapTorles() {
    document.getElementById('form-title').innerText = "Új film hozzáadása";
    document.getElementById('film-id').value = '';
    document.getElementById('film-cim').value = '';
    document.getElementById('film-ev').value = '';
    document.getElementById('film-hossz').value = '';
}

// PROGRAM INDÍTÁSA
// Amikor betöltődik az oldal, beolvassuk az adatokat és kirajzoljuk a táblázatot
window.onload = function() {
    adatokBeolvasasa();
    tablaKirajzolasa();
};