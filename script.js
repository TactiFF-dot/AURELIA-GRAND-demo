
/* =========================================
   LOADER
========================================= */

window.addEventListener("load", () => {

  const loader = document.getElementById("loader");

  setTimeout(() => {
    loader.classList.add("hidden");
  }, 1600);

});


/* =========================================
   HEADER
========================================= */

const header = document.getElementById("header");

function handleHeader() {

  header.classList.toggle(
    "scrolled",
    window.scrollY > 40
  );

}

window.addEventListener(
  "scroll",
  handleHeader,
  { passive: true }
);

handleHeader();


/* =========================================
   MOBILE MENU
========================================= */

const menuBtn =
  document.getElementById("menuBtn");

const nav =
  document.getElementById("nav");

function closeMenu() {

  menuBtn.classList.remove("active");
  nav.classList.remove("active");
  document.body.classList.remove("menu-open");

}

menuBtn.addEventListener("click", () => {

  menuBtn.classList.toggle("active");
  nav.classList.toggle("active");
  document.body.classList.toggle("menu-open");

});

document
  .querySelectorAll(".nav a")
  .forEach(link => {

    link.addEventListener(
      "click",
      closeMenu
    );

  });

document.addEventListener(
  "keydown",
  event => {

    if (event.key === "Escape") {
      closeMenu();
    }

  }
);


/* =========================================
   HERO PARALLAX
========================================= */

const heroBg =
  document.querySelector(".hero-bg");

window.addEventListener(
  "mousemove",
  event => {

    if (window.innerWidth <= 700) {
      return;
    }

    const x =
      (event.clientX / window.innerWidth - .5);

    const y =
      (event.clientY / window.innerHeight - .5);

    heroBg.style.transform =
      `scale(1.08) translate(${x * -8}px, ${y * -8}px)`;

  }
);


/* =========================================
   SUITE HOVER PARALLAX
========================================= */

const suiteCards =
  document.querySelectorAll(".suite-card");

suiteCards.forEach(card => {

  const visual =
    card.querySelector(".suite-visual");

  card.addEventListener(
    "mousemove",
    event => {

      if (window.innerWidth <= 700) {
        return;
      }

      const rect =
        card.getBoundingClientRect();

      const x =
        (event.clientX - rect.left) / rect.width - .5;

      const y =
        (event.clientY - rect.top) / rect.height - .5;

      visual.style.transform =
        `perspective(900px)
         rotateX(${y * -2}deg)
         rotateY(${x * 2}deg)`;

    }
  );

  card.addEventListener(
    "mouseleave",
    () => {
      visual.style.transform = "";
    }
  );

});


/* =========================================
   GALLERY HOVER
========================================= */

const galleryCards =
  document.querySelectorAll(".gallery-card");

galleryCards.forEach(card => {

  card.addEventListener(
    "mousemove",
    event => {

      if (window.innerWidth <= 700) {
        return;
      }

      const rect =
        card.getBoundingClientRect();

      const x =
        event.clientX - rect.left;

      const y =
        event.clientY - rect.top;

      card.style.setProperty(
        "--mx",
        `${x}px`
      );

      card.style.setProperty(
        "--my",
        `${y}px`
      );

    }
  );

});


/* =========================================
   BOOKING FORM
========================================= */

const bookingForm =
  document.getElementById("bookingForm");

const arrival =
  document.getElementById("arrival");

const departure =
  document.getElementById("departure");

const guests =
  document.getElementById("guests");

const bookingMessage =
  document.getElementById("bookingMessage");


/* Prevent past dates */

const today =
  new Date().toISOString().split("T")[0];

arrival.min = today;
departure.min = today;


arrival.addEventListener(
  "change",
  () => {

    departure.min =
      arrival.value || today;

    if (
      departure.value &&
      departure.value <= arrival.value
    ) {
      departure.value = "";
    }

  }
);


