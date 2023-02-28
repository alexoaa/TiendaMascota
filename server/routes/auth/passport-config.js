import LocalStrategy from 'passport-local';
LocalStrategy.Strategy;
import bcrypt from 'bcrypt';
import { mysqlConnection } from '../../database.js';

function initialize(passport) {
  const authenticateUser = async (email, password, done) => {
    //* Comprueba si existe un user con el email
    const query = 'SELECT * FROM cliente WHERE email_CL = ?';
    mysqlConnection.query(query, [email], async (err, results, fields) => {
      if (err) return done(err);
      if (!results.length) {
        console.log('El correo es incorrecto.');
        return done(null, false, { message: 'El correo/contraseña es incorrecto.' });
      }
      //* Comprobar si las passwords son las mismas
      if (!(await bcrypt.compare(password, results[0]['contrasena_CL']))) {
        console.log('La contraseña es incorrecta.');
        return done(null, false, { message: 'El correo/contraseña es incorrecto.' });
      }
      //* Si las credenciales coinciden, se accede
      return done(null, results[0]);
    });
  };
  passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser));

  passport.serializeUser((user, done) => done(null, user['id_CL']));

  passport.deserializeUser((id, done) => {
    mysqlConnection.query('SELECT * FROM cliente WHERE id_CL = ?', [id], (err, results) => {
      return done(err, results[0]);
    });
  });
}
export default initialize;
