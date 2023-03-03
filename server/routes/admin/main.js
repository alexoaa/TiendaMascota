import { Router } from 'express';
import { mysqlConnection } from '../../database.js';

const router = Router();

router.get('/activity-log', (req, res) => {
  const query = `SELECT id_registro_R AS IdRegistro, DATE_FORMAT(DATE(fecha_R), '%d/%m/%Y') AS Fecha, TIME(fecha_R) AS Hora, u.id_U AS IdUsuario, u.nombre_U AS Usuario, accion_R AS Accion, m.id_mascota AS IdMascota, m.nombre AS Mascota
  FROM registro
  INNER JOIN usuario u ON usuario_id_R = u.id_U
  INNER JOIN mascota m ON mascota_id_R = m.id_mascota
  ORDER BY Fecha DESC`;

  // const query = 'SELECT * FROM registro ORDER BY fecha_R DESC;';
  mysqlConnection.query(query, (err, results, fields) => {
    if (err) {
      return res.status(400).json({ status: 'error', log: err });
    }
    // console.log(results);

    return res.status(200).json(results);
  });
});

export default router;
