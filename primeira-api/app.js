import sqlite3 from 'sqlite3'; 
import express from 'express';
import { sequelize } from './models.js';

const app = express();

app.use((req, res, next)=>{
    console.log('Digite 9 para falar com um atendente');
    next();
});

app.use((req, res, next)=>{
    res.send({ mensagem: 'Problema resolvido' });
});

app.use((req, res, next)=>{
    console.log('Segue o link para baixar o driver atualizado');
});

async function inicializaApp(){
    const db = new sqlite3.Database('./tic.db', (erro) => {
        if(erro){
            console.log('Falha ao inicializar o banco de dados');
            return;
        }
    
        console.log('Banco de dados inicializado');
    });
    
    await sequelize.sync();

    const porta = 3000;
    
    app.listen(porta);
}

inicializaApp();