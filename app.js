// =========================================================
// 0. НАСТРОЙКИ SUPABASE (ВСТАВЬТЕ СВОИ ЗНАЧЕНИЯ СЮДА)
// =========================================================
const SUPABASE_CONFIG = {
  URL: "https://ejchwvumsgyutbbtcuic.supabase.co",
  ANON_KEY: "sb_publishable_hjGhx1UAgVkvQcIXyMHZVA_WGZxx7gg"
};

const isSupabaseConfigured =
  SUPABASE_CONFIG.URL.startsWith("https://") &&
  !SUPABASE_CONFIG.ANON_KEY.includes("YOUR_") &&
  typeof window.supabase !== "undefined";

const sb = isSupabaseConfigured
  ? window.supabase.createClient(SUPABASE_CONFIG.URL, SUPABASE_CONFIG.ANON_KEY)
  : null;

// =========================================================
// 1. BIG FIVE DATA (Ресурс 7.2 + Ресурс 7.2.1)
// =========================================================
const FACTORS = [
  {
    id: "E", name: "Экстраверсия", en: "Extraversion", color: "#2563eb",
    highManifest: "Инициативность, энергичность, быстрая адаптация в коллективе, готовность выступать и вести за собой группу, позитивный эмоциональный фон.",
    midManifest: "Гибкое переключение между командным взаимодействием и самостоятельной работой в спокойной обстановке.",
    lowManifest: "Сдержанность, глубина размышлений, умение сосредоточенно работать в тишине и индивидуальном формате без лишней суеты.",
    highRisk: "Может перебивать других, стремиться занять всё «эфирное время», скучать при монотонной индивидуальной работе, искать излишней стимуляции.",
    midRisk: "В чрезмерно шумной или слишком изолированной обстановке продуктивность может умеренно снижаться.",
    lowRisk: "Утомление от больших групп и частых выступлений; сдержанность окружающие могут ошибочно принимать за холодность или закрытость.",
    matrixHigh: "Давать роли фасилитатора / спикера; задания с обменом идеями; правила баланса эфирного времени; проектная работа с распределением ответственности; целенаправленно развивать активное слушание.",
    matrixLow: "Предлагать парную работу, письменные ответы перед устными; предварительные сценарии выступлений; асинхронные формы участия (форумы, заметки); постепенно расширять социальные ситуации."
  },
  {
    id: "A", name: "Доброжелательность", en: "Agreeableness", color: "#16a34a",
    highManifest: "Чуткость, стремление к гармонии, искренность, готовность помогать и сотрудничать, дипломатичность и доверие к людям.",
    midManifest: "Умение сочетать доброжелательное сотрудничество со способностью спокойно отстаивать собственные интересы.",
    lowManifest: "Независимость суждений, объективность, критическое мышление, готовность говорить правду без прикрас и отстаивать позицию.",
    highRisk: "Трудности в ситуациях, требующих жёсткой объективности, критики или отказа; риск уступать в ущерб собственным границам.",
    midRisk: "Иногда возможны колебания между стремлением угодить и желанием проявить твёрдость.",
    lowRisk: "Скептицизм и прямолинейность могут провоцировать трения в группе, трудности в поиске компромиссов и отказ от командного взаимодействия.",
    matrixHigh: "Использовать кооперативные структуры (Jigsaw, Peer-tutoring); поручать медиаторские роли; прозрачные критерии справедливости; тренинги «Я-сообщений».",
    matrixLow: "Учить конструктивной конфронтации и аргументации; контракты поведения; ролевые игры по разрешению конфликтов; чёткие границы и правила «стоп-сигналов»."
  },
  {
    id: "C", name: "Добросовестность", en: "Conscientiousness", color: "#0891b2",
    highManifest: "Организованность, планирование, самодисциплина, настойчивость, надёжность, обдуманность решений и стремление к высокому результату.",
    midManifest: "Разумный баланс между соблюдением планов и способностью действовать гибко при изменении обстоятельств.",
    lowManifest: "Спонтанность, гибкость, способность быстро реагировать в нестандартных игровых или ограниченных по времени ситуациях.",
    highRisk: "Склонность к перфекционизму и перегрузкам, тревога при нарушении привычного порядка или нечётких правилах.",
    midRisk: "При потере интереса к задаче или отсутствии чётких ориентиров возможна прокрастинация.",
    lowRisk: "Импульсивность, откладывание дел, пропуск дедлайнов, сложности с многоэтапными проектами и соблюдением жёстких инструкций.",
    matrixHigh: "Сложные, долгосрочные задачи с вехами; лидерство в планировании; чек-листы качества; баланс «перфекционизм vs достаточно хорошо».",
    matrixLow: "Разбивка на шаги (chunking), визуальные распорядки, тайм-менеджмент по Помодоро, ежедневные мини-цели, напоминания; обучение само-мониторингу и рефлексии."
  },
  {
    id: "N", name: "Нейротизм (эмоц. реактивность)", en: "Neuroticism", color: "#d97706",
    highManifest: "Тонкая чувствительность к деталям обстановки и несправедливости, эмоциональная вовлечённость и осторожность в оценке угроз.",
    midManifest: "Умеренная эмоциональная чувствительность: обычные учебные трудности переживаются без длительной потери равновесия.",
    lowManifest: "Высокая эмоциональная стабильность, спокойствие под давлением, стрессоустойчивость и ясность ума в напряжённых ситуациях.",
    highRisk: "Высокая тревожность, уязвимость к критике и стрессу, быстрое эмоциональное выгорание, вспышки раздражения или неуверенность перед оценкой.",
    midRisk: "В периоды высокой нагрузки (контрольные, публичные защиты) может возникать ситуативное волнение.",
    lowRisk: "При очень низком нейротизме (высокой стабильности) возможна недооценка рисков и последствий, а также недостаток эмпатии к переживаниям более тревожных сверстников.",
    matrixHigh: "Навыки эмоциональной регуляции (дыхание, «стоп-мысль»), рефрейминг; предсказуемые ритуалы урока; поддерживающая обратная связь; постепенное повышение требований.",
    matrixLow: "Если низкий (высокая стабильность): давать челлендж-задачи, развивать эмпатию к переживаниям других; учить отслеживать риски и последствия."
  },
  {
    id: "O", name: "Открытость опыту", en: "Openness to Experience", color: "#7c3aed",
    highManifest: "Любознательность, креативность, развитое воображение, интерес к идеям, искусству и нестандартным способам решения задач.",
    midManifest: "Способность сочетать практический взгляд на задачи с интересом к новым идеям и творческим подходам.",
    lowManifest: "Практичность, опора на проверенные факты и традиции, стабильность в действиях и чёткое следование понятным алгоритмам.",
    highRisk: "Скука при рутинных тренировочных упражнениях, склонность оспаривать устоявшиеся правила и уходить в абстракции от практики.",
    midRisk: "Слишком расплывчатые или чрезмерно однообразные задания снижают учебный интерес.",
    lowRisk: "Дискомфорт от резких перемен, новых форматов и абстрактных заданий без чёткого практического образца.",
    matrixHigh: "Творческие исследовательские задания, межпредметные проекты, выбор форматов продукта; метапознание: «как я пришёл к идее».",
    matrixLow: "Алгоритмы и примеры; пошаговые инструкции; сначала надёжные шаблоны, затем вариации; поддержка при изменениях и новизне."
  }
];

