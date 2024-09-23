document.addEventListener('DOMContentLoaded', function() {
    const inputs = document.querySelectorAll('#inputs input');
    const textOutput = document.getElementById('text-output');
    const ctx = document.getElementById('graph').getContext('2d');
    let chart;
  
    inputs.forEach(input => {
      input.addEventListener('change', updateOutputs);
    });
  
    function updateOutputs() {
      const dateDebut = new Date(document.getElementById('dateDebut').value);
      const dateFin = new Date(document.getElementById('dateFin').value);
      const patrimoine = document.getElementById('patrimoine').checked;
      const tresorerie = document.getElementById('tresorerie').checked;
      const immobilisations = document.getElementById('immobilisations').checked;
      const obligations = document.getElementById('obligations').checked;
  
      // Mise à jour du texte
      textOutput.textContent = `Analyse du patrimoine du ${dateDebut.toLocaleDateString()} au ${dateFin.toLocaleDateString()}`;
  
      // Calcul des données pour le graphique
      const labels = [];
      const patrimoineData = [];
      const tresorerieData = [];
      const immobilisationsData = [];
      const obligationsData = [];
  
      let currentDate = new Date(dateDebut);
      while (currentDate <= dateFin) {
        labels.push(currentDate.toLocaleDateString());
        patrimoineData.push(calculateValue(100000, currentDate, dateDebut));
        tresorerieData.push(calculateValue(50000, currentDate, dateDebut));
        immobilisationsData.push(calculateValue(30000, currentDate, dateDebut));
        obligationsData.push(calculateValue(20000, currentDate, dateDebut));
        currentDate.setMonth(currentDate.getMonth() + 1);
      }
  
      // Mise à jour du graphique
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
      const monthsDiff = (currentDate.getFullYear() - startDate.getFullYear()) * 12 + (currentDate.getMonth() - startDate.getMonth());
      return initialValue * Math.pow(0.9, monthsDiff);
    }
  
    // Initialisation
    document.getElementById('dateDebut').valueAsDate = new Date();
    document.getElementById('dateFin').valueAsDate = new Date(new Date().setFullYear(new Date().getFullYear() + 1));
    updateOutputs();
  });