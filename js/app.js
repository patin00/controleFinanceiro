/* ========================================================= */
/* CONTROLE FINANCEIRO                                       */
/* ========================================================= */


/* ========================================================= */
/* DADOS INICIAIS                                            */
/* ========================================================= */

let movimentacoes = [

    {
        descricao: "Salario",
        valor: 5000,
        tipo: "receita",
        categoria: "trabalho",
        data: "2026-08-24"
    },

    {
        descricao: "Mercado",
        valor: 350,
        tipo: "despesa",
        categoria: "alimentacao",
        data: "2026-08-24"
    },

    {
        descricao: "Internet",
        valor: 100,
        tipo: "despesa",
        categoria: "casa",
        data: "2026-08-24"
    },

    {
        descricao: "Freelance",
        valor: 800,
        tipo: "receita",
        categoria: "trabalho",
        data: "2026-08-24"
    }

];


/* ========================================================= */
/* VARIÁVEIS DE CONTROLE                                     */
/* ========================================================= */

let indiceEmEdicao = null;

let graficoFinanceiro = null;

let graficoCategorias = null;

let graficoEvolucao = null;


/* ========================================================= */
/* ELEMENTOS DO HTML                                         */
/* ========================================================= */

const formulario =
    document.getElementById("form-movimentacao");

const botaoFormulario =
    formulario.querySelector(
        "button[type='submit']"
    );

const botaoCancelar =
    document.getElementById(
        "botao-cancelar"
    );


const modalFormulario =
    document.getElementById(
        "modal-formulario"
    );

const botaoAbrirFormulario =
    document.getElementById(
        "botao-abrir-formulario"
    );

const botaoFecharModal =
    document.getElementById(
        "botao-fechar-modal"
    );

const tituloModal =
    document.getElementById(
        "titulo-modal"
    );
const filtroTipo =
    document.getElementById("filtro-tipo");

const filtroCategoria =
    document.getElementById("filtro-categoria");

const filtroMes =
    document.getElementById("filtro-mes");

const buscaMovimentacao =
    document.getElementById("busca-movimentacao");

const botaoLimparFiltros =
    document.getElementById("botao-limpar-filtros");


/* ========================================================= */
/* LOCAL STORAGE                                             */
/* ========================================================= */

const dadosSalvos =
    localStorage.getItem("movimentacoes");

if (dadosSalvos) {

    try {

        movimentacoes =
            JSON.parse(dadosSalvos);

    } catch (erro) {

        console.error(
            "Erro ao recuperar movimentações:",
            erro
        );

    }

}


/* ========================================================= */
/* COMPATIBILIDADE COM DADOS ANTIGOS                         */
/* ========================================================= */

function normalizarMovimentacoes() {

    movimentacoes = movimentacoes.map(function (movimentacao) {

        return {

            descricao:
                movimentacao.descricao || "",

            valor:
                Number(movimentacao.valor) || 0,

            tipo:
                movimentacao.tipo || "despesa",

            categoria:
                movimentacao.categoria || "sem categoria",

            data:
                movimentacao.data || obterDataAtual()

        };

    });

}

normalizarMovimentacoes();


/* ========================================================= */
/* FORMATADOR DE MOEDA                                       */
/* ========================================================= */

const formatadorMoeda =
    new Intl.NumberFormat("pt-BR", {

        style: "currency",

        currency: "BRL"

    });


/* ========================================================= */
/* FORMATAR DATA                                             */
/* ========================================================= */

function formatarData(data) {

    if (!data) {
        return "";
    }

    const partes =
        data.split("-");

    if (partes.length !== 3) {
        return data;
    }

    return (
        partes[2] +
        "/" +
        partes[1] +
        "/" +
        partes[0]
    );

}


/* ========================================================= */
/* OBTER DATA ATUAL                                          */
/* ========================================================= */

function obterDataAtual() {

    const hoje =
        new Date();

    const ano =
        hoje.getFullYear();

    const mes =
        String(
            hoje.getMonth() + 1
        ).padStart(2, "0");

    const dia =
        String(
            hoje.getDate()
        ).padStart(2, "0");

    return (
        ano +
        "-" +
        mes +
        "-" +
        dia
    );

}


/* ========================================================= */
/* FORMATAR MÊS                                              */
/* ========================================================= */

function formatarMesAno(data) {

    if (!data) {
        return "";
    }

    const partes =
        data.split("-");

    if (partes.length !== 3) {
        return "";
    }

    const mes =
        partes[1];

    const ano =
        partes[0];

    const nomesMeses = [

        "Janeiro",
        "Fevereiro",
        "Março",
        "Abril",
        "Maio",
        "Junho",
        "Julho",
        "Agosto",
        "Setembro",
        "Outubro",
        "Novembro",
        "Dezembro"

    ];

    return (
        nomesMeses[
        Number(mes) - 1
        ] +
        " de " +
        ano
    );

}


/* ========================================================= */
/* CALCULAR RESUMO                                           */
/* ========================================================= */

function calcularResumo(lista) {

    let receitas = 0;

    let despesas = 0;


    lista.forEach(function (movimentacao) {

        if (
            movimentacao.tipo === "receita"
        ) {

            receitas +=
                Number(movimentacao.valor);

        }


        if (
            movimentacao.tipo === "despesa"
        ) {

            despesas +=
                Number(movimentacao.valor);

        }

    });


    return {

        receitas: receitas,

        despesas: despesas,

        saldo:
            receitas - despesas

    };

}


