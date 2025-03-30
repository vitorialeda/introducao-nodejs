import http from 'http';
import sqlite3 from 'sqlite3'; 
import express from 'express';
import { sequelize } from './models.js';
import rotas from './routes.js';

const app = express();

app.use((req, res, next)=>{
    console.log('Digite 9 para falar com um atendente');
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

    const servidor = http.createServer(app);
    
    const porta = 3000;
    const host = 'localhost';
    
    servidor.listen(porta, host, () => {
        console.log(`Servidor executando em http://${host}:${porta}/`);
     });
}

inicializaApp();