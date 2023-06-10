const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const { route } = require('./qrcode')
require('../models/Produto')
const Produto = mongoose.model('Produtos')
require('../models/Funcionario')
const Funcionario = mongoose.model('Funcionarios')
require('../models/Administrador')
const Administrador = mongoose.model('Administradores')
require('../models/Cliente')
const Cliente = mongoose.model('Clientes')
require('../models/Venda')
const Venda = mongoose.model('Vendas')
require('../models/Taxa')
const Taxa = mongoose.model('Taxas')
router.get('/', (req, res) => {
    res.render('admin/administrador')
})
router.get('/venda', (req, res) => {
    res.send('realizando venda')
})
router.get('/atualizar', (req, res) => {
    res.send('atualiza taxa')
})
//Gerenciamneto de Produto
router.get('/produto', (req, res) => {
    Produto.find().then((produtos) => {
        res.render('admin/produto', {produtos: produtos})
    }).catch((err) => {
        req.flash('error_msg', 'Erro ao listar produtos')
        res.redirect('/admin/produto')
    })
})
router.get('/produto/add', (req, res) => {
    res.render('admin/addproduto')
})
router.post('/produto/nova', (req, res) => {
    var erros= []
    if(!req.body.descricao || typeof req.body.descricao == undefined || req.body.descricao == null){
        erros.push({texto: 'Descrição obrigatória'})
    }
    if(!req.body.qtd || typeof req.body.qtd == undefined || req.body.qtd == null){
        erros.push({texto: 'Quantidade obrigatória'})
    }
    if(!req.body.valor || typeof req.body.valor == undefined || req.body.valor == null){
        erros.push({texto: 'Valor obrigatório'})
    }
    if(erros.length > 0){
        res.render('admin/addproduto', {erros: erros})
    }else{
        const novoProduto = {
            descricao: req.body.descricao,
            quantidade: req.body.qtd,
            preco: req.body.valor
        }
        new Produto(novoProduto).save().then(() => {
            req.flash('success_msg', 'Produto cadastrado com sucesso')
            res.redirect('/admin/produto')
        }).catch((err) => {

            req.flash('error_msg', 'Erro ao cadastrar')
            console.log('Erro ao cadastrar: ' + err)
            res.redirect('/admin/produto')
        })
}
})
router.get('/produto/edit/:id', (req, res) => {
    Produto.findOne({_id: req.params.id}).then((produto) => {
        res.render('admin/editproduto', {produto: produto})
    }).catch((err) => {
        req.flash('error_msg', 'Erro ao listar produtos')
        res.redirect('/admin/produto')
    })
})
router.post('/produto/editproduto/:id', (req, res) => {
    Produto.findOne({_id: req.params.id}).then((produto) => {
        var erros=[]
        if(!req.body.descricao || typeof req.body.descricao == undefined || req.body.descricao == null){
            erros.push({texto: 'Descrição obrigatória'})
        }
        if(!req.body.qtd || typeof req.body.qtd == undefined || req.body.qtd == null){
            erros.push({texto: 'Quantidade obrigatória'})
        }
        if(!req.body.valor || typeof req.body.valor == undefined || req.body.valor == null){
            erros.push({texto: 'Valor obrigatório'})
        }
        if(erros.length > 0){
            res.render('admin/editproduto', {produto: produto, erros: erros})
        }else{
            produto.descricao = req.body.descricao
            produto.quantidade = req.body.qtd
            produto.preco = req.body.valor
            produto.save().then(() => {
                req.flash('success_msg', 'Produto atualizado com sucesso')
                res.redirect('/admin/produto')
            }).catch((err) => {
                req.flash('error_msg', 'Erro ao atualizar')
                console.log('Erro ao atualizar: ' + err)
                res.redirect('/admin/produto')
            })
        }
    })
})
router.post('/produto/deletar/:id', (req, res) => {
    Produto.deleteOne({_id: req.params.id}).then(() => {
        req.flash('success_msg', 'Produto excluído com sucesso')
        res.redirect('/admin/produto')
    }).catch((err) => {
        req.flash('error_msg', 'Erro ao excluir')
        console.log('Erro ao excluir: ' + err)
        res.redirect('/admin/produto')
    })
})


//Gerenciamento de Usuário
router.get('/clientes', (req, res) => {
    Cliente.find().then((clientes) => {
        res.render('admin/clientes', {clientes: clientes})
    }).catch((err) => {
        req.flash('error_msg', 'Erro ao listar usuários')
        res.redirect('/admin/clientes')
    })    

})
router.get('/funcionarios', (req, res) => {
    Funcionario.find().then((funcionarios) => {
        res.render('admin/funcionarios', {funcionarios: funcionarios})
    }).catch((err) => {
        req.flash('error_msg', 'Erro ao listar funcionários')
        res.redirect('/admin/funcionarios')
    })
})
router.get('/administradores', (req, res) => {
    Administrador.find().then((administradores) => {
        res.render('admin/administradores', {administradores: administradores})
    }).catch((err) => {
        req.flash('error_msg', 'Erro ao listar administradores')
        res.redirect('/admin/administradores')
    })
})