/* ========================================================= */
/* OBTER MOVIMENTAÇÕES FILTRADAS                             */
/* ========================================================= */

function obterMovimentacoesFiltradas() {

    const textoBusca =
        buscaMovimentacao.value
            .trim()
            .toLowerCase();


    const tipoSelecionado =
        filtroTipo.value;


    const categoriaSelecionada =
        filtroCategoria.value;


    const mesSelecionado =
        filtroMes.value;


    return movimentacoes.filter(
        function (movimentacao) {

            /* ------------------------- */
            /* BUSCA                     */
            /* ------------------------- */

            const correspondeBusca =

                textoBusca === "" ||

                movimentacao.descricao
                    .toLowerCase()
                    .includes(textoBusca) ||

                movimentacao.categoria
                    .toLowerCase()
                    .includes(textoBusca);


            if (!correspondeBusca) {
                return false;
            }


            /* ------------------------- */
            /* TIPO                      */
            /* ------------------------- */

            if (

                tipoSelecionado !== "todas" &&

                movimentacao.tipo !==
                tipoSelecionado

            ) {

                return false;

            }


            /* ------------------------- */
            /* CATEGORIA                 */
            /* ------------------------- */

            if (

                categoriaSelecionada !== "todas" &&

                movimentacao.categoria !==
                categoriaSelecionada

            ) {

                return false;

            }


            /* ------------------------- */
            /* MÊS                       */
            /* ------------------------- */

            if (

                mesSelecionado !== "todos" &&

                !movimentacao.data.startsWith(
                    mesSelecionado
                )

            ) {

                return false;

            }


            return true;

        }
    );

}


/* ========================================================= */
/* ATUALIZAR RESUMO                                          */
/* ========================================================= */

function atualizarResumo() {

    const lista =
        obterMovimentacoesFiltradas();


    const resultado =
        calcularResumo(lista);


    document.getElementById(
        "receitas"
    ).textContent =
        formatadorMoeda.format(
            resultado.receitas
        );


    document.getElementById(
        "despesas"
    ).textContent =
        formatadorMoeda.format(
            resultado.despesas
        );


    document.getElementById(
        "saldo"
    ).textContent =
        formatadorMoeda.format(
            resultado.saldo
        );


    atualizarIndicadorFiltros(
        lista
    );

}


/* ========================================================= */
/* INDICADOR DE FILTROS                                      */
/* ========================================================= */

function atualizarIndicadorFiltros(lista) {

    const indicador =
        document.getElementById(
            "indicador-filtros"
        );


    const busca =
        buscaMovimentacao.value.trim();


    const tipo =
        filtroTipo.value;


    const categoria =
        filtroCategoria.value;


    const mes =
        filtroMes.value;


    const existemFiltros =

        busca !== "" ||

        tipo !== "todas" ||

        categoria !== "todas" ||

        mes !== "todos";


    if (!existemFiltros) {

        indicador.textContent = "";

        return;

    }


    indicador.textContent =
        "Resumo financeiro — filtros aplicados";

}


/* ========================================================= */
/* ATUALIZAR FILTRO DE CATEGORIAS                            */
/* ========================================================= */

function atualizarFiltroCategorias() {

    const valorAtual =
        filtroCategoria.value;


    const categorias = [];


    movimentacoes.forEach(
        function (movimentacao) {

            const categoria =
                movimentacao.categoria
                    .trim();


            if (

                categoria !== "" &&

                !categorias.includes(
                    categoria
                )

            ) {

                categorias.push(
                    categoria
                );

            }

        }
    );


    categorias.sort(
        function (a, b) {

            return a.localeCompare(
                b,
                "pt-BR"
            );

        }
    );


    filtroCategoria.innerHTML = "";


    const opcaoTodas =
        document.createElement("option");

    opcaoTodas.value = "todas";

    opcaoTodas.textContent =
        "Todas as Categorias";


    filtroCategoria.appendChild(
        opcaoTodas
    );


    categorias.forEach(
        function (categoria) {

            const opcao =
                document.createElement(
                    "option"
                );

            opcao.value =
                categoria;

            opcao.textContent =
                categoria;

            filtroCategoria.appendChild(
                opcao
            );

        }
    );


    if (

        valorAtual === "todas" ||

        categorias.includes(
            valorAtual
        )

    ) {

        filtroCategoria.value =
            valorAtual;

    } else {

        filtroCategoria.value =
            "todas";

    }

}


/* ========================================================= */
/* ATUALIZAR FILTRO DE MESES                                 */
/* ========================================================= */

function atualizarFiltroMes() {

    const valorAtual =
        filtroMes.value;


    const meses = [];


    movimentacoes.forEach(
        function (movimentacao) {

            if (
                movimentacao.data &&
                !meses.includes(
                    movimentacao.data.substring(
                        0,
                        7
                    )
                )
            ) {

                meses.push(
                    movimentacao.data.substring(
                        0,
                        7
                    )
                );

            }

        }
    );


    meses.sort().reverse();


    filtroMes.innerHTML = "";


    const opcaoTodos =
        document.createElement("option");

    opcaoTodos.value =
        "todos";

    opcaoTodos.textContent =
        "Todos os meses";


    filtroMes.appendChild(
        opcaoTodos
    );


    meses.forEach(
        function (mes) {

            const opcao =
                document.createElement(
                    "option"
                );

            opcao.value =
                mes;

            opcao.textContent =
                formatarMesAno(
                    mes + "-01"
                );

            filtroMes.appendChild(
                opcao
            );

        }
    );


    if (

        valorAtual === "todos" ||

        meses.includes(
            valorAtual
        )

    ) {

        filtroMes.value =
            valorAtual;

    } else {

        filtroMes.value =
            "todos";

    }

}


