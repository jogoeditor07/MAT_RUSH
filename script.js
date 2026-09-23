const telaInicial = document.getElementById('tela-inicial');
const telaJogo = document.getElementById('tela-jogo');
const btnJogar = document.getElementById('btn-jogar');

const canvas = document.getElementById('canvas-jogo');
const ctx = canvas.getContext('2d');

// Elementos da HUD e Modal
const pontuacaoEl = document.getElementById('pontuacao');
const vidasEl = document.getElementById('vidas');
const modalDesafio = document.getElementById('modal-desafio');
const tituloComercio = document.getElementById('titulo-comercio');
const enunciadoConta = document.getElementById('enunciado-conta');
const respostaInput = document.getElementById('resposta-jogador');
const btnResponder = document.getElementById('btn-responder');
const btnFechar = document.getElementById('btn-fechar');
const mensagemFeedback = document.getElementById('mensagem-feedback');

// =========================================================================
// 🎯 BANCO DE PERGUNTAS (OPERAÇÃO NA LÓGICA)
// =========================================================================
const BANCO_DE_PERGUNTAS = {
    adicao: [
        { pergunta: "Quanto é 15 + 27?", resposta: 42 },
        { pergunta: "Quanto é 85 + 15?", resposta: 100 }
    ],
    subtracao: [
        { pergunta: "Quanto é 50 - 18?", resposta: 32 },
        { pergunta: "Quanto é 100 - 45?", resposta: 55 }
    ],
    multiplicacao: [
        { pergunta: "Quanto é 7 × 8?", resposta: 56 },
        { pergunta: "Quanto é 9 × 6?", resposta: 54 }
    ],
    divisao: [
        { pergunta: "Quanto é 81 ÷ 9?", resposta: 9 },
        { pergunta: "Quanto é 100 ÷ 4?", resposta: 25 }
    ]
};

// Estado do Jogo
let pontuacao = 0;
let vidas = 3;
let desafioAtual = null;
let jogoPausado = false;
let comercioProximo = null; // Guarda o comércio cujo terminal está ao alcance

// Configurações do Mundo Urbano (2400x1800 MANTIDO)
const mundo = { largura: 2400, altura: 1800 };

// Posição e propriedades do Jogador (MANTIDO)
const jogador = { x: 1200, y: 900, largura: 30, altura: 30, velocidade: 4 };

// Câmera do Jogo (MANTIDO)
const camera = { x: 0, y: 0 };

// Monitor de teclas
const teclas = { ArrowUp: false, ArrowDown: false, ArrowLeft: false, ArrowRight: false, w: false, s: false, a: false, d: false, e: false };

// =========================================================================
// 🏬 ESTABELECIMENTOS URBANOS E SEUS TERMINAIS
// =========================================================================
const comercios = [
    {
        id: 'mercado',
        nome: 'MERCADO',
        icone: '🛒',
        categoria: 'adicao',
        x: 180, y: 80, largura: 280, altura: 160,
        corParede: '#334155', corTelhado: '#1e293b', corToldo: '#0284c7', corPlaca: '#0f172a',
        terminal: { x: 300, y: 270, largura: 40, altura: 35 }
    },
    {
        id: 'padaria',
        nome: 'PADARIA',
        icone: '🥖',
        categoria: 'subtracao',
        x: 1900, y: 80, largura: 280, altura: 160,
        corParede: '#78350f', corTelhado: '#451a03', corToldo: '#d97706', corPlaca: '#292524',
        terminal: { x: 2020, y: 270, largura: 40, altura: 35 }
    },
    {
        id: 'farmacia',
        nome: 'FARMÁCIA',
        icone: '💊',
        categoria: 'multiplicacao',
        x: 180, y: 1320, largura: 280, altura: 160,
        corParede: '#0f766e', corTelhado: '#115e59', corToldo: '#059669', corPlaca: '#064e3b',
        terminal: { x: 300, y: 1510, largura: 40, altura: 35 }
    },
    {
        id: 'lanchonete',
        nome: 'LANCHONETE',
        icone: '🍔',
        categoria: 'divisao',
        x: 1900, y: 1320, largura: 280, altura: 160,
        corParede: '#9f1239', corTelhado: '#881337', corToldo: '#dc2626', corPlaca: '#450a0a',
        terminal: { x: 2020, y: 1510, largura: 40, altura: 35 }
    }
];

