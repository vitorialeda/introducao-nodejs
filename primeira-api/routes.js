import { criaProduto, leProdutos, leProdutoPorId, atualizaPorId, deletaPorId } from './models.js'

export default async function rotas(req, res, dados){
    res.setHeader('Content-type', 'application/json', 'utf-8');
    
    if(req.method === 'GET' && req.url === '/'){
        const { conteudo } = dados;

        const resposta = {
            mensagem: conteudo
        };

        res.statusCode = 200;
        res.end(JSON.stringify(resposta));
        return;
    }

    if(req.method === 'POST' && req.url === '/produtos'){
        const corpo = [];
        
        // Junta os pedaços da mensagem e coloca no array corpo
        req.on('data', (parte) => {
            corpo.push(parte);
        });

        // Quando a requisição terminar exibe mensagem de erro caso exista algum 
        // e se não envia a resposta em forma de string json 
        req.on('end', async () => {
            const produto = JSON.parse(corpo);

            // Verificação de erro
            res.statusCode = 400;
            if(!produto?.nome) {
                const resposta = {
                    erro: {
                        mensagem: `O atributo 'nome' não foi encontrado, porém é obrigatório para a criação do produto.`
                    }
                };

                res.end(JSON.stringify(resposta));
                return;
            };

            if(!produto?.preco) {
                const resposta = {
                    erro: {
                        mensagem: `O atributo 'preco' não foi encontrado, porém é obrigatório para a criação do produto.`
                    }
                };

                res.end(JSON.stringify(resposta));
                return;
            };

            try{
                const resposta = await criaProduto(produto);

                res.statusCode = 201;

                res.end(JSON.stringify(resposta));
                return;
                
            } catch(erro) {
                console.log('Falha ao criar o produto', erro);

                res.statusCode = 500;
                const resposta = {
                    erro: {
                        mensagem: `Falha ao criar produto ${produto.nome}`
                    }
                }

                res.end(JSON.stringify(resposta));
                return;
            }
        });
        
        // Exibe erro caso exista um durante o processamento da requisição
        req.on('error', (erro) => {
            console.log('Falha ao processar a requisição', erro);
            res.statusCode = 400;

            const resposta = {
                erro: {
                    mensagem: 'Falha ao processar a requisição'
                }
            };

            res.end(JSON.stringify(resposta));
            return;
        });

        return;
    };

    if(req.method === 'PATCH' && req.url.split('/')[1] === 'produtos' && !isNaN(req.url.split('/')[2])){
        const corpo = [];
        // Junta os pedaços da mensagem e coloca no array corpo
        req.on('data', (parte) => {
            corpo.push(parte);
        });

        // Converte o corpo da mensagem em objeto JSON, exibe erro casa exista algum
        req.on('end', async () => {
            const produto = JSON.parse(corpo);

            res.statusCode = 400;
            if(!produto?.nome && !produto.preco) {
                const resposta = {
                    erro: {
                        mensagem: `Nenhum atributo foi encontrado, porém ao menos um é obrigatório para atualização`
                    }
                };

                res.end(JSON.stringify(resposta));
                return;
            }

            const id = req.url.split('/')[2];
            try{
                const resposta = await atualizaPorId(id, produto);

                res.statusCode = 200;

                if(!resposta)[
                    res.statusCode = 404
                ];
    
                res.end(JSON.stringify(resposta));
                return;
            } catch(erro) {
                console.log('Falha ao acessar produto', erro);

                res.statusCode = erro.code ==='ENOENT' ? 404 : 403;
                const resposta = {
                    erro: {
                        mensagem: `Falha ao acessar produto ${produto.nome}`
                    }
                };

                res.end(JSON.stringify(resposta))
                return;
            }
        });
        
        // Exibe erro caso exista um durante o processamento da requisição
        req.on('error', (erro) => {
            console.log('Falha ao processar a requisição', erro);

            res.statusCode = 400;
            const resposta = {
                erro: {
                    mensagem: 'Falha ao processar a requisição'
                }
            };

            res.end(JSON.stringify(resposta));
            return;
        });

        return;
    };

    if(req.method === 'DELETE' && req.url.split('/')[1] === 'produtos' && !isNaN(req.url.split('/')[2])){
        // Id do produto passado pela url
        const id = req.url.split('/')[2];
       try{
            const encontrado = await deletaPorId(id);
            res.statusCode = 204;

            if(!encontrado){
                res.statusCode = 404;
            }

            res.end();
            return;
       } catch(erro){
            console.log('Falha ao remover o produto', erro);

            res.statusCode = 500;
            const resposta = {
                erro: {
                     mensagem: `Falha ao remover produto ${id}`
                }
            }

            res.end(JSON.stringify(resposta));
            return;
       }
    };

    if(req.method === 'GET' && req.url.split('/')[1] === 'produtos' && !isNaN(req.url.split('/')[2])){
        const id = req.url.split('/')[2];
       try{
            const resposta = await leProdutoPorId(id);
            res.statusCode = 200;

            if(!resposta){
                res.statusCode = 404;
            }

            res.end(JSON.stringify(resposta));
            return;
       } catch(erro){
            console.log('Falha ao buscar o produto', erro);

            res.statusCode = 500;
            const resposta = {
                erro: {
                    mensagem: `Falha ao buscar produto ${id}`
                }
            }

            res.end(JSON.stringify(resposta));
            return;
       }
    };

    if(req.method === 'GET' && req.url === '/produtos'){
       try{
            const resposta = await leProdutos();
            res.statusCode = 200;

            res.end(JSON.stringify(resposta));
            return;
       } catch(erro){
            console.log('Falha ao buscar o produtos', erro);

            res.statusCode = 500;
            const resposta = {
                erro: {
                    mensagem: `Falha ao buscar produtos`
                }
            }

            res.end(JSON.stringify(resposta));
            return;
       }
    };

    res.statusCode = 404;
    const resposta = {
        erro: {
            mensagem: 'Rota não encontrada!',
            url: req.url
        }
    };

    res.end(JSON.stringify(resposta));

}