import { Router } from 'express';
//? Module sql import
import { mysqlConnection } from '../../database.js';

const router = Router();

//! https://restfulapi.net/http-status-codes/

router.get('/consultar-catalogo', (req, res) => {
  // if (Object.keys(req.query).length === 0) {
  //   console.log('El objeto está vacío');
  //   return;
  // }
  console.log(req.query);
  if (req.query.especie === 'Otro') {
    const query = 'SELECT * FROM mascota WHERE especie NOT IN (?, ?);';
    mysqlConnection.query(query, ['Perro', 'Gato'], (err, results) => {
      if (err) {
        return res.status(400).send({ status: 'error', log: err });
      }
      // console.log(results);

      return res.status(200).send(results);
    });
  } else {
    const query = 'SELECT * FROM mascota WHERE especie = ?;';
    mysqlConnection.query(query, [req.query.especie], (err, results) => {
      if (err) {
        return res.status(400).send({ status: 'error', log: err });
      }
      // console.log(results);

      return res.status(200).send(results);
    });
  }
});

router.delete('/eliminar-animal', (req, res) => {
  console.log(req.query);
  const query = 'DELETE FROM mascota WHERE id_mascota = ?;';
  mysqlConnection.query(query, [req.query.idMascota], (err, results, fields) => {
    if (err) {
      return res.status(400).send({ status: 'error', log: err });
    }
    // console.log(results);

    return res.status(200).send('Eliminado correctamente');
  });
});

export default router;
