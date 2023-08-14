const CARDAPIO = {
  cafe: 3,
  suco: 6.20,
  sanduiche: 6.50,
  salgado: 7.25,
  combo1: 9.50,
  combo2: 7.50,

  chantily: {
    preco: 1.50,
    extraDo: "cafe",
  },
  queijo: {
    preco: 2,
    extraDo: "sanduiche",
  }
};

const FORMA_DE_PAGAMENTO = {
  dinheiro: "dinheiro",
  debito: "debito",
  credito: "credito",
};

const DESCONTO_DINHEIRO = 0.05;
const TAXA_CREDITO = 0.03;

class CaixaDaLanchonete {
  constructor() {
    this.pedido = {};
    this.erros = [];
  }

  adicionarErro(mensagem) {
    this.erros.push(mensagem);
  }

  validarFormaDePagamento(metodoDePagamento) {
    if (!FORMA_DE_PAGAMENTO[metodoDePagamento]) {
      this.adicionarErro("Forma de pagamento inválida!");
    }
  }

  validarQuantidade(quantidade, produto) {
    if (quantidade <= 0) {
      this.adicionarErro(`Quantidade de ${produto} inválida: ${quantidade}`);
    }
  }

  validarItem(item) {
    const [produto, quantidade] = item.trim().toLowerCase().split(',');

    if (!(produto in CARDAPIO)) {
      this.adicionarErro(`${produto}: Item inválido ou fora do cardápio!`);
    }

    this.validarQuantidade(quantidade, produto);

    this.pedido[produto] = quantidade;

    const extraDO = CARDAPIO[produto]?.extraDO
    if (extraDO && !this.itensIncluemProduto(extraDO)) {
      this.adicionarErro(`Você só pode adicionar ${produto} como extra se houver ${CARDAPIO[produto]?.extraDo} como principal!`);
    }
  }

  itensIncluemProduto(produto) {
    return Object.keys(this.pedido).includes(produto);
  }

  calcularValorDaCompra(metodoDePagamento, itens = []) {
    this.erros = [];
    this.pedido = {};

    this.validarFormaDePagamento(metodoDePagamento);

    if (itens.length <= 0) {
      this.adicionarErro("Não há itens no carrinho de compra!");
    } else {
      itens.forEach(item => this.validarItem(item));
    }

    if (this.erros.length > 0) {
      return this.erros.join('\n');
    } else {
      const valorTotal = Object.entries(this.pedido).reduce((acumulador, [produto, quantidade]) => {
        const precoProduto = (CARDAPIO[produto]?.preco ?? CARDAPIO[produto]) * quantidade;
        return acumulador + precoProduto;
      }, 0);

      return this.calcularDescontoOuTaxa(metodoDePagamento, valorTotal);
    }
  }

  calcularDescontoOuTaxa(metodoDePagamento, valorTotal) {
    const format = (number) => {
      number = number.toFixed(2).replace('.', ',');
      return `R$ ${number}`;
    };

    switch (metodoDePagamento) {
      case FORMA_DE_PAGAMENTO.credito: {
        const taxa = valorTotal * TAXA_CREDITO;
        return format(valorTotal + taxa);
      }

      case FORMA_DE_PAGAMENTO.dinheiro: {
        const desconto = valorTotal * DESCONTO_DINHEIRO;
        return format(valorTotal - desconto);
      }

      case FORMA_DE_PAGAMENTO.debito: {
        return format(valorTotal);
      }
    }
  }
}

const caixaLanchonete = new CaixaDaLanchonete().calcularValorDaCompra("debito", ['cafe,1', 'queijo,1']);
console.log(caixaLanchonete);