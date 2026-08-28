/* =========================================
   AURELIA V2
   INTERACTIONS
========================================= */


/* LOADER */

window.addEventListener("load", () => {

  const loader = document.getElementById("loader");

  setTimeout(() => {
    loader.classList.add("hidden");
  }, 1500);

});


/* HEADER */

const header = document.getElementById("header");

function updateHeader() {

  if (window.scrollY > 50) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }

}

window.addEventListener(
  "scroll",
  updateHeader,
  { passive: true }
);

updateHeader();


/* MOBILE MENU */

const menuToggle =
  document.getElementById("menuToggle");

const nav =
  document.getElementById("nav");

function closeMenu() {

  menuToggle.classList.remove("active");
  nav.classList.remove("active");
  document.body.classList.remove("menu-open");

}

menuToggle.addEventListener("click", () => {

  menuToggle.classList.toggle("active");
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


/* SMOOTH SCROLL */

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

        const offset =
          header.offsetHeight;

        const targetTop =
          target.getBoundingClientRect().top +
          window.scrollY -
          offset;

        window.scrollTo({
          top: targetTop,
          behavior: "smooth"
        });

      }
    );

  });


/* HERO MOUSE PARALLAX */

const heroImage =
  document.querySelector(".hero-image");

if (heroImage && window.innerWidth > 800) {

  window.addEventListener(
    "mousemove",
    event => {

      const x =
        (event.clientX / window.innerWidth) - .5;

      const y =
        (event.clientY / window.innerHeight) - .5;

      heroImage.style.transform =
        `scale(1.08) translate(${x * -7}px, ${y * -7}px)`;

    }
  );

}


/* RESIDENCE TILT */

const residenceCards =
  document.querySelectorAll(".residence-card");

residenceCards.forEach(card => {

  const image =
    card.querySelector(".residence-image");

  card.addEventListener(
    "mousemove",
    event => {

      if (window.innerWidth <= 800) {
        return;
      }

      const rect =
        card.getBoundingClientRect();

      const x =
        ((event.clientX - rect.left) / rect.width) - .5;

      const y =
        ((event.clientY - rect.top) / rect.height) - .5;

      image.style.transform =
        `perspective(1000px)
         rotateX(${y * -1.5}deg)
         rotateY(${x * 1.5}deg)`;

    }
  );

  card.addEventListener(
    "mouseleave",
    () => {
      image.style.transform = "";
    }
  );

});


/* GALLERY POINTER */

const galleryItems =
  document.querySelectorAll(".gallery-item");

galleryItems.forEach(item => {

  item.addEventListener(
    "mousemove",
    event => {

      if (window.innerWidth <= 800) {
        return;
      }

      const rect =
        item.getBoundingClientRect();

      const x =
        ((event.clientX - rect.left) / rect.width) - .5;

      const y =
        ((event.clientY - rect.top) / rect.height) - .5;

      item.style.transform =
        `translate(${x * 4}px, ${y * 4}px)`;

    }
  );

  item.addEventListener(
    "mouseleave",
    () => {
      item.style.transform = "";
    }
  );

});


/* BOOKING */

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


/* SCROLL REVEAL */

const revealElements =
  document.querySelectorAll(
    ".section-number, .section-heading > div:last-child, .intro-main, .residence-card, .experience-row, .story-image, .story-main, .gallery-item, .dining-visual, .dining-copy, .reservation-inner, .location-main"
  );


revealElements.forEach(
  element => {

    element.style.opacity = "0";

    element.style.transform =
      "translateY(30px)";

    element.style.transition =
      "opacity .9s ease, transform .9s cubic-bezier(.2,.7,.2,1)";

  }
);


const revealObserver =
  new IntersectionObserver(
    entries => {

      entries.forEach(
        entry => {

          if (!entry.isIntersecting) {
            return;
          }

          entry.target.style.opacity = "1";

          entry.target.style.transform =
            "translateY(0)";

          revealObserver.unobserve(
            entry.target
          );

        }
      );

    },
    {
      threshold: .1
    }
  );


revealElements.forEach(
  element => {
    revealObserver.observe(element);
  }
);


/* ACTIVE NAV */

const navLinks =
  document.querySelectorAll(".nav a");

const sections =
  document.querySelectorAll(
    "main section[id]"
  );


const sectionObserver =
  new IntersectionObserver(
    entries => {

      entries.forEach(
        entry => {

          if (!entry.isIntersecting) {
            return;
          }

          navLinks.forEach(
            link => {
              link.classList.remove("active");
            }
          );

          const activeLink =
            document.querySelector(
              `.nav a[href="#${entry.target.id}"]`
            );

          if (activeLink) {
            activeLink.classList.add("active");
          }

        }
      );

    },
    {
      rootMargin: "-35% 0px -55% 0px"
    }
  );


sections.forEach(
  section => {
    sectionObserver.observe(section);
  }
);


/* CURSOR */

if (window.innerWidth > 1000) {

  const cursor =
    document.createElement("div");

  cursor.className =
    "aurelia-cursor";

  document.body.appendChild(cursor);


  const cursorCSS =
    document.createElement("style");

  cursorCSS.textContent = `
    .aurelia-cursor {
      position: fixed;
      z-index: 9998;
      width: 7px;
      height: 7px;
      border: 1px solid #bda477;
      border-radius: 50%;
      pointer-events: none;
      transform: translate(-50%, -50%);
      transition:
        width .25s ease,
        height .25s ease,
        background .25s ease;
    }

    .aurelia-cursor.large {
      width: 34px;
      height: 34px;
      background: rgba(189,164,119,.08);
    }
  `;

  document.head.appendChild(cursorCSS);


  window.addEventListener(
    "mousemove",
    event => {

      cursor.style.left =
        `${event.clientX}px`;

      cursor.style.top =
        `${event.clientY}px`;

    }
  );


  document
    .querySelectorAll(
      "a, button, .residence-card, .gallery-item"
    )
    .forEach(item => {

      item.addEventListener(
        "mouseenter",
        () => {
          cursor.classList.add("large");
        }
      );

      item.addEventListener(
        "mouseleave",
        () => {
          cursor.classList.remove("large");
        }
      );

    });

}


/* DATE FORMATTING HELPER */

function formatDate(value) {

  if (!value) {
    return "";
  }

  const date =
    new Date(value + "T00:00:00");

  return date.toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric"
    }
  );

}


/* CONSOLE BRANDING */

console.log(
  "%c AURELIA V2 ",
  "background:#bda477;color:#10100e;padding:8px 14px;font-family:serif;font-size:16px;"
);

console.log(
  "Private Retreat — Portfolio Demo"
);

