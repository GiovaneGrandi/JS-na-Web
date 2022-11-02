export function valida(input){ //Função que irá verificar qual o tipo de input foi usado para usar a validação certa
    const tipoDeInput = input.dataset.tipo;
    if(validadores[tipoDeInput]){
        validadores[tipoDeInput](input); 
    }

    if(input.validity.valid){ //Código que vê se tem algo faltando nos campos e entãoa diciona o design de inválido e irá mostrar as mensagens de erro
        input.parentElement.classList.remove("input-container--invalido");
        input.parentElement.querySelector(".input-mensagem-erro").innerHTML = "";
    }else{
        input.parentElement.classList.add("input-container--invalido");
        input.parentElement.querySelector(".input-mensagem-erro").innerHTML = mostraMensagemDeErro(tipoDeInput, input);
    }
}

const tiposDeErro = [ //Array com os tipos de erros que cuidaremos no formulário
    "valueMissing",
    "typeMismatch",
    "patternMismatch", //Quando se está em um bloco, se separa os itens usando a "," *NUNCA USAR ";"
    "customError"
]

const mensagensDeErro = { //Todas as mensagens de erros que serão utilizadas no código que estão linkadas com o "data-tipo" no HTML
    nome: {
        valueMissing: "O campo de nome não pode estar vazio."
    },
    email: {
        valueMissing: 'O campo de email não pode estar vazio.',
        typeMismatch: 'O email digitado não é válido.'
    },
    senha: {
        valueMissing: "O campo de senha não pode estar vazio.",
        patternMismatch: "A senha deve conter entre 6 a 12 caracteres, deve conter pelo menos uma letra maiúscula, um número e não deve conter símbolos."
    },
    dataNascimento: {
        valueMissing: "O campo de data de nascimento não pode estar vazio.",
        customError: "Você deve ser maior que 18 anos para se cadastrar."
    },
    cpf: {
        valueMissing: "O campo de CPF não pode estar vazio.",
        customError: "O CPF digitado não é válido."
    },
    cep: {
        valueMissing: "O campo de CEP não pode estar vazio.",
        patternMismatch: "O CEP digitado não é válido.",
        customError: "Não foi possível buscar o CEP."
    },
    logradouro: {
        valueMissing: "O campo de logradouro não pode estar vazio."
    },
    cidade: {
        valueMissing: "O campo de cidade não pode estar vazio."
    },
    estado: {
        valueMissing: "O campo de estado não pode estar vazio."
    },
    preco: {
        valueMissing: "O campo de preço não pode estar vazio."
    }
}

const validadores = { //A função que vai selecionar a validação correta 
    dataNascimento:input => validaDataNascimento(input),
    cpf:input => validaCPF(input),
    cep:input => recuperarCEP(input)
}

function mostraMensagemDeErro(tipoDeInput, input) { //A função que mostrará qual mensagem deve ser mostrada aonde
    let mensagem = "";
    tiposDeErro.forEach(erro => { //Código que irá checar todos os itens e retornara se o erro for false ou true, se for true ele irá selecionar as mensagens para exibir
        if(input.validity[erro]){
            mensagem = mensagensDeErro[tipoDeInput][erro];
        }
    })
    return mensagem;
}

function validaDataNascimento(input){
    const dataRecebida = new Date(input.value);
    let mensagem = "";
    if(!maiorQue18(dataRecebida)){ //A ! serve para informar ao if que ele devrá ser ativado se a condição for falsa
        mensagem = "Você deve ser maior que 18 anos para se cadastrar."
    }
    input.setCustomValidity(mensagem);
}

function maiorQue18(data){
    const dataAtual = new Date();
    const dataMais18 = new Date(data.getUTCFullYear() + 18, data.getUTCMonth(), data.getUTCDate());
    return dataMais18 <= dataAtual;
}

