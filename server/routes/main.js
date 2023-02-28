import { Router } from "express";
const router = Router();

router.use((req,res)=>{
    res.render('main.ejs');
});

export default router;