/* ========================================================= */
/* RENDERIZAR MOVIMENTAÇÕES                                  */
/* ========================================================= */

function renderizarMovimentacoes() {

    const listaMovimentacoes =
        document.getElementById(
            "lista-movimentacoes"
        );


    listaMovimentacoes.innerHTML = "";


    const lista =
        obterMovimentacoesFiltradas();


    const contador =
        document.getElementById(
            "contador-movimentacoes"
        );


    contador.textContent =

        lista.length +
        (
            lista.length === 1
                ? " movimentação encontrada"
                : " movimentações encontradas"
        );


    if (lista.length === 0) {

        const mensagem =
            document.createElement(
                "div"
            );

        mensagem.classList.add(
            "mensagem-vazia"
        );

        mensagem.textContent =
            "Nenhuma movimentação encontrada.";

        listaMovimentacoes.appendChild(
            mensagem
        );

        return;

    }


    lista.forEach(
        function (movimentacao) {

            const indice =
                movimentacoes.indexOf(
                    movimentacao
                );


            /* ================================= */
            /* CARD */
            /* ================================= */

            const card =
                document.createElement(
                    "div"
                );

            card.classList.add(
                "card"
            );


            /* ================================= */
            /* ÁREA 1 - INFORMAÇÕES */
            /* ================================= */

            const cardInfo =
                document.createElement(
                    "div"
                );

            cardInfo.classList.add(
                "card-info"
            );


            const descricao =
                document.createElement(
                    "div"
                );

            descricao.classList.add(
                "card-descricao"
            );

            descricao.textContent =
                movimentacao.descricao;


            const categoria =
                document.createElement(
                    "div"
                );

            categoria.classList.add(
                "card-categoria"
            );

            categoria.textContent =
                movimentacao.categoria;


            const data =
                document.createElement(
                    "div"
                );

            data.classList.add(
                "card-data"
            );

            data.textContent =
                formatarData(
                    movimentacao.data
                );


            cardInfo.appendChild(
                descricao
            );

            cardInfo.appendChild(
                categoria
            );

            cardInfo.appendChild(
                data
            );


            /* ================================= */
            /* ÁREA 2 - FINANCEIRO */
            /* ================================= */

            const cardFinanceiro =
                document.createElement(
                    "div"
                );

            cardFinanceiro.classList.add(
                "card-financeiro"
            );


            const valor =
                document.createElement(
                    "div"
                );

            valor.classList.add(
                "card-valor"
            );

            valor.textContent =
                formatadorMoeda.format(
                    movimentacao.valor
                );


            const tipo =
                document.createElement(
                    "div"
                );

            tipo.classList.add(
                "card-tipo"
            );

            tipo.textContent =
                movimentacao.tipo;


            cardFinanceiro.appendChild(
                valor
            );

            cardFinanceiro.appendChild(
                tipo
            );


            /* ================================= */
            /* ÁREA 3 - BOTÕES */
            /* ================================= */

            const cardBotoes =
                document.createElement(
                    "div"
                );

            cardBotoes.classList.add(
                "card-botoes"
            );


            /* Botão excluir */

            const botaoExcluir =
                document.createElement(
                    "button"
                );

            botaoExcluir.classList.add(
                "botao-excluir"
            );

            botaoExcluir.textContent =
                "Excluir";


            botaoExcluir.addEventListener(
                "click",
                function () {

                    const confirmar =
                        confirm(
                            "Deseja realmente excluir esta movimentação?"
                        );


                    if (!confirmar) {
                        return;
                    }


                    movimentacoes.splice(
                        indice,
                        1
                    );


                    salvarMovimentacoes();

                    atualizarTela();

                }
            );


            /* Botão editar */

            const botaoEditar =
                document.createElement(
                    "button"
                );

            botaoEditar.classList.add(
                "botao-editar"
            );

            botaoEditar.textContent =
                "Editar";


            botaoEditar.addEventListener(
                "click",
                function () {

                    iniciarEdicao(
                        indice
                    );

                }
            );


            cardBotoes.appendChild(
                botaoExcluir
            );

            cardBotoes.appendChild(
                botaoEditar
            );


            /* ================================= */
            /* CLASSE RECEITA / DESPESA */
            /* ================================= */

            if (
                movimentacao.tipo ===
                "receita"
            ) {

                card.classList.add(
                    "receita"
                );

            } else {

                card.classList.add(
                    "despesa"
                );

            }


            /* ================================= */
            /* MONTAR CARD */
            /* ================================= */

            card.appendChild(
                cardInfo
            );

            card.appendChild(
                cardFinanceiro
            );

            card.appendChild(
                cardBotoes
            );


            listaMovimentacoes.appendChild(
                card
            );

        }
    );

}

/* ========================================================= */
/* ABRIR MODAL                                               */
/* ========================================================= */

function abrirModalFormulario() {

    modalFormulario.classList.add(
        "aberto"
    );

    modalFormulario.setAttribute(
        "aria-hidden",
        "false"
    );

}


/* ========================================================= */
/* FECHAR MODAL                                              */
/* ========================================================= */

function fecharModalFormulario() {

    modalFormulario.classList.remove(
        "aberto"
    );

    modalFormulario.setAttribute(
        "aria-hidden",
        "true"
    );

}
/* ========================================================= */
/* ABRIR FORMULÁRIO                                          */
/* ========================================================= */

