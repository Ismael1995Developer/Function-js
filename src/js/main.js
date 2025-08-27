// Import our custom CSS
import '../scss/styles.scss'

// Import all of Bootstrap’s JS
import * as bootstrap from 'bootstrap'

import Alert from 'bootstrap/js/dist/alert';

// or, specify which plugins you need:
import { Tooltip, Toast, Popover } from 'bootstrap';

//biblioteca cleave.js para inputs e outros. 
import cleave from 'cleave.js';

// função mostra e ocultar password
toggleSenha.style.cursor = "pointer";

document.querySelector("#toggleSenha").addEventListener('click', () => {
    const senhaInput = document.querySelector("#senha");

    //Uso do operador Ternário
    const type = senhaInput.getAttribute('type') === 'password' ? 'text' : 'password';
    senhaInput.setAttribute('type', type);

    // altera o ícone 
    toggleSenha.textContent = type === 'password' ? '👁️' : '🙈';
});

// função limpar campo dinâmica 

document.querySelectorAll(".limpar").forEach(botao => {
    botao.addEventListener("click", () => {
      // pega a section mais próxima que contém o botão
      const section = botao.closest("section");
  
      if (!section) return;
  
      // pega todos os inputs dentro dessa section
      const inputs = section.querySelectorAll("input");
  
      inputs.forEach(input => {
        input.value = ""; // limpa
        input.dispatchEvent(new Event("input", { bubbles: true }));
      });
      
      // Limpar os campos Inner.HTML 
      //display calculo IMC
      const imcResult = document.querySelector("#imcResult");
      imcResult.innerHTML = "IMC:";
      //display calculo juros
      const displayJurSimp = document.querySelector("#displayJurSimp");
      const displayJurComp = document.querySelector("#displayJurComp");
      displayJurSimp.textContent = "Juros Simples";
      displayJurComp.textContent = "Juros Composto";
      //display verifica numero primo
      const displayPri = document.querySelector("#displayPri");
      displayPri.textContent = "Número Primo";
    });
  });
  
  //instancia Classes biblioteca Cleave.js 
  new cleave('#inputPeso', {
    numeral: true,
    numeralDecimalMark: ',',
    numeralDecimalScale: 1,
    numeralIntegerScale: 2
  });

  const cleaveAlt = new Cleave('#inputAlt', {
    numeral: true,
    numeralDecimalMark: ',',
    numeralDecimalScale: 2,    // quantidade de casas decimais
    numeralIntegerScale: 1,    // dígitos antes da vírgula
    numeralPositiveOnly: true, // apenas números positivos
    delimiter: ''               // sem separador de milhares
  });

  //função calculo IMC 

  document.querySelector("#btnCal").addEventListener('click', () => {

    const inputPeso = document.querySelector("#inputPeso");
    const imcResult = document.querySelector("#imcResult");
   
    // validação e limitação do number campos 
    if (inputPeso.value === "" || cleaveAlt.getRawValue() === "") {
      imcResult.innerHTML = "Preencher os Campos Vazios";
      return;
    }

    let peso = Number(inputPeso.value);
    let altura = Number(cleaveAlt.getRawValue());
   
       // calculo de IMC 
      let IMC = peso / (altura * altura);
      console.log(`${IMC}`);

      // Função de verifição do IMC interpretação 
      let classificacao = "";
      let grauObesidade = 0;

      if (IMC <= 18.5) {
        classificacao = "Magraza";
      }else if (IMC >= 18.5 && IMC <= 24.9) {
        classificacao = "Normal";
      }else if (IMC >= 25.0 && IMC <= 29.9) {
        classificacao = "SobrePeso";
        grauObesidade = 1;
      }else if (IMC >= 30.0 && IMC <= 39.9) {
        classificacao = "Obesidade";
        grauObesidade = 2;
      }else {
        classificacao = "Obesidade Grave";
        grauObesidade = 3;
      };

      imcResult.innerHTML = `IMC: ${IMC.toFixed(2)} Classificação: ${classificacao} Grau: ${grauObesidade}`;

  });
  
 // 1) Perfis de formatação
const optReal = {
  numeral: true,
  numeralDecimalMark: ',',              // vírgula como decimal para o usuário
  numeralThousandsGroupStyle: 'thousand',
  numeralDecimalScale: 2,               // 2 casas decimais
  numeralPositiveOnly: true,
  prefix: 'R$ ',                        // mostra "R$ " no input
  noImmediatePrefix: true,             
  delimiter: '.',                       // separador de milhar (BR)
  rawValueTrimPrefix: true             // <<< remove "R$ " do getRawValue()
};

