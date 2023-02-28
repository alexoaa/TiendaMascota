import dotenv from 'dotenv';
if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}
import { Router } from 'express';
const router = Router();

import bcrypt from 'bcrypt';
import passport from 'passport';
import flash from 'express-flash';
import session from 'express-session';
import methodOverride from 'method-override';
import { body, validationResult } from 'express-validator';
import { mysqlConnection } from '../../database.js';
// import index from '../index.js';
// import passwordReset from './passwordReset.js';

import initializePassport from './passport-config.js';
initializePassport(passport);

//* Middleware
router.use(flash());
router.use(
  session({
    secret: 'secret' /*process.env.SESSION_SECRET*/,
    resave: false,
    saveUninitialized: false,
  })
);
router.use(passport.initialize());
router.use(passport.session());
router.use(methodOverride('_method'));

//* Routes
// router.get('/', checkAuthenticated, index);

// router.get('/login', checkNotAuthenticated, (req, res) => {
//     res.json({'login.ejs'});
// });
// router.get('/inicio', checkNotAuthenticated, (req, res) => {
//     res.render('main.ejs');
// });

//* Se quitara un middleware "checkNotAuthenticated" antes de "checkLogInData" pero despues se pondrá
router.post('/login', checkLogInData, function (req, res, next) {
  passport.authenticate('local', function (err, user, info) {
    if (err) {
      return next(err);
    }
    // Redirect if it fails
    if (!user) {
      // req.flash('message', info.message);
      console.log('No user');
      return res.status(500).send('Ha ocurrido un error.');
    }
    req.logIn(user, function (err) {
      if (err) {
        return next(err);
      }
      // Redirect if it succeeds
      // console.log(user);
      return res.status(200).send('Login exitoso');
    });
  })(req, res, next);
});

router.post(
  '/registrar',
  body('email').isEmail(),
  body('password').isLength({ min: 8 }),
  body('phone').isMobilePhone(['es-MX']),
  //   checkNotAuthenticated,
  async (req, res) => {
    try {
      const { name, phone, email, password, confirmPassword } = req.body;
      console.log(req.body);
      //* Comprueba si hay datos mandados por el user
      if (Object.keys(req.body).length === 0) {
        return res.status(400).send('Faltan campos obligatorios');
      }
      //* Comprueba si email, password y telefono son validos
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).send('Datos no validos');
      }

      //* Comprueba si las contraseñas son las mismas
      const hashedPass = await bcrypt.hash(password, 10);
      if (!(await bcrypt.compare(confirmPassword, hashedPass))) {
        return res.status(400).send('Las contraseñas no coinciden.');
      }

      //* Comprueba si existe un user con el email
      const query = 'SELECT COUNT(email_CL) FROM cliente WHERE email_CL = ?';
      mysqlConnection.query(query, [email], (err, results, fields) => {
        if (err) return console.log(err);
        //     //* Si no existe un user con el email, crea un nuevo user
        if (results[0]['COUNT(email_CL)'] > 0 !== true) {
          const id = Date.now().toString();
          // const role = 'user';

          // !CAMBIO DE QUERY, SE QUITO CALL A PROCEDURE Y SE AGREGO LA QUERY DIRECTA PARA PROBAR EN DEPLOYMENT

          //       // const query = 'CALL registrarNuevoUsuario(?,?,?,?,?,?,?);';
          const query =
            'INSERT INTO cliente (id_CL, nombre_CL, email_CL, telefono_CL, contrasena_CL) VALUES (?,?,?,?,?);';
          //       //* Añade el nuevo user a la DB y redirije a /login
          mysqlConnection.query(
            query,
            [id, name, email, phone, hashedPass],
            (err, results, fields) => {
              if (err) return console.log({ status: 'error', log: err });
              res.status(200).send('Registro exitoso');
            }
          );
        } else {
          //* Si existe un user con el email, se avisa al user
          return res.status(400).send('Ya existe una cuenta con ese correo.');
        }
      });
    } catch {
      res.status(500).send('Ha ocurrido un error.');
    }
  }
);

// router.delete('/logout', checkAuthenticated, (req, res) => {
//   req.logOut((err) => {
//     if (err) return next(err);
//   });
//   res.redirect('/login');
// });

// router.use('/password', checkNotAuthenticated, passwordReset);

//* Middleware functions
function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.redirect('/login');
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }
  return next();
}

function checkLogInData(req, res, next) {
  const { email, password } = req.body;
  if (email === '' || password === '') {
    return res.status(400).send('Se necesitan credenciales para acceder.');
  } else {
    return next();
  }
}

export default router;
