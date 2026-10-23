
/* =========================
   1. ПОДГОТОВКА САЙТА
========================= */

document.documentElement.classList.add("js-ready");


/* =========================
   2. МОБИЛЬНОЕ МЕНЮ
========================= */

const menuToggle = document.querySelector("#menu-toggle");
const navigation = document.querySelector("#navigation");

function closeMenu() {
    if (!menuToggle || !navigation) return;

    menuToggle.classList.remove("is-active");
    navigation.classList.remove("is-open");
    document.body.classList.remove("menu-open");

    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Открыть меню");
}

if (menuToggle && navigation) {
    menuToggle.addEventListener("click", () => {
        const isOpen = navigation.classList.toggle("is-open");

        menuToggle.classList.toggle("is-active", isOpen);
        document.body.classList.toggle("menu-open", isOpen);

        menuToggle.setAttribute("aria-expanded", String(isOpen));
        menuToggle.setAttribute(
            "aria-label",
            isOpen ? "Закрыть меню" : "Открыть меню"
        );
    });

    navigation.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeMenu();
        }
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 760) {
            closeMenu();
        }
    });
}


/* =========================
   3. ФИЛЬТРАЦИЯ ПРОЕКТОВ
========================= */

const filterButtons = document.querySelectorAll(".filter-button");
const projectCards = document.querySelectorAll(".project-card");

filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const selectedCategory = button.dataset.filter;

        // Обновляем активную кнопку
        filterButtons.forEach((filterButton) => {
            const isActive = filterButton === button;

            filterButton.classList.toggle("is-active", isActive);
            filterButton.setAttribute("aria-pressed", String(isActive));
        });

        // Показываем проекты выбранной категории
        projectCards.forEach((card) => {
            const category = card.dataset.category;

            const shouldShow =
                selectedCategory === "all" ||
                category === selectedCategory;

            card.classList.toggle("is-hidden", !shouldShow);
        });
    });
});


/* =========================
   4. АНИМАЦИЯ ПОЯВЛЕНИЯ
========================= */

const revealElements = document.querySelectorAll(
    ".section-heading, .about__text, .skills-card, " +
    ".project-card, .service-card, .contacts__box"
);

revealElements.forEach((element) => {
    element.classList.add("reveal");
});

if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.12,
            rootMargin: "0px 0px -30px 0px"
        }
    );

    revealElements.forEach((element) => {
        revealObserver.observe(element);
    });
} else {
    // Резервный вариант для старых браузеров
    revealElements.forEach((element) => {
        element.classList.add("is-visible");
    });
}


/* =========================
   5. КОПИРОВАНИЕ TELEGRAM
========================= */

const copyButton = document.querySelector("#copy-telegram");
const copyStatus = document.querySelector("#copy-status");

async function copyText(text) {
    // Современный способ копирования
    if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return;
    }

    // Запасной способ для локального просмотра
    const temporaryInput = document.createElement("textarea");

    temporaryInput.value = text;
    temporaryInput.setAttribute("readonly", "");
    temporaryInput.style.position = "fixed";
    temporaryInput.style.opacity = "0";

    document.body.appendChild(temporaryInput);
    temporaryInput.select();

    const copied = document.execCommand("copy");

    temporaryInput.remove();

    if (!copied) {
        throw new Error("Не удалось скопировать ссылку");
    }
}

if (copyButton && copyStatus) {
    copyButton.addEventListener("click", async () => {
        const textToCopy = copyButton.dataset.copy;

        try {
            await copyText(textToCopy);

            copyStatus.textContent = "Ссылка скопирована!";
        } catch (error) {
            copyStatus.textContent =
                "Не получилось скопировать. Ссылка: " + textToCopy;
        }
    });
}


/* =========================
   6. АВТОМАТИЧЕСКИЙ ГОД
========================= */

const yearElement = document.querySelector("#current-year");

if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
}


/* =========================
   7. ПОДСВЕТКА АКТИВНОГО РАЗДЕЛА
========================= */

const pageSections = document.querySelectorAll(
    "main section[id]"
);

const navigationLinks = document.querySelectorAll(
    '.navigation a[href^="#"]'
);

if ("IntersectionObserver" in window && pageSections.length > 0) {
    const sectionObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;

                navigationLinks.forEach((link) => {
                    const isCurrent =
                        link.getAttribute("href") ===
                        `#${entry.target.id}`;

                    link.classList.toggle("is-current", isCurrent);

                    if (isCurrent) {
                        link.setAttribute("aria-current", "location");
                    } else {
                        link.removeAttribute("aria-current");
                    }
                });
            });
        },
        {
            rootMargin: "-25% 0px -60% 0px"
        }
    );

    pageSections.forEach((section) => {
        sectionObserver.observe(section);
    });
}
