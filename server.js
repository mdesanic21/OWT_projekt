const express = require("/usr/lib/node_modules/express");
const ds = require("fs");
const { json } = require("stream/consumers");
const server = express();

const port = 12340;
const putanja = __dirname;
const CSVHandler =require("./rezervacije.js");

//REST
const csvFilePath = 'podaci/rezervacije.csv';
const csvHandler = new CSVHandler(csvFilePath);

server.get('/api/rezervacije', (zahtjev, odgovor) => {
  const rezervacije = csvHandler.citaj();
  odgovor.status(200).json(rezervacije);
});

server.post("/api/rezervacije", (zahtjev, odgovor) => {
  let podaci = zahtjev.body;
  console.log(podaci);
  odgovor.type("json");
  if (podaci == null) {
    odgovor.status(417);
    odgovor.send(JSON.stringify({ poruka: "Nevaljani podaci" }));
  } else {
    csvHandler.pisi(podaci);
    odgovor.status(200);
    odgovor.send(JSON.stringify({ poruka: "Podaci dodani" }));
  }
});

server.put('/api/rezervacije', (zahtjev, odgovor) => {
  odgovor.status(501).json({ error: 'Metoda nije implementirana' });
});

server.delete('/api/rezervacije', (zahtjev, odgovor) => {
  odgovor.status(501).json({ error: 'Metoda nije implementirana' });
});

server.get('/api/rezervacije/:id', (zahtjev, odgovor) => {
  const id = zahtjev.params.id;

  ds.readFile(csvFilePath, 'utf-8', (err, data) => {
    if (err) {
      odgovor.status(500).json({ greska: 'Internal server error' });
      return;
    }

    const rows = data.trim().split('\n');
    const header = rows[0].split(',');

    if (id < 1 || id >= rows.length) {
      odgovor.status(404).json({ greska: 'Nema resursa' });
      return;
    }

    const rowData = rows[id].split(',');
    const rezervacije = {};

    for (let i = 0; i < header.length; i++) {
      rezervacije[header[i]] = rowData[i];
    }

    odgovor.status(200).json(rezervacije);
  });
});

server.post('/api/rezervacije/:id', (zahtjev, odgovor) => {
  odgovor.status(405).json({ greska: 'Metoda nije dopuštena' });
});

server.put('/api/rezervacije/:id', (zahtjev, odgovor) => {
  odgovor.status(501).json({ greska: 'Metoda nije implementirana' });
});

server.delete('/api/rezervacije/:id', (zahtjev, odgovor) => {
  const id = zahtjev.params.id;

  ds.readFile(csvFilePath, 'utf-8', (err, data) => {
    if (err) {
      odgovor.status(500).json({ greska: 'Internal server error' });
      return;
    }

    const rows = data.trim().split('\n');

    if (id < 1 || id >= rows.length) {
      odgovor.status(417).json({ greska: 'Nevaljani podaci' });
      return;
    }

    rows.splice(id, 1);

    const update = rows.join('\n');

    ds.writeFile(csvFilePath, update, 'utf-8', (err) => {
      if (err) {
        odgovor.status(500).json({ greska: 'Internal server error' });
        return;
      }

      odgovor.status(200).json({ message: 'Podaci su obrisani' });
    });
  });
});
//REST

// HYPERLINKOVI
server.get("/", (zahtjev, odgovor) => {
	odgovor.sendFile(putanja + "/html/index.html");
});

server.get("/index", (zahtjev, odgovor) => {
	odgovor.sendFile(putanja + "/html/index.html");
});

server.get("/hotel_egipat", (zahtjev, odgovor) => {
	odgovor.sendFile(putanja + "/html/hotel_egipat.html");
});

server.get("/hotel_grcka", (zahtjev, odgovor) => {
	odgovor.sendFile(putanja + "/html/hotel_grcka.html");
});

server.get("/hotel_turska", (zahtjev, odgovor) => {
	odgovor.sendFile(putanja + "/html/hotel_turska.html");
});

server.get("/kontakt", (zahtjev, odgovor) => {
	odgovor.sendFile(putanja + "/html/kontakt.html");
});

server.get("/autor", (zahtjev, odgovor) => {
	odgovor.sendFile(putanja + "/dokumentacija/autor.html");
});

server.get("/dokumentacija", (zahtjev, odgovor) => {
	odgovor.sendFile(putanja + "/dokumentacija/dokumentacija.html");
});

server.get("/cjenik", (zahtjev, odgovor) => {
	odgovor.sendFile(putanja + "/html/cjenik.html");
});

server.get("/galerija", (zahtjev, odgovor) => {
	odgovor.sendFile(putanja + "/html/galerija.html");
});

server.get("/rezervacije", (zahtjev, odgovor) => {
	odgovor.sendFile(putanja + "/html/rezervacije.html");
});
//HYPERLINKOVI - KRAJ

// DINAMICNA
server.get('/dinamicna', (zahtjev, odgovor) => {
  const prijeHtml = ds.readFileSync('podaci/zaglavlje.txt', 'utf8');
  const nakonHtml = ds.readFileSync('podaci/podnozje.txt', 'utf8');

  let data = ds.readFileSync('podaci/cjenik.json', 'utf-8');
  data = JSON.parse(data);

  let tablica = '<table>';
  // Header row
  tablica += `<tr><th>${Object.keys(data[0]).join('</th><th>')}</th></tr>`;

  // Data rows
  for (let red of data) {
    tablica += `<tr><td>${Object.values(red).join('</td><td>')}</td></tr>`;
  }
  tablica += '</table>';

  odgovor.type('html');
  odgovor.write(prijeHtml);
  odgovor.write(tablica);
  odgovor.write(nakonHtml);
  odgovor.end();
});

//DINAMICNA KRAJ

server.use("/css", express.static(putanja + "/css"));
server.use("/dokumenti", express.static(putanja + "/dokumenti"));

server.get("/javascript", (zahtjev, odgovor) => {
	odgovor.sendFile(putanja + "/jsk/mdesanic21.js");
});

server.use((zahtjev, odgovor) => {
	odgovor.status(404);
	odgovor.send("<a href=/index>Stranica nije pronađena!</a>");
});

server.listen(port, () => {
	console.log(`Server pokrenut na portu: ${port}`);
});
