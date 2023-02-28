import dotenv from 'dotenv';
if (process.env.NODE_ENV !== 'production') {
    dotenv.config();
}
import { Router } from "express";
import nodemailer from 'nodemailer';
import { google } from 'googleapis';
import { mysqlConnection } from "../../database.js";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { body, validationResult } from 'express-validator';
const OAuth2 = google.auth.OAuth2;
const router = Router();

//* Funcion para poder mandar mensaje al front end

router.get('/reset', /* body('email').isEmail(), */(req, res) => {
    res.render('password/passwordReset.ejs');
});

router.post('/reset', async (req, res) => {
    try {
        const userEmail = req.body.email;

        //* Comprueba si existe un user con el email
        const query = 'SELECT * FROM usuarios WHERE email_U = ?';
        mysqlConnection.query(query, [userEmail], (err, results, fields) => {
            if (err) return console.log(err);
            if (!results.length) {
                console.log('No existe una cuenta con ese correo.');
                req.flash('message', 'No existe una cuenta con ese correo.');
                return res.status(200).redirect('/password/reset');
            }
            const userId = results[0]['id_U'];
            const userPassword = results[0]['contrasena_U'];
            const secretJWT = process.env.JWT_SECRET + userPassword;
            const payload = { email: userEmail, id: userId }
            const token = jwt.sign(payload, secretJWT, { expiresIn: '15m' });
            // Link para localhost
            // const link = `http://localhost:5500/password/reset/confirm/${userId}/${token}`;
            // Link para railway
            const link = `https://petgroomer-app-production.up.railway.app/password/reset/confirm/${userId}/${token}`;

            const oauth2Client = new OAuth2(
                process.env.EMAIL_GOOGLE_CLIENT_ID,
                process.env.EMAIL_GOOGLE_CLIENT_SECRET,
                process.env.EMAIL_GOOGLE_REDIRECT_URI,
            );

            oauth2Client.setCredentials({
                refresh_token: process.env.EMAIL_GOOGLE_REFRESH_TOKEN,
                tls: {
                    rejectUnauthorized: false
                }
            });
            async function sendMail() {
                try {
                    const accessToken = oauth2Client.getAccessToken((err, token) => {
                        if (err) return console.log(err);
                        return token;
                    });

                    const transporter = nodemailer.createTransport({
                        service: "gmail",
                        auth: {
                            type: "OAuth2",
                            user: "alexoa.olveraa@gmail.com",
                            clientId: process.env.EMAIL_GOOGLE_CLIENT_ID,
                            clientSecret: process.env.EMAIL_GOOGLE_CLIENT_SECRET,
                            refreshToken: process.env.EMAIL_GOOGLE_REFRESH_TOKEN,
                            accessToken: accessToken
                        },
                    });
                    // send mail with defined transport object
                    return transporter.sendMail({
                        from: '"DogBarber 🐶" <alexoa.olveraa@gmail.com>', // sender address
                        to: userEmail, // list of receivers
                        subject: "Restablecimiento de contraseña de la cuenta DogBarber", // Subject line
                        // html: emailHTMLContent, // html body
                        html: `
                        <!DOCTYPE html>
                        <html lang="en">
                        <head>
                            <meta charset="UTF-8">
                            <meta http-equiv="X-UA-Compatible" content="IE=edge">
                            <meta name="viewport" content="width=device-width, initial-scale=1.0">
                            <style>
                                .container {
                                    line-height: 1.3em;
                                    font-family: sans-serif;
                                    text-align: center;
                                    color: #202020;
                                    max-width: 500px;
                                }
                                .form-container {
                                    max-height: 800px;
                                    padding: 20px;            
                                }
                                .extra-link {
                                    text-decoration: none;
                                    font-size: .8em;
                                    color: #999;
                                    margin-top: 25px;
                                }
                                .extra-link a {
                                    color: #999;
                                    text-decoration: underline;
                                }
                                .subcontainer {
                                    text-align: center;
                                    border-bottom: 1px solid #eee;
                                }
                                .subcontainer div {
                                    margin: 30px 0 20px;
                                    padding: 30px 10px 60px;
                                    font-size: 3em;
                                    border-bottom: 1px solid #eee;
                                    width: 100%;
                                    text-align: center;
                                }
                                .subcontainer div a {
                                    text-decoration: none;
                                    color: #3498db;
                                    font-weight: bold;
                                }
                                .subcontainer h4 {
                                    width: 100%;
                                    padding: 10px 10px;
                                }
                                .subcontainer p {
                                    padding: 20px 10px;
                                }
                                .submit-btn {
                                    display: inline-block;
                                    padding: 15px 30px;
                                    font-size: 1.1em;
                                    background-color: #3498db;
                                    color: #fff !important;
                                    font-weight: bold;
                                    margin-top: 40px;
                                    border: none;
                                    cursor: pointer;
                                    text-decoration: none;
                                }
                            </style>
                        </head>
                        
                        <body>
                            <div class="container">
                                <div class="form-container">
                                    <div class="subcontainer">
                                        <div><a href="#">DogBarber</a></div>
                                        <h4>Hola ${results[0]['nombre_U']}, eres tú quien intenta restablecer la contraseña?</h4>
                                        <p>Alguien a solicitado restablecer la contraseña de tu cuenta de DogBarber. Por favor dale click en el
                                            botón de abajo. Si no fuiste tú el que solicitó este restablecimiento de contraseña, puedes ignorar
                                            este correo.</p>
                                    </div>
                                    <a class="submit-btn" href="${link}">Restablecer contraseña</a>
                                    <p class="extra-link">O si tienes problemas con el botón, por favor da click en este link: <a
                                            href="${link}">Link</a></p>
                                </div>
                            </div>
                        </body>
                        </html>
                    `, // html body
                    }, (err, info) => {
                        if (err) {
                            req.flash('message', 'Hubo un error, intentálo mas tarde.');
                            console.log(err);
                            return res.status(500).redirect('/password/reset');
                        }
                        console.log(info);
                        const mensaje = `Hemos enviado un link a la dirección de correo electrónico`;
                        const mensaje2 = ` para restablecer tu contraseña. Puede que el correo tome unos minutos en aparecer, asegúrate de checar la carpeta de spam o no deseados.`;
                        return res.status(200).render('password/passwordResetConfirm.ejs', { mensaje, userEmail, mensaje2 });
                    });
                }
                catch (e) {
                    console.log(e);
                }
            }
            sendMail().catch(error => console.log(error.message));
        });
    }
    catch (e) {
        console.log(e);
    }
});

