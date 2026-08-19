const API_URL = "/api/expenses";

const state = {
  expenses: [],
  chart: null,
  query: "",
};

const categoryTheme = {
  Comida: { color: "#ff7657", icon: "fork" },
  Transporte: { color: "#b9a2ff", icon: "car" },
  Moradia: { color: "#a8e6c1", icon: "home" },
  Lazer: { color: "#f1e26b", icon: "spark" },
  Saúde: { color: "#79c9e8", icon: "heart" },
  Educação: { color: "#ffa6c8", icon: "book" },
  Outros: { color: "#b7bac2", icon: "dots" },
};

const elements = {
  dialog: document.querySelector("#expenseDialog"),
  form: document.querySelector("#expenseForm"),
  openModal: document.querySelector("#openExpenseModal"),
  closeModal: document.querySelector("#closeExpenseModal"),
  cancelModal: document.querySelector("#cancelExpense"),
  submit: document.querySelector("#submitExpense"),
  amount: document.querySelector("#amount"),
  category: document.querySelector("#category"),
  date: document.querySelector("#date"),
  description: document.querySelector("#description"),
  total: document.querySelector("#totalValue"),
  count: document.querySelector("#transactionCount"),
  average: document.querySelector("#averageValue"),
  averageBar: document.querySelector("#averageBar"),
  topCategory: document.querySelector("#topCategory"),
  topCategoryText: document.querySelector("#topCategoryText"),
  topCategoryShare: document.querySelector("#topCategoryShare"),
  categoryCount: document.querySelector("#chartCategoryCount"),
  legend: document.querySelector("#chartLegend"),
  expenseList: document.querySelector("#expenseList"),
  search: document.querySelector("#searchInput"),
  toast: document.querySelector("#toast"),
  toastMessage: document.querySelector("#toastMessage"),
  today: document.querySelector("#todayLabel"),
};

const money = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  minimumFractionDigits: 2,
});

const shortMoney = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 0,
});

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "short",
});

function localISODate(date = new Date()) {
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 10);
}

function safeText(value) {
  return String(value ?? "").replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    '"': "&quot;",
  })[character]);
}

function getIcon(name) {
  const icons = {
    fork: '<path d="M7 3v7M4.5 3v4.5A2.5 2.5 0 0 0 7 10v11M10 3v4.5A2.5 2.5 0 0 1 7.5 10M17 21v-7m0 0c2 0 3-1.6 3-4V3c-3 1.2-4 4-4 7v4h1Z" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>',
    car: '<path d="m5 16-1 2m15-2 1 2M5 14h14l-1.3-5.2A2.4 2.4 0 0 0 15.4 7H8.6a2.4 2.4 0 0 0-2.3 1.8L5 14Zm0 0v4h2v-1h10v1h2v-4M8 13h.01M16 13h.01" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>',
    home: '<path d="m4 11 8-7 8 7v9h-6v-6h-4v6H4v-9Z" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>',
    spark: '<path d="m12 3 1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5L12 3Zm6 12 .7 2.3L21 18l-2.3.7L18 21l-.7-2.3L15 18l2.3-.7L18 15Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>',
    heart: '<path d="M20 8.5c0 5-8 10-8 10s-8-5-8-10A4.5 4.5 0 0 1 12 5.7a4.5 4.5 0 0 1 8 2.8Z" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>',
    book: '<path d="M5 4.5h5a2 2 0 0 1 2 2V20a2 2 0 0 0-2-2H5V4.5Zm14 0h-5a2 2 0 0 0-2 2V20a2 2 0 0 1 2-2h5V4.5Z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/>',
    dots: '<circle cx="6" cy="12" r="1.4" fill="currentColor"/><circle cx="12" cy="12" r="1.4" fill="currentColor"/><circle cx="18" cy="12" r="1.4" fill="currentColor"/>',
  };
  return `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true">${icons[name] || icons.dots}</svg>`;
}

async function request(url, options = {}) {
  const response = await fetch(url, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });

  let payload;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    throw new Error(payload?.error || "Não foi possível concluir a operação.");
  }
  return payload;
}

async function loadExpenses() {
  try {
    const payload = await request(API_URL);
    state.expenses = Array.isArray(payload) ? payload : payload.expenses || [];
    renderDashboard();
  } catch (error) {
    elements.expenseList.innerHTML = `<div class="empty-state"><div><strong>API indisponível</strong><span>${safeText(error.message)}</span></div></div>`;
    showToast("Não foi possível carregar os gastos.", true);
    renderSummary();
    renderChart();
  }
}

