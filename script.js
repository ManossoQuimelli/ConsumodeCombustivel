document.addEventListener('DOMContentLoaded', () => {
    // Referências para os elementos das fases
    const fase1 = document.getElementById('fase1');
    const fase2 = document.getElementById('fase2');
    const fase3 = document.getElementById('fase3');
    const fase4 = document.getElementById('fase4');

    // Referências para os elementos de controle
    const tipoCombustivel = document.getElementById('tipo-combustivel');
    const formGasolina = document.getElementById('form-gasolina');
    const formEtanol = document.getElementById('form-etanol');
    const formFlex = document.getElementById('form-flex');
    const avancarFase1 = document.getElementById('avancar-fase1');
    const avancarFase2 = document.getElementById('avancar-fase2');
    const calcular = document.getElementById('calcular');
    const resultadoTexto = document.getElementById('resultado-texto');
    const ctx = document.getElementById('grafico').getContext('2d');

    // Fase 1: Avançar para a fase 2
    avancarFase1.addEventListener('click', () => {
        const tipo = tipoCombustivel.value;

        if (!tipo) {
            alert('Selecione um tipo de combustível.');
            return;
        }

        fase1.classList.add('hidden');
        fase2.classList.remove('hidden');

        // Mostrar formulários com base na escolha do tipo de combustível
        formGasolina.classList.toggle('hidden', tipo !== 'gasolina' && tipo !== 'flex');
        formEtanol.classList.toggle('hidden', tipo !== 'etanol' && tipo !== 'flex');
        formFlex.classList.toggle('hidden', tipo !== 'flex');
    });

    // Fase 2: Avançar para a fase 3
    avancarFase2.addEventListener('click', () => {
        const tipo = tipoCombustivel.value;
        let valid = true;

        // Validação dos campos de acordo com o tipo de combustível
        if (tipo === 'gasolina') {
            valid = document.getElementById('valor-combustivel-gasolina').value &&
                    document.getElementById('consumo-combustivel-gasolina').value;
        } else if (tipo === 'etanol') {
            valid = document.getElementById('valor-combustivel-etanol').value &&
                    document.getElementById('consumo-combustivel-etanol').value;
        } else if (tipo === 'flex') {
            valid = document.getElementById('valor-combustivel-gasolina').value &&
                    document.getElementById('consumo-combustivel-gasolina').value &&
                    document.getElementById('valor-combustivel-etanol').value &&
                    document.getElementById('consumo-combustivel-etanol').value;
        }

        if (valid) {
            fase2.classList.add('hidden');
            fase3.classList.remove('hidden');
        } else {
            alert('Preencha todas as informações necessárias.');
        }
    });

    // Fase 3: Calcular e mostrar resultados na fase 4
    calcular.addEventListener('click', () => {
        const tipo = tipoCombustivel.value;
        const valorGasolina = parseFloat(document.getElementById('valor-combustivel-gasolina').value) || 0;
        const consumoGasolina = parseFloat(document.getElementById('consumo-combustivel-gasolina').value) || 0;
        const valorEtanol = parseFloat(document.getElementById('valor-combustivel-etanol').value) || 0;
        const consumoEtanol = parseFloat(document.getElementById('consumo-combustivel-etanol').value) || 0;
        const kmDiaria = parseFloat(document.getElementById('km-diaria').value) || 0;
        const dias = parseInt(document.getElementById('dias-uteis').value) || 0;

        const kmTotal = kmDiaria * dias;

        let resultado = '';
        let dados = {
            labels: [],
            datasets: []
        };

        if (tipo === 'flex') {
            const litrosGasolina = kmTotal / consumoGasolina;
            const custoGasolina = litrosGasolina * valorGasolina;
            const litrosEtanol = kmTotal / consumoEtanol;
            const custoEtanol = litrosEtanol * valorEtanol;

            resultado = `Gasolina:\n - Litros: ${litrosGasolina.toFixed(2)}\n - Custo: R$ ${custoGasolina.toFixed(2)}\n\nEtanol:\n - Litros: ${litrosEtanol.toFixed(2)}\n - Custo: R$ ${custoEtanol.toFixed(2)}`;

            dados.labels = ['Gasolina', 'Etanol'];
            dados.datasets.push({
                label: 'Litros Usados',
                data: [litrosGasolina, litrosEtanol],
                backgroundColor: ['blue', 'green']
            });
            dados.datasets.push({
                label: 'Custo',
                data: [custoGasolina, custoEtanol],
                backgroundColor: ['lightblue', 'lightgreen']
            });
        } else if (tipo === 'gasolina') {
            const litrosGasolina = kmTotal / consumoGasolina;
            const custoGasolina = litrosGasolina * valorGasolina;

            resultado = `Gasolina:\n - Litros: ${litrosGasolina.toFixed(2)}\n - Custo: R$ ${custoGasolina.toFixed(2)}`;

            dados.labels = ['Gasolina'];
            dados.datasets.push({
                label: 'Litros Usados',
                data: [litrosGasolina],
                backgroundColor: ['blue']
            });
            dados.datasets.push({
                label: 'Custo',
                data: [custoGasolina],
                backgroundColor: ['lightblue']
            });
        } else if (tipo === 'etanol') {
            const litrosEtanol = kmTotal / consumoEtanol;
            const custoEtanol = litrosEtanol * valorEtanol;

            resultado = `Etanol:\n - Litros: ${litrosEtanol.toFixed(2)}\n - Custo: R$ ${custoEtanol.toFixed(2)}`;

            dados.labels = ['Etanol'];
            dados.datasets.push({
                label: 'Litros Usados',
                data: [litrosEtanol],
                backgroundColor: ['green']
            });
            dados.datasets.push({
                label: 'Custo',
                data: [custoEtanol],
                backgroundColor: ['lightgreen']
            });
        }

        resultadoTexto.textContent = resultado;

        new Chart(ctx, {
            type: 'bar',
            data: dados,
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    tooltip: {
                        callbacks: {
                            label: function(tooltipItem) {
                                return tooltipItem.dataset.label + ': R$ ' + tooltipItem.raw.toFixed(2);
                            }
                        }
                    }
                }
            }
        });

        fase3.classList.add('hidden');
        fase4.classList.remove('hidden');
    });
});
