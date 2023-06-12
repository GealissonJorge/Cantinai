module.exports={
    eFuncionario: function(req,res,next){
        if(req.isAuthenticated() && req.user.eFuncionario==1){
            return next();
        }
        req.flash("error_msg","pagina destinada a funcionarios")
        res.redirect("/")
    }
}