// Elementos cenográficos do mapa urbano
const elementosCidadaos = {
    arvores: [
        {x: 100, y: 500}, {x: 700, y: 500}, {x: 900, y: 500}, {x: 1500, y: 500},
        {x: 100, y: 1280}, {x: 700, y: 1280}, {x: 1500, y: 1280}, {x: 2300, y: 1280},
        {x: 700, y: 100}, {x: 1500, y: 100}, {x: 700, y: 1700}, {x: 1500, y: 1700}
    ],
    postes: [
        {x: 500, y: 520}, {x: 1100, y: 520}, {x: 1800, y: 520},
        {x: 500, y: 1270}, {x: 1100, y: 1270}, {x: 1800, y: 1270},
        {x: 720, y: 300}, {x: 720, y: 900}, {x: 1520, y: 300}, {x: 1520, y: 900}
    ],
    bancos: [
        {x: 520, y: 260}, {x: 1820, y: 260}, {x: 520, y: 1500}, {x: 1820, y: 1500}
    ],
    lixeiras: [
        {x: 480, y: 265}, {x: 1780, y: 265}, {x: 480, y: 1505}, {x: 1780, y: 1505}
    ],
    carros: [
        {x: 100, y: 560, cor: '#ef4444', dir: 'H'}, {x: 350, y: 560, cor: '#3b82f6', dir: 'H'},
        {x: 1800, y: 1160, cor: '#eab308', dir: 'H'}, {x: 2050, y: 1160, cor: '#10b981', dir: 'H'},
        {x: 760, y: 1000, cor: '#a855f7', dir: 'V'}, {x: 1560, y: 400, cor: '#64748b', dir: 'V'}
    ]
};

btnJogar.addEventListener('click', () => {
    telaInicial.classList.add('escondido');
    telaJogo.classList.remove('escondido');
    loopJogo();
});

window.addEventListener('keydown', (e) => {
    const tecla = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    if (teclas.hasOwnProperty(tecla)) teclas[tecla] = true;

    // Tecla 'E' para acionar o desafio quando próximo
    if (tecla === 'e' && comercioProximo && !jogoPausado) {
        abrirDesafio(comercioProximo);
    }
});

window.addEventListener('keyup', (e) => {
    const tecla = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    if (teclas.hasOwnProperty(tecla)) teclas[tecla] = false;
});

function atualizarJogador() {
    if (jogoPausado) return;

    if ((teclas.ArrowUp || teclas.w) && jogador.y > 0) jogador.y -= jogador.velocidade;
    if ((teclas.ArrowDown || teclas.s) && jogador.y + jogador.altura < mundo.altura) jogador.y += jogador.velocidade;
    if ((teclas.ArrowLeft || teclas.a) && jogador.x > 0) jogador.x -= jogador.velocidade;
    if ((teclas.ArrowRight || teclas.d) && jogador.x + jogador.largura < mundo.largura) jogador.x += jogador.velocidade;

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

// Verifica aproximação ou contato com as caixas/terminais de desafio
function verificarProximidadeTerminal() {
    comercioProximo = null;

    comercios.forEach(loja => {
        const t = loja.terminal;
        
        // Área de interação ligeiramente maior que o terminal
        const margem = 20;
        const emProximidade = (
            jogador.x < t.x + t.largura + margem &&
            jogador.x + jogador.largura > t.x - margem &&
            jogador.y < t.y + t.altura + margem &&
            jogador.y + jogador.altura > t.y - margem
        );

        // Contato direto
        const emContato = (
            jogador.x < t.x + t.largura &&
            jogador.x + jogador.largura > t.x &&
            jogador.y < t.y + t.altura &&
            jogador.y + jogador.altura > t.y
        );

        if (emProximidade) {
            comercioProximo = loja;
        }

        if (emContato && !jogoPausado) {
            abrirDesafio(loja);
        }
    });
}

function abrirDesafio(loja) {
    jogoPausado = true;
    
    const listaPerguntas = BANCO_DE_PERGUNTAS[loja.categoria];
    const indiceAleatorio = Math.floor(Math.random() * listaPerguntas.length);
    desafioAtual = listaPerguntas[indiceAleatorio];

    tituloComercio.textContent = `${loja.icone} ${loja.nome}`;
    enunciadoConta.textContent = desafioAtual.pergunta;
    respostaInput.value = '';
    mensagemFeedback.textContent = '';
    modalDesafio.classList.remove('escondido');
    respostaInput.focus();
}

btnResponder.addEventListener('click', validarResposta);

respostaInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') validarResposta();
});