botaoAbrirFormulario.addEventListener(
    "click",
    function () {

        abrirNovaMovimentacao();

    }
);


/* ========================================================= */
/* FECHAR MODAL                                              */
/* ========================================================= */

botaoFecharModal.addEventListener(
    "click",
    function () {

        cancelarEdicao();

    }
);


/* ========================================================= */
/* FECHAR CLICANDO FORA                                      */
/* ========================================================= */

modalFormulario.addEventListener(
    "click",
    function (event) {

        if (
            event.target ===
            modalFormulario
        ) {

            cancelarEdicao();

        }

    }
);


/* ========================================================= */
/* FECHAR COM ESC                                             */
/* ========================================================= */

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Escape" &&
            modalFormulario.classList.contains(
                "aberto"
            )
        ) {

            cancelarEdicao();

        }

    }
);

/* ========================================================= */
/* NOVA MOVIMENTAÇÃO                                         */
/* ========================================================= */

function abrirNovaMovimentacao() {

    formulario.reset();

    indiceEmEdicao = null;

    botaoFormulario.textContent =
        "Adicionar Movimentação";

    botaoCancelar.style.display =
        "block";

    tituloModal.textContent =
        "Adicionar Movimentação";

    abrirModalFormulario();

}
/* ========================================================= */
/* INICIAR EDIÇÃO                                            */
/* ========================================================= */

function iniciarEdicao(indice) {

    const movimentacao =
        movimentacoes[indice];


    indiceEmEdicao =
        indice;


    document.getElementById(
        "descricao"
    ).value =
        movimentacao.descricao;


    document.getElementById(
        "valor"
    ).value =
        movimentacao.valor;


    document.getElementById(
        "tipo"
    ).value =
        movimentacao.tipo;


    document.getElementById(
        "categoria"
    ).value =
        movimentacao.categoria;


    document.getElementById(
        "data"
    ).value =
        movimentacao.data;


    botaoFormulario.textContent =
        "Salvar Alterações";

    botaoCancelar.style.display =
        "block";

    tituloModal.textContent =
        "Editar Movimentação";

    abrirModalFormulario();

}


/* ========================================================= */
/* CANCELAR EDIÇÃO                                          */
/* ========================================================= */

function cancelarEdicao() {

    formulario.reset();

    indiceEmEdicao = null;

    botaoFormulario.textContent =
        "Adicionar Movimentação";

    botaoCancelar.style.display =
        "none";

    tituloModal.textContent =
        "Adicionar Movimentação";

    fecharModalFormulario();

}


/* ========================================================= */
/* SALVAR LOCAL STORAGE                                      */
/* ========================================================= */

function salvarMovimentacoes() {

    localStorage.setItem(
        "movimentacoes",
        JSON.stringify(
            movimentacoes
        )
    );

}


/* ========================================================= */
/* ATUALIZAR GRÁFICO FINANCEIRO                              */
/* ========================================================= */

function atualizarGraficoFinanceiro() {

    const canvas =
        document.getElementById(
            "grafico-financeiro"
        );


    const lista =
        obterMovimentacoesFiltradas();


    const resultado =
        calcularResumo(lista);


    if (graficoFinanceiro) {

        graficoFinanceiro.destroy();

    }


    graficoFinanceiro =
        new Chart(
            canvas,
            {

                type: "bar",

                data: {

                    labels: [
                        "Receitas",
                        "Despesas"
                    ],

                    datasets: [

                        {

                            label:
                                "Valor",

                            data: [

                                resultado.receitas,

                                resultado.despesas

                            ],

                            backgroundColor: [

                                "#008f20",

                                "#ff0000"

                            ],

                            borderRadius: 5

                        }

                    ]

                },

                options: {

                    responsive: true,

                    maintainAspectRatio: false,

                    plugins: {

                        legend: {
                            display: false
                        }

                    },

                    scales: {

                        y: {

                            beginAtZero: true

                        }

                    }

                }

            }
        );

}


/* ========================================================= */
/* ATUALIZAR GRÁFICO DE CATEGORIAS                           */
/* ========================================================= */

function atualizarGraficoCategorias() {

    const canvas =
        document.getElementById(
            "grafico-categorias"
        );


    const lista =
        obterMovimentacoesFiltradas();


    const despesasPorCategoria = {};


    lista.forEach(
        function (movimentacao) {

            if (
                movimentacao.tipo !==
                "despesa"
            ) {

                return;

            }


            const categoria =
                movimentacao.categoria;


            if (
                !despesasPorCategoria[
                categoria
                ]
            ) {

                despesasPorCategoria[
                    categoria
                ] = 0;

            }


            despesasPorCategoria[
                categoria
            ] += Number(
                movimentacao.valor
            );

        }
    );


    const categorias =
        Object.keys(
            despesasPorCategoria
        );


    const valores =
        Object.values(
            despesasPorCategoria
        );


    if (graficoCategorias) {

        graficoCategorias.destroy();

    }


    graficoCategorias =
        new Chart(
            canvas,
            {

                type: "doughnut",

                data: {

                    labels: categorias,

                    datasets: [

                        {

                            data: valores,

                            backgroundColor: [

                                "#ff0000",

                                "#ff8000",

                                "#008f20",

                                "#005eff",

                                "#8e44ad",

                                "#00a8a8",

                                "#f1c40f",

                                "#795548"

                            ]

                        }

                    ]

                },

                options: {

                    responsive: true,

                    maintainAspectRatio: false,

                    plugins: {

                        legend: {
                            display: true,

                            position: "bottom",

                            labels: {
                                padding: 15,

                                usePointStyle: true
                            }
                        },

                        tooltip: {

                            callbacks: {

                                label: function (context) {

                                    const valor =
                                        context.raw;

                                    return (
                                        context.label +
                                        ": " +
                                        valor.toLocaleString(
                                            "pt-BR",
                                            {
                                                style: "currency",
                                                currency: "BRL"
                                            }
                                        )
                                    );

                                }

                            }

                        }

                    }

                }

            }
        );

}
/* ========================================================= */
/* GRÁFICO DE EVOLUÇÃO FINANCEIRA                            */
/* ========================================================= */

