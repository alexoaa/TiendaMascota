import LocalStrategy from 'passport-local';
import { Strategy as JWTStrategy, ExtractJwt } from 'passport-jwt';
import bcrypt from 'bcrypt';
import { mysqlConnection } from '../../database.js';

LocalStrategy.Strategy;

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'your_refresh_secret_key';

function initialize(passport) {
  const authenticateUser = async (email, password, done) => {
    //* Comprueba si existe un user con el email
    const query = 'SELECT * FROM usuario WHERE email_U = ?';
    mysqlConnection.query(query, [email], async (err, results) => {
      if (err) {
        console.log(err);
        return done(err);
      }
      if (!results.length) {
        return done(null, false, { message: 'No existe un usario con este correo.' });
      }
      //* Comprobar si las passwords son las mismas con bcrypt para encriptar ya que en la DB esta encriptada
      if (!(await bcrypt.compare(password, results[0]['contrasena_U']))) {
        return done(null, false, { message: 'El correo/contraseña es incorrecto.' });
      }
      //* Si las credenciales coinciden, se accede
      return done(null, results[0]);
    });
  };

  //? ******* USANDO LOCAL STRATEGY **********
  //*Usamos local strategy y le pasamos los campos como objeto por las cuales se autenticara
  //* El segundo parametro es una funcion para autenticar el user en la DB
  passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser));

  //? ******* USANDO JWT STRATEGY **********
  const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
  };

  passport.use(
    new JWTStrategy(jwtOptions, async (payload, done) => {
      try {
        // Buscar al usuario en la base de datos utilizando el ID del usuario almacenado en el token
        console.log(payload);

        const query = 'SELECT * FROM usuario WHERE id_U = ?';
        mysqlConnection.query(query, [payload.user.id], async (err, results) => {
          if (err) {
            console.log(err);
            return done(err);
          }
          if (!results.length) {
            console.log('No existe un usario con este correo.');
            return done(null, false, { message: 'Usuario no encontrado' });
          }
          //* Si las credenciales coinciden, se accede
          return done(null, results[0]);
        });
      } catch (error) {
        return done(error);
      }
    })
  );

  //? **************************************

  //*Una vez autenticado, PassportJS genera un objeto de usuario y lo serializa
  //*Serializacion es el proceso de convertir el objeto en una cadena o formato de texto que se pueda almacenar en la sesion
  passport.serializeUser((user, done) => {
    console.log('El user es:' + user['id_U']);
    done(null, user['id_U']);
  });

  //*Deserializacion - toma la cadena o formato serializado y lo convierte en un objeto
  passport.deserializeUser((id, done) => {
    mysqlConnection.query('SELECT * FROM usuario WHERE id_U = ?', [id], (err, results) => {
      console.log(results);
      return done(err, results[0]);
    });
  });
}
export default initialize;