router.get('/usuarios/addfuncionario', (req, res) => {
    res.render('admin/addfuncionario')
})
router.post('/funcionario/novo', (req, res) => {
    var erros=[]
    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
        erros.push({texto: 'Nome obrigatório'})
    }
    if(!req.body.cpf || typeof req.body.cpf == undefined || req.body.cpf == null){
        erros.push({texto: 'CPF obrigatório'})
    }
    if(!req.body.email || typeof req.body.email == undefined || req.body.email == null){
        erros.push({texto: 'Email obrigatório'})
    }
    if(!req.body.telefone || typeof req.body.telefone == undefined || req.body.telefone == null){
        erros.push({texto: 'Telefone obrigatório'})
    }
    if(!req.body.senha || typeof req.body.senha == undefined || req.body.senha == null){
        erros.push({texto: 'Senha obrigatória'})
    }
    if(!req.body.endereco || typeof req.body.endereco == undefined || req.body.endereco == null){
        erros.push({texto: 'Endereço obrigatório'})
    }
    if(erros.length > 0){
        res.render('admin/addfuncionario', {erros: erros})
    }else{
        const novoFuncionario = {
            nome: req.body.nome,
            cpf: req.body.cpf,
            email: req.body.email,
            telefone: req.body.telefone,
            senha: req.body.senha,
            endereco: req.body.endereco
        }
        new Funcionario(novoFuncionario).save().then(() => {
            req.flash('success_msg', 'Funcionário cadastrado com sucesso')
            res.redirect('/admin/funcionarios')
            console.log('Cadastrado com sucesso')
        }).catch((err) => {
            req.flash('error_msg', 'Erro ao cadastrar')
            console.log('Erro ao cadastrar: ' + err)
        })
    }
})
router.get('/usuarios/editfuncionario/:id', (req, res) => {
    Funcionario.findOne({_id: req.params.id}).then((funcionario) => {
        res.render('admin/editfuncionario', {funcionario: funcionario})
    }).catch((err) => {
        req.flash('error_msg', 'Erro ao editar')
        console.log('Erro ao editar: ' + err)
        res.redirect('/admin/funcionarios')
    })
})
router.post('/usuarios/editfuncionario/:id', (req, res) => {
    Funcionario.findOne({_id: req.params.id}).then((funcionario) => {
        var erros=[]
        if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
            erros.push({texto: 'Nome obrigatório'})
        }
        if(!req.body.cpf || typeof req.body.cpf == undefined || req.body.cpf == null){
            erros.push({texto: 'CPF obrigatório'})
        }
        if(!req.body.email || typeof req.body.email == undefined || req.body.email == null){
            erros.push({texto: 'Email obrigatório'})
        }
        if(!req.body.telefone || typeof req.body.telefone == undefined || req.body.telefone == null){
            erros.push({texto: 'Telefone obrigatório'})
        }
        if(!req.body.senha || typeof req.body.senha == undefined || req.body.senha == null){
            erros.push({texto: 'Senha obrigatória'})
        }
        if(erros.length > 0){
            res.render('admin/editfuncionario', {funcionario: funcionario, erros: erros})
        }else{
            funcionario.nome = req.body.nome
            funcionario.cpf = req.body.cpf
            funcionario.email = req.body.email
            funcionario.telefone = req.body.telefone
            funcionario.senha = req.body.senha
            funcionario.endereco = req.body.endereco
            funcionario.save().then(() => {
                req.flash('success_msg', 'Funcionário atualizado com sucesso')
                res.redirect('/admin/funcionarios')
            }).catch((err) => {
                req.flash('error_msg', 'Erro ao atualizar')
                console.log('Erro ao atualizar: ' + err)
                res.redirect('/admin/funcionarios')
            })
        }

    })
})
router.post('/usuarios/deletefuncionario/:id', (req, res) => {
    Funcionario.deleteOne({_id: req.params.id}).then(() => {
        req.flash('success_msg', 'Funcionário deletado com sucesso')
        res.redirect('/admin/funcionarios')
    }).catch((err) => {
        req.flash('error_msg', 'Erro ao deletar')
        console.log('Erro ao deletar: ' + err)
        res.redirect('/admin/funcionarios')
    })
})