const optTempo = {
  numeral: true,
  numeralDecimalScale: 0,               // inteiro
  numeralIntegerScale: 4,               // até 4 dígitos
  numeralPositiveOnly: true,
  delimiter: ''                         // sem separador
};

const optTaxa = {
  numeral: true,
  numeralDecimalMark: ',',              // usuário digita vírgula
  numeralDecimalScale: 4,               // até 4 casas (ex.: 2,3456)
  numeralIntegerScale: 3,               // até 3 dígitos inteiros (ex.: 100)
  numeralPositiveOnly: true,
  delimiter: ''                         // sem separador
};

// 2) Aplicar por classe (em lote)
const clReais = Array.from(document.querySelectorAll('#secaoJuros .inputReal'))
  .map(el => new Cleave(el, optReal));

const clTempo = Array.from(document.querySelectorAll('#secaoJuros .inputTempo'))
  .map(el => new Cleave(el, optTempo));

const clTaxa  = Array.from(document.querySelectorAll('#secaoJuros .inputTaxa'))
  .map(el => new Cleave(el, optTaxa));

// função Global validação da instancia do Cleave 
function readNum(inst) {
  if (!inst) return null;
  const raw = inst.getRawValue(); // "" ou "1234.56"
  return raw === '' ? null : Number(raw);
}

// Função Global normaliza taxa: se usuário digita 2,5 (percentual), vira 0.025
function normTaxa(t) {
  if (!Number.isFinite(t)) return null;
  return t >= 1 ? t / 100 : t;
}

document.querySelector("#btnResult").addEventListener("click", () => {
  // --- SIMPLES (usa os índices 0) ---
  const capitalSimples = readNum(clReais[0]);
  const tempoSimples   = readNum(clTempo[0]);
  const taxaSimplesUI  = readNum(clTaxa[0]);
  const iS             = normTaxa(taxaSimplesUI);

  // só calcula Simples se ao menos um campo foi preenchido
  const algumS = [capitalSimples, tempoSimples, iS].some(v => v !== null);
  if (algumS) {
    const validS = [capitalSimples, tempoSimples, iS].every(v => Number.isFinite(v) && v > 0);
    if (validS) {
      const jurosS = capitalSimples * iS * tempoSimples;
      displayJurSimp.textContent = `Juros: ${jurosS.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`;
    } else {
      displayJurSimp.textContent = "Preencha os campos válidos (Simples).";
    }
  }
  
  // --- COMPOSTO (usa os índices 1) ---
  const capitalComp = readNum(clReais[1]);
  const tempoComp   = readNum(clTempo[1]);
  const taxaCompUI  = readNum(clTaxa[1]);
  const iC          = normTaxa(taxaCompUI);

  const algumC = [capitalComp, tempoComp, iC].some(v => v !== null);
  if (algumC) {
    const validC = [capitalComp, tempoComp, iC].every(v => Number.isFinite(v) && v > 0);
    if (validC) {
      const montante = capitalComp * (1 + iC) ** tempoComp;
      const jurosC   = montante - capitalComp;
      displayJurComp.textContent = `Juros: ${jurosC.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} / Montante: ${montante.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`;
    } else {
      displayJurComp.textContent = "Preencha os campos válidos (Composto).";
    }
  }
});

// ====== seção de validação de numero primo ===== //

// validação input para numero inteiro com Cleave
const inputPri = new Cleave ('#inputPri', {
  numeral: true,                  // confirma que é numero
  numeralDecimalMark: ',',        // altera o , para .
  numeralDecimalScale: 0,         // sem casas decimais (inteiro)
  numeralIntegerScale: 10,        // limite de dígitos antes da virgula
  numeralPositiveOnly: true,      // Só numeros positivos
  delimiter: ''
});


// função veirifica se o numero é primo 

document.querySelector("#btnAnalis").addEventListener('click', () => {

  // Validação campo vazio 
if (inputPri.getRawValue() === "") {
  displayPri.textContent = "Preencher o campo vazio";
  return;
}; 
  const valor = Number(inputPri.getRawValue());
  let primo = 0;
  for(let i = 1; i <= valor; i++ ) {
      if(valor % i === 0) {
        primo++;
        if (primo === 2) {
          displayPri.textContent = `O Número (${valor}) é Primo.`;
        }
      }else {
        displayPri.textContent = `O Número (${valor}) Não é Primo.`;
      };
  };
  return;

});

// // função enxuta de verificar numero primos 
// function ehPrimo(n) {
//   if (!Number.isInteger(n) || n <= 1) return false;
//   if (n <= 3) return true;
//   if (n % 2 === 0 || n % 3 === 0) return false;

