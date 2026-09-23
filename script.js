const telaInicial = document.getElementById('tela-inicial');
const telaJogo = document.getElementById('tela-jogo');
const btnJogar = document.getElementById('btn-jogar');

const canvas = document.getElementById('canvas-jogo');
const ctx = canvas.getContext('2d');

// Ajuste preciso do canvas para mobile e desktop
function redimensionarCanvas() {
    const largura = window.visualViewport ? window.visualViewport.width : document.documentElement.clientWidth;
    const altura = window.visualViewport ? window.visualViewport.height : document.documentElement.clientHeight;

    canvas.width = largura;
    canvas.height = altura;

    canvas.style.width = `${largura}px`;
    canvas.style.height = `${altura}px`;
}

window.addEventListener('resize', redimensionarCanvas);
window.addEventListener('orientationchange', () => {
    setTimeout(redimensionarCanvas, 100);
});
if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', redimensionarCanvas);
}
redimensionarCanvas();

const pontuacaoEl = document.getElementById('pontuacao');
const vidasEl = document.getElementById('vidas');
const modalDesafio = document.getElementById('modal-desafio');
const tituloComercio = document.getElementById('titulo-comercio');
const enunciadoConta = document.getElementById('enunciado-conta');
const respostaInput = document.getElementById('resposta-jogador');
const btnResponder = document.getElementById('btn-responder');
const btnFechar = document.getElementById('btn-fechar');
const mensagemFeedback = document.getElementById('mensagem-feedback');

// Elementos da Tela de Pontuação Final (Conectados com o index.html)
const telaPontuacao = document.getElementById('tela-pontuacao');
const tituloFimJogo = document.getElementById('titulo-fim-jogo');
const pontosFinais = document.getElementById('pontos-finais');
const qtdCertas = document.getElementById('qtd-certas');
const qtdErradas = document.getElementById('qtd-erradas');
const btnReiniciar = document.getElementById('btn-reiniciar');

