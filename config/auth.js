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
            if(cliente){
                //return done(null,false,{message:"conta nao existe cliente"})
                bcrypt.compare(senha,cliente.senha,(erro,batem)=>{
                    if(batem){
                        return done(null,cliente)
                    }else{
                        return done(null, false,{message: "senha incorreta"})
                    }
                })
            }else{
                Administrador.findOne({email: email}).lean().then((administrador)=>{
                    if(administrador){
                        bcrypt.compare(senha,administrador.senha,(erro,batem)=>{
                            if(batem){
                                return done(null,administrador)
                            }else{
                                return done(null, false,{message: "senha incorreta admin"})
                            }
                        })
                        
                    }else{
                        Funcionario.findOne({email: email}).lean().then((funcionario)=>{
                            if(funcionario){
                                bcrypt.compare(senha,funcionario.senha,(erro,batem)=>{
                                    if(batem){
                                        return done(null,funcionario)
                                    }else{
                                        return done(null, false,{message: "senha incorreta funcionario"})
                                    }
                                })
                            }else{
                                return done(null,false,{message:"conta nao existe"})
                            }
                        })
                    }
                    
                }) 
            }
            
        
        })

    }))
    

    passport.serializeUser((user, done) => {
        done(null, user)   
      })
      
   passport.deserializeUser((id, done) => {
    Cliente.findById(id).then((cliente) => {
      if (cliente) {
        done(null, cliente)
      } else {
        Administrador.findById(id).then((administrador) => {
          if (administrador) {
            done(null, administrador)
          } else {
            Funcionario.findById(id).then((funcionario) => {
                if (funcionario) {
                  done(null, funcionario)
                } else {
                    done(null, false, { message: 'algo deu errado' })
                }
            }).catch((err) => {
              done(null, false, { message: 'algo deu errado' })
            })
            
          }
        }).catch((err) => {
          done(null, false, { message: 'algo deu errado' });
        });
      }
    }).catch((err) => {
      done(null, false, { message: 'algo deu errado' });
    });
  });
  

}