import { Router } from 'express';
//? Module sql import
import { mysqlConnection } from "../../database.js"

const router = Router();

router.get('/agendar-una-cita', (req, res) => {
    res.render('citas/agendar.ejs', { mensajeError: '' });
});

router.post('/nueva-cita', (req, res) => {
    const { nombreCliente, nombreMascota, razaMascota, numeroTelefono, segundoNumTel, servicio, fechaCita, horarioSelect, precioServicio } = req.body;
    if (!(Object.keys(req.body).length === 0)) {
        // !CAMBIO DE QUERY, SE QUITO CALL A PROCEDURE Y SE AGREGO LA QUERY DIRECTA PARA PROBAR EN DEPLOYMENT
        // const estado = 'PENDIENTE';
        const query = 'INSERT INTO cita (nombre_cliente_C, numero_telefono_C, segundo_num_tel_C, nombre_mascota_C, raza_mascota_C, servicio_C, precio_C, fecha_C, hora_C, estado_C) VALUES (?,?,?,?,?,?,?,?,?,"PENDIENTE");';
        mysqlConnection.query(query, [nombreCliente, numeroTelefono, segundoNumTel,nombreMascota, razaMascota, servicio, precioServicio, fechaCita, horarioSelect], (err, results, fields) => {
            //! https://restfulapi.net/http-status-codes/
            if (err) {
                console.log({ status: "error", log: err });
                return res.status(500).render('citas/agendar.ejs', { mensajeError: 'Ha ocurrido un error, intentalo mas tarde' });
            }
            return results;
        }
        );
    } else {
        res.status(405).render('citas/agendar.ejs', { mensajeError: 'Necesitas ingresar todos los datos.' });
    }
});

router.post('/horario-disponible', (req,res)=>{
    const { fechaCita } = req.body;
    mysqlConnection.query('SELECT * FROM cita WHERE fecha_C = ?', [fechaCita], (err, results)=>{
        if (err) return console.log(err);
        // console.log(results);
        return res.json(results);
    });
    
})
/* router.post('/confirmacion-cita', (req, res) => {
    const { nombreMascota, servicio, fechaCita, horaCita, precioServicio } = req.body;
    console.log(req.body);
    res.status(200).render('confirmacionCita', {
        message: 'Cita agendada!',
        nombreMascota: nombreMascota,
        servicio: servicio,
        fechaCita: fechaCita,
        horaCita: horaCita,
        precioServicio: precioServicio
    });
});
 */

export default router;