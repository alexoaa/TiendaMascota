import dotenv from 'dotenv';
if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}
import { Router } from 'express';
const router = Router();

import bcrypt from 'bcrypt';
import passport from 'passport';
// import flash from 'express-flash';
import session from 'express-session';
import methodOverride from 'method-override';
import { body, validationResult } from 'express-validator';
import { mysqlConnection } from '../../database.js';
// import index from '../index.js';
// import passwordReset from './passwordReset.js';

import initializePassport from './passport-config.js';
initializePassport(passport);

//* Middleware
// router.use(flash());
//?Para production no se ocupa el process.env.SESSION_SECRET
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
router.post('/login', checkNotAuthenticated, checkLogInData, function (req, res, next) {
  passport.authenticate('local', function (err, user, info) {
    if (err) {
      return next(err);
    }
    // Se notifica al cliente si algo falló o si un hay objeto user de PassportJS
    if (!user) {
      console.log(info);
      return res.status(401).send(info.message);
    }
    req.logIn(user, function (err) {
      if (err) {
        return next(err);
      }
      // Enviamos datos del user si se pudo autenticar
      // console.log(user);
      delete user.contrasena_U;
      return res.status(200).json({ user }); //!
    });
  })(req, res, next);
});

router.post(
  '/registrar',
  body('email').isEmail(),
  body('password').isLength({ min: 8 }),
  body('phone').isMobilePhone(['es-MX']),
  checkNotAuthenticated,
  async (req, res) => {
    try {
      const { name, phone, email, password, confirmPassword } = req.body;
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
      const query = 'SELECT COUNT(email_U) FROM usuario WHERE email_U = ?';
      mysqlConnection.query(query, [email], (err, results) => {
        if (err) return console.log(err);
        //     //* Si no existe un user con el email, crea un nuevo user
        if (results[0]['COUNT(email_U)'] > 0 !== true) {
          const id = Date.now().toString();
          const role = 'user';

          // !CAMBIO DE QUERY, SE QUITO CALL A PROCEDURE Y SE AGREGO LA QUERY DIRECTA PARA PROBAR EN DEPLOYMENT
          //       // const query = 'CALL registrarNuevoUsuario(?,?,?,?,?,?,?);';

          const query =
            'INSERT INTO usuario (id_U, role_U, nombre_U, email_U, telefono_U, contrasena_U) VALUES (?,?,?,?,?,?);';
          //* Añade el nuevo user a la DB y notifica el regitro fue exitoso
          mysqlConnection.query(query, [id, role, name, email, phone, hashedPass], (err) => {
            if (err) {
              console.log({ status: 'error', log: err });
              return res.status(500).send('Ya existe una cuenta con ese correo.');
            }
            return res.status(200).send('Registro exitoso');
          });
        } else {
          //* Si existe un user con el email, se avisa al user
          return res.status(400).send('Ya existe una cuenta con ese correo.');
        }
      });
    } catch {
      return res.status(500).send('Ha ocurrido un error.');
    }
  }
);

router.delete('/logout', checkAuthenticated, (req, res) => {
  req.logOut((err) => {
    if (err) return res.status(500).send(err);
  });
  return res.status(200);
});

// router.use('/password', checkNotAuthenticated, passwordReset);

//* Middleware functions
function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(501).send('No autenticado.');
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.status(200).send('Ya autenticado.');
  }
  return next();
}

function checkLogInData(req, res, next) {
  const { email, password } = req.body;
  if (email === '' || password === '') {
    return res.status(400).json({ error: 'Se necesitan credenciales para acceder.' });
  } else {
    return next();
  }
}

export default router;