// ============================================
// GRÁFICO DE EVOLUÇÃO FINANCEIRA
// ============================================

function atualizarGraficoEvolucao() {

    const lista =
        obterMovimentacoesFiltradas();


    // ============================================
    // VERIFICAR FILTRO DE MÊS
    // ============================================

    const mesSelecionado =
        filtroMes.value;


    // ============================================
    // NENHUMA MOVIMENTAÇÃO
    // ============================================

    if (lista.length === 0) {

        if (graficoEvolucao !== null) {

            graficoEvolucao.destroy();

            graficoEvolucao = null;

        }

        return;

    }


    // ============================================
    // ORDENAR MOVIMENTAÇÕES POR DATA
    // ============================================

    const movimentacoesOrdenadas =
        [...lista].sort(
            function (a, b) {

                return a.data.localeCompare(
                    b.data
                );

            }
        );


    // ============================================
    // DADOS DO GRÁFICO
    // ============================================

    const labels = [];

    const valoresReceitas = [];

    const valoresDespesas = [];

    const valoresSaldo = [];


    // ============================================
    // MODO 1 — MÊS SELECIONADO
    // ============================================

    if (
        mesSelecionado !== "todos"
    ) {

        const dadosPorDia = {};


        // ----------------------------------------
        // AGRUPAR MOVIMENTAÇÕES POR DIA
        // ----------------------------------------

        movimentacoesOrdenadas.forEach(
            function (movimentacao) {

                const data =
                    movimentacao.data;


                if (
                    !dadosPorDia[data]
                ) {

                    dadosPorDia[data] = {

                        receitas: 0,

                        despesas: 0

                    };

                }


                if (
                    movimentacao.tipo ===
                    "receita"
                ) {

                    dadosPorDia[data].receitas +=
                        Number(
                            movimentacao.valor
                        );

                }


                if (
                    movimentacao.tipo ===
                    "despesa"
                ) {

                    dadosPorDia[data].despesas +=
                        Number(
                            movimentacao.valor
                        );

                }

            }
        );


        // ----------------------------------------
        // PRIMEIRA E ÚLTIMA DATA
        // ----------------------------------------

        const datas =
            Object.keys(
                dadosPorDia
            ).sort();


        const primeiraData =
            datas[0];


        const ultimaData =
            datas[datas.length - 1];


        const diaInicial =
            Number(
                primeiraData.substring(8, 10)
            );


        const diaFinal =
            Number(
                ultimaData.substring(8, 10)
            );


        const ano =
            mesSelecionado.substring(0, 4);


        const mes =
            mesSelecionado.substring(5, 7);


        // ----------------------------------------
        // ACUMULADORES
        // ----------------------------------------

        let receitasAcumuladas = 0;

        let despesasAcumuladas = 0;


        // ----------------------------------------
        // CRIAR CADA DIA
        // ----------------------------------------

        for (
            let dia = diaInicial;
            dia <= diaFinal;
            dia++
        ) {

            const chave =
                `${ano}-${mes}-${String(dia).padStart(2, "0")}`;


            const dadosDia =
                dadosPorDia[chave] || {

                    receitas: 0,

                    despesas: 0

                };


            receitasAcumuladas +=
                dadosDia.receitas;


            despesasAcumuladas +=
                dadosDia.despesas;


            const saldoAcumulado =
                receitasAcumuladas -
                despesasAcumuladas;


            // ------------------------------------
            // LABEL
            // ------------------------------------

            labels.push(
                `${String(dia).padStart(2, "0")}/${mes}`
            );


            valoresReceitas.push(
                receitasAcumuladas
            );


            valoresDespesas.push(
                despesasAcumuladas
            );


            valoresSaldo.push(
                saldoAcumulado
            );

        }

    }


    // ============================================
    // MODO 2 — TODOS OS MESES
    // ============================================

    else {

        const dadosPorMes = {};


        // ----------------------------------------
        // AGRUPAR POR MÊS
        // ----------------------------------------

        movimentacoesOrdenadas.forEach(
            function (movimentacao) {

                if (!movimentacao.data) {

                    return;

                }


                const mes =
                    movimentacao.data.substring(
                        0,
                        7
                    );


                if (
                    !dadosPorMes[mes]
                ) {

                    dadosPorMes[mes] = {

                        receitas: 0,

                        despesas: 0

                    };

                }


                if (
                    movimentacao.tipo ===
                    "receita"
                ) {

                    dadosPorMes[mes].receitas +=
                        Number(
                            movimentacao.valor
                        );

                }


                if (
                    movimentacao.tipo ===
                    "despesa"
                ) {

                    dadosPorMes[mes].despesas +=
                        Number(
                            movimentacao.valor
                        );

                }

            }
        );


        const meses =
            Object.keys(
                dadosPorMes
            ).sort();


        let receitasAcumuladas = 0;

        let despesasAcumuladas = 0;


        // ----------------------------------------
        // CRIAR CADA MÊS
        // ----------------------------------------

        meses.forEach(
            function (mes) {

                receitasAcumuladas +=
                    dadosPorMes[mes].receitas;


                despesasAcumuladas +=
                    dadosPorMes[mes].despesas;


                const saldoAcumulado =
                    receitasAcumuladas -
                    despesasAcumuladas;


                const partes =
                    mes.split("-");


                const ano =
                    partes[0];


                const numeroMes =
                    Number(
                        partes[1]
                    );


                const data =
                    new Date(
                        Number(ano),
                        numeroMes - 1,
                        1
                    );


                const nomeMes =
                    data.toLocaleDateString(
                        "pt-BR",
                        {
                            month: "short"
                        }
                    );


                labels.push(
                    `${nomeMes}/${ano.substring(2)}`
                );


                valoresReceitas.push(
                    receitasAcumuladas
                );


                valoresDespesas.push(
                    despesasAcumuladas
                );


                valoresSaldo.push(
                    saldoAcumulado
                );

            }
        );

    }


    // ============================================
    // DESTRUIR GRÁFICO ANTERIOR
    // ============================================

    if (
        graficoEvolucao !== null
    ) {

        graficoEvolucao.destroy();

        graficoEvolucao = null;

    }


    // ============================================
    // CRIAR GRÁFICO
    // ============================================

    const canvas =
        document.getElementById(
            "grafico-evolucao"
        );


    const contexto =
        canvas.getContext("2d");


    graficoEvolucao =
        new Chart(
            contexto,
            {

                type: "line",


                data: {

                    labels: labels,


                    datasets: [

                        // ------------------------
                        // RECEITAS
                        // ------------------------

                        {

                            label: "Receitas",

                            data:
                                valoresReceitas,

                            borderColor:
                                "#008f20",

                            backgroundColor:
                                "#008f20",

                            borderWidth: 2,

                            pointRadius: 4,

                            pointHoverRadius: 7,

                            tension: 0,

                            fill: false

                        },


                        // ------------------------
                        // DESPESAS
                        // ------------------------

                        {

                            label: "Despesas",

                            data:
                                valoresDespesas,

                            borderColor:
                                "#ff0000",

                            backgroundColor:
                                "#ff0000",

                            borderWidth: 2,

                            pointRadius: 4,

                            pointHoverRadius: 7,

                            tension: 0,

                            fill: false

                        },


                        // ------------------------
                        // SALDO
                        // ------------------------

                        {

                            label: "Saldo",

                            data:
                                valoresSaldo,

                            borderColor:
                                "#005eff",

                            backgroundColor:
                                "#005eff",

                            borderWidth: 2,

                            pointRadius: 4,

                            pointHoverRadius: 7,

                            tension: 0,

                            fill: false

                        }

                    ]

                },


                // =================================
                // CONFIGURAÇÕES
                // =================================

                options: {

                    responsive: true,

                    maintainAspectRatio: false,


                    interaction: {

                        mode: "index",

                        intersect: false

                    },


                    plugins: {

                        legend: {

                            position: "bottom",

                            labels: {

                                usePointStyle: true,

                                pointStyle: "circle",

                                padding: 18

                            }

                        },


                        tooltip: {

                            mode: "index",

                            intersect: false,

                            padding: 12,


                            callbacks: {

                                title:
                                    function (items) {

                                        if (
                                            !items.length
                                        ) {

                                            return "";

                                        }


                                        return (
                                            "Data: " +
                                            items[0].label
                                        );

                                    },


                                label:
                                    function (context) {

                                        return (
                                            " " +
                                            context.dataset.label +
                                            ": " +
                                            context.parsed.y.toLocaleString(
                                                "pt-BR",
                                                {
                                                    style:
                                                        "currency",

                                                    currency:
                                                        "BRL"
                                                }
                                            )
                                        );

                                    }

                            }

                        }

                    },


                    scales: {

                        x: {

                            grid: {

                                display: false

                            },


                            ticks: {

                                autoSkip: true,

                                maxTicksLimit: 8,

                                maxRotation: 0,

                                minRotation: 0

                            }

                        },


                        y: {

                            beginAtZero: false,

                            grace: "10%",


                            ticks: {

                                callback:
                                    function (value) {

                                        return value.toLocaleString(
                                            "pt-BR",
                                            {
                                                style:
                                                    "currency",

                                                currency:
                                                    "BRL",

                                                maximumFractionDigits:
                                                    0
                                            }
                                        );

                                    }

                            }

                        }

                    }

                }

            }
        );

}
/* ========================================================= */
/* ATUALIZAR INDICADORES DO DASHBOARD                        */
/* ========================================================= */

