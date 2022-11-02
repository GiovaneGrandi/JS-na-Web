import { valida } from "./validacao.js";

const inputs = document.querySelectorAll("input");
inputs.forEach(input => {
    if(input.dataset.tipo === "preco"){ //Condição que colocará a máscara monetária importada no HTML quando necessário
        SimpleMaskMoney.setMask(input, { //São os argumentos que usaremos na máscara
            prefix: 'R$ ', //O que vem antes do valor
            fixed: true,
            fractionDigits: 2, //Quantos itens teremos depois da separação decimal
            decimalSeparator: ',', //O que usaremos para separar as casas decimais
            thousandsSeparator: '.', //O que usaremos como separador de milhar
            cursor: 'end' //Por onde ele começará a digitação
        })
    }

    input.addEventListener("blur", (evento) => {
        valida(evento.target);
    })
})