router.get('/reset/confirm/:id/:token', (req, res) => {
    const { id, token } = req.params;
    //*Checar si el id existe en la DB
    const query = 'SELECT * FROM usuarios WHERE id_U = ?;';
    mysqlConnection.query(query, [id], (err, results) => {
        if (err) return console.log(err);
        if (!results.length) {
            return res.status(200).render('password/passwordResetError.ejs');
        }
        try {
            const userPassword = results[0]['contrasena_U'];
            const secretJWT = process.env.JWT_SECRET + userPassword;
            const payload = jwt.verify(token, secretJWT);
            res.render('password/resetPassword.ejs', {message : ""});
        } catch (e) {
            console.log(e.message);
            return res.status(200).render('password/passwordResetError.ejs');
        }
    });
});

router.post('/reset/confirm/:id/:token', body('password').isLength({ min: 5 }), (req, res) => {
    const { id, token } = req.params;
    const { password, passwordConf } = req.body;
    //*Checar si el id existe en la DB
    const query = 'SELECT * FROM usuarios WHERE id_U = ?;';
    mysqlConnection.query(query, [id], async (err, results) => {
        if (err) return console.log(err);
        if (!results.length) {
            return res.status(200).render('password/passwordResetError.ejs', {message});
        }
        try {
            const userId = results[0]['id_U'];
            const userEmail = results[0]['email_U'];
            const userPassword = results[0]['contrasena_U'];
            const secretJWT = process.env.JWT_SECRET + userPassword;
            const payload = jwt.verify(token, secretJWT);

            //* Comprueba si hay datos mandados por el user
            if ((Object.keys(req.body).length === 0)) {
                return res.status(200).render('password/resetPassword.ejs', {message : 'Se necesita llenar los campos.'});
            }
            
            //* Comprueba si las passwords son validas
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(200).render('password/resetPassword.ejs', {message : 'Las contraseñas no son validas.'});
            }

            //* Comprueba si las contraseñas son las mismas
            if (password !== passwordConf) return res.status(200).render('password/resetPassword.ejs', {message : 'Las contraseñas no coinciden.'});
            
            const hashedPass = await bcrypt.hash(password, 10);
            
            const query = 'UPDATE usuarios SET contrasena_U = ? WHERE id_U = ? AND email_U = ?;'
            mysqlConnection.query(query, [hashedPass, userId, userEmail], (err, results)=>{
                if (err) return console.log(err);
                return res.redirect('/login');
            });
        } catch (e) {
            console.log(e.message);
            return res.status(200).render('password/passwordResetError.ejs');
        }
    });

});

export default router;