function atualizarIndicadoresDashboard() {

    const lista =
        obterMovimentacoesFiltradas();


    /* ================================= */
    /* TOTAL DE MOVIMENTAÇÕES             */
    /* ================================= */

    document.getElementById(
        "dashboard-total-movimentacoes"
    ).textContent =
        lista.length;


    document.getElementById(
        "dashboard-total-movimentacoes-descricao"
    ).textContent =
        lista.length === 1
            ? "movimentação encontrada"
            : "movimentações encontradas";


    /* ================================= */
    /* DESPESAS                           */
    /* ================================= */

    const despesas =
        lista.filter(
            function (movimentacao) {

                return (
                    movimentacao.tipo ===
                    "despesa"
                );

            }
        );


    /* ================================= */
    /* MAIOR DESPESA                      */
    /* ================================= */

    let maiorDespesa = null;


    despesas.forEach(
        function (movimentacao) {

            if (
                maiorDespesa === null ||
                Number(movimentacao.valor) >
                Number(maiorDespesa.valor)
            ) {

                maiorDespesa =
                    movimentacao;

            }

        }
    );


    if (maiorDespesa) {

        document.getElementById(
            "dashboard-maior-despesa"
        ).textContent =
            formatadorMoeda.format(
                Number(
                    maiorDespesa.valor
                )
            );


        document.getElementById(
            "dashboard-maior-despesa-nome"
        ).textContent =
            maiorDespesa.descricao;

    }

    else {

        document.getElementById(
            "dashboard-maior-despesa"
        ).textContent =
            "R$ 0,00";


        document.getElementById(
            "dashboard-maior-despesa-nome"
        ).textContent =
            "Nenhuma despesa";

    }


    /* ================================= */
    /* CATEGORIAS DE DESPESAS             */
    /* ================================= */

    const categorias = {};


    despesas.forEach(
        function (movimentacao) {

            const categoria =
                movimentacao.categoria;


            if (
                !categorias[categoria]
            ) {

                categorias[categoria] =
                    0;

            }


            categorias[categoria] +=
                Number(
                    movimentacao.valor
                );

        }
    );


    /* ================================= */
    /* MAIOR CATEGORIA                    */
    /* ================================= */

    let maiorCategoria = null;

    let maiorValorCategoria = 0;


    Object.keys(
        categorias
    ).forEach(
        function (categoria) {

            if (
                categorias[categoria] >
                maiorValorCategoria
            ) {

                maiorValorCategoria =
                    categorias[categoria];

                maiorCategoria =
                    categoria;

            }

        }
    );


    if (maiorCategoria) {

        document.getElementById(
            "dashboard-maior-categoria"
        ).textContent =
            formatadorMoeda.format(
                maiorValorCategoria
            );


        document.getElementById(
            "dashboard-maior-categoria-nome"
        ).textContent =
            maiorCategoria;


        /* ----------------------------- */
        /* PERCENTUAL DA CATEGORIA        */
        /* ----------------------------- */

        const totalDespesas =
            despesas.reduce(
                function (total, movimentacao) {

                    return (
                        total +
                        Number(
                            movimentacao.valor
                        )
                    );

                },
                0
            );


        let percentualCategoria = 0;


        if (totalDespesas > 0) {

            percentualCategoria =
                (
                    maiorValorCategoria /
                    totalDespesas
                ) * 100;

        }


        document.getElementById(
            "dashboard-maior-categoria-percentual"
        ).textContent =
            percentualCategoria.toFixed(1) +
            "% das despesas";

    }

    else {

        document.getElementById(
            "dashboard-maior-categoria"
        ).textContent =
            "R$ 0,00";


        document.getElementById(
            "dashboard-maior-categoria-nome"
        ).textContent =
            "Nenhuma categoria";


        document.getElementById(
            "dashboard-maior-categoria-percentual"
        ).textContent =
            "0% das despesas";

    }


    /* ================================= */
    /* RESUMO FINANCEIRO                  */
    /* ================================= */

    const resultado =
        calcularResumo(lista);


    /* ================================= */
    /* COMPROMETIMENTO DA RECEITA         */
    /* ================================= */

    let percentual = 0;


    if (
        resultado.receitas > 0
    ) {

        percentual =
            (
                resultado.despesas /
                resultado.receitas
            ) * 100;

    }


    document.getElementById(
        "dashboard-percentual-despesas"
    ).textContent = percentual.toFixed(1) + "%";


    /* ================================= */
    /* TEXTO DO COMPROMETIMENTO           */
    /* ================================= */

    /* ================================= */
    /* CLASSIFICAÇÃO DO COMPROMETIMENTO  */
    /* ================================= */

    let descricaoComprometimento;

    let classeComprometimento;


    if (resultado.receitas === 0) {

        descricaoComprometimento =
            "Sem receitas no período";

        classeComprometimento =
            "comprometimento-neutro";

    }

    else if (percentual <= 30) {

        descricaoComprometimento =
            "Baixo comprometimento";

        classeComprometimento =
            "comprometimento-baixo";

    }

    else if (percentual <= 60) {

        descricaoComprometimento =
            "Comprometimento moderado";

        classeComprometimento =
            "comprometimento-moderado";

    }

    else if (percentual <= 80) {

        descricaoComprometimento =
            "Alto comprometimento";

        classeComprometimento =
            "comprometimento-alto";

    }

    else {

        descricaoComprometimento =
            "Comprometimento muito alto";

        classeComprometimento =
            "comprometimento-muito-alto";

    }


    /* ================================= */
    /* ATUALIZA TEXTO                     */
    /* ================================= */

    document.getElementById(
        "dashboard-percentual-descricao"
    ).textContent =
        descricaoComprometimento;


    /* ================================= */
    /* ATUALIZA COR DO CARD               */
    /* ================================= */

    const cardComprometimento =
        document.querySelector(
            ".indicador-comprometimento"
        );


    cardComprometimento.classList.remove(
        "comprometimento-neutro",
        "comprometimento-baixo",
        "comprometimento-moderado",
        "comprometimento-alto",
        "comprometimento-muito-alto"
    );


    cardComprometimento.classList.add(
        classeComprometimento
    );

}

