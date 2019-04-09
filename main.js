window.addEventListener('load', intro);

function intro() {
  // sakrij sadržaj kviza
  document.querySelector('.main-con').classList.add('none');
  document.querySelector('#pokreniKviz').addEventListener('click', kviz);
}

function kviz() {
  document.querySelector('.contnaslov').classList.add('none'); // ukloni uvod
  const container = document.querySelector('#container');
  const tim = document.querySelector('#vreme');
  let pitanja = [];
  let trenutnoPitanje = 0; // brojač-pitanja
  let zbir = 0; // brojač-zbir tačnih odgovora

  fetch('https://opentdb.com/api.php?amount=20&category=11')
    .then(res => res.json())
    .then(data => {
      data.results.forEach(d => {
        pitanja.push([d.question, d.correct_answer, d.incorrect_answers]);
      });
      napraviPitanja();
      document.querySelector('.main-con').classList.remove('none');
      document.querySelector('.main-con').classList.add('flex');
      function napraviPitanja() {
        // zaustavi kada završi niz pitanja, rezultat, reset brojača:
        if (trenutnoPitanje >= pitanja.length) {
          kraj();
          clearInterval(sInt);
          trenutnoPitanje = 0;
          zbir = 0;
          pitanja = [] // praznim niz za novi fetch data
          return false; // zaustavljam funkciju
        }
        // Pitanja, opcije, random sort opcija, prikaz
        document.querySelector('#naslov').innerHTML = `${trenutnoPitanje +
          1} / ${pitanja.length}`;
        const pitanje = pitanja[trenutnoPitanje][0];
        const sveOpcije = [];
        sveOpcije.push(pitanja[trenutnoPitanje][2][0],
          pitanja[trenutnoPitanje][2][1],
          pitanja[trenutnoPitanje][2][2],
          pitanja[trenutnoPitanje][1]);
        sveOpcije.sort(() => Math.random() - 0.5);
        container.innerHTML = ''; // prazan container za naredni krug
        let listaPit = '';
        sveOpcije.forEach(op => {
          if (op !== undefined && op == pitanja[trenutnoPitanje][1]) {
            listaPit += `<label><input type = 'radio' name = 'opcije' id = 't'
            value = '${op}'><div>${op}</div></label>`;
          } else if (op !== undefined) {
            listaPit += `<label><input type = 'radio' name = 'opcije'
            value = '${op}'><div>${op}</div></label>`;
          }
        })
        container.innerHTML += `<div class = 'pitanje borderR'>${pitanje}<div>`;
        container.innerHTML += listaPit;
        container.innerHTML += `<button>Next question</button>`;
        document.querySelector('button').
          addEventListener('click', proveriOdgovor);
      }
      const odbrojOd = new Date().getTime() + 601000;
      // setovanje vremena za kviz.
      const sInt = setInterval(function () {
        const sada = new Date().getTime();
        const razlika = odbrojOd - sada; 
        // Račun za minute and sekunde
        let minuti = Math.floor((razlika % (1000 * 60 * 60)) / (1000 * 60));
        let sekunde = Math.floor((razlika % (1000 * 60)) / 1000);
        sekunde < 10 ? sekunde = `0${sekunde}` : sekunde
        minuti < 10 ? minuti = `0${minuti}` : minuti
        if (razlika >= 0) {
            tim.innerHTML = `${minuti} : ${sekunde}`
        }
        else {
            clearInterval(sInt);
            kraj()
            tim.innerHTML = "Time's up!";
        }
    }, 1000, napraviPitanja);

      function proveriOdgovor() {
        const opcije = document.querySelectorAll('input[name="opcije"]');
        opcije.forEach(function (op) {
          let att = op.getAttribute('id');
          if (att === 't') {
            op.parentNode.classList.add('tacanBorder');
          }
          if (op.checked) {
            if (att === 't') {
              zbir++;
              op.parentNode.classList.add('tacan');
            } else {
              op.parentNode.classList.add('netacan');
            }
          }
        });
        console.log(zbir);
        // Naredno pitanje. setTimeout da se prikaže tačnost odgovora
        trenutnoPitanje++;
        setTimeout(function () {
          napraviPitanja();
        }, 2000);
      }

      function kraj() {
        const procenat = parseFloat((zbir * 100) / pitanja.length).toFixed(2);
        container.innerHTML = `<div class = 'pitanje borderR'>You won ${zbir}
        of ${pitanja.length} points or ${procenat}%</div>`;
        document.querySelector('#naslov').innerHTML = `Quiz is finished`;
      }
    });
}