function validaCPF(input){ //Função que vai formatar o cpf para a forma desejada
    const cpfFormatado = input.value.replace(/\D/g, ""); //Regex que irá tirar qualquer dígito que não for um número
    let mensagem = "";

    if(!checaCPFRepetido(cpfFormatado) || !checaEstruturaCPF(cpfFormatado)){ //Quando houver uma ! no início do if, significa que aquela condição só deverá acontecer se o resultado retornado for false
        mensagem = "O CPF digitado não é válido." //Comando para a mensagem ser exibida quando o valor do checaCPF for false
    }
    input.setCustomValidity(mensagem); //Comando que enviará a mensagem de aviso
}

function checaCPFRepetido(cpf){ //Função que irá invalidar cpfs com números repetidos
    const valoresRepetidos = [ //Todas as sequências de números repetidos que não serão aceitos
        "00000000000",
        "11111111111",
        "22222222222",
        "33333333333",
        "44444444444",
        "55555555555",
        "66666666666",
        "77777777777",
        "88888888888",
        "99999999999"
    ]
    let cpfValido = true;

    valoresRepetidos.forEach(valor => { //Função que irá verificar se o cpf digitado é igual a lista acima, se for ele retornará como false
        if(valor == cpf){
            cpfValido = false;
        }
    })

    return cpfValido;
}

function checaEstruturaCPF(cpf){ //Função que irá fazer a soma dos 9 primeiro números do cpf
    const multiplicador = 10; //Multiplicador que será usado para montar o cálculo do primeiro número verificador
    return checaDigitoVerificador(cpf, multiplicador);
}

function checaDigitoVerificador(cpf, multiplicador){ //Função que irá separar os 9 digitos do cpf dos 2 verificadores
    if(multiplicador >= 12){ //Fazendo o loop terminar como true após rodar 2 vezes e chegar no resultado esperado
        return true
    }

    let multiplicadorInicial = multiplicador;
    let soma = 0 //Código que irá representar a soma dos 9 números
    const cpfSemDigitos = cpf.substr(0, multiplicador - 1).split(""); //Código que irá separar os 9 digitos
    const digitoVerificador = cpf.charAt(multiplicador - 1); //Código que irá pegar o digito verificador
    for(let contador = 0; multiplicadorInicial > 1; multiplicadorInicial --){
        soma = soma + cpfSemDigitos[contador] * multiplicadorInicial; //O loop que fará o cálculo para cada um dos 9 dígitos
        contador++;
    }

    if(digitoVerificador == confirmaDigito(soma)){
        return checaDigitoVerificador(cpf, multiplicador + 1); //Retronando o multiplicadosr +1 para poder calcular o 2 dígito verificador
    }
    return false //Caso o cálculo não funcione, ele retorna false
}

function confirmaDigito(soma){ //Função que irá usar a soma feita acima para montar o primeiro número verificador do cpf
    return 11 - (soma % 11);
}

function recuperarCEP(input){ //Função que irá chamar a API para validar o CEP
    const cep = input.value.replace(/\D/g, "");
    const url = `https://viacep.com.br/ws/${cep}/json/` //Link da API`
    const options = { //Os parâmetros que a API precisa para funcionar
        method: "GET", //O que iremos fazer com a API
        mode: "cors",
        headers: {
            "content-type": "application/json;charset=utf-8" //O contéudo que iremos receber
        }
    }
    if(!input.validity.patternMismatch && !input.validity.valueMissing){ //Condição que só chamará a API quando o retorno para os erros for false
        fetch(url,options).then(
            Response => Response.json()
        ).then(
            data => {
                if(data.erro){
                    input.setCustomValidity("Não foi possível buscar o CEP.");
                    return
                }
                input.setCustomValidity("");
                preencheCamposComCEP(data);
                return;
            }
        )
    }
}

function preencheCamposComCEP(data){
    const logradouro = document.querySelector('[data-tipo="logradouro"]'); //Quando precisar usar 2 aspas uma dentro da outra, se usa aspas diferentes, nunca o mesmo tipo
    const cidade = document.querySelector('[data-tipo="cidade"]');
    const estado = document.querySelector('[data-tipo="estado"]'); //Código que irá selecionar os campos a serem preenchidos no HTML

    logradouro.value = data.logradouro;
    cidade.value = data.localidade;
    estado.value = data.uf;
}

//O atalho "Ctrl + ;" serve para comentar várias linhas de código de uma vez só