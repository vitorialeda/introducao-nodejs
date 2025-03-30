import sqlite3 from 'sqlite3'; 
import express from 'express';
import bodyParser from 'body-parser';

import { sequelize } from './models.js';


const app = express();

app.use(bodyParser.json());

app.use('/produtos',(req, res, next)=>{
    console.log('Rota /produtos');
    res.send();
});

app.use((req, res, next)=>{
    res.send({ mensagem: 'Problema resolvido' });
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