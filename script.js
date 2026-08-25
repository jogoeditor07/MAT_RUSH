const telaInicial = document.getElementById('tela-inicial');
const telaJogo = document.getElementById('tela-jogo');
const btnJogar = document.getElementById('btn-jogar');

const canvas = document.getElementById('canvas-jogo');
const ctx = canvas.getContext('2d');

// =========================================================================
// 📐 AJUSTE DINÂMICO DE TELA CHEIA
// =========================================================================
function redimensionarCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', redimensionarCanvas);
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

// =========================================================================
// 🎯 BANCO DE PERGUNTAS (NÍVEL MAIS DESAFIADOR - CIEP MARLENE ABIB)
// =========================================================================
const BANCO_DE_PERGUNTAS = {
    adicao: [
        { pergunta: "[1/5] O CIEP organizou uma campanha de arrecadação de alimentos em 3 etapas. Na 1ª etapa foram 485 kg, na 2ª foram 672 kg e na 3ª foram 543 kg. Qual o total arrecadado?", resposta: 1700 },
        { pergunta: "[2/5] Na biblioteca, o acervo antigo era de 1.250 livros. No trimestre passado chegaram 485 novos e, neste mês, mais 315. Quantos livros há agora?", resposta: 2050 },
        { pergunta: "[3/5] No festival cultural, o turno da manhã gerou R$ 1.340,00, o da tarde R$ 1.890,00 e a noite R$ 1.270,00 em doações. Quanto foi o total?", resposta: 4500 },
        { pergunta: "[4/5] Para a reforma do laboratório, foram comprados 850 parafusos grandes, 625 médios e 525 pequenos. Quantos parafusos foram comprados ao todo?", resposta: 2000 },
        { pergunta: "[5/5] A escola gastou 1.450 litros de água na segunda-feira, 1.820 na terça e 1.730 na quarta. Qual foi o consumo total nesses três dias?", resposta: 5000 }
    ],

    subtracao: [
        { pergunta: "[1/5] O estoque central do CIEP tinha 3.500 folhas de EVA. Os professores usaram 1.425 para os projetos e 875 para murais. Quantas folhas sobraram?", resposta: 1200 },
        { pergunta: "[2/5] Uma verba de R$ 5.000,00 foi destinada à escola. Foram gastos R$ 1.850,00 com material esportivo e R$ 2.150,00 com livros. Quanto sobrou?", resposta: 1000 },
        { pergunta: "[3/5] O marcador de energia do CIEP indicava 8.420 kWh no início do mês e fechou em 6.950 kWh consumidos? (Calcule a diferença: 8420 - 3250).", resposta: 5170 },
        { pergunta: "[4/5] Havia 2.400 senhas para a gincana escolar. No primeiro dia foram distribuídas 980 e no segundo dia 845. Quantas senhas ainda restam?", resposta: 575 },
        { pergunta: "[5/5] Um total de 1.500 alunos participou da seletiva de atletismo, mas 634 foram eliminados na primeira fase e 416 na segunda. Quantos continuam?", resposta: 450 }
    ],

    multiplicacao: [
        { pergunta: "[1/5] O CIEP comprou 24 caixas de giz de cera. Cada caixa contém 48 unidades. Quantas unidades de giz de cera foram compradas no total?", resposta: 1152 },
        { pergunta: "[2/5] Um evento reuniu 35 turmas, e cada turma arrecadou exatamente 64 kg de alimentos para a caridade. Quantos quilos foram arrecadados?", resposta: 2240 },
        { pergunta: "[3/5] O refeitório serve refeições em mesas de 12 lugares. Se há 45 mesas lotadas em dois turnos (considere 45 x 18), quantas refeições foram?", resposta: 810 },
        { pergunta: "[4/5] Para a festa junina, foram encomendados 78 pacotes com 35 bandeirinhas em cada um. Quantas bandeirinhas vieram ao todo?", resposta: 2730 },
        { pergunta: "[5/5] Uma biblioteca escolar possui 54 estantes, e cada estante tem capacidade para 85 livros organizados. Quantos livros cabem no máximo?", resposta: 4590 }
    ],

    divisao: [
        { pergunta: "[1/5] A prefeitura enviou 2.880 cadernos para serem distribuídos igualmente entre as 24 turmas do CIEP. Quantos cadernos cada turma recebeu?", resposta: 120 },
        { pergunta: "[2/5] Um total de R$ 3.360,00 obtido em doações foi dividido igualmente entre 14 projetos pedagógicos da escola. Quanto recebeu cada projeto?", resposta: 240 },
        { pergunta: "[3/5] A horta do CIEP produziu 1.440 morangos e os empacotou em bandejas com 18 unidades cada. Quantas bandejas foram formadas?", resposta: 80 },
        { pergunta: "[4/5] Para uma olimpíada de matemática, 1.728 alunos foram separados em 36 salas com a mesma quantidade. Quantos alunos ficaram por sala?", resposta: 48 },
        { pergunta: "[5/5] O estoque tem 4.500 folhas de cartolina para dividir de forma igual entre os 25 professores da instituição. Quantas folhas cada um ganhou?", resposta: 180 }
    ],

    porcentagem: [
        { pergunta: "[1/5] O custo total de uma excursão escolar era de R$ 250,00, mas o CIEP conseguiu um patrocínio com 35% de desconto. Qual o valor do desconto?", resposta: 87.5 },
        { pergunta: "[2/5] Dos 800 alunos matriculados no CIEP, 15% fazem parte do coral da escola. Quantos alunos participam do coral?", resposta: 120 },
        { pergunta: "[3/5] Um notebook para o laboratório custava R$ 2.400,00 e teve um reajuste (aumento) de 12%. Qual foi o valor do aumento em reais?", resposta: 288 },
        { pergunta: "[4/5] Em uma avaliação diagnóstica com 300 questões respondidas no total da rede, 65% foram acertadas pelos estudantes. Quantas acertos houve?", resposta: 195 },
        { pergunta: "[5/5] Uma blusa do uniforme do CIEP custava R$ 85,00 e foi vendida com 20% de desconto na liquidação. Qual foi o valor do desconto?", resposta: 17 }
    ]
};

