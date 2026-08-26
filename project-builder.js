(() => {
  "use strict";

  const STORAGE_KEY = "cimacove_digital_project_v2";
  const LEGACY_KEY = "cimacove_digital_project_v1";
  const SCHEMA_VERSION = 2;
  const PROJECT_TYPES = [
    ["landing_page", "Landing page"], ["website", "Página web"],
    ["online_store", "Tienda online"], ["automation", "Automatización"],
    ["digital_system", "Sistema digital"], ["ai_assistant", "Asistente con IA"],
    ["custom_jarvis", "JARVIS personalizado"], ["integrations", "Integraciones"],
    ["other", "Otro"], ["guidance", "No estoy seguro / Necesito orientación"],
  ];
  const TYPE_LABELS = Object.fromEntries(PROJECT_TYPES);
  const BUDGET_LABELS = { under_500: "Menos de $500", "500_1000": "$500–$1,000", "1000_2500": "$1,000–$2,500", "2500_5000": "$2,500–$5,000", "5000_10000": "$5,000–$10,000", "10000_plus": "$10,000+", unsure: "No estoy seguro" };
  const TIMELINE_LABELS = { urgent: "Urgente", "2_4_weeks": "2–4 semanas", "1_2_months": "1–2 meses", "3_plus_months": "3+ meses", flexible: "Flexible" };
  const ALLOWED_TYPES = new Set(PROJECT_TYPES.map(([value]) => value));
  const form = document.querySelector("#builder");
  if (!form) return;

  const steps = [...document.querySelectorAll(".step")];
  const error = document.querySelector("#error");
  const backButton = document.querySelector("#back");
  const nextButton = document.querySelector("#next");
  const submitButton = document.querySelector("#submit");
  const stepStatus = document.querySelector("#stepStatus");
  const typesContainer = document.querySelector("#projectTypes");
  let submitted = false;

  function freshState() {
    return { schemaVersion: SCHEMA_VERSION, currentStep: 1, idempotencyKey: `dig_${crypto.randomUUID()}`, projectTypes: [], scopeAnswers: {} };
  }

  function readState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        if (localStorage.getItem(LEGACY_KEY)) localStorage.removeItem(LEGACY_KEY);
        return freshState();
      }
      const saved = JSON.parse(raw);
      if (!saved || saved.schemaVersion !== SCHEMA_VERSION || typeof saved !== "object") throw new Error("incompatible draft");
      const currentStep = Number.isInteger(saved.currentStep) && saved.currentStep >= 1 && saved.currentStep <= 6 ? saved.currentStep : 1;
      return {
        ...saved,
        schemaVersion: SCHEMA_VERSION,
        currentStep,
        idempotencyKey: typeof saved.idempotencyKey === "string" && saved.idempotencyKey ? saved.idempotencyKey : `dig_${crypto.randomUUID()}`,
        projectTypes: Array.isArray(saved.projectTypes) ? saved.projectTypes.filter((x) => ALLOWED_TYPES.has(x)).slice(0, 5) : [],
        scopeAnswers: saved.scopeAnswers && typeof saved.scopeAnswers === "object" && !Array.isArray(saved.scopeAnswers) ? saved.scopeAnswers : {},
      };
    } catch {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(LEGACY_KEY);
      return freshState();
    }
  }

  let state = readState();
  let step = state.currentStep;
  const save = () => {
    state.currentStep = step;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch { /* The funnel remains usable when storage is unavailable. */ }
  };
  const track = (name, meta = {}) => {
    window.dispatchEvent(new CustomEvent("cimacove:analytics", { detail: { name, ...meta } }));
    if (window.cloudflareWebAnalytics?.track) window.cloudflareWebAnalytics.track(name, meta);
  };
  const selected = () => [...typesContainer.querySelectorAll("input:checked")].map((input) => input.value);

  typesContainer.innerHTML = PROJECT_TYPES.map(([value, label]) => `<div class="choice"><input type="checkbox" id="t_${value}" value="${value}" ${state.projectTypes.includes(value) ? "checked" : ""}><label for="t_${value}">${label}</label></div>`).join("");
  typesContainer.addEventListener("change", (event) => {
    if (selected().length > 5) event.target.checked = false;
    state.projectTypes = selected();
    track("project_type_selected", { projectType: event.target.value, selected: event.target.checked });
    save();
  });

  const safeFields = ["customerName", "companyName", "customerEmail", "customerPhone", "cityCountry", "businessDescription", "existingWebsite", "problem", "desiredOutcome", "budgetRange", "timeline", "references"];
  for (const name of safeFields) {
    const field = form.elements[name];
    if (field && typeof state[name] === "string") field.value = state[name];
    field?.addEventListener("input", () => { state[name] = field.value; save(); });
  }

  function addScopeField(container, id, label, placeholder) {
    const wrap = document.createElement("div");
    wrap.className = "field-wrap";
    const fieldLabel = document.createElement("label");
    fieldLabel.className = "field";
    fieldLabel.htmlFor = id;
    fieldLabel.textContent = label;
    const textarea = document.createElement("textarea");
    textarea.id = id;
    textarea.maxLength = 3000;
    textarea.placeholder = placeholder;
    textarea.value = typeof state.scopeAnswers[id] === "string" ? state.scopeAnswers[id] : "";
    textarea.addEventListener("input", () => { state.scopeAnswers[id] = textarea.value; save(); });
    wrap.append(fieldLabel, textarea);
    container.append(wrap);
  }

  function renderDynamic() {
    const container = document.querySelector("#dynamic");
    container.replaceChildren();
    if (state.projectTypes.some((x) => ["landing_page", "website", "online_store"].includes(x))) addScopeField(container, "website_scope", "Web / landing", "Páginas, idiomas, formularios, reservas, pagos, ecommerce, branding y contenido.");
    if (state.projectTypes.includes("automation")) addScopeField(container, "automation_scope", "Automatización", "Proceso manual, aplicaciones, disparador, resultado y frecuencia aproximada.");
    if (state.projectTypes.some((x) => ["ai_assistant", "custom_jarvis", "digital_system", "integrations"].includes(x))) addScopeField(container, "system_scope", "IA / JARVIS / sistema", "CRM, email, WhatsApp, calendario, cotizaciones, pagos, tareas, documentos, dashboard, alertas, aprobaciones, analytics, voz e integraciones.");
    if (!container.children.length) addScopeField(container, "general_scope", "Detalles de alcance", "Describe cualquier detalle que ayude a dimensionar el proyecto.");
  }

  function reviewRow(label, value) {
    const row = document.createElement("div");
    row.className = "review-row";
    const title = document.createElement("strong");
    title.textContent = label;
    const content = document.createElement("span");
    content.textContent = value || "—";
    row.append(title, content);
    return row;
  }

  function renderReview() {
    const review = document.querySelector("#review");
    const scope = Object.values(state.scopeAnswers).filter((value) => typeof value === "string" && value.trim()).join(" · ");
    review.replaceChildren(
      reviewRow("Proyecto", state.projectTypes.map((value) => TYPE_LABELS[value]).filter(Boolean).join(", ")),
      reviewRow("Negocio / contacto", [form.elements.companyName.value, form.elements.customerName.value].filter(Boolean).join(" · ")),
      reviewRow("Problema", form.elements.problem.value),
      reviewRow("Resultado esperado", form.elements.desiredOutcome.value),
      reviewRow("Alcance principal", scope),
      reviewRow("Presupuesto", BUDGET_LABELS[form.elements.budgetRange.value]),
      reviewRow("Plazo", TIMELINE_LABELS[form.elements.timeline.value]),
    );
  }

  function fail(message, field) {
    error.textContent = message;
    error.hidden = false;
    field?.focus();
    error.scrollIntoView({ block: "nearest" });
    return false;
  }

  function validate() {
    error.hidden = true;
    if (step === 1 && !state.projectTypes.length) return fail("Selecciona al menos una opción para continuar.", typesContainer.querySelector("input"));
    if (step === 2 && !form.elements.customerName.value.trim()) return fail("Ingresa tu nombre.", form.elements.customerName);
    if (step === 2 && !form.elements.customerEmail.checkValidity()) return fail("Ingresa tu correo electrónico.", form.elements.customerEmail);
    if (step === 2 && !form.elements.customerPhone.value.trim()) return fail("Ingresa tu teléfono.", form.elements.customerPhone);
    if (step === 3 && !form.elements.problem.value.trim()) return fail("Cuéntanos brevemente qué quieres resolver.", form.elements.problem);
    if (step === 3 && !form.elements.desiredOutcome.value.trim()) return fail("Cuéntanos qué resultado quieres conseguir.", form.elements.desiredOutcome);
    if (step === 5 && !form.elements.budgetRange.value) return fail("Selecciona un rango de presupuesto.", form.elements.budgetRange);
    if (step === 5 && !form.elements.timeline.value) return fail("Selecciona un plazo.", form.elements.timeline);
    return true;
  }

  function render() {
    if (!Number.isInteger(step) || step < 1 || step > 6) step = 1;
    steps.forEach((section, index) => section.classList.toggle("active", index === step - 1));
    document.querySelectorAll("#progress span").forEach((segment, index) => {
      segment.classList.toggle("completed", index < step - 1);
      segment.classList.toggle("current", index === step - 1);
    });
    stepStatus.textContent = `Paso ${step} de 6`;
    backButton.hidden = step === 1;
    nextButton.hidden = step === 6;
    submitButton.hidden = step !== 6;
    if (step === 4) renderDynamic();
    if (step === 6) renderReview();
    save();
  }

  nextButton.addEventListener("click", () => {
    if (!validate()) return;
    track("project_builder_step_completed", { step });
    step += 1;
    render();
    document.querySelector(`.step[data-step="${step}"] h2`)?.focus?.();
  });
  backButton.addEventListener("click", () => { if (step > 1) step -= 1; render(); });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (step !== 6 || submitted || !validate()) return;
    submitted = true;
    submitButton.disabled = true;
    submitButton.textContent = "Enviando…";
    const params = new URLSearchParams(location.search);
    const body = {
      ...state, currentStep: undefined, schemaVersion: undefined, projectTypes: selected(), scopeAnswers: state.scopeAnswers,
      referenceLinks: form.elements.references.value.split(/\n/).map((value) => value.trim()).filter(Boolean),
      attribution: { utmSource: params.get("utm_source"), utmMedium: params.get("utm_medium"), utmCampaign: params.get("utm_campaign"), utmContent: params.get("utm_content"), utmTerm: params.get("utm_term"), referrer: document.referrer || null, landingPath: location.pathname },
      website: form.elements.website.value, language: "es", isTest: params.get("qa") === "1",
    };
    try {
      const response = await fetch("https://connect.cimacove.com/api/digital-intakes", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const json = await response.json();
      if (!response.ok) throw new Error(response.status === 429 ? "Has enviado varios intentos. Espera y vuelve a intentar." : "No pudimos guardar el proyecto. Revisa los campos e intenta otra vez.");
      const reference = json.data.reference;
      localStorage.removeItem(STORAGE_KEY);
      track("project_builder_submitted", { projectTypeCount: body.projectTypes.length });
      form.hidden = true;
      document.querySelector("#success").hidden = false;
      document.querySelector("#reference").textContent = reference;
      document.querySelector("#whatsapp").href = `https://wa.me/16027720124?text=${encodeURIComponent(`Hola, quiero conversar sobre mi proyecto ${reference}.`)}`;
    } catch (submissionError) {
      fail(submissionError.message || "Error de red. Tu progreso sigue guardado; intenta nuevamente.");
      submitted = false;
      submitButton.disabled = false;
      submitButton.textContent = "Enviar proyecto";
    }
  });

  if (!state.projectTypes.length) step = 1;
  else if (step > 2 && (!form.elements.customerName.value.trim() || !form.elements.customerEmail.checkValidity() || !form.elements.customerPhone.value.trim())) step = 2;
  else if (step > 3 && (!form.elements.problem.value.trim() || !form.elements.desiredOutcome.value.trim())) step = 3;
  else if (step > 5 && (!form.elements.budgetRange.value || !form.elements.timeline.value)) step = 5;
  track("project_builder_started", { landingPath: location.pathname });
  render();
})();