function getCategoryTotals() {
  return state.expenses.reduce((totals, expense) => {
    totals[expense.category] = (totals[expense.category] || 0) + Number(expense.amount);
    return totals;
  }, {});
}

function renderDashboard() {
  renderSummary();
  renderChart();
  renderExpenses();
}

function renderSummary() {
  const total = state.expenses.reduce((sum, expense) => sum + Number(expense.amount), 0);
  const average = state.expenses.length ? total / state.expenses.length : 0;
  const categoryTotals = getCategoryTotals();
  const sortedCategories = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);
  const [topName, topValue] = sortedCategories[0] || ["Sem dados", 0];
  const share = total ? Math.round((topValue / total) * 100) : 0;

  elements.total.textContent = money.format(total);
  elements.count.textContent = state.expenses.length;
  elements.average.textContent = shortMoney.format(average);
  elements.averageBar.style.width = `${Math.min(100, Math.max(0, share || 0))}%`;
  elements.topCategory.textContent = topName;
  elements.topCategoryShare.textContent = `${share}%`;
  elements.topCategoryText.textContent = topValue
    ? `${money.format(topValue)} — ${share}% de todos os gastos registrados.`
    : "Adicione um gasto para começar sua análise.";
}

function renderChart() {
  const categoryTotals = getCategoryTotals();
  const entries = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);
  const labels = entries.map(([label]) => label);
  const data = entries.map(([, value]) => value);
  const colors = labels.map((label) => (categoryTheme[label] || categoryTheme.Outros).color);
  elements.categoryCount.textContent = labels.length;

  elements.legend.innerHTML = entries.length
    ? entries.slice(0, 6).map(([label], index) => `<span class="legend-item"><span class="legend-dot" style="background:${colors[index]}"></span>${safeText(label)}</span>`).join("")
    : '<p class="empty-chart">Aguardando seus primeiros gastos</p>';

  if (state.chart) state.chart.destroy();
  const canvas = document.querySelector("#categoryChart");
  if (!window.Chart) return;

  state.chart = new Chart(canvas, {
    type: "doughnut",
    data: {
      labels: labels.length ? labels : ["Sem gastos"],
      datasets: [{
        data: data.length ? data : [1],
        backgroundColor: colors.length ? colors : ["rgba(25,25,27,.13)"],
        borderWidth: 0,
        spacing: data.length ? 3 : 0,
        hoverOffset: 7,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      cutout: "70%",
      animation: { duration: 700 },
      plugins: {
        legend: { display: false },
        tooltip: {
          enabled: Boolean(data.length),
          backgroundColor: "#19191b",
          titleFont: { family: "Inter", size: 11 },
          bodyFont: { family: "Inter", size: 11, weight: "600" },
          padding: 11,
          cornerRadius: 12,
          callbacks: { label: (context) => ` ${money.format(context.raw)}` },
        },
      },
    },
  });
}

function renderExpenses() {
  const query = state.query.trim().toLocaleLowerCase("pt-BR");
  const filtered = state.expenses.filter((expense) =>
    [expense.description, expense.category, expense.date].some((field) => String(field).toLocaleLowerCase("pt-BR").includes(query))
  );

  if (!filtered.length) {
    elements.expenseList.innerHTML = `
      <div class="empty-state">
        <div>
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 8h14M7 4h10l2 4v12H5V8l2-4Zm3 8h4" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>
          <strong>${query ? "Nenhum resultado" : "Tudo limpo por aqui"}</strong>
          <span>${query ? "Tente buscar por outro termo." : "Adicione seu primeiro gasto para iniciar."}</span>
        </div>
      </div>`;
    return;
  }

  elements.expenseList.innerHTML = filtered.map((expense, index) => {
    const theme = categoryTheme[expense.category] || categoryTheme.Outros;
    const parsedDate = new Date(`${expense.date}T12:00:00`);
    return `
      <div class="expense-row" style="animation-delay:${Math.min(index * 35, 210)}ms">
        <span class="expense-icon" style="--category-color:${theme.color}">${getIcon(theme.icon)}</span>
        <div class="expense-detail">
          <strong title="${safeText(expense.description)}">${safeText(expense.description)}</strong>
          <div class="expense-meta"><span>${safeText(expense.category)}</span><span>${dateFormatter.format(parsedDate).replace(".", "")}</span></div>
        </div>
        <div class="expense-value">
          <strong>− ${money.format(expense.amount)}</strong>
          <button class="delete-expense" type="button" data-id="${safeText(expense.id)}" aria-label="Excluir ${safeText(expense.description)}">Excluir</button>
        </div>
      </div>`;
  }).join("");
}

function openDialog() {
  clearErrors();
  elements.form.reset();
  elements.date.value = localISODate();
  elements.dialog.showModal();
  window.setTimeout(() => elements.amount.focus(), 80);
}

function closeDialog() {
  elements.dialog.close();
  clearErrors();
}

function clearErrors() {
  document.querySelectorAll(".field-error").forEach((field) => { field.textContent = ""; });
  document.querySelectorAll(".input-shell.invalid").forEach((field) => field.classList.remove("invalid"));
}

function showFieldError(field, message) {
  const target = document.querySelector(`[data-error-for="${field.id}"]`);
  if (target) target.textContent = message;
  field.closest(".field")?.querySelector(".input-shell")?.classList.add("invalid");
}

function validateForm() {
  clearErrors();
  let valid = true;
  if (!elements.amount.value || Number(elements.amount.value) <= 0) {
    showFieldError(elements.amount, "Informe um valor maior que zero.");
    valid = false;
  }
  if (!elements.category.value) {
    showFieldError(elements.category, "Selecione uma categoria.");
    valid = false;
  }
  if (!elements.date.value) {
    showFieldError(elements.date, "Informe a data do gasto.");
    valid = false;
  }
  if (!elements.description.value.trim()) {
    showFieldError(elements.description, "Descreva brevemente este gasto.");
    valid = false;
  }
  return valid;
}

async function addExpense(event) {
  event.preventDefault();
  if (!validateForm()) return;

  const payload = {
    amount: Number(elements.amount.value),
    category: elements.category.value,
    date: elements.date.value,
    description: elements.description.value.trim(),
  };

  elements.submit.disabled = true;
  elements.submit.querySelector("span").textContent = "Salvando...";
  try {
    const created = await request(API_URL, { method: "POST", body: JSON.stringify(payload) });
    state.expenses = [created, ...state.expenses];
    renderDashboard();
    closeDialog();
    showToast("Gasto adicionado com sucesso.");
  } catch (error) {
    showToast(error.message, true);
  } finally {
    elements.submit.disabled = false;
    elements.submit.querySelector("span").textContent = "Salvar gasto";
  }
}

async function deleteExpense(id, button) {
  button.disabled = true;
  button.textContent = "...";
  try {
    await request(`${API_URL}/${encodeURIComponent(id)}`, { method: "DELETE" });
    state.expenses = state.expenses.filter((expense) => String(expense.id) !== String(id));
    renderDashboard();
    showToast("Gasto removido.");
  } catch (error) {
    button.disabled = false;
    button.textContent = "Excluir";
    showToast(error.message, true);
  }
}

let toastTimer;
function showToast(message, isError = false) {
  window.clearTimeout(toastTimer);
  elements.toastMessage.textContent = message;
  elements.toast.classList.toggle("error", isError);
  elements.toast.querySelector(".toast-icon").textContent = isError ? "!" : "✓";
  elements.toast.classList.add("show");
  toastTimer = window.setTimeout(() => elements.toast.classList.remove("show"), 3200);
}

elements.openModal.addEventListener("click", openDialog);
elements.closeModal.addEventListener("click", closeDialog);
elements.cancelModal.addEventListener("click", closeDialog);
elements.form.addEventListener("submit", addExpense);
elements.dialog.addEventListener("click", (event) => {
  if (event.target === elements.dialog) closeDialog();
});
elements.search.addEventListener("input", (event) => {
  state.query = event.target.value;
  renderExpenses();
});
elements.expenseList.addEventListener("click", (event) => {
  const button = event.target.closest(".delete-expense");
  if (button) deleteExpense(button.dataset.id, button);
});

elements.today.textContent = new Intl.DateTimeFormat("pt-BR", {
  weekday: "long",
  day: "2-digit",
  month: "long",
}).format(new Date()).replace(/^./, (letter) => letter.toUpperCase());
elements.date.max = localISODate();
loadExpenses();
