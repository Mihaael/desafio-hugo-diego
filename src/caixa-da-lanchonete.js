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
}

const FORMA_DE_PAGAMENTO = {
  dinheiro: "dinheiro",
  debito: "debito",
  credito: "credito",
}

const DESCONTO_DINHEIRO = 0.05
const TAXA_CREDITO = 0.03

class CaixaDaLanchonete {

  calcularValorDaCompra(metodoDePagamento, itens = []) {
      let pedido = {}
      const erros = []
      
      if (!FORMA_DE_PAGAMENTO[metodoDePagamento]){
        return "Forma de pagamento inválida!"
      }
      if (itens.length <= 0) {
        return "Não há itens no carrinho de compra!"
      }
      
      itens.forEach((item, _index, array) => {
        const [produto, quantidade] = item.trim().toLowerCase().split(',')

        if (!(produto in CARDAPIO)) {
          erros.push(`${produto}: Item inválido ou fora do cardápio!`)
        }
        if (quantidade <= 0 ) {
          erros.push(`Quantidade de ${produto} inválida: ${quantidade}`)
        }

        pedido[produto] = quantidade

        if (
          CARDAPIO[produto]?.extraDo && !array.some((i) => i.split(',')[0] === CARDAPIO[produto]?.extraDo) 
        ) {
          erros.push(`Você ira poder adicionar ${produto} como extra, se houver ${CARDAPIO[produto]?.extraDo} como principal!`)
        }
      })

      if (erros.length > 0){
        return erros.join('\n')
      }else {
        const valorTotal = Object.entries(pedido).reduce((acumulador, [produto, quantidade]) => {
          const precoProduto = (CARDAPIO[produto]?.preco ?? CARDAPIO[produto]) * quantidade
          return acumulador + precoProduto
        }, 0)

        return this.calcularDescontoOuTaxa(metodoDePagamento, valorTotal)
      }
  }
  calcularDescontoOuTaxa(metodoDePagamento, valorTotal) {
    const format = (number) => {
      number = number.toFixed(2).replace('.',',')
      return `R$ ${number}`
    }
    switch (metodoDePagamento) {
      case FORMA_DE_PAGAMENTO.credito: {
        const taxa = valorTotal * TAXA_CREDITO
        return format(valorTotal + taxa)
      }

      case FORMA_DE_PAGAMENTO.dinheiro: {
        const desconto = valorTotal * DESCONTO_DINHEIRO
        return format(valorTotal - desconto)
      }

      case FORMA_DE_PAGAMENTO.debito: {
        return format(valorTotal)
      }
    }
  }
}

let caixaLanchonete = new CaixaDaLanchonete().calcularValorDaCompra("debito", ['cafe,1', 'queijo,1'])

console.log(caixaLanchonete)

export { CaixaDaLanchonete };