//   for (let i = 5; i * i <= n; i += 6) {
//     if (n % i === 0 || n % (i + 2) === 0) return false;
//   }
//   return true;
// }

// ===== Seção conversão numero decimal, binario e hex ======= //

// validação de input 
const instDec = new Cleave(".inputDec", {
  numeral: true, 
  numeralDecimalScale: 0,
  numeralIntegerScale: 16,
  numeralPositiveOnly: true,
  delimiter: '',
});


const instBi = new Cleave('.inputBi', {
  delimiter:' ',
  blocks: [4,4,4,4,4,4,4,4],
  onValueChanged: (e) => {
    e.target.value = e.target.value.replace(/[^01\s]/g, '');
  }
});

const instHe = new Cleave('.inputHe', {
  uppercase: true,
  delimiter: ''
});

// Função validação 

function validarBase(raw, base, {allowEmpty = true, maxDigits} = {}) {
  const s = String(raw ?? '').trim();
  if (s === '') return allowEmpty ? {empty: true} : {error: 'valor obrigatório'};

  // checar base 

  const RX = {
    10: /^\d+$/,
    2: /^[01]+$/,
    16: /^[0-9a-fA-F]+$/,
  };
  if (!RX[base].test(s)) {
    return {error: `Não aceita caracteres somente numeros inteiros!`}
  }

  // Checar tamanho 
  if(maxDigits && s.length > maxDigits) {
    return { error: `Máximo de ${maxDigits} dígitos na base: ${base}`}
  }

  // converter para BigInt
  let value;
  try {
    if(base === 10) value = BigInt(s);
    else if (base === 2) value = BigInt('0b' + s);
    else if (base === 16) value = BigInt('0x' + s);
  } catch (error) {
    return {error: `Número fora do intervalo suportado. `};
  }
  return {value}; // encerra a função 
}

// função para retornar string 

function toBaseString(nBig, base, { uppercase = true} = {}) {
  let s = nBig.toString(base);
  if ( base === 16 && uppercase) s = s.toUpperCase();
  return s;
} 

// Agrupa a partir da direita: "101101" -> "101 101" (size = 4)
function groupRight(str, size, delim = ' ') {
  let out = '', count = 0;
  for (let i = str.length - 1; i >= 0; i--) {
    out = str[i] + out;
    count++;
    if (i > 0 && count === size) {
      out = delim + out;
      count = 0;
    }
  }
  return out;
}

// pad à esquerda até múltiplo (ex.: múltiplo de 4 para binário)
function padLeftToMultiple(str, multiple, padChar = '0') {
  const m = str.length % multiple;
  if (m === 0) return str;
  return padChar.repeat(multiple - m) + str;
}

// função conversão decimal para binario
function toBinaryPretty(nBig, { groupSize = 4, padToMultiple = false } = {}) {
  let s = nBig.toString(2);
  if (padToMultiple && groupSize > 1) {
    s = padLeftToMultiple(s, groupSize, '0');
  }
  return groupSize > 1 ? groupRight(s, groupSize, ' ') : s;
}

// função conversão hex 
function toHexPretty(nBig, { uppercase = true } = {}) {
  return uppercase ? nBig.toString(16).toUpperCase() : nBig.toString(16);
}

// função de UI para mensagem da validação e verificação 

document.querySelector('#btnConverter').addEventListener('click', () => {

  const rawDec = instDec.getRawValue().trim();
  const rest = validarBase(rawDec, 10, { maxDigits: 16}); // retorna {empty | error | value}

  if(rest.empty) {
    alert('campo decimal vazio.');
    instBi.setRawValue('');
    instHe.setRawValue('');
    return;
  }
  
  if(rest.error) {
    alert(rest.error);
    return;
  }

  const nunDec = rest.value; //BigInt seguro

  // converter 
  const bin = toBinaryPretty(nunDec, {groupSize: 4, padToMultiple: true});
  const hex = toHexPretty(nunDec, { uppercase: true});

  // preencher os inputs
  instBi.setRawValue(bin);
  instHe.setRawValue(hex);
  
});








// Para estudo: converte BigInt para base (2..36) via divisões sucessivas

// function toBaseByDivMod(nBig, base) {
//   if (nBig === 0n) return '0';
//   const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
//   const b = BigInt(base);
//   let x = nBig, out = '';
//   while (x > 0n) {
//     const r = x % b;                 // resto
//     out = alphabet[Number(r)] + out; // empilha à esquerda
//     x = x / b;                       // quociente
//   }
//   return out;
// }