// BANCO DE PERGUNTAS ORGANIZADO POR COMÉRCIO
const BANCO_DE_PERGUNTAS = {
    mercado: [
        { pergunta: "[1/3] Maria foi ao mercado e comprou uma cesta de frutas que custava R$ 80,00. Ao chegar à caixa, viu um cartaz informando que todas as frutas vinham com 15% de desconto. Qual foi o valor do desconto em reais?", resposta: 12 },
        { pergunta: "[2/3] João foi ao mercado e comprou 2 kg de arroz por R$ 5,00 cada quilo e 1 kg de feijão por R$ 8,00. Ele pagou a compra com uma nota de R$ 50,00. Quanto João recebeu de troco?", resposta: 32 },
        { pergunta: "[3/3] Uma caixa de bombons custa R$ 40,00 no mercado. O gerente anunciou uma promoção dando 10% de desconto para quem pagar no Pix. Qual será o valor pago pela caixa de bombons com esse desconto?", resposta: 36 }
    ],

    roupas: [
        { pergunta: "[1/3] Uma pessoa foi a uma loja de roupas e comprou uma camiseta por R$ 40,00 e uma calça por R$ 80,00. Na hora do pagamento, a caixa aplicou um desconto fixo de R$ 10,00 no valor total. A pessoa pagou a compra com duas notas de R$ 100,00. Quanto ela recebeu de troco?", resposta: 90 },
        { pergunta: "[2/3] Uma pessoa comprou um casaco por R$ 90,00 e um par de meias por R$ 10,00 em uma loja de roupas. A caixa deu um desconto fixo de R$ 15,00 no valor total da compra. Se o cliente pagou com uma nota de R$ 100,00, quanto recebeu de troco?", resposta: 15 },
        { pergunta: "[3/3] Lucas comprou duas camisetas de R$ 30,00 cada uma. Ao passar na caixa da loja, ele apresentou um cupom que dava R$ 10,00 de desconto no total da compra. Lucas pagou com uma nota de R$ 50,00 e uma nota de R$ 20,00. Quanto ele recebeu de troco?", resposta: 20 }
    ],

    padaria: [
        { pergunta: "[1/3] Um cliente foi à padaria e comprou uma bandeja de pães por R$ 12,00 e um bolo por R$ 18,00. Por ser final de tarde, a padaria ofereceu um desconto fixo de R$ 5,00 no total da compra. O cliente pagou a conta entregando uma nota de R$ 50,00. Quanto ele recebeu de troco?", resposta: 25 },
        { pergunta: "[2/3] Mariana comprou uma torta salgada de R$ 40,00 e dois sucos naturais de R$ 10,00 cada. Por pagar via Pix, a padaria concede um desconto de 10% sobre o valor total do pedido. Se ela pagou em dinheiro entregando uma nota de R$ 100,00 na caixa, quanto deve receber de troco?", resposta: 40 },
        { pergunta: "[3/3] Um cliente comprou 10 pães franceses que custavam R$ 1,00 cada e 2 cafés expressos de R$ 5,00 cada. Ao pagar, ele utilizou um cupom de fidelidade da padaria que concede 20% de desconto no valor total dos pães. Sabendo que o cliente pagou a compra com uma nota de R$ 50,00, qual foi o valor do troco recebido?", resposta: 32 }
    ],

    lanchonete: [
        { pergunta: "[1/3] Lucas foi à lanchonete e comprou 3 salgados por R$ 6,00 cada e 2 sucos por R$ 5,00 cada. Para pagar a conta, ele entregou uma nota de R$ 50,00 na caixa. Quanto Lucas deve receber de troco?", resposta: 22 },
        { pergunta: "[2/3] Um grupo de 4 amigos foi lanchar e pediu um combo de sobremesas que custou R$ 48,00 no total. Eles decidiram dividir o valor da conta igualmente entre os 4. Um dos amigos pagou a sua parte usando uma nota de R$ 20,00. Quanto esse amigo recebeu de troco?", resposta: 8 },
        { pergunta: "[3/3] Uma lanchonete vende mini pães de queijo em pacotes. Um pacote com 5 unidades custa R$ 15,00. Mariana queria comprar apenas 3 mini pães de queijo para o seu lanche. Sabendo que Mariana também comprou uma vitamina por R$ 9,00 e pagou o total com uma nota de R$ 20,00, qual foi o valor do troco recebido por ela?", resposta: 2 }
    ],

    farmacia: [
        { pergunta: "[1/3] Pedro foi à farmácia comprar suprimentos para seu kit de primeiros socorros. Ele comprou 3 caixas de curativos por R$ 8,00 cada e 2 frascos de soro fisiológico por R$ 6,00 cada. Para pagar a compra, Pedro entregou uma nota de R$ 50,00 na caixa. Quanto ele recebeu de troco?", resposta: 14 },
        { pergunta: "[2/3] Um grupo de 3 amigos foi à farmácia comprar um protetor solar familiar para usar no fim da semana. O produto custava R$ 57,00 e eles dividiram esse valor igualmente entre os três. Um dos amigos pagou a sua parte entregando uma nota de R$ 20,00. Qual foi o valor do troco recebido por esse amigo?", resposta: 1 },
        { pergunta: "[3/3] Lucas precisa tomar um suplemento vitamínico durante uma semana. Na farmácia, uma caixa com 6 barrinhas de proteína custa R$ 30,00, mas é possível comprar as unidades avulsas pelo valor proporcional. Lucas decided comprar apenas 4 barrinhas e também um sabonete líquido de R$ 12,00. Se ele pagou a compra com uma nota de R$ 50,00, quanto recebeu de troco?", resposta: 18 }
    ]
};

const progressoComercios = { mercado: 0, padaria: 0, roupas: 0, farmacia: 0, lanchonete: 0 };

let pontuacao = 0;
let vidas = 3;
let respostasCertas = 0;
let respostasErradas = 0;

let desafioAtual = null;
let comercioAtualCategoria = null;
let jogoPausado = false;
let comercioProximo = null;
let loopIniciado = false;

// Configuração do mundo e mapa
const mundo = { largura: 1800, altura: 1350 };
const jogador = { x: 605, y: 455, largura: 30, altura: 30, velocidade: 4.5 };
const camera = { x: 0, y: 0 };
const teclas = { ArrowUp: false, ArrowDown: false, ArrowLeft: false, ArrowRight: false, w: false, s: false, a: false, d: false, e: false };