const QUESTIONS_RAW = [
  { id: "q1", factor: "E", facet: "Дружелюбность", text: "Мне легко заводить новых друзей и открыто проявлять тёплые чувства к людям.", reverse: false },
  { id: "q2", factor: "E", facet: "Дружелюбность", text: "В общении с незнакомыми людьми я обычно держусь отстранённо и сдержанно.", reverse: true },
  { id: "q3", factor: "E", facet: "Общительность", text: "Я заряжаюсь энергией в больших компаниях и люблю находиться среди людей.", reverse: false },
  { id: "q4", factor: "E", facet: "Общительность", text: "Шумные компании быстро утомляют меня, и мне нужно много личного пространства.", reverse: true },
  { id: "q5", factor: "E", facet: "Самоуверенность", text: "В группе я часто беру ответственность на себя и направляю действия других.", reverse: false },
  { id: "q6", factor: "E", facet: "Самоуверенность", text: "При совместной работе я предпочитаю молчать и позволять другим управлять процессом.", reverse: true },
  { id: "q7", factor: "E", facet: "Активность", text: "Я предпочитаю быстрый, насыщенный темп и занимаюсь сразу многими видами деятельности.", reverse: false },
  { id: "q8", factor: "E", facet: "Активность", text: "Мне комфортнее действовать в медленном, неторопливом и расслабленном темпе.", reverse: true },
  { id: "q9", factor: "E", facet: "Поиск ярких ощущений", text: "Мне быстро становится скучно без ярких впечатлений, риска и динамичной обстановки.", reverse: false },
  { id: "q10", factor: "E", facet: "Поиск ярких ощущений", text: "Я не люблю шум, суету и избегаю ситуаций с поиском острых ощущений.", reverse: true },
  { id: "q11", factor: "E", facet: "Жизнерадостность", text: "Я часто испытываю широкий спектр позитивных чувств: радость, энтузиазм и оптимизм.", reverse: false },
  { id: "q12", factor: "E", facet: "Жизнерадостность", text: "Я редко бываю в энергичном, восторженном и приподнятом настроении.", reverse: true },

  { id: "q13", factor: "A", facet: "Доверие", text: "Я верю, что большинство людей справедливы, честны и имеют добрые намерения.", reverse: false },
  { id: "q14", factor: "A", facet: "Доверие", text: "Я склонен(на) считать, что многие люди хитры и преследуют лишь личную выгоду.", reverse: true },
  { id: "q15", factor: "A", facet: "Моральность", text: "В делах с людьми я веду себя искренне и прямолинейно, не прибегая к манипуляциям.", reverse: false },
  { id: "q16", factor: "A", facet: "Моральность", text: "Я считаю, что в социальных отношениях иногда необходимо притворяться или недоговаривать.", reverse: true },
  { id: "q17", factor: "A", facet: "Альтруизм", text: "Помощь нуждающимся доставляет мне искреннее удовольствие и чувство самореализации.", reverse: false },
  { id: "q18", factor: "A", facet: "Альтруизм", text: "Просьбы других людей о помощи чаще кажутся мне обузой, чем радостью.", reverse: true },
  { id: "q19", factor: "A", facet: "Сотрудничество", text: "Я избегаю конфронтации и охотно иду на компромисс, чтобы ладить с окружающими.", reverse: false },
  { id: "q20", factor: "A", facet: "Сотрудничество", text: "Чтобы добиться своего, я могу жёстко надавить и настоять на своей позиции.", reverse: true },
  { id: "q21", factor: "A", facet: "Скромность", text: "Я не люблю хвастаться своими успехами и утверждать, что я лучше других.", reverse: false },
  { id: "q22", factor: "A", facet: "Скромность", text: "Мне нравится публично подчёркивать своё превосходство и достижения.", reverse: true },
  { id: "q23", factor: "A", facet: "Сочувствие", text: "Я мягкосердечный человек: остро чувствую чужую боль и легко сопереживаю.", reverse: false },
  { id: "q24", factor: "A", facet: "Сочувствие", text: "При оценке ситуаций я опираюсь на холодный рассудок и беспристрастность, а не на жалость.", reverse: true },

  { id: "q25", factor: "C", facet: "Самоэффективность", text: "Я уверен(а), что обладаю самоконтролем и способностью доводить дела до конца.", reverse: false },
  { id: "q26", factor: "C", facet: "Самоэффективность", text: "Мне часто кажется, что я не справляюсь со сложными задачами и не контролирую ситуацию.", reverse: true },
  { id: "q27", factor: "C", facet: "Аккуратность", text: "Я люблю порядок, составляю списки дел и следую утверждённым правилам и распорядку.", reverse: false },
  { id: "q28", factor: "C", facet: "Аккуратность", text: "Строгие правила, графики и инструкции кажутся мне слишком ограничивающими мою волю.", reverse: true },
  { id: "q29", factor: "C", facet: "Стремление к цели", text: "Я прилагаю огромные усилия, чтобы достичь выдающихся результатов и поставленных целей.", reverse: false },
  { id: "q30", factor: "C", facet: "Стремление к цели", text: "Я обычно довольствуюсь минимальными затратами труда, лишь бы закрыть задачу.", reverse: true },
  { id: "q31", factor: "C", facet: "Самодисциплина", text: "Я умею преодолеть нежелание и упорно выполнять даже трудную или скучную работу до завершения.", reverse: false },
  { id: "q32", factor: "C", facet: "Самодисциплина", text: "Я часто откладываю выполнение задач и не довожу начатые дела до конца.", reverse: true },
  { id: "q33", factor: "C", facet: "Осторожность", text: "Перед принятием решения я не спешу и обдумываю разные варианты и последствия.", reverse: false },
  { id: "q34", factor: "C", facet: "Осторожность", text: "Я обычно говорю или делаю первое, что приходит на ум, не просчитывая альтернативы.", reverse: true },

  { id: "q35", factor: "N", facet: "Тревога", text: "Я часто чувствую напряжение, нервозность и тревогу, будто должно случиться что-то плохое.", reverse: false },
  { id: "q36", factor: "N", facet: "Тревога", text: "Обычно я спокоен(на) и не испытываю сильного страха или тревоги перед новыми ситуациями.", reverse: true },
  { id: "q37", factor: "N", facet: "Гнев", text: "Я легко раздражаюсь и злюсь, если что-то идёт не по моему плану или кажется несправедливым.", reverse: false },
  { id: "q38", factor: "N", facet: "Гнев", text: "Меня очень трудно вывести из равновесия и заставить разгневаться.", reverse: true },
  { id: "q39", factor: "N", facet: "Депрессивность", text: "Я нередко испытываю печаль, уныние, разочарование и нехватку энергии для старта.", reverse: false },
  { id: "q40", factor: "N", facet: "Депрессивность", text: "Я редко погружаюсь в подавленное настроение и чувство безнадёжности.", reverse: true },
  { id: "q41", factor: "N", facet: "Самосознание", text: "Я очень чувствителен(на) к мнению окружающих, легко смущаюсь и боюсь насмешек.", reverse: false },
  { id: "q42", factor: "N", facet: "Самосознание", text: "Я не нервничаю в компании и не думаю, что все вокруг оценивают каждый мой шаг.", reverse: true },
  { id: "q43", factor: "N", facet: "Несдержанность", text: "Мне трудно сопротивляться сильным сиюминутным желаниям в ущерб долгосрочным целям.", reverse: false },
  { id: "q44", factor: "N", facet: "Несдержанность", text: "Я легко контролирую свои импульсы и не поддаюсь соблазнам.", reverse: true },
  { id: "q45", factor: "N", facet: "Уязвимость", text: "Под давлением или в стрессовой ситуации я чувствую панику, замешательство и беспомощность.", reverse: false },
  { id: "q46", factor: "N", facet: "Уязвимость", text: "В условиях стресса и давления я остаюсь уравновешенным(ой) и здравомыслящим(ей).", reverse: true },

  { id: "q47", factor: "O", facet: "Воображение", text: "У меня богатое воображение, и я люблю придумывать интересные, нестандартные идеи и образы.", reverse: false },
  { id: "q48", factor: "O", facet: "Воображение", text: "Я ориентируюсь прежде всего на конкретные факты, а фантазирование считаю лишним.", reverse: true },
  { id: "q49", factor: "O", facet: "Артистичность", text: "Я глубоко ценю красоту в искусстве, музыке или природе и легко ими увлекаюсь.", reverse: false },
  { id: "q50", factor: "O", facet: "Артистичность", text: "Искусство, поэзия и эстетика вызывают у меня мало интереса.", reverse: true },
  { id: "q51", factor: "O", facet: "Эмоциональность", text: "Я хорошо понимаю свои глубокие чувства и умею опираться на них.", reverse: false },
  { id: "q52", factor: "O", facet: "Эмоциональность", text: "Я редко анализирую свои эмоции и не склонен(на) выражать переживания открыто.", reverse: true },
  { id: "q53", factor: "O", facet: "Авантюризм", text: "Я люблю новизну, перемены и готов(а) менять привычные маршруты ради нового опыта.", reverse: false },
  { id: "q54", factor: "O", facet: "Авантюризм", text: "Я чувствую дискомфорт от перемен и предпочитаю хорошо знакомый, стабильный распорядок.", reverse: true },
  { id: "q55", factor: "O", facet: "Интеллект", text: "Мне нравится играть с идеями, решать головоломки и обсуждать сложные абстрактные вопросы.", reverse: false },
  { id: "q56", factor: "O", facet: "Интеллект", text: "Отвлечённые теоретические рассуждения кажутся мне пустой тратой времени.", reverse: true },
  { id: "q57", factor: "O", facet: "Либерализм", text: "Я готов(а) ставить под сомнение привычные традиции, обычаи и авторитеты.", reverse: false },
  { id: "q58", factor: "O", facet: "Либерализм", text: "Я считаю, что надёжнее и правильнее следовать проверенным традициям и общепринятым правилам.", reverse: true }
];

const LIKERT_OPTIONS = [
  { val: 1, label: "Совершенно не согласен" },
  { val: 2, label: "Скорее не согласен" },
  { val: 3, label: "Нейтрально" },
  { val: 4, label: "Скорее согласен" },
  { val: 5, label: "Полностью согласен" }
];

// =========================================================
// 2. APP STATE & INIT
// =========================================================
let activeQuestions = [];
let answers = {};
let currentPage = 0;
let lastProfile = [];
const PAGE_SIZE = 10;

let urlInvite = { classCode: null, studentToken: null, className: null, displayName: null };

const SESSION_STORAGE_KEY = "bf_teacher_session_token";
let teacherToken = localStorage.getItem(SESSION_STORAGE_KEY) || null;
let dashData = null;
let selectedClassId = null;
let viewingContext = {
  isTeacherView: false,
  studentId: null,
  resultId: null,
  studentName: "",
  className: ""
};

