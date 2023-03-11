//! To use "import" ECMS6 in packacge.json should use "type" : "module"

import express from 'express';
// import ejs from "ejs";
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
// import citas from './routes/citas/nuevaCita.js';
import consultarCatalogo from './routes/animales/consultarsAnimales.js';
import auth from './routes/auth/auth.js';
import cors from 'cors';

const app = express();

//* create dynamic route
const __dirname = dirname(fileURLToPath(import.meta.url));

//* Settings
app.set('port', process.env.PORT || 5600);

//* Middleware
app.use(express.json()); //To convert data recieved into json
app.use(express.static(join(__dirname, '../dist'))); // Load files to the nav web so they can access
app.use(express.urlencoded({ extended: false }));
app.use(cors());

// const whitelist = ['http://169.254.166.60'];
// const corsOptions = {
//   origin: function (origin, callback) {
//     if (whitelist.indexOf(origin) !== -1) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
// };

// app.use(cors(corsOptions));

app.use(auth);
app.use(consultarCatalogo);

app.get('/', (req, res) => {
  // res.send('H');
  res.sendFile(join(__dirname, 'dist', 'index.html'));
});
app.use('*', (req, res) => {
  res.redirect('/');
});

//* Starting server
app.listen(app.get('port'), () => {
  console.log(`Server on port ${app.get('port')}`);
});
