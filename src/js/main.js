// Import our custom CSS
import '../scss/styles.scss'

// Import all of Bootstrap’s JS
import * as bootstrap from 'bootstrap'

import Alert from 'bootstrap/js/dist/alert';

// or, specify which plugins you need:
import { Tooltip, Toast, Popover } from 'bootstrap';

// função mostar e ocultar password
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
    });
  });
  