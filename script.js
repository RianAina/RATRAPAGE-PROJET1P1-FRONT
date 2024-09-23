document.addEventListener('DOMContentLoaded', function() {
    const inputs = document.querySelectorAll('#inputs input, #inputs select');
    const textOutput = document.getElementById('text-output');
    const ctx = document.getElementById('graph').getContext('2d');
    const fluxImpossiblesDiv = document.getElementById('flux-impossibles');
    const historiqueDiv = document.getElementById('historique');
    let chart;
  
    inputs.forEach(input => {
      input.addEventListener('change', updateOutputs);
    });
  
    function updateOutputs() {
      const proprietaire = document.getElementById('proprietaire').value;
      const dateDebut = new Date(document.getElementById('dateDebut').value);
      const dateFin = new Date(document.getElementById('dateFin').value);
      const patrimoine = document.getElementById('patrimoine').checked;
      const tresorerie = document.getElementById('tresorerie').checked;
      const immobilisations = document.getElementById('immobilisations').checked;
      const obligations = document.getElementById('obligations').checked;
  

      let initialValues;
      if (proprietaire === 'cresus') {
        initialValues = {
          patrimoine: 100000,
          tresorerie: 50000,
          immobilisations: 30000,
          obligations: 20000
        };
      } else if (proprietaire === 'ilo') {
        initialValues = {
          patrimoine: 80000,
          tresorerie: 40000,
          immobilisations: 25000,
          obligations: 15000
        };
      }
  

      textOutput.textContent = `Analyse du patrimoine de ${proprietaire.charAt(0).toUpperCase() + proprietaire.slice(1)} du ${dateDebut.toLocaleDateString()} au ${dateFin.toLocaleDateString()}`;
  

      const labels = [];
      const patrimoineData = [];
      const tresorerieData = [];
      const immobilisationsData = [];
      const obligationsData = [];
  
      let currentDate = new Date(dateDebut);
      let fluxImpossiblesHTML = '';
      let historiqueHTML = '';
      const monthsDiff = (dateFin.getFullYear() - dateDebut.getFullYear()) * 12 + (dateFin.getMonth() - dateDebut.getMonth());
  
      if (monthsDiff > 6) {
        fluxImpossiblesHTML = '<p>2024-07-01: Patrimoine: -1000000€ (Impossible)</p>'; // Exemple de flux impossible
      }
  
      while (currentDate <= dateFin) {
        labels.push(currentDate.toLocaleDateString());
        const patrimoineValue = calculateValue(initialValues.patrimoine, currentDate, dateDebut);
        const tresorerieValue = calculateValue(initialValues.tresorerie, currentDate, dateDebut);
        const immobilisationsValue = calculateValue(initialValues.immobilisations, currentDate, dateDebut);
        const obligationsValue = calculateValue(initialValues.obligations, currentDate, dateDebut);
  
        patrimoineData.push(patrimoineValue);
        tresorerieData.push(tresorerieValue);
        immobilisationsData.push(immobilisationsValue);
        obligationsData.push(obligationsValue);
  
        historiqueHTML += `<p>${currentDate.toLocaleDateString()} : 
          Patrimoine: ${patrimoineValue.toFixed(2)}€, 
          Trésorerie: ${tresorerieValue.toFixed(2)}€, 
          Immobilisations: ${immobilisationsValue.toFixed(2)}€, 
          Obligations: ${obligationsValue.toFixed(2)}€</p>`;
  
        currentDate.setDate(currentDate.getDate() + 1);
      }
  
      fluxImpossiblesDiv.innerHTML = fluxImpossiblesHTML;
      historiqueDiv.innerHTML = historiqueHTML;
  

      if (chart) {
        chart.destroy();
      }
      chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Patrimoine',
              data: patrimoine ? patrimoineData : [],
              borderColor: 'rgb(255, 99, 132)',
              hidden: !patrimoine
            },
            {
              label: 'Trésorerie',
              data: tresorerie ? tresorerieData : [],
              borderColor: 'rgb(54, 162, 235)',
              hidden: !tresorerie
            },
            {
              label: 'Immobilisations',
              data: immobilisations ? immobilisationsData : [],
              borderColor: 'rgb(75, 192, 192)',
              hidden: !immobilisations
            },
            {
              label: 'Obligations',
              data: obligations ? obligationsData : [],
              borderColor: 'rgb(255, 206, 86)',
              hidden: !obligations
            }
          ]
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    }
  
    function calculateValue(initialValue, currentDate, startDate) {
      const daysDiff = (currentDate - startDate) / (1000 * 60 * 60 * 24);
      return initialValue * Math.pow(0.9967, daysDiff);
    }
  

    document.getElementById('dateDebut').valueAsDate = new Date();
    document.getElementById('dateFin').valueAsDate = new Date(new Date().setDate(new Date().getDate() + 30));
    updateOutputs();
  });