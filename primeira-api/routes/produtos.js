import express from 'express';
import { sequelize, criaProduto, leProdutos, leProdutoPorId, atualizaPorId, deletaPorId } from '../models.js';


export const rotasProduto = express.Router();

rotasProduto.post('/produtos', async (req, res, next) => {
    const produto = req.body;

    // Verificação de erro
    res.statusCode = 400;
    if(!produto?.nome) {
        const resposta = {
            erro: {
                mensagem: `O atributo 'nome' não foi encontrado, porém é obrigatório para a criação do produto.`
            }
        };

        res.send(resposta);
        return;
    };

    if(!produto?.preco) {
        const resposta = {
            erro: {
                mensagem: `O atributo 'preco' não foi encontrado, porém é obrigatório para a criação do produto.`
            }
        };

        res.send(resposta);
        return;
    };

    try{
        const resposta = await criaProduto(produto);

        res.statusCode = 201;

        res.send(resposta);
        return;
        
    } catch(erro) {
        console.log('Falha ao criar o produto', erro);

        res.statusCode = 500;
        const resposta = {
            erro: {
                mensagem: `Falha ao criar produto ${produto.nome}`
            }
        }

        res.send(resposta);
        return;
    }

});

rotasProduto.patch('/produtos/:id', async (req, res, next) => {
    const produto = req.body;

    res.statusCode = 400;

    if(!produto?.nome && !produto.preco) {
        const resposta = {
            erro: {
                mensagem: `Nenhum atributo foi encontrado, porém ao menos um é obrigatório para atualização`
            }
        };

        res.send(resposta);
        return;
    }

    const id = req.params.id;
    try{
        const resposta = await atualizaPorId(id, produto);

        res.statusCode = 200;

        if(!resposta)[
            res.statusCode = 404
        ];

        res.send(resposta);
        return;
    } catch(erro) {
        console.log('Falha ao acessar produto', erro);

        res.statusCode = erro.code ==='ENOENT' ? 404 : 403;
        const resposta = {
            erro: {
                mensagem: `Falha ao acessar produto ${id}`
            }
        };

        res.end(JSON.stringify(resposta))
        return;
    }
});

rotasProduto.delete('/produtos/:id', async (req, res, next) => {
    const id = req.params.id;

    try{
         const encontrado = await deletaPorId(id);
         res.statusCode = 204;

         if(!encontrado){
             res.statusCode = 404;
         }

         res.send();
         return;
    } catch(erro){
         console.log('Falha ao remover o produto', erro);

         res.statusCode = 500;
         const resposta = {
             erro: {
                  mensagem: `Falha ao remover produto ${id}`
             }
         }

         res.send(resposta);
         return;
    }
});

rotasProduto.get('/produtos/:id', async (req, res, next) => {
    const id = req.params.id;

    try{
        const resposta = await leProdutoPorId(id);
        res.statusCode = 200;

        if(!resposta){
            res.statusCode = 404;
        }

        res.send(resposta);
        return;
    } catch(erro){
        console.log('Falha ao buscar o produto', erro);

        res.statusCode = 500;
        const resposta = {
            erro: {
                mensagem: `Falha ao buscar produto ${id}`
            }
        }

        res.send(resposta);
        return;
    }
});

rotasProduto.get('/produtos', async (req, res, next) => {
    try{
        const resposta = await leProdutos();
        res.statusCode = 200;

        res.send(resposta);
        return;
       } catch(erro){
        console.log('Falha ao buscar o produtos', erro);

        res.statusCode = 500;
        const resposta = {
            erro: {
                mensagem: `Falha ao buscar produtos`
            }
        }

        res.send(resposta);
        return;
       }
});