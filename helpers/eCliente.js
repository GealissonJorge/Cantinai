module.exports={
    eCliente: function(req,res,next){
        if(req.isAuthenticated() && req.user.eCliente==1){
            return next();
        }
        req.flash("error_msg","pagina destinada a administradores")
        res.redirect("/")
    }
}