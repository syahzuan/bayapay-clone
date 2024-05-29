import express from 'express';
import sqlite3 from 'sqlite3';

const app = express();
const db = new sqlite3.Database('vehicles.db');

db.run(`CREATE TABLE IF NOT EXISTS vehicles (
  id INTEGER PRIMARY KEY,
  type TEXT,
  lock_unlock TEXT,
  current_speed INTEGER,
  battery_level INTEGER,
  status TEXT,
  latitude REAL,
  longitude REAL,
  last_updated TEXT
)`);

// Sample data provided in the UI
// const sampleData = [
//   [132456, 'Scooter', 'Lock', 0, 100, 'PARKING', 3.142,120, '2019-07-02T09:00:00'],
//   [987654, 'Scooter', 'Unlock', 5, 75, 'MOVING', 2.125,114, '2019-07-02T10:00:00'],
//   [569825, 'Scooter', 'Unlock', 0, 50, 'IDLING', 4.125,114, '2019-07-02T10:00:00'],
//   [125864, 'Scooter', 'Lock', 0, 15, 'TOWING', 5.125,114, '2019-07-02T10:00:00'],
//   [125865, 'Scooter', 'Lock', 0, 0, 'TOWING', 5.125,114, '2019-07-02T10:00:00']
// ];

// sampleData.forEach(data => {
//   db.run(`INSERT INTO vehicles (id, type, lock_unlock, current_speed, battery_level, status, latitude, longitude, last_updated)
//     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`, data);
// });

app.get('/api/vehicles', (req, res) => {
  db.all('SELECT * FROM vehicles', (err, rows) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {

        //formatting sql data into UI formats
        //latitudes and longitudes combined into one location
        //they are also destructed so they will not be included
        //ISO date to human readable date
        const formattedOutput = rows.map(({ latitude, longitude, ...row}) => ({
        ...row,
            location: `${latitude},${longitude}`,
            last_updated: new Date(row.last_updated).toLocaleString()
          }));
      res.json(formattedOutput);
    }
  });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});