function validarResposta() {
    const val = parseFloat(respostaInput.value);
    if (isNaN(val)) return;

    if (val === desafioAtual.resposta) {
        pontuacao += 10;
        pontuacaoEl.textContent = pontuacao;
        mensagemFeedback.style.color = '#22c55e';
        mensagemFeedback.textContent = 'Correto! +10 pontos';

        setTimeout(() => {
            fecharModalEAfastar();
        }, 1000);
    } else {
        vidas--;
        atualizarVidas();
        mensagemFeedback.style.color = '#ef4444';
        mensagemFeedback.textContent = 'Incorreto! Tente novamente.';

        if (vidas <= 0) {
            alert('Fim de jogo! Sua pontuação: ' + pontuacao);
            document.location.reload();
        }
    }
}

btnFechar.addEventListener('click', () => {
    fecharModalEAfastar();
});

function fecharModalEAfastar() {
    modalDesafio.classList.add('escondido');
    jogador.y += 30; // Recua o jogador para fora do terminal
    jogoPausado = false;
}

function atualizarVidas() {
    let textoVidas = '';
    for (let i = 0; i < vidas; i++) textoVidas += '❤️';
    vidasEl.textContent = textoVidas;
}

// =========================================================================
// 🎨 DESENHO DO MAPA URBANO DETALHADO
// =========================================================================
function desenharMapaUrbano() {
    // Gramado de Fundo
    ctx.fillStyle = '#15803d';
    ctx.fillRect(0, 0, mundo.largura, mundo.altura);

    // Asfalto das Ruas
    ctx.fillStyle = '#334155';
    ctx.fillRect(0, 540, mundo.largura, 120);
    ctx.fillRect(0, 1140, mundo.largura, 120);
    ctx.fillRect(740, 0, 120, mundo.altura);
    ctx.fillRect(1540, 0, 120, mundo.altura);

    // Calçadas das Ruas
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(0, 520, mundo.largura, 20);
    ctx.fillRect(0, 660, mundo.largura, 20);
    ctx.fillRect(0, 1120, mundo.largura, 20);
    ctx.fillRect(0, 1260, mundo.largura, 20);
    ctx.fillRect(720, 0, 20, mundo.altura);
    ctx.fillRect(860, 0, 20, mundo.altura);
    ctx.fillRect(1520, 0, 20, mundo.altura);
    ctx.fillRect(1660, 0, 20, mundo.altura);

    // Faixas de Pedestre nas Esquinas
    ctx.fillStyle = '#ffffff';
    const esquinasX = [740, 1540];
    const esquinasY = [540, 1140];

    esquinasX.forEach(ex => {
        esquinasY.forEach(ey => {
            for (let i = 10; i < 110; i += 20) {
                ctx.fillRect(ex + i, ey - 30, 12, 30);
                ctx.fillRect(ex + i, ey + 120, 12, 30);
                ctx.fillRect(ex - 30, ey + i, 30, 12);
                ctx.fillRect(ex + 120, ey + i, 30, 12);
            }
        });
    });

    // Faixas Pontilhadas Amarelas
    ctx.fillStyle = '#facc15';
    for (let x = 0; x < mundo.largura; x += 60) {
        if ((x < 720 || x > 860) && (x < 1520 || x > 1660)) {
            ctx.fillRect(x, 598, 30, 4);
            ctx.fillRect(x, 1198, 30, 4);
        }
    }
    for (let y = 0; y < mundo.altura; y += 60) {
        if ((y < 520 || y > 660) && (y < 1120 || y > 1260)) {
            ctx.fillRect(798, y, 4, 30);
            ctx.fillRect(1598, y, 4, 30);
        }
    }

    // Quarteirões Urbanos Residenciais
    ctx.fillStyle = '#1e293b';
    const posicoesBlocos = [
        {x: 60, y: 60, w: 640, h: 440}, {x: 880, y: 60, w: 620, h: 440}, {x: 1700, y: 60, w: 640, h: 440},
        {x: 60, y: 700, w: 640, h: 400}, {x: 880, y: 700, w: 620, h: 400}, {x: 1700, y: 700, w: 640, h: 400},
        {x: 60, y: 1300, w: 640, h: 440}, {x: 880, y: 1300, w: 620, h: 440}, {x: 1700, y: 1300, w: 640, h: 440}
    ];

    posicoesBlocos.forEach(b => {
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(b.x, b.y, b.w, b.h);
        ctx.fillStyle = '#334155';
        ctx.fillRect(b.x + 10, b.y + 10, b.w - 20, b.h - 20);
    });

    // Elementos Cenográficos: Carros Estacionados
    elementosCidadaos.carros.forEach(c => {
        ctx.fillStyle = c.cor;
        if (c.dir === 'H') {
            ctx.fillRect(c.x, c.y, 70, 35);
            ctx.fillStyle = '#38bdf8';
            ctx.fillRect(c.x + 15, c.y + 5, 20, 25);
            ctx.fillRect(c.x + 45, c.y + 5, 12, 25);
        } else {
            ctx.fillRect(c.x, c.y, 35, 70);
            ctx.fillStyle = '#38bdf8';
            ctx.fillRect(c.x + 5, c.y + 15, 25, 20);
            ctx.fillRect(c.x + 5, c.y + 45, 25, 12);
        }
    });

    // Elementos Cenográficos: Árvores
    elementosCidadaos.arvores.forEach(a => {
        ctx.fillStyle = 'rgba(0,0,0,0.2)';
        ctx.beginPath();
        ctx.arc(a.x + 4, a.y + 4, 22, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#15803d';
        ctx.beginPath();
        ctx.arc(a.x, a.y, 22, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#22c55e';
        ctx.beginPath();
        ctx.arc(a.x - 5, a.y - 5, 12, 0, Math.PI * 2);
        ctx.fill();
    });

    // Elementos Cenográficos: Postes
    elementosCidadaos.postes.forEach(p => {
        ctx.fillStyle = '#64748b';
        ctx.beginPath();
        ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#fef08a';
        ctx.beginPath();
        ctx.arc(p.x, p.y, 10, 0, Math.PI * 2);
        ctx.globalAlpha = 0.3;
        ctx.fill();
        ctx.globalAlpha = 1.0;
    });

    // Elementos Cenográficos: Bancos e Lixeiras
    elementosCidadaos.bancos.forEach(b => {
        ctx.fillStyle = '#78350f';
        ctx.fillRect(b.x, b.y, 30, 10);
    });

    elementosCidadaos.lixeiras.forEach(l => {
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(l.x, l.y, 10, 10);
    });
}

// =========================================================================
// 🏬 RENDERIZAÇÃO DOS ESTABELECIMENTOS E TERMINAIS
// =========================================================================
function desenharComercios() {
    comercios.forEach(loja => {
        // 1. Calçada e Pátio Frontal
        ctx.fillStyle = '#cbd5e1';
        ctx.fillRect(loja.x - 15, loja.y - 15, loja.largura + 30, loja.altura + 110);

        // Piso com Textura de Placas
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 1;
        for (let px = loja.x - 15; px < loja.x + loja.largura + 15; px += 30) {
            ctx.beginPath();
            ctx.moveTo(px, loja.y + loja.altura);
            ctx.lineTo(px, loja.y + loja.altura + 110);
            ctx.stroke();
        }

        // 2. Paredes do Prédio
        ctx.fillStyle = loja.corParede;
        ctx.fillRect(loja.x, loja.y, loja.largura, loja.altura);

        // 3. Telhado
        ctx.fillStyle = loja.corTelhado;
        ctx.fillRect(loja.x + 12, loja.y + 12, loja.largura - 24, loja.altura - 40);

        // Detalhes no Telhado (Ar condicionado e exaustores)
        ctx.fillStyle = '#475569';
        ctx.fillRect(loja.x + 30, loja.y + 25, 35, 25);
        ctx.fillRect(loja.x + loja.largura - 65, loja.y + 25, 30, 30);

        // 4. Vitrines Espelhadas
        ctx.fillStyle = '#38bdf8';
        ctx.globalAlpha = 0.7;
        ctx.fillRect(loja.x + 20, loja.y + loja.altura - 25, 60, 20);
        ctx.fillRect(loja.x + loja.largura - 80, loja.y + loja.altura - 25, 60, 20);
        ctx.globalAlpha = 1.0;

        // Porta Social
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(loja.x + loja.largura / 2 - 20, loja.y + loja.altura - 25, 40, 25);

        // 5. Placa/Letreiro Grande
        ctx.fillStyle = loja.corPlaca;
        ctx.fillRect(loja.x + 10, loja.y + loja.altura - 50, loja.largura - 20, 22);
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.strokeRect(loja.x + 10, loja.y + loja.altura - 50, loja.largura - 20, 22);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 13px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${loja.icone} ${loja.nome}`, loja.x + loja.largura / 2, loja.y + loja.altura - 39);

        // 6. Toldo Comercial Frontal
        ctx.fillStyle = loja.corToldo;
        ctx.fillRect(loja.x + 5, loja.y + loja.altura - 5, loja.largura - 10, 8);

        // 7. DESENHO DO TERMINAL / CAIXA DE DESAFIO
        const t = loja.terminal;
        const eProximo = (comercioProximo && comercioProximo.id === loja.id);

        // Brilho de Destaque se o jogador estiver perto
        if (eProximo) {
            ctx.shadowColor = '#38bdf8';
            ctx.shadowBlur = 15;
            ctx.strokeStyle = '#38bdf8';
            ctx.lineWidth = 3;
            ctx.strokeRect(t.x - 4, t.y - 4, t.largura + 8, t.altura + 8);
        }

        // Corpo Físico do Terminal
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(t.x, t.y, t.largura, t.altura);
        
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 2;
        ctx.strokeRect(t.x, t.y, t.largura, t.altura);

        // Tela do Terminal
        ctx.fillStyle = '#0284c7';
        ctx.fillRect(t.x + 5, t.y + 5, t.largura - 10, 15);

        // Símbolo de Desafio "?"
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 12px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('?', t.x + t.largura / 2, t.y + 13);

        // Luz Superior Indicadora
        ctx.fillStyle = eProximo ? '#22c55e' : '#f59e0b';
        ctx.beginPath();
        ctx.arc(t.x + t.largura / 2, t.y - 3, 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.shadowBlur = 0; // Reseta sombra

        // Balão de Texto "PRESSIONE E PARA DESAFIAR"
        if (eProximo) {
            ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
            ctx.fillRect(t.x - 65, t.y - 35, 170, 22);
            ctx.strokeStyle = '#38bdf8';
            ctx.lineWidth = 1;
            ctx.strokeRect(t.x - 65, t.y - 35, 170, 22);

            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 10px sans-serif';
            ctx.fillText('PRESSIONE [E] PARA DESAFIAR', t.x + 20, t.y - 24);
        }
    });
}

// =========================================================================
// 🏃 DESENHO DO JOGADOR
// =========================================================================
function desenharJogador() {
    const centroX = jogador.x + jogador.largura / 2;

    // Sombra do Personagem
    ctx.fillStyle = 'rgba(0,0,0,0.25)';
    ctx.beginPath();
    ctx.ellipse(centroX, jogador.y + 28, 12, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    // Corpo / Camisa
    ctx.fillStyle = '#2563eb';
    ctx.fillRect(jogador.x + 6, jogador.y + 12, 18, 12);

    // Pernas
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(jogador.x + 7, jogador.y + 24, 6, 6);
    ctx.fillRect(jogador.x + 17, jogador.y + 24, 6, 6);

    // Cabeça
    ctx.fillStyle = '#fca5a5';
    ctx.beginPath();
    ctx.arc(centroX, jogador.y + 9, 7, 0, Math.PI * 2);
    ctx.fill();

    // Boné
    ctx.fillStyle = '#f43f5e';
    ctx.beginPath();
    ctx.arc(centroX, jogador.y + 7, 7, Math.PI, 0);
    ctx.fill();
    ctx.fillRect(centroX - 2, jogador.y + 5, 11, 3);
}

// =========================================================================
// 🔄 LOOP PRINCIPAL
// =========================================================================
function loopJogo() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    atualizarJogador();
    atualizarCamera();

    ctx.save();
    ctx.translate(-camera.x, -camera.y);

    desenharMapaUrbano();
    desenharComercios();
    desenharJogador();

    ctx.restore();

    requestAnimationFrame(loopJogo);
}