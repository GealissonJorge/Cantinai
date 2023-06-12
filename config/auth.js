const localStrategy = require("passport-local").Strategy
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

//model
require("../models/Cliente")
const Cliente = mongoose.model("Clientes")//
require("../models/Funcionario")
const Funcionario = mongoose.model("Funcionarios")
require("../models/Administrador")
const Administrador = mongoose.model("Administradores")


module.exports = function(passport){
    passport.use(new localStrategy({usernameField:'email', passwordField:"senha"},(email,senha,done)=>{

        Cliente.findOne({email: email}).lean().then((cliente)=>{
            if(!cliente){
                return done(null,false,{message:"conta nao existe cliente"})
            }
            bcrypt.compare(senha,cliente.senha,(erro,batem)=>{
                if(batem){
                    return done(null,cliente)
                }else{
                    return done(null, false,{message: "senha incorreta"})
                }
            })
        
        })

    }))
    passport.use(new localStrategy({usernameField:'email', passwordField:"senha"},(email,senha,done)=>{
        Administrador.findOne({email: email}).lean().then((administrador)=>{
            if(!administrador){
                return done(null,false,{message:"conta nao existe adminis"})
            }
            bcrypt.compare(senha,administrador.senha,(erro,batem)=>{
                if(batem){
                    return done(null,administrador)
                }else{
                    return done(null, false,{message: "senha incorreta admin"})
                }
            })
        }) 
    }))

    passport.serializeUser((cliente,done)=>{
        done(null,cliente)
    })

    passport.serializeUser((administrador,done)=>{
        done(null,administrador)  
    })
   // passport.deserializeUser((id,done)=>{
   //     Usuario.findById(id,(err,usuario)=>{
   //         done(err,usuario)
   //     }).lean()
   // })

    passport.deserializeUser((id,done)=>{
        Cliente.findById(id).then((cliente)=>{
           return done(null,cliente)
        }).catch((err)=>{
            return done (null,false,{message:'algo deu errado'})
        })
    })
    passport.deserializeUser((id,done)=>{
        Administrador.findById(id).then((administrador)=>{
           return done(null,administrador)
        }).catch((err)=>{
            return done (null,false,{message:'algo deu errado'})
        })
    })

}