bookingForm.addEventListener(
  "submit",
  event => {

    event.preventDefault();

    if (!arrival.value || !departure.value) {
      bookingMessage.textContent =
        "Please select your arrival and departure dates.";
      return;
    }

    if (departure.value <= arrival.value) {
      bookingMessage.textContent =
        "Departure must be after arrival.";
      return;
    }

    const guestCount =
      guests.value;

    bookingMessage.textContent =
      `Availability request prepared for ${guestCount} guest${guestCount > 1 ? "s" : ""}. Our reservations team will contact you shortly.`;

  }
);


/* =========================================
   SCROLL REVEAL
========================================= */

const revealElements =
  document.querySelectorAll(
    ".section-label, .section-head, .suite-card, .experience-item, .story-content, .gallery-card, .dining-content, .reservation-inner, .location-content"
  );


revealElements.forEach(element => {

  element.style.opacity = "0";
  element.style.transform =
    "translateY(28px)";
  element.style.transition =
    "opacity .9s ease, transform .9s cubic-bezier(.2,.7,.2,1)";

});


const revealObserver =
  new IntersectionObserver(
    entries => {

      entries.forEach(entry => {

        if (!entry.isIntersecting) {
          return;
        }

        entry.target.style.opacity = "1";
        entry.target.style.transform =
          "translateY(0)";

        revealObserver.unobserve(
          entry.target
        );

      });

    },
    {
      threshold: .12
    }
  );


revealElements.forEach(element => {
  revealObserver.observe(element);
});


/* =========================================
   ACTIVE NAV
========================================= */

const navLinks =
  document.querySelectorAll(".nav a");

const sections =
  document.querySelectorAll("main section[id]");


const sectionObserver =
  new IntersectionObserver(
    entries => {

      entries.forEach(entry => {

        if (!entry.isIntersecting) {
          return;
        }

        navLinks.forEach(link => {
          link.classList.remove("active");
        });

        const current =
          document.querySelector(
            `.nav a[href="#${entry.target.id}"]`
          );

        if (current) {
          current.classList.add("active");
        }

      });

    },
    {
      threshold: .25
    }
  );


sections.forEach(section => {
  sectionObserver.observe(section);
});


/* =========================================
   SMOOTH ANCHOR SCROLL
========================================= */

document
  .querySelectorAll('a[href^="#"]')
  .forEach(link => {

    link.addEventListener(
      "click",
      event => {

        const id =
          link.getAttribute("href");

        if (!id || id === "#") {
          return;
        }

        const target =
          document.querySelector(id);

        if (!target) {
          return;
        }

        event.preventDefault();

        const headerHeight =
          header.offsetHeight;

        const top =
          target.getBoundingClientRect().top +
          window.scrollY -
          headerHeight;

        window.scrollTo({
          top,
          behavior: "smooth"
        });

      }
    );

  });


/* =========================================
   IMAGE-LIKE CURSOR EFFECT
========================================= */

if (window.innerWidth > 900) {

  const cursor =
    document.createElement("div");

  cursor.className =
    "aurelia-cursor";

  document.body.appendChild(cursor);

  const cursorStyle =
    document.createElement("style");

  cursorStyle.textContent = `
    .aurelia-cursor {
      position: fixed;
      z-index: 9998;
      width: 8px;
      height: 8px;
      border: 1px solid #bda77b;
      border-radius: 50%;
      pointer-events: none;
      transform: translate(-50%, -50%);
      transition:
        width .25s ease,
        height .25s ease,
        background .25s ease;
    }

    .aurelia-cursor.cursor-large {
      width: 38px;
      height: 38px;
      background: rgba(189,167,123,.08);
    }
  `;

  document.head.appendChild(cursorStyle);

  window.addEventListener(
    "mousemove",
    event => {

      cursor.style.left =
        `${event.clientX}px`;

      cursor.style.top =
        `${event.clientY}px`;

    }
  );

  const interactive =
    document.querySelectorAll(
      "a, button, .suite-card, .gallery-card"
    );

  interactive.forEach(item => {

    item.addEventListener(
      "mouseenter",
      () => {
        cursor.classList.add(
          "cursor-large"
        );
      }
    );

    item.addEventListener(
      "mouseleave",
      () => {
        cursor.classList.remove(
          "cursor-large"
        );
      }
    );

  });

}