router.get('/usuarios/addadministrador', (req, res) => {
    res.render('admin/addadministrador')
})
router.post('/administrador/novo', (req, res) => {
    var erros= []
    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
        erros.push({texto: 'Nome obrigatório'})
    }
    if(!req.body.cpf || typeof req.body.cpf == undefined || req.body.cpf == null){
        erros.push({texto: 'CPF obrigatório'})
    }
    if(!req.body.email || typeof req.body.email == undefined || req.body.email == null){
        erros.push({texto: 'Email obrigatório'})
    }
    if(!req.body.telefone || typeof req.body.telefone == undefined || req.body.telefone == null){
        erros.push({texto: 'Telefone obrigatório'})
    }
    if(!req.body.senha || typeof req.body.senha == undefined || req.body.senha == null){
        erros.push({texto: 'Senha obrigatória'})
    }
    if(!req.body.endereco || typeof req.body.endereco == undefined || req.body.endereco == null){
        erros.push({texto: 'Endereço obrigatório'})
    }
    if(erros.length > 0){
        res.render('admin/addadministrador', {erros: erros})
    }else{
        const novoAdministrador = {
            nome: req.body.nome,
            cpf: req.body.cpf,
            email: req.body.email,
            telefone: req.body.telefone,
            senha: req.body.senha,
            endereco: req.body.endereco
        }
        new Administrador(novoAdministrador).save().then(() => {
            req.flash('success_msg', 'Administrador cadastrado com sucesso')
            res.redirect('/admin/administradores')
            console.log('Cadastrado com sucesso')
        }).catch((err) => {
            req.flash('error_msg', 'Erro ao cadastrar')
            req.redirect('/admin/administradores')
            console.log('Erro ao cadastrar: ' + err)
        })
    }
    
})
router.get('/usuarios/editadministrador/:id', (req, res) => {
    Administrador.findOne({_id: req.params.id}).then((administrador) => {
        res.render('admin/editadministrador', {administrador: administrador})
    }).catch((err) => {
        req.flash('error_msg', 'Erro ao listar administrador')
        res.redirect('/admin/administradores')
    })
})
router.post('/usuarios/editadministrador/:id', (req, res) => {
    Administrador.findOne({_id: req.params.id}).then((administrador) => {
        var erros=[]
        if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
            erros.push({texto: 'Nome obrigatório'})
        }
        if(!req.body.cpf || typeof req.body.cpf == undefined || req.body.cpf == null){
            erros.push({texto: 'CPF obrigatório'})
        }
        if(!req.body.email || typeof req.body.email == undefined || req.body.email == null){
            erros.push({texto: 'Email obrigatório'})
        }
        if(!req.body.telefone || typeof req.body.telefone == undefined || req.body.telefone == null){
            erros.push({texto: 'Telefone obrigatório'})
        }
        if(!req.body.senha || typeof req.body.senha == undefined || req.body.senha == null){
            erros.push({texto: 'Senha obrigatória'})
        }
        if(!req.body.endereco || typeof req.body.endereco == undefined || req.body.endereco == null){
            erros.push({texto: 'Endereço obrigatório'})
        }
        if(erros.length > 0){
            res.render('admin/editadministrador', {administrador: administrador, erros: erros})
        }else{
            administrador.nome = req.body.nome
            administrador.cpf = req.body.cpf
            administrador.email = req.body.email
            administrador.telefone = req.body.telefone
            administrador.senha = req.body.senha
            administrador.endereco = req.body.endereco
            administrador.save().then(() => {
                req.flash('success_msg', 'Administrador atualizado com sucesso')
                res.redirect('/admin/administradores')
            }).catch((err) => {
                req.flash('error_msg', 'Erro ao atualizar')
                console.log('Erro ao atualizar: ' + err)
                res.redirect('/admin/administradores')
            })
        }
    })
})
router.post('/usuarios/deleteadministrador/:id', (req, res) => {
    Administrador.deleteOne({_id: req.params.id}).then(() => {
        req.flash('success_msg', 'Administrador deletado com sucesso')
        res.redirect('/admin/administradores')
    }).catch((err) => {
        req.flash('error_msg', 'Erro ao deletar')
        res.redirect('/admin/administradores')
    })
})


//gerenciar taxa
router.get('/taxa', (req, res) => {
    Taxa.find().then((taxas) => {
        res.render('admin/taxa', {taxas: taxas})
    }).catch((err) => {
        req.flash('error_msg', 'Erro ao listar taxa')
        res.redirect('/admin/taxa')
    })
})
router.post('/taxa/nova', (req, res) => {
    var erros = []
    if(!req.body.taxa || typeof req.body.taxa == undefined || req.body.taxa == null || req.body.taxa < 0){
        erros.push({texto: 'Taxa obrigatória'})
    }
    if(erros.length > 0){
        res.render('admin/taxa', {erros: erros})
    }else{
        const novaTaxa = {
            taxa: req.body.taxa
        }
        new Taxa(novaTaxa).save().then(() => {
            req.flash('success_msg', 'Taxa cadastrada com sucesso')
            res.redirect('/admin/taxa')
        }).catch((err) => {
            req.flash('error_msg', 'Erro ao cadastrar taxa')
            res.redirect('/admin/taxa')
        })
    }
})


//adicionar rota para editar um usuario

module.exports = router