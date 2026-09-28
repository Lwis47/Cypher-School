const progressKey = "cypher-school-progress";

const getProgress = () => {
  try {
    return JSON.parse(localStorage.getItem(progressKey)) || {};
  } catch {
    return {};
  }
};

const saveProgress = (progress) => {
  localStorage.setItem(progressKey, JSON.stringify(progress));
};

const updateProgressUi = () => {
  const progress = getProgress();
  const completed = Object.values(progress).filter(Boolean).length;
  const percentage = Math.min(100, Math.round((completed / 4) * 100));

  document.querySelectorAll("[data-progress-value]").forEach((element) => {
    element.textContent = `${percentage}%`;
  });

  document.querySelectorAll("[data-progress-bar]").forEach((element) => {
    element.style.width = `${percentage}%`;
  });

  document.querySelectorAll("[data-progress-count]").forEach((element) => {
    element.textContent = `${completed} of 4 lessons complete`;
  });
};

const setupMobileNavigation = () => {
  const nav = document.querySelector("nav");
  const navWrap = document.querySelector(".nav-wrap");
  if (!nav || !navWrap || nav.querySelector(".nav-toggle")) return;

  const toggle = document.createElement("button");
  toggle.className = "nav-toggle";
  toggle.type = "button";
  toggle.setAttribute("aria-expanded", "false");
  toggle.setAttribute("aria-label", "Toggle navigation");
  toggle.textContent = "Menu";
  navWrap.insertBefore(toggle, nav);

  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });
};

const setupCourseFilter = () => {
  const filter = document.querySelector("[data-course-filter]");
  const cards = document.querySelectorAll("[data-course-card]");
  const emptyState = document.querySelector("[data-course-empty]");
  if (!filter || !cards.length) return;

  filter.addEventListener("input", () => {
    const query = filter.value.trim().toLowerCase();
    let visibleCards = 0;

    cards.forEach((card) => {
      const matches = card.textContent.toLowerCase().includes(query);
      card.hidden = !matches;
      if (matches) visibleCards += 1;
    });

    if (emptyState) emptyState.hidden = visibleCards > 0;
  });
};

const setupLessonCompletion = () => {
  const button = document.querySelector("[data-complete-lesson]");
  if (!button) return;

  const lessonId = button.dataset.completeLesson;
  const progress = getProgress();
  const render = () => {
    const complete = Boolean(getProgress()[lessonId]);
    button.textContent = complete ? "Lesson completed" : "Mark lesson complete";
    button.classList.toggle("is-complete", complete);
    button.setAttribute("aria-pressed", String(complete));
  };

  button.addEventListener("click", () => {
    const nextProgress = getProgress();
    nextProgress[lessonId] = !nextProgress[lessonId];
    saveProgress(nextProgress);
    render();
    updateProgressUi();
  });

  if (progress[lessonId]) render();
};

const setupFormFeedback = () => {
  document.querySelectorAll("form[data-feedback-target]").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const target = document.querySelector(form.dataset.feedbackTarget);
      if (target) target.style.display = "flex";
      form.reset();
    });
  });
};

setupMobileNavigation();
setupCourseFilter();
setupLessonCompletion();
setupFormFeedback();
updateProgressUi();