const comercios = [
    {
        id: 'mercado', nome: 'MERCADO', icone: '🛒', categoria: 'mercado',
        x: 120, y: 60, largura: 250, altura: 140,
        corParede: '#334155', corTelhado: '#1e293b', corToldo: '#0284c7', corPlaca: '#0f172a',
        terminal: { x: 225, y: 210, largura: 40, altura: 32 }
    },
    {
        id: 'padaria', nome: 'PADARIA', icone: '🥖', categoria: 'padaria',
        x: 1430, y: 60, largura: 250, altura: 140,
        corParede: '#78350f', corTelhado: '#451a03', corToldo: '#d97706', corPlaca: '#292524',
        terminal: { x: 1535, y: 210, largura: 40, altura: 32 }
    },
    {
        id: 'roupas', nome: 'LOJA DE ROUPAS', icone: '👕', categoria: 'roupas',
        x: 775, y: 550, largura: 250, altura: 140,
        corParede: '#6b21a8', corTelhado: '#581c87', corToldo: '#a855f7', corPlaca: '#3b0764',
        terminal: { x: 880, y: 700, largura: 40, altura: 32 }
    },
    {
        id: 'farmacia', nome: 'FARMÁCIA', icone: '💊', categoria: 'farmacia',
        x: 120, y: 1020, largura: 250, altura: 140,
        corParede: '#0f766e', corTelhado: '#115e59', corToldo: '#059669', corPlaca: '#064e3b',
        terminal: { x: 225, y: 1170, largura: 40, altura: 32 }
    },
    {
        id: 'lanchonete', nome: 'LANCHONETE', icone: '🍔', categoria: 'lanchonete',
        x: 1430, y: 1020, largura: 250, altura: 140,
        corParede: '#9f1239', corTelhado: '#881337', corToldo: '#dc2626', corPlaca: '#450a0a',
        terminal: { x: 1535, y: 1170, largura: 40, altura: 32 }
    }
];

const elementosCidadaos = {
    arvores: [
        {x: 80, y: 400}, {x: 520, y: 400}, {x: 1280, y: 400}, {x: 1720, y: 400},
        {x: 80, y: 950}, {x: 520, y: 950}, {x: 1280, y: 950}, {x: 1720, y: 950},
        {x: 520, y: 80}, {x: 1280, y: 80}, {x: 520, y: 1270}, {x: 1280, y: 1270}
    ],
    postes: [
        {x: 580, y: 410}, {x: 1220, y: 410}, {x: 580, y: 940}, {x: 1220, y: 940},
        {x: 580, y: 150}, {x: 1220, y: 150}, {x: 580, y: 1200}, {x: 1220, y: 1200}
    ],
    bancos: [
        {x: 480, y: 220}, {x: 1320, y: 220}, {x: 480, y: 1130}, {x: 1320, y: 1130}
    ],
    lixeiras: [
        {x: 450, y: 225}, {x: 1290, y: 225}, {x: 450, y: 1135}, {x: 1290, y: 1135}
    ],
    carros: [
        {x: 100, y: 440, cor: '#ef4444', dir: 'H'}, {x: 1400, y: 440, cor: '#3b82f6', dir: 'H'},
        {x: 200, y: 880, cor: '#eab308', dir: 'H'}, {x: 1300, y: 880, cor: '#10b981', dir: 'H'},
        {x: 615, y: 250, cor: '#a855f7', dir: 'V'}, {x: 1175, y: 980, cor: '#64748b', dir: 'V'}
    ]
};

function iniciarJogo() {
    if (telaInicial) telaInicial.style.display = 'none';
    if (telaJogo) telaJogo.classList.remove('escondido');
    redimensionarCanvas();
    if (!loopIniciado) {
        loopIniciado = true;
        loopJogo();
    }
}

btnJogar?.addEventListener('click', iniciarJogo);
btnJogar?.addEventListener('touchstart', (e) => {
    e.preventDefault();
    iniciarJogo();
});

window.addEventListener('keydown', (e) => {
    const tecla = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    if (teclas.hasOwnProperty(tecla)) teclas[tecla] = true;

    if (tecla === 'e' && comercioProximo && !jogoPausado) {
        abrirDesafio(comercioProximo);
    }
});

window.addEventListener('keyup', (e) => {
    const tecla = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    if (teclas.hasOwnProperty(tecla)) teclas[tecla] = false;
});

const botoesTouch = {
    'btn-cima': 'ArrowUp',
    'btn-baixo': 'ArrowDown',
    'btn-esquerda': 'ArrowLeft',
    'btn-direita': 'ArrowRight'
};