/* ========================================================= */
/* ATUALIZAR TELA                                            */
/* ========================================================= */

function atualizarTela() {

    /* ================================= */
    /* RESUMO FINANCEIRO */
    /* ================================= */

    atualizarResumo();


    /* ================================= */
    /* FILTROS */
    /* ================================= */

    atualizarFiltroCategorias();

    atualizarFiltroMes();


    /* ================================= */
    /* LISTA DE MOVIMENTAÇÕES */
    /* ================================= */

    renderizarMovimentacoes();


    /* ================================= */
    /* INDICADORES DO DASHBOARD */
    /* ================================= */

    atualizarIndicadoresDashboard();


    /* ================================= */
    /* GRÁFICOS */
    /* ================================= */

    atualizarGraficoFinanceiro();

    atualizarGraficoCategorias();

    atualizarGraficoEvolucao();

}
/* ========================================================= */
/* EVENTO DO FORMULÁRIO                                      */
/* ========================================================= */

formulario.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        /* --------------------------------- */
        /* CAPTURAR DADOS */
        /* --------------------------------- */

        const descricao =
            document.getElementById(
                "descricao"
            ).value.trim();


        const valor =
            Number(
                document.getElementById(
                    "valor"
                ).value
            );


        const tipo =
            document.getElementById(
                "tipo"
            ).value;


        const categoria =
            document.getElementById(
                "categoria"
            ).value.trim();


        const data =
            document.getElementById(
                "data"
            ).value;


        /* --------------------------------- */
        /* VALIDAÇÕES */
        /* --------------------------------- */

        if (descricao === "") {

            alert(
                "A descrição é obrigatória!"
            );

            return;

        }


        if (
            isNaN(valor) ||
            valor <= 0
        ) {

            alert(
                "O valor deve ser maior que zero!"
            );

            return;

        }


        if (categoria === "") {

            alert(
                "A categoria é obrigatória!"
            );

            return;

        }


        if (data === "") {

            alert(
                "A data é obrigatória!"
            );

            return;

        }


        /* --------------------------------- */
        /* NOVA MOVIMENTAÇÃO */
        /* --------------------------------- */

        const novaMovimentacao = {

            descricao: descricao,

            valor: valor,

            tipo: tipo,

            categoria: categoria,

            data: data

        };


        /* --------------------------------- */
        /* ADICIONAR */
        /* --------------------------------- */

        if (
            indiceEmEdicao === null
        ) {

            movimentacoes.push(
                novaMovimentacao
            );

        }

        /* --------------------------------- */
        /* EDITAR */
        /* --------------------------------- */

        else {

            movimentacoes[
                indiceEmEdicao
            ] =
                novaMovimentacao;


            indiceEmEdicao =
                null;


            botaoFormulario.textContent =
                "Adicionar Movimentação";


            botaoCancelar.style.display =
                "none";

        }


        /* --------------------------------- */
        /* SALVAR */
        /* --------------------------------- */

        salvarMovimentacoes();


        /* --------------------------------- */
        /* ATUALIZAR */
        /* --------------------------------- */

        atualizarTela();


        /* --------------------------------- */
        /* LIMPAR */
        /* --------------------------------- */

        formulario.reset();

        fecharModalFormulario();

    }
);


