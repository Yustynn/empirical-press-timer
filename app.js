const $ = document.querySelectorAll.bind(document)
const playBtn = $('#play')[0]
class ResultsTracker {
    constructor() {
       self.results = {}
       for (let n = 0; n < 10; n++) {
            const tracker = {}
            for (let i = 1; i < 4; i++) tracker[i] = []
            self.results[n] = tracker
        }
    }

    addRecord(result, n, i) {
        self.results[n][i].push(result)
    }

    getScore(n, i) {
        const mean = (arr) => arr.reduce(
            (curr, next) => curr + next,
            0
        ) / arr.length

        const tracker = self.results[n][i]
        return mean(tracker)
    }

    getTimes(n) {
        return self.results[n][1].length
    }
}

const state = {
    isPlaying: false,
    n: 0,
    i: 0,
    resultsTracker: new ResultsTracker(),
    lastTime: Date.now()
}

const toggleBtnActive = (btn) => {
    btn.isActive = !btn.isActive
    btn.classList.toggle('btn-secondary')
    btn.classList.toggle('btn-success')
}

const choice = (arr) => arr[Math.floor( Math.random() * arr.length)]

const chooseRandomN = () => {
    const choices = [];
    const times = []
    for (let n = 0; n < 10; n++) {
        choices.push(n)
        times.push(state.resultsTracker.getTimes(n))
    }
    const [max, min] = [Math.max(...times), Math.min(...times)]
    console.log(max, min)

    // if all elements equally pressed, choose any
    if (max === min) return choice(choices)
    const filtered = choices.filter(
        (n, idx) => times[idx] !== max
    )
    console.log(filtered)
    return choice(filtered)

}
const getBtn = (n) => $(`#btn-${n}`)[0]
const getRandomBtn = () => getBtn( chooseRandomN() )

const updateTable = (result, n, i) => {
    $(`#cell-${n}-${i}`)[0].innerText = Math.round(result, 5)
}

playBtn.onclick = () => {
    state.isPlaying = !state.isPlaying;
    if (state.isPlaying) {
        state.lastTime = Date.now();
        startRound()
    }

    playBtn.innerText = state.isPlaying ? 'Stop' : 'Start';
}

const createResultsRow = (n) => {
   const row = document.createElement('TR');

   let innerHtml = `<td>${n}</td>`
   for (let i of [1,2,3]) {
      innerHtml += `<td id="cell-${n}-${i}">0</td>`;
   }
   innerHtml += `<td id="cell-${n}-times">0</td>`;
   row.innerHTML = innerHtml;

   return row;
}

const initResultsTable = () => {
    const resultsTable = $('#results')[0]

    for (let n = 0; n < 10; n++) {
        resultsTable.appendChild(createResultsRow(n))
    }
}

const initButtons = () => {
    const keypadContainer = $('#keypad')[0]

    let innerHtml = '<div class="row">';
    for (let n = 1; n < 10; n++) {
        innerHtml += `<button type="button" id="btn-${n}" class="btn btn-secondary keypad">${n}</button>`
        if (!(n % 3)) {
            innerHtml += '</div><div class="row">'
        }
    }
    innerHtml += `<button type="button" class="btn btn-secondary keypad"></button>`
    innerHtml += `<button type="button" id="btn-0" class="btn btn-secondary keypad">0</button>`
    innerHtml += `<button type="button" class="btn btn-secondary keypad"></button>`
    innerHtml += '</div>'

    keypadContainer.innerHTML = innerHtml

    for (let n = 0; n < 10; n++) {
        const btn = getBtn(n)
        btn.isActive = false

        btn.onclick = () => {
            if (!btn.isActive) return;

            state.i++;

            const record = Date.now() - state.lastTime;
            state.resultsTracker.addRecord(record, state.n, state.i)

            updateTable(
                    state.resultsTracker.getScore(state.n, state.i),
                    state.n,
                    state.i
            )

            if (state.i === 3) {
                toggleBtnActive(btn)
                updateTable(
                    state.resultsTracker.getTimes(state.n),
                    state.n,
                    'times'
                )

                if (state.isPlaying) {
                    console.log('hi')
                    setTimeout(startRound, 500)
                }
            }
        }
    }
}

initResultsTable()
initButtons()

function startRound() {
    state.lastTime = Date.now()
    state.n = chooseRandomN()
    state.i = 0
    toggleBtnActive(getBtn(state.n))
}