Object.keys(botoesTouch).forEach(id => {
    const btn = document.getElementById(id);
    if (btn) {
        const ativar = (e) => {
            if (e.cancelable) e.preventDefault();
            teclas[botoesTouch[id]] = true;
        };
        const desativar = (e) => {
            if (e.cancelable) e.preventDefault();
            teclas[botoesTouch[id]] = false;
        };

        btn.addEventListener('touchstart', ativar, { passive: false });
        btn.addEventListener('touchend', desativar, { passive: false });
        btn.addEventListener('touchcancel', desativar, { passive: false });

        btn.addEventListener('mousedown', () => { teclas[botoesTouch[id]] = true; });
        btn.addEventListener('mouseup', () => { teclas[botoesTouch[id]] = false; });
    }
});

canvas.addEventListener('touchstart', (e) => {
    if (comercioProximo && !jogoPausado) {
        abrirDesafio(comercioProximo);
    }
}, { passive: true });

function verificarColisao(novoX, novoY) {
    if (novoX < 0 || novoX + jogador.largura > mundo.largura ||
        novoY < 0 || novoY + jogador.altura > mundo.altura) {
        return true;
    }

    for (let i = 0; i < comercios.length; i++) {
        let loja = comercios[i];
        if (novoX < loja.x + loja.largura &&
            novoX + jogador.largura > loja.x &&
            novoY < loja.y + loja.altura &&
            novoY + jogador.altura > loja.y) {
            return true;
        }
    }
    return false;
}

function atualizarJogador() {
    if (jogoPausado) return;
    let moveX = 0, moveY = 0;

    if (teclas.ArrowUp || teclas.w) moveY = -jogador.velocidade;
    if (teclas.ArrowDown || teclas.s) moveY = jogador.velocidade;
    if (teclas.ArrowLeft || teclas.a) moveX = -jogador.velocidade;
    if (teclas.ArrowRight || teclas.d) moveX = jogador.velocidade;

    if (moveX !== 0 && !verificarColisao(jogador.x + moveX, jogador.y)) jogador.x += moveX;
    if (moveY !== 0 && !verificarColisao(jogador.x, jogador.y + moveY)) jogador.y += moveY;

    verificarProximidadeTerminal();
}

function atualizarCamera() {
    camera.x = jogador.x - canvas.width / 2 + jogador.largura / 2;
    camera.y = jogador.y - canvas.height / 2 + jogador.altura / 2;

    if (camera.x < 0) camera.x = 0;
    if (camera.y < 0) camera.y = 0;
    if (camera.x > mundo.largura - canvas.width) camera.x = mundo.largura - canvas.width;
    if (camera.y > mundo.altura - canvas.height) camera.y = mundo.altura - canvas.height;
}

function verificarProximidadeTerminal() {
    comercioProximo = null;
    comercios.forEach(loja => {
        const t = loja.terminal;
        const margem = 45;
        if (jogador.x < t.x + t.largura + margem &&
            jogador.x + jogador.largura > t.x - margem &&
            jogador.y < t.y + t.altura + margem &&
            jogador.y + jogador.altura > t.y - margem) {
            comercioProximo = loja;
        }
    });
}

function abrirDesafio(loja) {
    comercioAtualCategoria = loja.categoria;
    const indice = progressoComercios[comercioAtualCategoria];
    const listaPerguntas = BANCO_DE_PERGUNTAS[comercioAtualCategoria];

    if (indice >= listaPerguntas.length) {
        return;
    }

    jogoPausado = true;
    desafioAtual = listaPerguntas[indice];
    tituloComercio.textContent = `${loja.icone} ${loja.nome}`;
    enunciadoConta.textContent = desafioAtual.pergunta;
    respostaInput.value = '';
    mensagemFeedback.textContent = '';
    modalDesafio.classList.remove('escondido');
    setTimeout(() => respostaInput.focus(), 50);
}

btnResponder?.addEventListener('click', validarResposta);
respostaInput?.addEventListener('keypress', (e) => { if (e.key === 'Enter') validarResposta(); });

// Exibe a Tela de Pontuação Final
function exibirTelaFinal(titulo) {
    jogoPausado = true;
    
    if (telaJogo) telaJogo.classList.add('escondido');
    if (modalDesafio) modalDesafio.classList.add('escondido');

    if (tituloFimJogo) tituloFimJogo.textContent = titulo;
    if (pontosFinais) pontosFinais.textContent = pontuacao;
    if (qtdCertas) qtdCertas.textContent = respostasCertas;
    if (qtdErradas) qtdErradas.textContent = respostasErradas;

    if (telaPontuacao) telaPontuacao.classList.remove('escondido');
}

