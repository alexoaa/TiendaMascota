import { Router } from "express";
const router = Router();

router.use((req,res)=>{
    res.render('user/index.ejs', {user: `${req.user["nombre_U"]} ${req.user["apellido_U"]}`});
});

export default router;