const progressoComercios = { adicao: 0, subtracao: 0, multiplicacao: 0, divisao: 0, porcentagem: 0 };

let pontuacao = 0;
let vidas = 3;
let desafioAtual = null;
let comercioAtualCategoria = null;
let jogoPausado = false;
let comercioProximo = null;
let loopIniciado = false;

// Mapa ajustado para 1800x1350
const mundo = { largura: 1800, altura: 1350 };
const jogador = { x: 605, y: 455, largura: 30, altura: 30, velocidade: 4.5 };
const camera = { x: 0, y: 0 };
const teclas = { ArrowUp: false, ArrowDown: false, ArrowLeft: false, ArrowRight: false, w: false, s: false, a: false, d: false, e: false };

// Posicionamento proporcional ao mapa 1800x1350
const comercios = [
    {
        id: 'mercado', nome: 'MERCADO', icone: '🛒', categoria: 'adicao',
        x: 120, y: 60, largura: 250, altura: 140,
        corParede: '#334155', corTelhado: '#1e293b', corToldo: '#0284c7', corPlaca: '#0f172a',
        terminal: { x: 225, y: 210, largura: 40, altura: 32 }
    },
    {
        id: 'padaria', nome: 'PADARIA', icone: '🥖', categoria: 'subtracao',
        x: 1430, y: 60, largura: 250, altura: 140,
        corParede: '#78350f', corTelhado: '#451a03', corToldo: '#d97706', corPlaca: '#292524',
        terminal: { x: 1535, y: 210, largura: 40, altura: 32 }
    },
    {
        id: 'roupas', nome: 'LOJA DE ROUPAS', icone: '👕', categoria: 'porcentagem',
        x: 775, y: 550, largura: 250, altura: 140,
        corParede: '#6b21a8', corTelhado: '#581c87', corToldo: '#a855f7', corPlaca: '#3b0764',
        terminal: { x: 880, y: 700, largura: 40, altura: 32 }
    },
    {
        id: 'farmacia', nome: 'FARMÁCIA', icone: '💊', categoria: 'divisao',
        x: 120, y: 1020, largura: 250, altura: 140,
        corParede: '#0f766e', corTelhado: '#115e59', corToldo: '#059669', corPlaca: '#064e3b',
        terminal: { x: 225, y: 1170, largura: 40, altura: 32 }
    },
    {
        id: 'lanchonete', nome: 'LANCHONETE', icone: '🍔', categoria: 'multiplicacao',
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

// =========================================================================
// 📱 CONTROLES TOUCH OTIMIZADOS PARA MOBILE
// =========================================================================
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

// =========================================================================
// 🧱 SISTEMA DE COLISÃO E MOVIMENTAÇÃO
// =========================================================================
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
        alert(`Parabéns! Você já respondeu todas as 5 perguntas de ${loja.nome}.`);
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

function validarResposta() {
    const val = parseFloat(respostaInput.value);
    if (isNaN(val)) return;

    if (val === desafioAtual.resposta) {
        pontuacao += 10;
        if (pontuacaoEl) pontuacaoEl.textContent = pontuacao;
        mensagemFeedback.style.color = '#22c55e';
        mensagemFeedback.textContent = 'Correto! +10 pontos';
        progressoComercios[comercioAtualCategoria]++;
        setTimeout(() => fecharModalEAfastar(), 800);
    } else {
        vidas--;
        atualizarVidas();
        mensagemFeedback.style.color = '#ef4444';
        mensagemFeedback.textContent = 'Incorreto! Tente novamente.';

        if (vidas <= 0) {
            alert('Fim de jogo! Você perdeu todas as vidas. Pontuação total: ' + pontuacao);
            document.location.reload();
        }
    }
}

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

// =========================================================================
// 🔄 LOOP DO JOGO
// =========================================================================
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