async function initApp() {
  if (!isSupabaseConfigured) {
    document.getElementById("config-warning").classList.remove("hidden");
  }

  document.querySelectorAll('input[name="testMode"]').forEach(radio => {
    radio.addEventListener("change", () => {
      document.getElementById("mode-full-box").classList.toggle("active", radio.value === "full" && radio.checked);
      document.getElementById("mode-express-box").classList.toggle("active", radio.value === "express" && radio.checked);
    });
  });

  const params = new URLSearchParams(window.location.search);
  const classParam = params.get("class");
  const tokenParam = params.get("token");

  if (classParam) {
    urlInvite.classCode = classParam.trim().toUpperCase();
    document.getElementById("joinCode").value = urlInvite.classCode;
  }
  if (tokenParam) {
    urlInvite.studentToken = tokenParam.trim();
  }

  if (sb && (urlInvite.classCode || urlInvite.studentToken)) {
    try {
      const { data, error } = await sb.rpc("get_student_invite_info", {
        p_join_code: urlInvite.classCode,
        p_student_token: urlInvite.studentToken
      });
      if (!error && data && data.valid) {
        const banner = document.getElementById("invite-banner");
        banner.classList.remove("hidden");
        if (data.type === "token") {
          urlInvite.className = data.class_name;
          urlInvite.displayName = data.display_name;
          banner.innerHTML = `Персональное приглашение: <strong>${escapeHtml(data.display_name)}</strong> (${escapeHtml(data.class_name)}). Ваши ответы автоматически сохранятся в базу.`;
          document.getElementById("userName").value = data.display_name;
          document.getElementById("userGroup").value = data.class_name;
          document.getElementById("join-code-wrap").classList.add("hidden");
          document.getElementById("user-name-wrap").classList.add("hidden");
          document.getElementById("user-group-wrap").classList.add("hidden");
        } else {
          urlInvite.className = data.class_name;
          banner.innerHTML = `Приглашение в класс: <strong>${escapeHtml(data.class_name)}</strong> (код <code class="code-pill">${escapeHtml(urlInvite.classCode)}</code>). Введите ваше имя и пройдите тест.`;
          document.getElementById("userGroup").value = data.class_name;
          document.getElementById("joinCode").readOnly = true;
        }
      } else if (urlInvite.studentToken) {
        const banner = document.getElementById("invite-banner");
        banner.className = "alert alert-danger";
        banner.textContent = "Персональная ссылка недействительна или приём ответов для этого класса закрыт.";
      }
    } catch (e) {
      console.warn("Invite lookup failed:", e);
    }
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}

function switchMode(mode) {
  document.getElementById("tab-student").classList.toggle("active", mode === "student");
  document.getElementById("tab-teacher").classList.toggle("active", mode === "teacher");
  document.getElementById("screen-results").classList.add("hidden");

  if (mode === "student") {
    document.getElementById("section-teacher").classList.add("hidden");
    document.getElementById("section-student").classList.remove("hidden");
  } else {
    document.getElementById("section-student").classList.add("hidden");
    document.getElementById("section-teacher").classList.remove("hidden");
    if (teacherToken && sb) {
      loadDashboard();
    } else {
      document.getElementById("teacher-dashboard").classList.add("hidden");
      document.getElementById("teacher-login-card").classList.remove("hidden");
    }
  }
}

// =========================================================
// 3. TEST FLOW
// =========================================================
function buildQuestions(mode) {
  const pool = mode === "express"
    ? QUESTIONS_RAW.filter((_, idx) => idx % 2 === 0)
    : [...QUESTIONS_RAW];

  const groups = { E: [], A: [], C: [], N: [], O: [] };
  pool.forEach(q => groups[q.factor].push(q));

  const ordered = [];
  const keys = ["E", "A", "C", "N", "O"];
  let added = true;
  while (added) {
    added = false;
    for (const k of keys) {
      if (groups[k].length) {
        ordered.push(groups[k].shift());
        added = true;
      }
    }
  }
  return ordered;
}

function startTest() {
  const mode = document.querySelector('input[name="testMode"]:checked').value;
  activeQuestions = buildQuestions(mode);
  answers = {};
  currentPage = 0;
  viewingContext = { isTeacherView: false, studentId: null, resultId: null, studentName: "", className: "" };

  document.getElementById("screen-start").classList.add("hidden");
  document.getElementById("screen-results").classList.add("hidden");
  document.getElementById("screen-test").classList.remove("hidden");
  renderPage();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function renderPage() {
  const container = document.getElementById("questions-container");
  const totalPages = Math.ceil(activeQuestions.length / PAGE_SIZE);
  const start = currentPage * PAGE_SIZE;
  const slice = activeQuestions.slice(start, start + PAGE_SIZE);

  document.getElementById("test-error").classList.add("hidden");
  document.getElementById("page-text").textContent = `Страница ${currentPage + 1} из ${totalPages}`;
  updateProgress();

  container.innerHTML = slice.map((q, idx) => {
    const globalNum = start + idx + 1;
    const saved = answers[q.id];
    return `
      <div class="question-card" id="card-${q.id}">
        <div class="q-title"><span class="q-num">${globalNum}.</span> ${q.text}</div>
        <div class="likert">
          ${LIKERT_OPTIONS.map(opt => `
            <label>
              <input type="radio" name="ans-${q.id}" value="${opt.val}" ${saved === opt.val ? "checked" : ""}
                onchange="selectAnswer('${q.id}', ${opt.val})" />
              <span>${opt.label}</span>
            </label>
          `).join("")}
        </div>
      </div>
    `;
  }).join("");

  document.getElementById("btn-prev").disabled = currentPage === 0;
  const isLast = currentPage === totalPages - 1;
  document.getElementById("btn-next").classList.toggle("hidden", isLast);
  document.getElementById("btn-finish").classList.toggle("hidden", !isLast);
}

function selectAnswer(qId, val) {
  answers[qId] = val;
  const card = document.getElementById(`card-${qId}`);
  if (card) card.classList.remove("unanswered-highlight");
  updateProgress();
}

function updateProgress() {
  const answeredCount = Object.keys(answers).length;
  const total = activeQuestions.length;
  const pct = Math.round((answeredCount / total) * 100);
  document.getElementById("progress-text").textContent = `Отвечено: ${answeredCount} из ${total} (${pct}%)`;
  document.getElementById("progress-fill").style.width = `${pct}%`;
}

function validateCurrentPage() {
  const start = currentPage * PAGE_SIZE;
  const slice = activeQuestions.slice(start, start + PAGE_SIZE);
  let firstMissing = null;

  slice.forEach(q => {
    const card = document.getElementById(`card-${q.id}`);
    if (!answers[q.id]) {
      card.classList.add("unanswered-highlight");
      if (!firstMissing) firstMissing = card;
    } else {
      card.classList.remove("unanswered-highlight");
    }
  });

  if (firstMissing) {
    const err = document.getElementById("test-error");
    err.textContent = "Пожалуйста, ответьте на все вопросы текущей страницы перед переходом дальше.";
    err.classList.remove("hidden");
    firstMissing.scrollIntoView({ behavior: "smooth", block: "center" });
    return false;
  }
  return true;
}

function nextPage() {
  if (!validateCurrentPage()) return;
  currentPage++;
  renderPage();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function prevPage() {
  if (currentPage > 0) {
    currentPage--;
    renderPage();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

function fillCurrentPageRandom() {
  const start = currentPage * PAGE_SIZE;
  const slice = activeQuestions.slice(start, start + PAGE_SIZE);
  slice.forEach(q => { answers[q.id] = Math.floor(Math.random() * 5) + 1; });
  renderPage();
}

function runDemoProfile() {
  if (!document.getElementById("userName").value.trim()) document.getElementById("userName").value = "Демо-профиль (Ученик)";
  if (!document.getElementById("userGroup").value.trim()) document.getElementById("userGroup").value = "9 «А» класс";
  viewingContext = { isTeacherView: false, studentId: null, resultId: null, studentName: "", className: "" };

  activeQuestions = buildQuestions("full");
  answers = {};
  const targetBias = { E: 4.1, A: 3.1, C: 2.1, N: 3.7, O: 4.4 };
  activeQuestions.forEach(q => {
    const base = targetBias[q.factor] + (Math.random() * 1.4 - 0.7);
    const clamped = Math.max(1, Math.min(5, Math.round(base)));
    answers[q.id] = q.reverse ? (6 - clamped) : clamped;
  });
  renderResultsUI({ skipDbSave: true });
}

async function finishTest() {
  if (!validateCurrentPage()) return;
  await renderResultsUI({ skipDbSave: false });
}

function resetToStart() {
  document.getElementById("screen-results").classList.add("hidden");
  document.getElementById("screen-test").classList.add("hidden");
  document.getElementById("section-student").classList.remove("hidden");
  document.getElementById("screen-start").classList.remove("hidden");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// =========================================================
// 4. SCORING & RESULTS RENDERING
// =========================================================
function getLevel(avg) {
  if (avg < 2.6) return { key: "low", label: "Низкий", badgeClass: "badge-low" };
  if (avg <= 3.4) return { key: "mid", label: "Средний", badgeClass: "badge-mid" };
  return { key: "high", label: "Высокий", badgeClass: "badge-high" };
}

function calculateProfile() {
  return FACTORS.map(f => {
    const fQuestions = activeQuestions.filter(q => q.factor === f.id);
    const facetMap = {};

    fQuestions.forEach(q => {
      const raw = answers[q.id] || 3;
      const score = q.reverse ? (6 - raw) : raw;
      if (!facetMap[q.facet]) facetMap[q.facet] = [];
      facetMap[q.facet].push(score);
    });

    const facets = Object.entries(facetMap).map(([name, scores]) => {
      const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
      return { name, avg: Number(avg.toFixed(2)), pct: Math.round(((avg - 1) / 4) * 100), level: getLevel(avg) };
    });

    const avg = facets.reduce((sum, fc) => sum + fc.avg, 0) / facets.length;
    const pct = Math.round(((avg - 1) / 4) * 100);
    const level = getLevel(avg);

    return { ...f, avg: Number(avg.toFixed(2)), pct, level, facets };
  });
}

async function renderResultsUI({ skipDbSave = false, savedPlan = null, customDate = null } = {}) {
  const profile = calculateProfile();
  lastProfile = profile;
  const map = Object.fromEntries(profile.map(p => [p.id, p]));

  const userName = viewingContext.isTeacherView
    ? viewingContext.studentName
    : (urlInvite.displayName || document.getElementById("userName").value.trim() || "Пользователь");

  const userGroup = viewingContext.isTeacherView
    ? viewingContext.className
    : (urlInvite.className || document.getElementById("userGroup").value.trim() || "Не указано");

  const dateStr = customDate
    ? new Date(customDate).toLocaleString("ru-RU", { dateStyle: "medium", timeStyle: "short" })
    : new Date().toLocaleDateString("ru-RU");

  document.getElementById("result-meta-line").textContent = `${userName} • ${userGroup} • ${dateStr}`;
  document.getElementById("chart-meta").textContent = `Профиль: ${userName} (${userGroup}), дата диагностики: ${dateStr}`;

  document.getElementById("factor-bars").innerHTML = profile.map(f => `
    <div class="bar-row">
      <div><strong>${f.name}</strong> <span class="muted-text">(${f.avg.toFixed(2)} / 5)</span></div>
      <div class="bar-track"><div class="bar-fill" style="width:${Math.max(5, f.pct)}%; background:${f.color};"></div></div>
      <div><span class="badge ${f.level.badgeClass}">${f.level.label} (${f.pct}%)</span></div>
    </div>
  `).join("");

  document.getElementById("table-1-body").innerHTML = profile.map(f => {
    const manifest = f.level.key === "high" ? f.highManifest : (f.level.key === "low" ? f.lowManifest : f.midManifest);
    const risk = f.level.key === "high" ? f.highRisk : (f.level.key === "low" ? f.lowRisk : f.midRisk);
    const sortedFacets = [...f.facets].sort((a, b) => b.avg - a.avg);
    const facetsHtml = `<ul class="facet-list">${sortedFacets.map(fc => {
      const mark = fc.level.key === "high" ? "▲" : (fc.level.key === "low" ? "▼" : "•");
      return `<li><strong>${fc.name}:</strong> ${fc.avg.toFixed(1)} (${fc.level.label}) ${mark}</li>`;
    }).join("")}</ul>`;

    return `
      <tr>
        <td><strong>${f.name}</strong><br><span class="muted-text" style="font-size:0.8rem;">${f.en}</span></td>
        <td><span class="badge ${f.level.badgeClass}">${f.level.label}</span><br><span style="font-size:0.85rem;">${f.avg.toFixed(2)} / 5 (${f.pct}%)</span></td>
        <td>${facetsHtml}</td>
        <td>${manifest}</td>
        <td>${risk}</td>
      </tr>
    `;
  }).join("");

  const derivedTop = deriveTop3(profile);
  const strengths = savedPlan?.top_strengths || derivedTop.strengths;
  const risks = savedPlan?.top_risks || derivedTop.risks;
  document.getElementById("table-2-body").innerHTML = [0, 1, 2].map(i => `
    <tr>
      <td><strong>${i + 1})</strong> <span contenteditable="true">${escapeHtml(strengths[i] || "")}</span></td>
      <td><strong>${i + 1})</strong> <span contenteditable="true">${escapeHtml(risks[i] || "")}</span></td>
    </tr>
  `).join("");

  const hypotheses = savedPlan?.hypotheses || buildHypotheses(map);
  document.getElementById("table-3-body").innerHTML = hypotheses.map(h => `
    <tr>
      <td><strong>${escapeHtml(h.component)}</strong></td>
      <td contenteditable="true">${escapeHtml(h.pros)}</td>
      <td contenteditable="true">${escapeHtml(h.cons)}</td>
    </tr>
  `).join("");

  document.getElementById("table-4-body").innerHTML = profile.map(f => {
    const highActive = f.level.key === "high" ? "cell-active" : "";
    const lowActive = f.level.key === "low" ? "cell-active" : "";
    return `
      <tr>
        <td>
          <strong>${f.name}</strong><br>
          <span class="badge ${f.level.badgeClass}" style="margin-top:4px;">${f.level.label} (${f.pct}%)</span>
          ${f.level.key === "mid" ? '<div class="muted-text" style="font-size:0.78rem; margin-top:4px;">Сбалансировано: берите приёмы по ситуации</div>' : ""}
        </td>
        <td class="${highActive}">${f.matrixHigh}</td>
        <td class="${lowActive}">${f.matrixLow}</td>
      </tr>
    `;
  }).join("");

  const planRows = savedPlan?.plan_rows || buildIndividualPlan(profile);
  document.getElementById("table-5-body").innerHTML = planRows.map(r => `
    <tr>
      <td contenteditable="true">${escapeHtml(r.goal)}</td>
      <td contenteditable="true">${escapeHtml(r.strategy)}</td>
      <td contenteditable="true">${escapeHtml(r.assessment)}</td>
      <td contenteditable="true">${escapeHtml(r.format)}</td>
      <td contenteditable="true">${escapeHtml(r.owner)}</td>
      <td contenteditable="true">${escapeHtml(r.timeline)}</td>
    </tr>
  `).join("");

  document.getElementById("presentation-summary").innerHTML = `
    <li><strong>Портрет по Big Five (2–3 наблюдения):</strong> ${buildPortraitLine(profile)}</li>
    <li><strong>Сильные стороны (ТОП-3) — как используем:</strong> ${strengths.map(escapeHtml).join("; ")}.</li>
    <li><strong>Зоны риска (ТОП-3) — что делаем:</strong> ${risks.map(escapeHtml).join("; ")}.</li>
    <li><strong>Индивидуальный план:</strong> главная цель — ${escapeHtml((planRows[0]?.goal || "").toLowerCase())}; метрика — ${escapeHtml((planRows[0]?.assessment || "").toLowerCase())}.</li>
    <li><strong>Запросы к классу / родителям / учителям:</strong> предсказуемые правила обратной связи, поддержка в выбранной роли, рефлексия прогресса каждые 2 недели.</li>
  `;

  document.getElementById("btn-back-to-dash").classList.toggle("hidden", !viewingContext.isTeacherView);
  document.getElementById("btn-save-plan").classList.toggle("hidden", !viewingContext.isTeacherView);
  document.getElementById("btn-retake").classList.toggle("hidden", viewingContext.isTeacherView);
  if (!viewingContext.isTeacherView) {
    document.getElementById("attempt-switcher-wrap").classList.add("hidden");
  }

  document.getElementById("screen-start").classList.add("hidden");
  document.getElementById("screen-test").classList.add("hidden");
  document.getElementById("section-teacher").classList.add("hidden");
  document.getElementById("screen-results").classList.remove("hidden");

  const banner = document.getElementById("save-status-banner");
  banner.classList.add("hidden");

  if (!skipDbSave && !viewingContext.isTeacherView) {
    const joinCode = urlInvite.classCode || document.getElementById("joinCode").value.trim();
    const studentToken = urlInvite.studentToken;

    if (sb && (joinCode || studentToken)) {
      banner.className = "alert alert-info no-print";
      banner.textContent = "Сохраняем результаты в облачную базу...";
      banner.classList.remove("hidden");

      try {
        const factorScoresObj = {};
        const facetScoresArr = [];
        profile.forEach(f => {
          factorScoresObj[f.id] = { avg: f.avg, pct: f.pct, level: f.level.label };
          f.facets.forEach(fc => facetScoresArr.push({ factor: f.id, name: fc.name, avg: fc.avg, level: fc.level.label }));
        });

        const mode = activeQuestions.length <= 30 ? "express" : "full";
        const { data, error } = await sb.rpc("submit_student_test", {
          p_join_code: joinCode || null,
          p_student_token: studentToken || null,
          p_display_name: userName,
          p_mode: mode,
          p_factor_scores: factorScoresObj,
          p_facet_scores: facetScoresArr,
          p_raw_answers: answers
        });

        if (error) throw error;
        banner.className = "alert alert-success no-print";
        banner.innerHTML = `✓ Результаты успешно сохранены и переданы педагогу (класс: <strong>${escapeHtml(data.class_name)}</strong>, имя: <strong>${escapeHtml(data.display_name)}</strong>).`;
      } catch (err) {
        banner.className = "alert alert-danger no-print";
        banner.textContent = `Не удалось сохранить в базу: ${err.message || err}. Вы всё равно можете скачать таблицы в .docx.`;
      }
    }
  }

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function deriveTop3(profile) {
  const allFacets = [];
  profile.forEach(f => {
    f.facets.forEach(fc => {
      const strengthScore = f.id === "N" ? (6 - fc.avg) : fc.avg;
      const riskScore = f.id === "N" ? fc.avg : (6 - fc.avg);
      allFacets.push({ factor: f.name, factorId: f.id, name: fc.name, avg: fc.avg, strengthScore, riskScore });
    });
  });

  const strengths = [...allFacets].sort((a, b) => b.strengthScore - a.strengthScore).slice(0, 3).map(item =>
    item.factorId === "N"
      ? `Эмоциональная устойчивость по шкале «${item.name}» (${item.avg.toFixed(1)} из 5 по нейротизму)`
      : `Выраженность аспекта «${item.name}» (${item.factor}, ${item.avg.toFixed(1)} из 5)`
  );

  const risks = [...allFacets].sort((a, b) => b.riskScore - a.riskScore).slice(0, 3).map(item => {
    if (item.factorId === "N") return `Повышенная чувствительность по шкале «${item.name}» (${item.avg.toFixed(1)} из 5)`;
    if (item.avg < 2.6) return `Низкий уровень аспекта «${item.name}» (${item.factor}, ${item.avg.toFixed(1)} из 5 — зона развития)`;
    return `Относительно невысокий показатель по шкале «${item.name}» (${item.factor}, ${item.avg.toFixed(1)} из 5)`;
  });

  return { strengths, risks };
}

function buildHypotheses(map) {
  const E = map.E.level.key, A = map.A.level.key, C = map.C.level.key, N = map.N.level.key, O = map.O.level.key;
  return [
    {
      component: "Атмосфера и благополучие",
      pros: [
        E === "high" ? "Привносит энергию, оптимизм и оживляет атмосферу в классе." : (E === "low" ? "Создаёт спокойный, уравновешенный фон, не провоцирует лишнюю суету." : "Поддерживает комфортный баланс активности и спокойствия."),
        A === "high" ? "Смягчает напряжённость, заботится о психологическом комфорте сверстников." : "",
        N === "low" ? "Помогает группе сохранять хладнокровие в напряжённые моменты." : ""
      ].filter(Boolean).join(" "),
      cons: [
        N === "high" ? "Высокая чувствительность к критике, стрессу и оценочным ситуациям; риск эмоционального выгорания." : "",
        E === "low" ? "Шумная, перегруженная стимулами обстановка быстро истощает ресурсы." : "",
        N === "low" && A === "low" ? "Может недооценивать эмоциональную уязвимость более чувствительных одноклассников." : ""
      ].filter(Boolean).join(" ") || "Существенных угроз психологическому благополучию не выявлено при соблюдении базовых правил поддержки."
    },
    {
      component: "Коммуникация и взаимодействие",
      pros: [
        E === "high" ? "Легко вступает в диалог, выступает спикером и инициирует обсуждения." : "Внимательно слушает, отвечает обдуманно, предпочитает содержательный диалог в малых группах.",
        A === "high" ? "Открыто сотрудничает, умеет сглаживать острые углы и слышать других." : "Даёт честную, прямую и аргументированную обратную связь без лести."
      ].join(" "),
      cons: [
        E === "high" ? "Риск перебивать более тихих участников и доминировать в обсуждении." : "Риск оставаться незамеченным на фронтальных опросах при нехватке времени на подготовку.",
        A === "low" ? "Прямолинейность и скепсис могут восприниматься одноклассниками как резкость." : (A === "high" ? "Трудно сказать «нет» и защитить свою позицию при давлении." : "")
      ].filter(Boolean).join(" ")
    },
    {
      component: "Проектная / групповая работа",
      pros: [
        O === "high" ? "Генерирует нестандартные идеи, видит межпредметные связи и творческие форматы продукта." : "Надёжно реализует проверенные практические шаги и конкретные задачи.",
        C === "high" ? "Структурирует этапы проекта, контролирует качество и сроки." : "Гибко реагирует на неожиданные изменения в проекте."
      ].join(" "),
      cons: [
        C === "low" ? "Риск срыва сроков и потери фокуса на многоэтапных задачах без чек-листов." : (C === "high" ? "Склонность к перфекционизму и переделкам в ущерб срокам." : ""),
        O === "high" ? "Скука при оформлении рутинных отчётов и работе по жёсткому шаблону." : (O === "low" ? "Трудности на старте открытых творческих проектов без образца." : "")
      ].filter(Boolean).join(" ")
    },
    {
      component: "Дисциплина и саморегуляция",
      pros: [
        C === "high" ? "Высокая самодисциплина, аккуратность, соблюдение правил и обдуманность действий." : "Высокая спонтанность в игровых и быстрых ситуациях; не зацикливается на формальностях.",
        N === "low" ? "Устойчивость к срывам и импульсивным вспышкам раздражения." : ""
      ].filter(Boolean).join(" "),
      cons: [
        C === "low" ? "Импульсивность, откладывание сложных дел, забывание деталей инструкции." : "",
        N === "high" ? "Под давлением времени возможны паника, раздражение или ступор при старте работы." : "",
        O === "high" ? "Склонность оспаривать формальные правила, если их смысл не объяснён." : ""
      ].filter(Boolean).join(" ") || "Саморегуляция в норме; важно поддерживать понятные критерии и посильный уровень сложности."
    }
  ];
}

function buildIndividualPlan(profile) {
  const candidates = profile.map(f => ({
    f,
    priority: f.id === "N" ? f.avg : (6 - f.avg)
  })).sort((a, b) => b.priority - a.priority);

  const mainRisk = candidates[0].f;
  const secondRisk = candidates[1].f;
  const mainStrength = [...profile].sort((a, b) => {
    const sA = a.id === "N" ? (6 - a.avg) : a.avg;
    const sB = b.id === "N" ? (6 - b.avg) : b.avg;
    return sB - sA;
  })[0];

  return [
    {
      goal: `Снизить риски по фактору «${mainRisk.name}» и развить адаптивные навыки`,
      strategy: mainRisk.id === "N" ? mainRisk.matrixHigh : (mainRisk.level.key === "high" ? mainRisk.matrixHigh : mainRisk.matrixLow),
      assessment: "Мини-опросники саморегуляции и учебной мотивации (до/после); наблюдательные листы",
      format: "Индивидуальная дорожная карта («learning contract»); короткие мастер-классы навыков",
      owner: "Учитель / классный руководитель, ученик",
      timeline: "Спринт 2 недели (промежуточная проверка через 7 дней)"
    },
    {
      goal: `Реализовать сильную сторону («${mainStrength.name}») в учебной и командной работе`,
      strategy: mainStrength.id === "N" ? mainStrength.matrixLow : mainStrength.matrixHigh,
      assessment: "Рубрики к продуктам проектной деятельности (роль, вклад, качество, сроки); взаимооценка «три звезды и пожелание»",
      format: "Парная и групповая работа с распределёнными ролями; проектные спринты 1–2 недели",
      owner: "Предметник, ученик, команда проекта",
      timeline: "В течение ближайшего проектного модуля (2–4 недели)"
    },
    {
      goal: `Укрепить саморегуляцию и взаимодействие (акцент: «${secondRisk.name}»)`,
      strategy: secondRisk.id === "N"
        ? (secondRisk.level.key === "low" ? secondRisk.matrixLow : secondRisk.matrixHigh)
        : (secondRisk.level.key === "high" ? secondRisk.matrixHigh : secondRisk.matrixLow),
      assessment: "Портфолио-артефакты: планы, черновики, рефлексивные заметки; короткие чек-листы самооценки",
      format: "Проектные спринты с чёткими критериями и ретроспективой; парная работа",
      owner: "Ученик, учитель, при необходимости — родители",
      timeline: "Еженедельная рефлексия в течение четверти"
    }
  ];
}

function buildPortraitLine(profile) {
  const sorted = [...profile].sort((a, b) => Math.abs(b.avg - 3) - Math.abs(a.avg - 3));
  const p1 = sorted[0], p2 = sorted[1];
  return `Наиболее ярко выражены черты по факторам «${p1.name}» (${p1.level.label.toLowerCase()}, ${p1.pct}%) и «${p2.name}» (${p2.level.label.toLowerCase()}, ${p2.pct}%). Остальные показатели формируют сбалансированную основу для обучения.`;
}

// =========================================================
// 5. TEACHER / PSYCHOLOGIST CABINET (SUPABASE RPC)
// =========================================================
async function handleTeacherLogin() {
  const errBox = document.getElementById("login-error");
  errBox.classList.add("hidden");

  if (!sb) {
    errBox.textContent = "Supabase не настроен. Вставьте URL и ANON_KEY в файл app.js.";
    errBox.classList.remove("hidden");
    return;
  }

  const username = document.getElementById("loginUsername").value.trim();
  const password = document.getElementById("loginPassword").value;
  if (!username || !password) {
    errBox.textContent = "Введите имя пользователя и пароль.";
    errBox.classList.remove("hidden");
    return;
  }

  try {
    const { data, error } = await sb.rpc("teacher_login", {
      p_username: username,
      p_password: password
    });
    if (error) throw error;

    teacherToken = data.token;
    localStorage.setItem(SESSION_STORAGE_KEY, teacherToken);
    document.getElementById("loginPassword").value = "";
    await loadDashboard();
  } catch (err) {
    errBox.textContent = err.message || "Ошибка авторизации";
    errBox.classList.remove("hidden");
  }
}

async function handleTeacherLogout() {
  if (sb && teacherToken) {
    await sb.rpc("teacher_logout", { p_token: teacherToken });
  }
  teacherToken = null;
  dashData = null;
  selectedClassId = null;
  localStorage.removeItem(SESSION_STORAGE_KEY);
  document.getElementById("teacher-dashboard").classList.add("hidden");
  document.getElementById("teacher-login-card").classList.remove("hidden");
}

async function loadDashboard() {
  if (!sb || !teacherToken) return;
  try {
    const { data, error } = await sb.rpc("teacher_get_dashboard", { p_token: teacherToken });
    if (error) throw error;

    dashData = data;
    document.getElementById("teacher-login-card").classList.add("hidden");
    document.getElementById("teacher-dashboard").classList.remove("hidden");
    renderDashboard();
  } catch (err) {
    console.warn(err);
    teacherToken = null;
    localStorage.removeItem(SESSION_STORAGE_KEY);
    document.getElementById("teacher-dashboard").classList.add("hidden");
    document.getElementById("teacher-login-card").classList.remove("hidden");
    const errBox = document.getElementById("login-error");
    errBox.textContent = err.message || "Сессия истекла. Войдите снова.";
    errBox.classList.remove("hidden");
  }
}

function renderDashboard() {
  const t = dashData.teacher;
  const isPsy = t.status === "психолог";
  const badge = isPsy
    ? `<span class="badge badge-psy">Статус: психолог (доступ ко всем классам)</span>`
    : `<span class="badge badge-teach">Статус: педагог (личные классы)</span>`;

  document.getElementById("dash-welcome").textContent = `${t.full_name} (@${t.username})`;
  document.getElementById("dash-role-line").innerHTML = badge;
  document.getElementById("classes-scope-hint").textContent = isPsy
    ? "Вы вошли со статусом «психолог» — отображаются все классы в базе данных."
    : "Вы видите классы, созданные вами.";

  const classes = dashData.classes || [];
  const pillsEl = document.getElementById("class-pills");
  document.getElementById("class-empty-hint").classList.toggle("hidden", classes.length > 0);

  if (classes.length && (!selectedClassId || !classes.some(c => c.id === selectedClassId))) {
    selectedClassId = classes[0].id;
  }

  pillsEl.innerHTML = classes.map(c => `
    <button class="class-pill ${c.id === selectedClassId ? "active" : ""}" onclick="selectClass('${c.id}')">
      ${escapeHtml(c.name)} ${c.is_active ? "" : "(закрыт)"}
      ${isPsy ? `<span style="opacity:0.75; font-weight:400;">(${escapeHtml(c.teacher_name)})</span>` : ""}
    </button>
  `).join("");

  const selectedPanel = document.getElementById("selected-class-panel");
  if (!classes.length || !selectedClassId) {
    selectedPanel.classList.add("hidden");
    return;
  }
  selectedPanel.classList.remove("hidden");

  const cls = classes.find(c => c.id === selectedClassId);
  const classStudents = (dashData.students || []).filter(s => s.class_id === cls.id);
  const resultsByStudent = {};
  (dashData.results || []).forEach(r => {
    if (!resultsByStudent[r.student_id]) resultsByStudent[r.student_id] = [];
    resultsByStudent[r.student_id].push(r);
  });

  const passedStudents = classStudents.filter(s => (resultsByStudent[s.id] || []).length > 0);

  document.getElementById("sel-class-title").textContent = `Класс: ${cls.name}`;
  document.getElementById("sel-class-meta").innerHTML = `Куратор: <strong>${escapeHtml(cls.teacher_name)}</strong> • Приём ответов: ${cls.is_active ? '<span style="color:var(--success);font-weight:700;">Открыт</span>' : '<span style="color:var(--danger);font-weight:700;">Закрыт</span>'}`;
  document.getElementById("stat-students").textContent = classStudents.length;
  document.getElementById("stat-passed").textContent = passedStudents.length;
  document.getElementById("stat-code").textContent = cls.join_code;
  document.getElementById("btn-toggle-class").textContent = cls.is_active ? "Закрыть приём ответов" : "Открыть приём ответов";

  renderClassProfile(cls, classStudents, resultsByStudent);
  renderStudentsTable(classStudents, resultsByStudent);
}

function selectClass(classId) {
  selectedClassId = classId;
  renderDashboard();
}

async function createNewClass() {
  const nameInput = document.getElementById("newClassName");
  const name = nameInput.value.trim();
  if (!name) return alert("Введите название класса или группы.");

  const randCode = "CL-" + Math.random().toString(36).substring(2, 6).toUpperCase();
  try {
    const { data, error } = await sb.rpc("teacher_create_class", {
      p_token: teacherToken,
      p_name: name,
      p_join_code: randCode
    });
    if (error) throw error;
    nameInput.value = "";
    selectedClassId = data.id;
    await loadDashboard();
  } catch (err) {
    alert("Ошибка создания класса: " + (err.message || err));
  }
}

async function toggleSelectedClass() {
  const cls = dashData.classes.find(c => c.id === selectedClassId);
  if (!cls) return;
  try {
    const { error } = await sb.rpc("teacher_toggle_class", {
      p_token: teacherToken,
      p_class_id: cls.id,
      p_is_active: !cls.is_active
    });
    if (error) throw error;
    await loadDashboard();
  } catch (err) {
    alert("Ошибка: " + (err.message || err));
  }
}

async function addStudentsBulk() {
  const raw = document.getElementById("bulkNames").value;
  const names = raw.split("\n").map(s => s.trim()).filter(Boolean);
  if (!names.length) return alert("Введите хотя бы одно имя.");

  try {
    const { error } = await sb.rpc("teacher_add_students", {
      p_token: teacherToken,
      p_class_id: selectedClassId,
      p_names: names
    });
    if (error) throw error;
    document.getElementById("bulkNames").value = "";
    document.getElementById("bulk-add-box").classList.add("hidden");
    await loadDashboard();
  } catch (err) {
    alert("Ошибка добавления: " + (err.message || err));
  }
}

async function deleteStudent(studentId, name) {
  if (!confirm(`Удалить ученика «${name}» и все его результаты?`)) return;
  try {
    const { error } = await sb.rpc("teacher_delete_student", {
      p_token: teacherToken,
      p_student_id: studentId
    });
    if (error) throw error;
    await loadDashboard();
  } catch (err) {
    alert("Ошибка удаления: " + (err.message || err));
  }
}

function getBaseUrl() {
  return window.location.origin + window.location.pathname;
}

function copyClassLink() {
  const cls = dashData.classes.find(c => c.id === selectedClassId);
  if (!cls) return;
  const url = `${getBaseUrl()}?class=${encodeURIComponent(cls.join_code)}`;
  navigator.clipboard.writeText(url).then(() => alert(`Ссылка для класса «${cls.name}» скопирована:\n${url}`));
}

function copyStudentLink(token, name) {
  const url = `${getBaseUrl()}?token=${encodeURIComponent(token)}`;
  navigator.clipboard.writeText(url).then(() => alert(`Персональная ссылка для «${name}» скопирована:\n${url}`));
}

function renderStudentsTable(students, resultsByStudent) {
  const tbody = document.getElementById("students-table-body");
  if (!students.length) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:var(--muted);">В классе пока нет тестируемых. Отправьте ученикам ссылку с кодом класса или добавьте список вручную.</td></tr>`;
    return;
  }

  tbody.innerHTML = students.map(s => {
    const resList = resultsByStudent[s.id] || [];
    const latest = resList[0];
    let dateCell = `<span class="muted-text">Ещё не проходил(а)</span>`;
    let briefCell = "—";

    if (latest) {
      dateCell = `${new Date(latest.created_at).toLocaleString("ru-RU", { dateStyle: "short", timeStyle: "short" })} <span class="hint">(${resList.length} зам.)</span>`;
      const fs = latest.factor_scores || {};
      briefCell = ["E", "A", "C", "N", "O"].map(k => {
        const val = fs[k]?.avg ?? "—";
        return `<strong>${k}:</strong> ${val}`;
      }).join(" • ");
    }

    return `
      <tr>
        <td><strong>${escapeHtml(s.display_name)}</strong></td>
        <td><button class="btn-outline btn-sm" onclick="copyStudentLink('${s.access_token}', '${escapeAttr(s.display_name)}')">Личная ссылка</button></td>
        <td>${dateCell}</td>
        <td style="font-size:0.84rem;">${briefCell}</td>
        <td>
          <div style="display:flex; gap:6px; flex-wrap:wrap;">
            ${latest ? `<button class="btn-primary btn-sm" onclick="openStudentResult('${s.id}', '${latest.id}')">Таблицы 1–5</button>` : ""}
            <button class="btn-danger btn-sm" onclick="deleteStudent('${s.id}', '${escapeAttr(s.display_name)}')">✕</button>
          </div>
        </td>
      </tr>
    `;
  }).join("");
}

function renderClassProfile(cls, students, resultsByStudent) {
  const container = document.getElementById("class-profile-content");
  const latestEntries = students
    .map(s => ({ student: s, result: (resultsByStudent[s.id] || [])[0] }))
    .filter(x => !!x.result);

  if (!latestEntries.length) {
    container.innerHTML = `<p class="hint">Как только хотя бы один ученик пройдёт тестирование, здесь появится сводный профиль класса.</p>`;
    return;
  }

  const agg = FACTORS.map(f => {
    const vals = latestEntries.map(x => Number(x.result.factor_scores?.[f.id]?.avg || 3));
    const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
    const pct = Math.round(((avg - 1) / 4) * 100);
    const highNames = latestEntries.filter(x => (x.result.factor_scores?.[f.id]?.avg || 3) > 3.4).map(x => x.student.display_name);
    const lowNames = latestEntries.filter(x => (x.result.factor_scores?.[f.id]?.avg || 3) < 2.6).map(x => x.student.display_name);
    const midCount = vals.length - highNames.length - lowNames.length;
    return { ...f, avg, pct, level: getLevel(avg), highNames, lowNames, midCount };
  });

  const barsHtml = `<div class="factor-bars">${agg.map(f => `
    <div class="bar-row">
      <div><strong>${f.name}</strong> <span class="muted-text">(ср. ${f.avg.toFixed(2)})</span></div>
      <div class="bar-track"><div class="bar-fill" style="width:${Math.max(5, f.pct)}%; background:${f.color};"></div></div>
      <div><span class="badge ${f.level.badgeClass}">${f.level.label} (${f.pct}%)</span></div>
    </div>
  `).join("")}</div>`;

  const tableHtml = `
    <div class="table-wrap" style="margin-top:16px;">
      <table class="res-table" id="class-agg-table">
        <thead>
          <tr>
            <th>Фактор</th>
            <th>Среднее по классу</th>
            <th>Высокий уровень (чел.)</th>
            <th>Средний (чел.)</th>
            <th>Низкий уровень (чел.)</th>
          </tr>
        </thead>
        <tbody>
          ${agg.map(f => `
            <tr>
              <td><strong>${f.name}</strong></td>
              <td>${f.avg.toFixed(2)} / 5 (${f.pct}%)</td>
              <td><strong>${f.highNames.length}</strong>${f.highNames.length ? `: ${f.highNames.map(escapeHtml).join(", ")}` : ""}</td>
              <td><strong>${f.midCount}</strong></td>
              <td><strong>${f.lowNames.length}</strong>${f.lowNames.length ? `: ${f.lowNames.map(escapeHtml).join(", ")}` : ""}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;

  container.innerHTML = barsHtml + tableHtml;
}

function openStudentResult(studentId, resultId) {
  const cls = dashData.classes.find(c => c.id === selectedClassId);
  const student = dashData.students.find(s => s.id === studentId);
  const studentResults = (dashData.results || []).filter(r => r.student_id === studentId);
  const targetResult = studentResults.find(r => r.id === resultId) || studentResults[0];
  if (!student || !targetResult) return;

  viewingContext = {
    isTeacherView: true,
    studentId,
    resultId: targetResult.id,
    studentName: student.display_name,
    className: cls ? cls.name : ""
  };

  const switcherWrap = document.getElementById("attempt-switcher-wrap");
  const switcher = document.getElementById("attempt-switcher");
  if (studentResults.length > 1) {
    switcherWrap.classList.remove("hidden");
    switcher.innerHTML = studentResults.map((r, i) => `
      <option value="${r.id}" ${r.id === targetResult.id ? "selected" : ""}>
        Замер #${studentResults.length - i} — ${new Date(r.created_at).toLocaleString("ru-RU", { dateStyle: "short", timeStyle: "short" })} (${r.mode === "full" ? "58 вопр." : "29 вопр."})
      </option>
    `).join("");
  } else {
    switcherWrap.classList.add("hidden");
  }

  activeQuestions = buildQuestions(targetResult.mode);
  answers = targetResult.raw_answers || {};
  const savedPlan = (dashData.plans || []).find(p => p.result_id === targetResult.id) || null;

  renderResultsUI({
    skipDbSave: true,
    savedPlan,
    customDate: targetResult.created_at
  });
}

function switchStudentAttempt(newResultId) {
  openStudentResult(viewingContext.studentId, newResultId);
}

function backToDashboard() {
  document.getElementById("screen-results").classList.add("hidden");
  document.getElementById("section-teacher").classList.remove("hidden");
  document.getElementById("teacher-dashboard").classList.remove("hidden");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

async function saveCurrentPlanToDb() {
  if (!sb || !teacherToken || !viewingContext.resultId) return;

  const t2Rows = Array.from(document.querySelectorAll("#table-2-body tr"));
  const top_strengths = t2Rows.map(tr => tr.children[0].querySelector("span").textContent.trim());
  const top_risks = t2Rows.map(tr => tr.children[1].querySelector("span").textContent.trim());

  const hypotheses = Array.from(document.querySelectorAll("#table-3-body tr")).map(tr => ({
    component: tr.children[0].textContent.trim(),
    pros: tr.children[1].textContent.trim(),
    cons: tr.children[2].textContent.trim()
  }));

  const plan_rows = Array.from(document.querySelectorAll("#table-5-body tr")).map(tr => ({
    goal: tr.children[0].textContent.trim(),
    strategy: tr.children[1].textContent.trim(),
    assessment: tr.children[2].textContent.trim(),
    format: tr.children[3].textContent.trim(),
    owner: tr.children[4].textContent.trim(),
    timeline: tr.children[5].textContent.trim()
  }));

  const banner = document.getElementById("save-status-banner");
  try {
    const { error } = await sb.rpc("teacher_save_support_plan", {
      p_token: teacherToken,
      p_result_id: viewingContext.resultId,
      p_top_strengths: top_strengths,
      p_top_risks: top_risks,
      p_hypotheses: hypotheses,
      p_plan_rows: plan_rows
    });
    if (error) throw error;

    const existingIdx = dashData.plans.findIndex(p => p.result_id === viewingContext.resultId);
    const updatedObj = { result_id: viewingContext.resultId, top_strengths, top_risks, hypotheses, plan_rows };
    if (existingIdx >= 0) dashData.plans[existingIdx] = updatedObj;
    else dashData.plans.push(updatedObj);

    banner.className = "alert alert-success no-print";
    banner.textContent = "✓ Правки индивидуального плана и таблиц сохранены в базу данных.";
    banner.classList.remove("hidden");
  } catch (err) {
    banner.className = "alert alert-danger no-print";
    banner.textContent = "Ошибка сохранения: " + (err.message || err);
    banner.classList.remove("hidden");
  }
}

// =========================================================
// 6. REAL .DOCX GENERATOR (OOXML + ZIP STORE)
// =========================================================
const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
    t[i] = c >>> 0;
  }
  return t;
})();

function crc32(bytes) {
  let c = 0xffffffff;
  for (let i = 0; i < bytes.length; i++) c = CRC_TABLE[(c ^ bytes[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function buildZip(files) {
  const enc = new TextEncoder();
  const localParts = [];
  const centralParts = [];
  let offset = 0;

  for (const file of files) {
    const nameBytes = enc.encode(file.name);
    const data = typeof file.data === "string" ? enc.encode(file.data) : file.data;
    const crc = crc32(data);

    const lh = new ArrayBuffer(30 + nameBytes.length);
    const lv = new DataView(lh);
    lv.setUint32(0, 0x04034b50, true);
    lv.setUint16(4, 20, true);
    lv.setUint16(6, 0, true);
    lv.setUint16(8, 0, true);
    lv.setUint16(10, 0, true);
    lv.setUint16(12, 0x5421, true);
    lv.setUint32(14, crc, true);
    lv.setUint32(18, data.length, true);
    lv.setUint32(22, data.length, true);
    lv.setUint16(26, nameBytes.length, true);
    lv.setUint16(28, 0, true);
    new Uint8Array(lh, 30).set(nameBytes);
    localParts.push(new Uint8Array(lh), data);

    const ch = new ArrayBuffer(46 + nameBytes.length);
    const cv = new DataView(ch);
    cv.setUint32(0, 0x02014b50, true);
    cv.setUint16(4, 20, true);
    cv.setUint16(6, 20, true);
    cv.setUint16(8, 0, true);
    cv.setUint16(10, 0, true);
    cv.setUint16(12, 0, true);
    cv.setUint16(14, 0x5421, true);
    cv.setUint32(16, crc, true);
    cv.setUint32(20, data.length, true);
    cv.setUint32(24, data.length, true);
    cv.setUint16(28, nameBytes.length, true);
    cv.setUint16(30, 0, true);
    cv.setUint16(32, 0, true);
    cv.setUint16(34, 0, true);
    cv.setUint16(36, 0, true);
    cv.setUint32(38, 0, true);
    cv.setUint32(42, offset, true);
    new Uint8Array(ch, 46).set(nameBytes);
    centralParts.push(new Uint8Array(ch));
    offset += 30 + nameBytes.length + data.length;
  }

  const cdSize = centralParts.reduce((s, a) => s + a.length, 0);
  const eocd = new ArrayBuffer(22);
  const ev = new DataView(eocd);
  ev.setUint32(0, 0x06054b50, true);
  ev.setUint16(4, 0, true);
  ev.setUint16(6, 0, true);
  ev.setUint16(8, files.length, true);
  ev.setUint16(10, files.length, true);
  ev.setUint32(12, cdSize, true);
  ev.setUint32(16, offset, true);
  ev.setUint16(20, 0, true);

  const all = [...localParts, ...centralParts, new Uint8Array(eocd)];
  const totalLen = all.reduce((s, a) => s + a.length, 0);
  const out = new Uint8Array(totalLen);
  let pos = 0;
  for (const part of all) {
    out.set(part, pos);
    pos += part.length;
  }
  return out;
}

function xmlEscape(str) {
  return String(str || "")
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function wParagraph(text, opts = {}) {
  const size = opts.size || 20;
  const bold = opts.bold ? "<w:b/>" : "";
  const color = opts.color ? `<w:color w:val="${opts.color}"/>` : "";
  const after = opts.after !== undefined ? opts.after : 80;
  const before = opts.before !== undefined ? opts.before : 0;
  return `<w:p><w:pPr><w:spacing w:before="${before}" w:after="${after}"/></w:pPr><w:r><w:rPr><w:rFonts w:ascii="Calibri" w:hAnsi="Calibri" w:cs="Calibri"/>${bold}${color}<w:sz w:val="${size}"/><w:szCs w:val="${size}"/></w:rPr><w:t xml:space="preserve">${xmlEscape(text)}</w:t></w:r></w:p>`;
}

function extractCellLines(cell) {
  const listItems = cell.querySelectorAll("li");
  if (listItems.length > 0) {
    return Array.from(listItems).map(li => "• " + li.textContent.replace(/\s+/g, " ").trim());
  }
  const clone = cell.cloneNode(true);
  clone.querySelectorAll("br").forEach(br => br.replaceWith("\n"));
  clone.querySelectorAll("div, p").forEach(el => el.prepend("\n"));
  const lines = clone.textContent.split("\n").map(s => s.replace(/\s+/g, " ").trim()).filter(Boolean);
  return lines.length ? lines : [""];
}

function domTableToWordXml(tableId, colWidths) {
  const table = document.getElementById(tableId);
  const gridCols = colWidths.map(w => `<w:gridCol w:w="${w}"/>`).join("");
  const totalW = colWidths.reduce((a, b) => a + b, 0);

  const rowsXml = Array.from(table.querySelectorAll("tr")).map((tr, rIdx) => {
    const isHeader = tr.parentElement.tagName.toLowerCase() === "thead";
    const cells = Array.from(tr.children);
    const cellsXml = cells.map((cell, cIdx) => {
      const w = colWidths[cIdx] || Math.floor(totalW / cells.length);
      const fill = isHeader
        ? "E2E8F0"
        : (cell.classList.contains("cell-active") ? "DBEAFE" : (rIdx % 2 === 1 ? "F8FAFC" : "FFFFFF"));
      const lines = extractCellLines(cell);
      const paragraphs = lines.map((line, lIdx) =>
        wParagraph(line, { size: 19, bold: isHeader, color: isHeader ? "0F172A" : "1E293B", after: lIdx === lines.length - 1 ? 40 : 30 })
      ).join("");
      return `<w:tc><w:tcPr><w:tcW w:w="${w}" w:type="dxa"/><w:shd w:val="clear" w:color="auto" w:fill="${fill}"/></w:tcPr>${paragraphs}</w:tc>`;
    }).join("");
    const trPr = isHeader ? "<w:trPr><w:tblHeader/></w:trPr>" : "";
    return `<w:tr>${trPr}${cellsXml}</w:tr>`;
  }).join("");

  return `<w:tbl><w:tblPr><w:tblW w:w="${totalW}" w:type="dxa"/><w:tblBorders><w:top w:val="single" w:sz="6" w:space="0" w:color="94A3B8"/><w:left w:val="single" w:sz="6" w:space="0" w:color="94A3B8"/><w:bottom w:val="single" w:sz="6" w:space="0" w:color="94A3B8"/><w:right w:val="single" w:sz="6" w:space="0" w:color="94A3B8"/><w:insideH w:val="single" w:sz="4" w:space="0" w:color="CBD5E1"/><w:insideV w:val="single" w:sz="4" w:space="0" w:color="CBD5E1"/></w:tblBorders><w:tblCellMar><w:top w:w="90" w:type="dxa"/><w:left w:w="110" w:type="dxa"/><w:bottom w:w="90" w:type="dxa"/><w:right w:w="110" w:type="dxa"/></w:tblCellMar></w:tblPr><w:tblGrid>${gridCols}</w:tblGrid>${rowsXml}</w:tbl>`;
}

function downloadDocxParts(parts, filename) {
  const documentXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
    ${parts.join("\n")}
    <w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1134" w:right="1134" w:bottom="1134" w:left="1134"/></w:sectPr>
  </w:body>
</w:document>`;

  const contentTypesXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-officedocument.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
</Types>`;

  const relsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`;

  const zipBytes = buildZip([
    { name: "[Content_Types].xml", data: contentTypesXml },
    { name: "_rels/.rels", data: relsXml },
    { name: "word/document.xml", data: documentXml }
  ]);

  const blob = new Blob([zipBytes], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function exportToDocx() {
  const metaText = document.getElementById("result-meta-line").textContent;
  const rawName = viewingContext.isTeacherView
    ? viewingContext.studentName
    : (urlInvite.displayName || document.getElementById("userName").value.trim() || "Профиль");
  const safeFileName = rawName.replace(/[^\p{L}\p{N}_-]+/gu, "_");

  const parts = [
    wParagraph("Профиль по модели Big Five и индивидуальный план сопровождения", { size: 30, bold: true, color: "1E3A8A", after: 80 }),
    wParagraph(metaText, { size: 21, color: "475569", after: 140 }),
    wParagraph("Сводные показатели по 5 факторам", { size: 24, bold: true, color: "1E3A8A", before: 80, after: 60 }),
    ...lastProfile.map(f => wParagraph(`• ${f.name}: ${f.level.label} — ${f.avg.toFixed(2)} из 5 (${f.pct}%)`, { size: 20, after: 40 })),
    wParagraph("Таблица 1. Сводные результаты по модели Big Five", { size: 24, bold: true, color: "1E3A8A", before: 180, after: 80 }),
    domTableToWordXml("table-1", [1550, 1350, 2738, 2000, 2000]),
    wParagraph("Таблица 2. ТОП-3 сильных качества и ТОП-3 зоны риска", { size: 24, bold: true, color: "1E3A8A", before: 200, after: 80 }),
    domTableToWordXml("table-2", [4819, 4819]),
    wParagraph("Таблица 3. Гипотезы о влиянии особенностей на учебную деятельность", { size: 24, bold: true, color: "1E3A8A", before: 200, after: 80 }),
    domTableToWordXml("table-3", [2038, 3800, 3800]),
    wParagraph("Таблица 4. Матрица стратегий 5Ф (выделены рекомендации под профиль)", { size: 24, bold: true, color: "1E3A8A", before: 200, after: 80 }),
    domTableToWordXml("table-4", [1938, 3850, 3850]),
    wParagraph("Таблица 5. Индивидуальный план сопровождения", { size: 24, bold: true, color: "1E3A8A", before: 200, after: 80 }),
    domTableToWordXml("table-5", [1650, 2100, 1650, 1650, 1294, 1294]),
    wParagraph("Черновик мини-презентации профиля (3–5 минут)", { size: 24, bold: true, color: "1E3A8A", before: 200, after: 80 }),
    ...Array.from(document.querySelectorAll("#presentation-summary li")).map((li, idx) =>
      wParagraph(`${idx + 1}. ${li.textContent.replace(/\s+/g, " ").trim()}`, { size: 20, after: 60 })
    ),
    wParagraph("Этическая ремарка: результаты теста — не ярлык и не приговор; используем их как гипотезы для педагогических решений и наблюдаем динамику.", { size: 19, color: "475569", before: 140, after: 60 })
  ];

  downloadDocxParts(parts, `BigFive_${safeFileName}.docx`);
}

function exportClassProfileDocx() {
  const cls = dashData?.classes.find(c => c.id === selectedClassId);
  const tbl = document.getElementById("class-agg-table");
  if (!cls || !tbl) return alert("Сначала дождитесь результатов хотя бы одного ученика в классе.");

  const safeClass = cls.name.replace(/[^\p{L}\p{N}_-]+/gu, "_");
  const parts = [
    wParagraph(`Сводный профиль класса: ${cls.name}`, { size: 30, bold: true, color: "1E3A8A", after: 80 }),
    wParagraph(`Куратор: ${cls.teacher_name} | Дата выгрузки: ${new Date().toLocaleDateString("ru-RU")}`, { size: 21, color: "475569", after: 160 }),
    domTableToWordXml("class-agg-table", [2100, 1800, 2300, 1138, 2300]),
    wParagraph("Этическая ремарка: результаты теста — не ярлык и не приговор; используем их как гипотезы для педагогических решений и наблюдаем динамику.", { size: 19, color: "475569", before: 160, after: 60 })
  ];
  downloadDocxParts(parts, `ClassProfile_${safeClass}.docx`);
}

function escapeHtml(str) {
  return String(str || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function escapeAttr(str) {
  return String(str || "").replace(/'/g, "\\'").replace(/"/g, "&quot;");
}