import "./style.css"

const CHIAVE = "todo-tasks"

function caricaStato() {
  const testo = localStorage.getItem(CHIAVE)
  if (testo === null) return [
    { id: 1, title: "Studiare per la verifica", completed: false },
    { id: 2, title: "Comprare il pane", completed: true },
    { id: 3, title: "Finire il progetto TPSIT", completed: false }
  ]
  try {
    const dati = JSON.parse(testo)
    return Array.isArray(dati) ? dati : []
  } catch (errore) {
    return []
  }
}

let tasks = caricaStato()

function salvaStato() {
  localStorage.setItem(CHIAVE, JSON.stringify(tasks))
}

const lista = document.querySelector("#lista")
const info  = document.querySelector("#info")
const form  = document.querySelector("#form-task")
const campo = document.querySelector("#campo-task")

function render() {
  lista.innerHTML = tasks
    .map(t => `
      <li class="${t.completed ? "fatto" : ""}" data-id="${t.id}">
        <span class="titolo">${t.title}</span>
        <button class="elimina" data-id="${t.id}">×</button>
      </li>
    `)
    .join("")

  const completati = tasks.filter(t => t.completed).length
  const daFare = tasks.filter(t => !t.completed).length

  info.textContent = `Totali: ${tasks.length} · Completati: ${completati} · Da fare: ${daFare}`
}

function addTask(title) {
  const pulito = title.trim()
  if (pulito === "") return

  const nuovoTask = {
    id: Date.now(),
    title: pulito,
    completed: false
  }

  tasks = [...tasks, nuovoTask]
  salvaStato()
  render()
}

function toggleTask(id) {
  tasks = tasks.map(t =>
    t.id === id ? { ...t, completed: !t.completed } : t
  )
  salvaStato()
  render()
}

function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id)
  salvaStato()
  render()
}

form.addEventListener("submit", (evento) => {
  evento.preventDefault()
  addTask(campo.value)
  campo.value = ""
  campo.focus()
})

lista.addEventListener("click", (evento) => {
  const elemento = evento.target

  if (elemento.classList.contains("elimina")) {
    deleteTask(Number(elemento.dataset.id))
    return
  }

  const riga = elemento.closest("li")
  if (riga) {
    toggleTask(Number(riga.dataset.id))
  }
})

render()