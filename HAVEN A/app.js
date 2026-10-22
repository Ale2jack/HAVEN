
    "use strict";

    /* =========================================
    HAVEN — LÓGICA DE LA APLICACIÓN
    HTML + CSS + JAVASCRIPT
    ========================================= */

    const $ = (selector, root = document) => root.querySelector(selector);
    const $$ = (selector, root = document) =>
    Array.from(root.querySelectorAll(selector));

    const STORAGE_KEY = "haven_app_v1";

    const MOODS = {
    "Muy bien": { emoji: "😁", message: "¡Qué bueno! Disfruta este momento." },
    "Bien": { emoji: "🙂", message: "Me alegra. Sigue cuidando de ti." },
    "Regular": { emoji: "😐", message: "Está bien tener días diferentes. Ve a tu ritmo." },
    "Triste": { emoji: "😔", message: "Date permiso para sentir. No tienes que resolverlo todo ahora." },
    "Estresado": { emoji: "😣", message: "Haz una pausa si puedes. Un paso a la vez." }
    };

    /* DATOS DE DEMOSTRACIÓN */

    const spaces = [
    {
        id: 1,
        name: "Jardín de tranquilidad",
        type: "naturaleza",
        category: "Naturaleza",
        icon: "🌳",
        cover: "cover-green",
        location: "Ubicación ilustrativa",
        capacity: "Ambiente al aire libre",
        description: "Un espacio verde para respirar aire fresco, descansar entre clases y disfrutar de un momento de calma.",
        details: "Ideal para hacer una pausa, leer o conversar tranquilamente. La ubicación y las condiciones mostradas son ejemplos ficticios."
    },
    {
        id: 2,
        name: "Rincón de lectura",
        type: "silencio",
        category: "Tranquilidad",
        icon: "📚",
        cover: "cover-yellow",
        location: "Ubicación ilustrativa",
        capacity: "Ambiente silencioso",
        description: "Una propuesta de espacio tranquilo para leer, organizar tus ideas o tomar un descanso sin mucho ruido.",
        details: "Se recomienda mantener un volumen bajo y respetar el descanso de otros estudiantes. Este espacio es demostrativo."
    },
    {
        id: 3,
        name: "Zona de encuentro",
        type: "social",
        category: "Social",
        icon: "☕",
        cover: "cover-pink",
        location: "Ubicación ilustrativa",
        capacity: "Para compartir",
        description: "Una zona para conversar con compañeros, compartir ideas y hacer más agradables los tiempos entre clases.",
        details: "Una propuesta para fomentar la convivencia respetuosa. No representa una zona real confirmada del campus."
    },
    {
        id: 4,
        name: "Área de pausa interior",
        type: "interior",
        category: "Interior",
        icon: "🪴",
        cover: "cover-blue",
        location: "Ubicación ilustrativa",
        capacity: "Ambiente interior",
        description: "Una propuesta de rincón cómodo con plantas y asientos para desconectar durante unos minutos.",
        details: "La comodidad, el mobiliario y la ubicación deben verificarse en las instalaciones reales de la universidad."
    }
    ];

    const events = [
    {
        id: 1,
        title: "Respira y desconecta",
        category: "relajacion",
        categoryLabel: "Relajación",
        icon: "🧘",
        color: "green",
        date: "Actividad demostrativa",
        time: "15 minutos",
        place: "Espacio por confirmar",
        description: "Una sesión breve para practicar respiración tranquila y aprender a incorporar pausas durante el estudio."
    },
    {
        id: 2,
        title: "Muévete un poco",
        category: "movimiento",
        categoryLabel: "Movimiento",
        icon: "🙆",
        color: "yellow",
        date: "Actividad demostrativa",
        time: "10 minutos",
        place: "Lugar por confirmar",
        description: "Una propuesta de movimientos suaves y estiramientos cómodos para interrumpir periodos prolongados de estudio."
    },
    {
        id: 3,
        title: "Conexiones que suman",
        category: "comunidad",
        categoryLabel: "Comunidad",
        icon: "🤝",
        color: "pink",
        date: "Actividad demostrativa",
        time: "30 minutos",
        place: "Lugar por confirmar",
        description: "Una dinámica para conocer compañeros, compartir experiencias y fomentar una convivencia universitaria amable."
    },
    {
        id: 4,
        title: "Un momento creativo",
        category: "creatividad",
        categoryLabel: "Creatividad",
        icon: "🎨",
        color: "lilac",
        date: "Actividad demostrativa",
        time: "25 minutos",
        place: "Lugar por confirmar",
        description: "Una actividad libre para dibujar, escribir o expresar ideas y emociones mediante la creatividad."
    },
    {
        id: 5,
        title: "Caminata consciente",
        category: "movimiento",
        categoryLabel: "Movimiento",
        icon: "🌿",
        color: "green",
        date: "Actividad demostrativa",
        time: "15 minutos",
        place: "Ruta por confirmar",
        description: "Una propuesta de caminata tranquila para cambiar de ambiente y prestar atención al entorno."
    },
    {
        id: 6,
        title: "Compartir para crecer",
        category: "comunidad",
        categoryLabel: "Comunidad",
        icon: "💬",
        color: "yellow",
        date: "Actividad demostrativa",
        time: "20 minutos",
        place: "Lugar por confirmar",
        description: "Un espacio de conversación respetuosa para intercambiar ideas sobre cómo mejorar la experiencia estudiantil."
    }
    ];

    /* ESTADO Y ALMACENAMIENTO */

    function createInitialState() {
    return {
        moods: [],
        enrolled: [],
        ideas: [],
        pauseSeconds: 0
    };
    }

    function loadState() {
    const initial = createInitialState();

    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return initial;

        const saved = JSON.parse(raw);

        return {
        moods: Array.isArray(saved.moods) ? saved.moods : [],
        enrolled: Array.isArray(saved.enrolled)
            ? saved.enrolled.filter(id => events.some(event => event.id === id))
            : [],
        ideas: Array.isArray(saved.ideas) ? saved.ideas : [],
        pauseSeconds: Number.isFinite(saved.pauseSeconds)
            ? Math.max(0, saved.pauseSeconds)
            : 0
        };
    } catch (error) {
        console.warn("No se pudieron leer los datos guardados.", error);
        return initial;
    }
    }

    let state = loadState();

    function saveState() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        return true;
    } catch (error) {
        console.error("No se pudieron guardar los datos.", error);
        showToast("No se pudo guardar. Revisa el almacenamiento del navegador.");
        return false;
    }
    }

    /* FUNCIONES AUXILIARES */

    function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[char]);
    }

    function formatDate(dateValue, includeTime = true) {
    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) return "Fecha no disponible";

    return new Intl.DateTimeFormat("es-PE", includeTime
        ? { dateStyle: "medium", timeStyle: "short" }
        : { dateStyle: "long" }
    ).format(date);
    }

    function formatMinutes(seconds) {
    return Math.floor(seconds / 60);
    }

    let toastTimeout;

    function showToast(message) {
    const toast = $("#toast");
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);
    }

    /* NAVEGACIÓN ENTRE SECCIONES */

    const pageTitles = {
    inicio: "Inicio",
    espacios: "Espacios de descanso",
    pausas: "Pausas activas",
    actividades: "Actividades",
    comunidad: "Comunidad",
    bienestar: "Mi bienestar"
    };

    function navigateTo(pageName) {
    if (!pageTitles[pageName]) return;

    $$(".page").forEach(page => {
        page.classList.toggle("active", page.id === `page-${pageName}`);
    });

    $$(".nav-link").forEach(button => {
        const isActive = button.dataset.page === pageName;
        button.classList.toggle("active", isActive);

        if (isActive) {
        button.setAttribute("aria-current", "page");
        } else {
        button.removeAttribute("aria-current");
        }
    });
    
    $$(".bottom-nav-item").forEach(button => {
        const isActive = button.dataset.page === pageName;

        button.classList.toggle("active", isActive);

        if (isActive) {
        button.setAttribute("aria-current", "page");
        } else {
        button.removeAttribute("aria-current");
        }
    });


    $("#currentSection").textContent = pageTitles[pageName];

    $("#sidebar").classList.remove("open");
    $("#menuToggle").setAttribute("aria-expanded", "false");

    if (location.hash !== `#${pageName}`) {
        history.replaceState(null, "", `#${pageName}`);
    }

    if (pageName === "bienestar") renderWellbeing();
    if (pageName === "comunidad") renderIdeas();

    window.scrollTo({ top: 0, behavior: "smooth" });
    }

    document.addEventListener("click", event => {
    const navigationButton = event.target.closest("[data-page]");

    if (navigationButton) {
        event.preventDefault();
        navigateTo(navigationButton.dataset.page);
    }
    });

    $("#menuToggle").addEventListener("click", () => {
    const sidebar = $("#sidebar");
    const isOpen = sidebar.classList.toggle("open");

    $("#menuToggle").setAttribute("aria-expanded", String(isOpen));
    });

    document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
        $("#sidebar").classList.remove("open");
        $("#menuToggle").setAttribute("aria-expanded", "false");
    }
    });

    /* FECHA Y CONTADORES */

    function renderDate() {
    $("#todayDate").textContent = new Intl.DateTimeFormat("es-PE", {
        weekday: "short",
        day: "numeric",
        month: "short"
    }).format(new Date());
    }

    function renderCounters() {
    $("#spaceCount").textContent = spaces.length;
    $("#minutesCount").textContent = formatMinutes(state.pauseSeconds);
    $("#enrolledCount").textContent = state.enrolled.length;

    $("#wellbeingMinutes").textContent = formatMinutes(state.pauseSeconds);
    $("#wellbeingEvents").textContent = state.enrolled.length;
    $("#wellbeingEntries").textContent = state.moods.length;
    }

    /* ESPACIOS DE DESCANSO */

    function renderSpaces() {
    const search = $("#spaceSearch").value.trim().toLocaleLowerCase("es");
    const filter = $("#spaceFilter").value;

    const filtered = spaces.filter(space => {
        const matchesSearch = [
        space.name, space.description, space.category, space.location
        ].some(value => value.toLocaleLowerCase("es").includes(search));

        return matchesSearch && (filter === "todos" || space.type === filter);
    });

    $("#spaceGrid").innerHTML = filtered.map(space => `
        <article class="space-card">
        <div class="space-cover ${space.cover}">
            <span class="space-category">${escapeHTML(space.category)}</span>
            <span class="space-illustration" aria-hidden="true">${space.icon}</span>
        </div>
        <div class="space-body">
            <h3>${escapeHTML(space.name)}</h3>
            <p>${escapeHTML(space.description)}</p>
            <div class="space-meta">
            <span>⌖ ${escapeHTML(space.location)}</span>
            <span>${escapeHTML(space.capacity)}</span>
            </div>
            <button class="button button-primary full-width" data-space-details="${space.id}">
            Ver detalles →
            </button>
        </div>
        </article>
    `).join("");

    $("#spaceEmpty").classList.toggle("hidden", filtered.length !== 0);
    }

    $("#spaceSearch").addEventListener("input", renderSpaces);
    $("#spaceFilter").addEventListener("change", renderSpaces);

    /* VENTANA DE DETALLES */

    const detailDialog = $("#detailDialog");

    function openDialog(html) {
    $("#dialogContent").innerHTML = html;

    if (typeof detailDialog.showModal === "function") {
        if (!detailDialog.open) detailDialog.showModal();
    } else {
        detailDialog.setAttribute("open", "");
    }
    }

    $("#dialogClose").addEventListener("click", () => detailDialog.close());

    detailDialog.addEventListener("click", event => {
    if (event.target === detailDialog) detailDialog.close();
    });

    document.addEventListener("click", event => {
    const button = event.target.closest("[data-space-details]");
    if (!button) return;

    const space = spaces.find(item => item.id === Number(button.dataset.spaceDetails));
    if (!space) return;

    openDialog(`
        <span class="dialog-emoji">${space.icon}</span>
        <span class="eyebrow">${escapeHTML(space.category)}</span>
        <h2>${escapeHTML(space.name)}</h2>
        <p>${escapeHTML(space.details)}</p>
        <p><strong>Ubicación:</strong> ${escapeHTML(space.location)}</p>
        <p><strong>Características:</strong> ${escapeHTML(space.capacity)}</p>
        <p>Recuerda confirmar esta información en tu campus.</p>
        <button class="button button-primary full-width" id="dialogExplorePause">
        Ir a pausas activas →
        </button>
    `);
    });

    $("#dialogContent").addEventListener("click", event => {
    if (event.target.closest("#dialogExplorePause")) {
        detailDialog.close();
        navigateTo("pausas");
    }
    });

    /* ACTIVIDADES E INSCRIPCIONES */

    function isEnrolled(eventId) {
    return state.enrolled.includes(eventId);
    }

    function renderEvents() {
    const search = $("#eventSearch").value.trim().toLocaleLowerCase("es");
    const filter = $("#eventFilter").value;

    const filtered = events.filter(item => {
        const matchesSearch = [
        item.title, item.description, item.categoryLabel
        ].some(value => value.toLocaleLowerCase("es").includes(search));

        return matchesSearch && (filter === "todos" || item.category === filter);
    });

    $("#eventGrid").innerHTML = filtered.map(item => {
        const enrolled = isEnrolled(item.id);

        return `
        <article class="event-card">
            <div class="event-top">
            <div class="event-emoji ${item.color}">${item.icon}</div>
            <span class="tag">${escapeHTML(item.categoryLabel)}</span>
            </div>
            <h3>${escapeHTML(item.title)}</h3>
            <p>${escapeHTML(item.description)}</p>
            <div class="event-details">
            <span>◷ ${escapeHTML(item.time)}</span>
            <span>▦ ${escapeHTML(item.date)}</span>
            <span>⌖ ${escapeHTML(item.place)}</span>
            </div>
            <button class="button full-width ${enrolled ? "enrolled" : "button-primary"}"
            data-enroll="${item.id}" aria-pressed="${enrolled}">
            ${enrolled ? "✓ Inscrito · Cancelar inscripción" : "Participar en esta actividad"}
            </button>
        </article>
        `;
    }).join("");

    $("#eventEmpty").classList.toggle("hidden", filtered.length !== 0);
    }

    function toggleEnrollment(eventId) {
    const item = events.find(event => event.id === eventId);
    if (!item) return;

    if (isEnrolled(eventId)) {
        state.enrolled = state.enrolled.filter(id => id !== eventId);
        showToast(`Cancelaste tu inscripción a "${item.title}".`);
    } else {
        state.enrolled.push(eventId);
        showToast(`Inscripción local guardada: "${item.title}".`);
    }

    saveState();
    renderEvents();
    renderHomeEvents();
    renderCounters();
    }

    $("#eventGrid").addEventListener("click", event => {
    const button = event.target.closest("[data-enroll]");
    if (button) toggleEnrollment(Number(button.dataset.enroll));
    });

    $("#eventSearch").addEventListener("input", renderEvents);
    $("#eventFilter").addEventListener("change", renderEvents);

    function renderHomeEvents() {
    const featured = events.slice(0, 3);

    $("#homeEvents").innerHTML = featured.map(item => `
        <div class="home-event">
        <div class="home-event-icon">${item.icon}</div>
        <div class="home-event-info">
            <strong>${escapeHTML(item.title)}</strong>
            <small>${escapeHTML(item.categoryLabel)} · ${escapeHTML(item.time)}</small>
        </div>
        <button class="text-button" data-enroll-home="${item.id}">
            ${isEnrolled(item.id) ? "Inscrito ✓" : "Ver"}
        </button>
        </div>
    `).join("");
    }

    $("#homeEvents").addEventListener("click", event => {
    const button = event.target.closest("[data-enroll-home]");
    if (!button) return;

    const item = events.find(event => event.id === Number(button.dataset.enrollHome));
    if (!item) return;

    navigateTo("actividades");
    showToast(`Busca "${item.title}" en la sección de actividades.`);
    });

    /* ESTADO DE ÁNIMO */

    function saveMood(mood, note = "") {
    if (!MOODS[mood]) return false;

    const today = new Date().toISOString().slice(0, 10);

    // Mantener un solo registro por día; al volver a guardar,
    // se actualiza la emoción y la nota de esa fecha.
    const existingIndex = state.moods.findIndex(entry => entry.date === today);

    const entry = {
        date: today,
        updatedAt: new Date().toISOString(),
        mood,
        note: note.trim().slice(0, 500)
    };

    if (existingIndex >= 0) {
        state.moods[existingIndex] = entry;
    } else {
        state.moods.unshift(entry);
    }

    state.moods.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

    if (!saveState()) return false;

    renderWellbeing();
    renderCounters();
    updateHomeMood(mood);

    return true;
    }

    function updateHomeMood(mood) {
    const moodData = MOODS[mood];
    if (!moodData) return;

    $("#homeMoodFeedback").textContent = moodData.message;

    $$(".mood-option").forEach(button => {
        button.classList.toggle("selected", button.dataset.mood === mood);
    });
    }

    $$(".mood-option").forEach(button => {
    button.addEventListener("click", () => {
        const mood = button.dataset.mood;

        if (saveMood(mood)) {
        showToast("Tu estado de ánimo se guardó en este navegador.");
        }
    });
    });

    $("#moodForm").addEventListener("submit", event => {
    event.preventDefault();

    const selected = $('input[name="mood"]:checked');
    const feedback = $("#moodFeedback");

    if (!selected) {
        feedback.textContent = "Selecciona una emoción antes de guardar.";
        return;
    }

    const saved = saveMood(selected.value, $("#moodNote").value);

    if (saved) {
        $("#moodNote").value = "";
        feedback.textContent = "Tu registro se guardó correctamente.";
        showToast("Registro de bienestar guardado.");
    } else {
        feedback.textContent = "No se pudo guardar. Comprueba el almacenamiento.";
    }
    });

    function renderMoodHistory() {
    const history = $("#moodHistory");

    if (state.moods.length === 0) {
        history.innerHTML = `
        <div class="history-empty">
            Aún no tienes registros. Cuando quieras, guarda cómo te sientes hoy.
        </div>
        `;
        return;
    }

    history.innerHTML = state.moods.slice(0, 30).map(entry => {
        const mood = MOODS[entry.mood];
        if (!mood) return "";

        return `
        <article class="history-card">
            <span class="history-emoji">${mood.emoji}</span>
            <div class="history-content">
            <strong>${escapeHTML(entry.mood)}</strong>
            <small>${escapeHTML(formatDate(entry.updatedAt || entry.date))}</small>
            ${entry.note ? `<p>${escapeHTML(entry.note)}</p>` : ""}
            </div>
        </article>
        `;
    }).join("");
    }

    function renderWellbeing() {
    renderMoodHistory();
    renderCounters();

    if (state.moods.length > 0) {
        const today = new Date().toISOString().slice(0, 10);
        const todayEntry = state.moods.find(entry => entry.date === today);

        if (todayEntry) {
        updateHomeMood(todayEntry.mood);
        }
    }
    }

    $("#clearMoodHistory").addEventListener("click", () => {
    if (state.moods.length === 0) {
        showToast("No hay registros para borrar.");
        return;
    }

    const confirmed = window.confirm(
        "¿Quieres borrar todos tus registros emocionales guardados en este navegador? Esta acción no se puede deshacer."
    );

    if (!confirmed) return;

    const previous = state.moods;
    state.moods = [];

    if (!saveState()) {
        state.moods = previous;
        return;
    }

    $("#moodFeedback").textContent = "";
    renderWellbeing();
    $("#homeMoodFeedback").textContent = "Tómate un momento para escucharte.";
    $$(".mood-option").forEach(button => button.classList.remove("selected"));

    showToast("Se borró tu historial emocional.");
    });

    /* IDEAS PARA LA COMUNIDAD */

    $("#ideaForm").addEventListener("submit", event => {
    event.preventDefault();

    const input = $("#ideaInput");
    const idea = input.value.trim();

    if (idea.length < 5) {
        showToast("Escribe una idea un poco más detallada.");
        return;
    }

    state.ideas.unshift({
        text: idea.slice(0, 300),
        createdAt: new Date().toISOString()
    });

    if (!saveState()) {
        state.ideas.shift();
        return;
    }

    input.value = "";
    renderIdeas();
    showToast("Tu idea se guardó en este navegador.");
    });

    function renderIdeas() {
    const list = $("#ideaList");

    if (state.ideas.length === 0) {
        list.innerHTML = `
        <div class="history-empty">
            Todavía no has guardado propuestas. ¡Tu primera idea puede empezar aquí!
        </div>
        `;
        return;
    }

    list.innerHTML = state.ideas.slice(0, 20).map(idea => `
        <article class="idea-card">
        <p>${escapeHTML(idea.text)}</p>
        <small>Propuesta personal · ${escapeHTML(formatDate(idea.createdAt))}</small>
        </article>
    `).join("");
    }

    /* PAUSAS Y TEMPORIZADOR */

    let timerInterval = null;
    let timerStartedAt = 0;
    let timerEndsAt = 0;
    let timerTotalSeconds = 0;
    let breathingPhaseStartedAt = 0;
    let breathingRunning = false;
    let pauseSavedSeconds = 0;
    let currentExercise = "breathing";

    const breathingCircle = $(".breathing-circle");

    function setBreathingPhase(phase, seconds, instruction) {
    $("#breathingPhase").textContent = phase;
    $("#breathingCountdown").textContent = `${seconds} s`;
    $("#breathingInstruction").textContent = instruction;

    breathingCircle.classList.toggle("inhale", phase === "Inhala");
    breathingCircle.classList.toggle("exhale", phase === "Exhala");

    $("#breathingEmoji").textContent = phase === "Inhala" ? "🌿" : "☁️";
    }

    function updateTimerDisplay() {
    if (!breathingRunning) return;

    const now = Date.now();
    const remaining = Math.max(0, Math.ceil((timerEndsAt - now) / 1000));
    const elapsed = Math.max(0, Math.floor((now - timerStartedAt) / 1000));

    if (currentExercise === "breathing") {
        const phaseElapsed = Math.floor((now - breathingPhaseStartedAt) / 1000);
        const cyclePosition = phaseElapsed % 8;

        if (cyclePosition < 4) {
        setBreathingPhase("Inhala", 4 - cyclePosition,
            "Inspira suavemente, sin forzar la respiración.");
        } else {
        setBreathingPhase("Exhala", 8 - cyclePosition,
            "Suelta el aire despacio, a tu propio ritmo.");
        }

        $("#breathingCountdown").textContent =
        `${Math.ceil(remaining / 60)} min restantes`;
    } else {
        $("#breathingPhase").textContent = "En pausa";
        $("#breathingCountdown").textContent = `${remaining} s`;
    }

    if (remaining <= 0) {
        finishTimer(true);
    }
    }

    function startTimer(seconds, exercise = "breathing") {
    if (breathingRunning) return;

    currentExercise = exercise;
    timerTotalSeconds = seconds;
    timerStartedAt = Date.now();
    timerEndsAt = timerStartedAt + seconds * 1000;
    breathingPhaseStartedAt = timerStartedAt;
    pauseSavedSeconds = 0;
    breathingRunning = true;

    $("#startBreathing").disabled = true;
    $("#stopBreathing").disabled = false;
    $("#breathingDuration").disabled = true;

    if (exercise !== "breathing") {
        const instructions = {
        estiramiento: {
            emoji: "🙆",
            title: "Estiramiento suave",
            text: "Si te resulta cómodo, mueve suavemente hombros y cuello. No fuerces ningún movimiento."
        },
        ojos: {
            emoji: "👀",
            title: "Descanso visual",
            text: "Aparta la vista de la pantalla y mira a una distancia cómoda. Parpadea con naturalidad."
        },
        gratitud: {
            emoji: "🌷",
            title: "Momento de gratitud",
            text: "Piensa en algo sencillo que valores hoy. No necesitas encontrar una respuesta perfecta."
        }
        };

        const info = instructions[exercise];

        $("#breathingEmoji").textContent = info.emoji;
        $("#breathingPhase").textContent = info.title;
        $("#breathingInstruction").textContent = info.text;
        $("#breathingCountdown").textContent = `${seconds} s`;
        breathingCircle.classList.remove("inhale", "exhale");
    }

    updateTimerDisplay();
    timerInterval = setInterval(updateTimerDisplay, 250);
    }

    function finishTimer(completed = false) {
    if (!breathingRunning) return;

    const elapsed = Math.min(
        timerTotalSeconds,
        Math.max(0, Math.floor((Date.now() - timerStartedAt) / 1000))
    );

    clearInterval(timerInterval);
    timerInterval = null;
    breathingRunning = false;

    // Se registra el tiempo realmente realizado, no el tiempo seleccionado.
    state.pauseSeconds += elapsed;

    const saved = saveState();

    $("#startBreathing").disabled = false;
    $("#stopBreathing").disabled = true;
    $("#breathingDuration").disabled = false;

    breathingCircle.classList.remove("inhale", "exhale");

    if (currentExercise === "breathing") {
        $("#breathingPhase").textContent = completed ? "¡Muy bien!" : "Finalizado";
        $("#breathingEmoji").textContent = "🌿";
        $("#breathingCountdown").textContent = "Pausa terminada";
        $("#breathingInstruction").textContent = completed
        ? "Terminaste tu ejercicio. Tómate un momento antes de continuar."
        : "Terminaste la pausa. Continúa a tu ritmo.";
    } else {
        $("#breathingPhase").textContent = "¡Muy bien!";
        $("#breathingEmoji").textContent = "🌿";
        $("#breathingCountdown").textContent = "Pausa terminada";
        $("#breathingInstruction").textContent =
        "Terminaste esta pausa. Continúa a tu ritmo.";
    }

    renderCounters();

    if (saved) {
        showToast(
        completed
            ? "¡Pausa completada! Tu tiempo se ha registrado."
            : "Pausa finalizada. Se registró el tiempo realizado."
        );
    }
    }

    $("#startBreathing").addEventListener("click", () => {
    const duration = Number($("#breathingDuration").value);
    const seconds = Math.max(1, duration) * 60;
    startTimer(seconds, "breathing");
    });

    $("#stopBreathing").addEventListener("click", () => {
    finishTimer(false);
    });

    $$("[data-exercise]").forEach(button => {
    button.addEventListener("click", () => {
        const exercise = button.dataset.exercise;
        const seconds = exercise === "estiramiento" ? 120 : 60;

        if (breathingRunning) {
        showToast("Finaliza la pausa actual antes de iniciar otra.");
        return;
        }

        startTimer(seconds, exercise);
        $("#breathingVisual").scrollIntoView({
        behavior: "smooth",
        block: "center"
        });
    });
    });

    /* INICIALIZACIÓN */

    function initializeApp() {
    renderDate();
    renderSpaces();
    renderEvents();
    renderHomeEvents();
    renderWellbeing();
    renderIdeas();
    renderCounters();

    const today = new Date().toISOString().slice(0, 10);
    const todayEntry = state.moods.find(entry => entry.date === today);

    if (todayEntry) {
        updateHomeMood(todayEntry.mood);
    }

    const requestedPage = location.hash.replace("#", "");
    navigateTo(pageTitles[requestedPage] ? requestedPage : "inicio");
    }

    initializeApp();
