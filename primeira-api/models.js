import { Sequelize } from 'sequelize';

export const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './tic.db'
});

sequelize.authenticate();

// Define as colunas e seus atributos da tabela 'produto' e a armazena na constante Produto
export const Produto = sequelize.define('produto', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nome: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    preco:{
        type: Sequelize.DOUBLE,
        allowNull: false
    }
});


export async function criaProduto(produto){
    try{
        // Utiliza o metodo 'create' do sequelize para criar um novo item na tabela produto 
        const resultado = await Produto.create(produto);
        console.log(`O produto ${resultado.nome} foi criado com sucesso.`);
        return resultado;
    } catch(erro) {
        console.log('Erro ao criar o produto', erro);
        throw erro;
    }
}

export async function leProdutos(){
    try{
        // Utiliza o método findAll para retornar todos os produtos da tabela produto
        const resultado = await Produto.findAll();
        console.log(`Produtos consultados com sucesso.`, resultado)
        return resultado;
    } catch(erro) {
        console.log('Erro ao consultar o produto', erro);
        throw erro
    }
}

export async function leProdutoPorId(id){
    try{
        // Utiliza o método 'findByPk' do sequelize para retornar um produto baseado no seu id
        // Pk => Primary Key 
        const resultado = await Produto.findByPk(id);
        console.log(`Produto consultado com sucesso.`, resultado)
        return resultado;
    } catch(erro) {
        console.log('Erro ao consultar o produto', erro);
        throw erro;
    }
}

export async function atualizaPorId(id, dadosProduto){
    try{
        // Utiliza o método 'findByPk' para armazenar o produto à ser atualizado em uma variável
        const resultado = await Produto.findByPk(id);
        
        // Se o produto existir
        if(resultado?.id){
            // dadosProdutos é um objeto contendo chave-valor baseado nas colunas da tabela produto
            // Para cada chave de dadosProdutos que também exista no produto a ser atualizado
            for (const chave in dadosProduto){
                if(chave in resultado){
                    // O atributo de produto recebe o valor do atributo dadosProdutos.
                    resultado[chave] = dadosProduto[chave];
                };
            };
            // Commita os dados alterados.
            resultado.save();
            console.log(`Produto atualizado com sucesso.`, resultado);
        }
        return resultado;
    } catch(erro) {
        console.log('Erro ao atualizar o produto', erro);
        throw erro;
    }
}

export async function deletaPorId(id){
    try{
        // Utiliza o método 'destroy' do sequelize para destruir o item com id passado como parâmentro
        const resultado = await Produto.destroy({where:{id: id}});
        console.log(`Produto deletado com sucesso.`, resultado)
    } catch(erro) { 
        console.log('Erro ao deletar o produto', erro);
        throw erro;
    }
}

const Pedido = sequelize.define('pedido',{
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    valor_total: {
        type: Sequelize.DOUBLE,
        allowNull: false,
    },
    estado:{
        type: Sequelize.STRING,
        allowNull: false
    }
});

const ProdutosPedido = sequelize.define('produtos_pedido', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    quantidade: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    preco:{
        type: Sequelize.DOUBLE,
        allowNull: false
    }
});

Produto.belongsToMany(Pedido, { through: ProdutosPedido } );
Pedido.belongsToMany(Produto, { through: ProdutosPedido });

export async function criaPedido(novoPedido){
    try{
        const pedido = await Pedido.create({
            valor_total: 0,
            estado: 'ENCAMINHADO'
        });


        let somaTotal = 0;
        for(let prod of novoPedido.produtos){
            const produto = await Produto.findByPk(prod.id);
            if(produto){
                pedido.addProduto(produto, { through:{ quantidade: prod.quantidade, preco: produto.preco }});
                somaTotal += prod.quantidade * produto.preco;
            };
        };

        pedido.valor_total = somaTotal;
        await pedido.save();

        console.log('Pedido criado com sucesso!');
        return pedido;
    } catch(erro) {
        console.log('Falha ao criar pedido', erro)
        throw erro;
    }
}

export async function lePedidos(){
    try{
        const resultado = await Pedido.findAll();
        console.log('Pedidos foram consultados com sucesso!', resultado);
        return resultado;
    } catch(erro) {
        console.log('Falha ao consultar pedidos', erro);
        throw erro;
    }
}

export async function lePedidoPorId(id){
    try{
        const resultado = await Pedido.findByPk(id);
        console.log('Pedido foi consultado com sucesso!', resultado);
        return resultado;
    } catch(erro) {
        console.log('Falha ao consultar pedido', erro);
        throw erro;
    }
}