function verificarConclusaoJogo() {
    const totalProcessadas = Object.values(progressoComercios).reduce((acc, curr) => acc + curr, 0);
    
    if (totalProcessadas >= 15) {
        exibirTelaFinal("🎉 PARABÉNS! VOCÊ VENCEU! 🎉");
    }
}

function validarResposta() {
    const val = parseFloat(respostaInput.value);
    if (isNaN(val)) return;

    if (val === desafioAtual.resposta) {
        pontuacao += 10;
        respostasCertas++;
        if (pontuacaoEl) pontuacaoEl.textContent = pontuacao;
        mensagemFeedback.style.color = '#22c55e';
        mensagemFeedback.textContent = 'Correto! +10 pontos';

        progressoComercios[comercioAtualCategoria]++;

        setTimeout(() => {
            fecharModalEAfastar();
            verificarConclusaoJogo();
        }, 800);
    } else {
        vidas--;
        respostasErradas++;
        atualizarVidas();
        mensagemFeedback.style.color = '#ef4444';
        mensagemFeedback.textContent = 'Incorreto! Pergunta anulada, avançando...';

        progressoComercios[comercioAtualCategoria]++;

        if (vidas <= 0) {
            setTimeout(() => {
                fecharModalEAfastar();
                exibirTelaFinal("☹️ GAME OVER 👎");
            }, 800);
        } else {
            setTimeout(() => {
                fecharModalEAfastar();
                verificarConclusaoJogo();
            }, 1200);
        }
    }
}

btnReiniciar?.addEventListener('click', () => {
    document.location.reload();
});

btnFechar?.addEventListener('click', fecharModalEAfastar);

function fecharModalEAfastar() {
    modalDesafio.classList.add('escondido');
    jogador.y += 20;
    jogoPausado = false;
}

function atualizarVidas() {
    if (!vidasEl) return;
    let textoVidas = '';
    for (let i = 0; i < vidas; i++) textoVidas += '❤️';
    vidasEl.textContent = textoVidas;
}

function desenharMapaUrbano() {
    ctx.fillStyle = '#15803d';
    ctx.fillRect(0, 0, mundo.largura, mundo.altura);

    ctx.fillStyle = '#334155';
    ctx.fillRect(0, 420, mundo.largura, 100);
    ctx.fillRect(0, 830, mundo.largura, 100);
    ctx.fillRect(570, 0, 100, mundo.altura);
    ctx.fillRect(1130, 0, 100, mundo.altura);

    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(0, 405, mundo.largura, 15);
    ctx.fillRect(0, 520, mundo.largura, 15);
    ctx.fillRect(0, 815, mundo.largura, 15);
    ctx.fillRect(0, 930, mundo.largura, 15);
    ctx.fillRect(555, 0, 15, mundo.altura);
    ctx.fillRect(670, 0, 15, mundo.altura);
    ctx.fillRect(1115, 0, 15, mundo.altura);
    ctx.fillRect(1230, 0, 15, mundo.altura);

    ctx.fillStyle = '#ffffff';
    const esquinasX = [570, 1130];
    const esquinasY = [420, 830];

    esquinasX.forEach(ex => {
        esquinasY.forEach(ey => {
            for (let i = 8; i < 90; i += 18) {
                ctx.fillRect(ex + i, ey - 25, 12, 25);
                ctx.fillRect(ex + i, ey + 100, 12, 25);
                ctx.fillRect(ex - 25, ey + i, 25, 12);
                ctx.fillRect(ex + 100, ey + i, 25, 12);
            }
        });
    });

    ctx.fillStyle = '#facc15';
    for (let x = 0; x < mundo.largura; x += 55) {
        if ((x < 555 || x > 670) && (x < 1115 || x > 1230)) {
            ctx.fillRect(x, 468, 28, 4);
            ctx.fillRect(x, 878, 28, 4);
        }
    }
    for (let y = 0; y < mundo.altura; y += 55) {
        if ((y < 405 || y > 520) && (y < 815 || y > 930)) {
            ctx.fillRect(618, y, 4, 28);
            ctx.fillRect(1178, y, 4, 28);
        }
    }

    const posicoesBlocos = [
        {x: 50, y: 40, w: 505, h: 365}, {x: 685, y: 40, w: 430, h: 365}, {x: 1245, y: 40, w: 505, h: 365},
        {x: 50, y: 535, w: 505, h: 280}, {x: 685, y: 535, w: 430, h: 280}, {x: 1245, y: 535, w: 505, h: 280},
        {x: 50, y: 945, w: 505, h: 365}, {x: 685, y: 945, w: 430, h: 365}, {x: 1245, y: 945, w: 505, h: 365}
    ];

    posicoesBlocos.forEach(b => {
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(b.x, b.y, b.w, b.h);
        ctx.fillStyle = '#334155';
        ctx.fillRect(b.x + 8, b.y + 8, b.w - 16, b.h - 16);
    });

    elementosCidadaos.carros.forEach(c => {
        ctx.fillStyle = c.cor;
        if (c.dir === 'H') {
            ctx.fillRect(c.x, c.y, 60, 30);
            ctx.fillStyle = '#38bdf8';
            ctx.fillRect(c.x + 12, c.y + 4, 18, 22);
            ctx.fillRect(c.x + 38, c.y + 4, 10, 22);
        } else {
            ctx.fillRect(c.x, c.y, 30, 60);
            ctx.fillStyle = '#38bdf8';
            ctx.fillRect(c.x + 4, c.y + 12, 22, 18);
            ctx.fillRect(c.x + 4, c.y + 38, 22, 10);
        }
    });

    elementosCidadaos.bancos.forEach(b => {
        ctx.fillStyle = '#78350f';
        ctx.fillRect(b.x, b.y, 26, 9);
    });

    elementosCidadaos.lixeiras.forEach(l => {
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(l.x, l.y, 9, 9);
    });
}