/* ========================================================= */
/* EVENTO CANCELAR                                           */
/* ========================================================= */

botaoCancelar.addEventListener(
    "click",
    function () {

        cancelarEdicao();

    }
);


/* ========================================================= */
/* FILTRO POR TIPO                                           */
/* ========================================================= */

filtroTipo.addEventListener(
    "change",
    function () {

        filtroCategoria.value =
            "todas";


        atualizarFiltroCategorias();

        atualizarResumo();

        renderizarMovimentacoes();

        atualizarGraficoFinanceiro();

        atualizarGraficoCategorias();

        atualizarGraficoEvolucao();

    }
);

/* ========================================================= */
/* FILTRO POR CATEGORIA                                     */
/* ========================================================= */

filtroCategoria.addEventListener(
    "change",
    function () {

        atualizarResumo();

        renderizarMovimentacoes();

        atualizarGraficoFinanceiro();

        atualizarGraficoCategorias();

        atualizarGraficoEvolucao();

    }
);

/* ========================================================= */
/* FILTRO POR MÊS                                            */
/* ========================================================= */

filtroMes.addEventListener(
    "change",
    function () {

        atualizarResumo();

        renderizarMovimentacoes();

        atualizarGraficoFinanceiro();

        atualizarGraficoCategorias();

        atualizarGraficoEvolucao();

    }
);

/* ========================================================= */
/* BUSCA                                                     */
/* ========================================================= */

buscaMovimentacao.addEventListener(
    "input",
    function () {

        atualizarResumo();

        renderizarMovimentacoes();

        atualizarGraficoFinanceiro();

        atualizarGraficoCategorias();

        atualizarGraficoEvolucao();

    }
);

/* ========================================================= */
/* LIMPAR FILTROS                                            */
/* ========================================================= */

botaoLimparFiltros.addEventListener(
    "click",
    function () {

        buscaMovimentacao.value =
            "";

        filtroTipo.value =
            "todas";

        filtroCategoria.value =
            "todas";

        filtroMes.value =
            "todos";


        atualizarTela();

    }
);


/* ========================================================= */
/* INICIALIZAÇÃO                                             */
/* ========================================================= */

if (
    document.getElementById("data").value === ""
) {

    document.getElementById("data").value =
        obterDataAtual();

}


atualizarTela();