function desenharArvore25D(a) {
    ctx.fillStyle = 'rgba(0,0,0,0.25)';
    ctx.beginPath();
    ctx.ellipse(a.x, a.y + 2, 14, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#78350f';
    ctx.fillRect(a.x - 4, a.y - 14, 8, 16);

    ctx.fillStyle = '#14532d';
    ctx.beginPath();
    ctx.arc(a.x, a.y - 24, 18, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#22c55e';
    ctx.beginPath();
    ctx.arc(a.x - 3, a.y - 27, 13, 0, Math.PI * 2);
    ctx.fill();
}

function desenharPoste25D(p) {
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.beginPath();
    ctx.arc(p.x, p.y + 2, 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#475569';
    ctx.fillRect(p.x - 2, p.y - 28, 4, 30);

    ctx.fillStyle = '#1e293b';
    ctx.fillRect(p.x - 6, p.y - 32, 12, 6);

    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.arc(p.x, p.y - 29, 3, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.arc(p.x, p.y, 14, 0, Math.PI * 2);
    ctx.globalAlpha = 0.25;
    ctx.fill();
    ctx.globalAlpha = 1.0;
}

function desenharJogador() {
    const centroX = jogador.x + jogador.largura / 2;

    ctx.fillStyle = 'rgba(0,0,0,0.25)';
    ctx.beginPath();
    ctx.ellipse(centroX, jogador.y + 28, 12, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#2563eb';
    ctx.fillRect(jogador.x + 6, jogador.y + 12, 18, 12);

    ctx.fillStyle = '#1e293b';
    ctx.fillRect(jogador.x + 7, jogador.y + 24, 6, 6);
    ctx.fillRect(jogador.x + 17, jogador.y + 24, 6, 6);

    ctx.fillStyle = '#fca5a5';
    ctx.beginPath();
    ctx.arc(centroX, jogador.y + 9, 7, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#f43f5e';
    ctx.beginPath();
    ctx.arc(centroX, jogador.y + 7, 7, Math.PI, 0);
    ctx.fill();
    ctx.fillRect(centroX - 2, jogador.y + 5, 11, 3);
}

function loopJogo() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    atualizarJogador();
    atualizarCamera();

    ctx.save();
    ctx.translate(-camera.x, -camera.y);

    desenharMapaUrbano();

    let elementosVisuais = [];

    comercios.forEach(loja => {
        elementosVisuais.push({ y: loja.y + loja.altura, desenhar: () => {
            ctx.fillStyle = '#cbd5e1';
            ctx.fillRect(loja.x - 12, loja.y - 12, loja.largura + 24, loja.altura + 90);
            
            ctx.strokeStyle = '#94a3b8';
            ctx.lineWidth = 1;
            for (let px = loja.x - 12; px < loja.x + loja.largura + 12; px += 28) {
                ctx.beginPath();
                ctx.moveTo(px, loja.y + loja.altura);
                ctx.lineTo(px, loja.y + loja.altura + 90);
                ctx.stroke();
            }

            ctx.fillStyle = loja.corParede;
            ctx.fillRect(loja.x, loja.y, loja.largura, loja.altura);

            ctx.fillStyle = loja.corTelhado;
            ctx.fillRect(loja.x + 10, loja.y + 10, loja.largura - 20, loja.altura - 38);

            ctx.fillStyle = '#475569';
            ctx.fillRect(loja.x + 25, loja.y + 22, 30, 22);
            ctx.fillRect(loja.x + loja.largura - 55, loja.y + 22, 30, 22);

            ctx.fillStyle = '#38bdf8';
            ctx.globalAlpha = 0.7;
            ctx.fillRect(loja.x + 18, loja.y + loja.altura - 24, 50, 18);
            ctx.fillRect(loja.x + loja.largura - 68, loja.y + loja.altura - 24, 50, 18);
            ctx.globalAlpha = 1.0;

            ctx.fillStyle = '#1e293b';
            ctx.fillRect(loja.x + loja.largura / 2 - 18, loja.y + loja.altura - 24, 36, 24);

            ctx.fillStyle = loja.corPlaca;
            ctx.fillRect(loja.x + 10, loja.y + loja.altura - 46, loja.largura - 20, 20);
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 1.5;
            ctx.strokeRect(loja.x + 10, loja.y + loja.altura - 46, loja.largura - 20, 20);

            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 12px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(`${loja.icone} ${loja.nome}`, loja.x + loja.largura / 2, loja.y + loja.altura - 35);

            ctx.fillStyle = loja.corToldo;
            ctx.fillRect(loja.x + 5, loja.y + loja.altura - 5, loja.largura - 10, 7);

            const t = loja.terminal;
            const eProximo = (comercioProximo && comercioProximo.id === loja.id);

            if (eProximo) {
                ctx.shadowColor = '#38bdf8';
                ctx.shadowBlur = 12;
                ctx.strokeStyle = '#38bdf8';
                ctx.lineWidth = 2.5;
                ctx.strokeRect(t.x - 3, t.y - 3, t.largura + 6, t.altura + 6);
            }

            ctx.fillStyle = '#0f172a';
            ctx.fillRect(t.x, t.y, t.largura, t.altura);
            
            ctx.strokeStyle = '#f59e0b';
            ctx.lineWidth = 2;
            ctx.strokeRect(t.x, t.y, t.largura, t.altura);

            ctx.fillStyle = '#0284c7';
            ctx.fillRect(t.x + 4, t.y + 4, t.largura - 8, 14);

            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 11px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('?', t.x + t.largura / 2, t.y + 12);

            ctx.fillStyle = eProximo ? '#22c55e' : '#f59e0b';
            ctx.beginPath();
            ctx.arc(t.x + t.largura / 2, t.y - 3, 3, 0, Math.PI * 2);
            ctx.fill();

            ctx.shadowBlur = 0;

            if (eProximo) {
                ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
                ctx.fillRect(t.x - 60, t.y - 32, 160, 20);
                ctx.strokeStyle = '#38bdf8';
                ctx.lineWidth = 1;
                ctx.strokeRect(t.x - 60, t.y - 32, 160, 20);

                ctx.fillStyle = '#ffffff';
                ctx.font = 'bold 9px sans-serif';
                const msg = ('ontouchstart' in window) ? 'TOQUE AQUI PARA DESAFIAR' : 'PRESSIONE [E] PARA DESAFIAR';
                ctx.fillText(msg, t.x + 20, t.y - 22);
            }
        }});
    });

    elementosCidadaos.arvores.forEach(a => {
        elementosVisuais.push({ y: a.y, desenhar: () => desenharArvore25D(a) });
    });

    elementosCidadaos.postes.forEach(p => {
        elementosVisuais.push({ y: p.y, desenhar: () => desenharPoste25D(p) });
    });

    elementosVisuais.push({ y: jogador.y + jogador.altura, desenhar: () => desenharJogador() });

    elementosVisuais.sort((el1, el2) => el1.y - el2.y);
    elementosVisuais.forEach(el => el.desenhar());

    ctx.restore();

    requestAnimationFrame(loopJogo);
}