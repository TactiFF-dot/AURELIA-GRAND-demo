/* =========================================
   AURELIA GRAND
   Main interaction layer
========================================= */

const navbar = document.getElementById("navbar");
const menuBtn = document.getElementById("menuBtn");
const mobileMenu = document.getElementById("mobileMenu");
const toast = document.getElementById("toast");
const modal = document.getElementById("availabilityModal");

const checkin = document.getElementById("checkin");
const checkout = document.getElementById("checkout");
const guests = document.getElementById("guests");

const summaryCheckin = document.getElementById("summaryCheckin");
const summaryCheckout = document.getElementById("summaryCheckout");
const summaryGuests = document.getElementById("summaryGuests");


/* =========================================
   NAVBAR
========================================= */

window.addEventListener("scroll", () => {

  if (window.scrollY > 30) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }

});


/* =========================================
   MOBILE MENU
========================================= */

menuBtn.addEventListener("click", () => {

  mobileMenu.classList.toggle("open");

});


document.querySelectorAll(".mobile-menu a").forEach(link => {

  link.addEventListener("click", () => {

    mobileMenu.classList.remove("open");

  });

});


/* =========================================
   SMOOTH SCROLL
========================================= */

function scrollToBooking(){

  document
    .getElementById("booking")
    .scrollIntoView({
      behavior:"smooth",
      block:"center"
    });

}


/* =========================================
   DATE SETUP
========================================= */

const today = new Date();

const tomorrow = new Date(today);
tomorrow.setDate(today.getDate() + 1);

const afterTomorrow = new Date(today);
afterTomorrow.setDate(today.getDate() + 2);


function formatDate(date){

  return date.toISOString().split("T")[0];

}


checkin.min = formatDate(today);
checkout.min = formatDate(tomorrow);

checkin.value = formatDate(tomorrow);
checkout.value = formatDate(afterTomorrow);


/* =========================================
   DATE RELATION
========================================= */

checkin.addEventListener("change", () => {

  const selected = new Date(checkin.value);

  const nextDay = new Date(selected);
  nextDay.setDate(selected.getDate() + 1);

  checkout.min = formatDate(nextDay);

  if (
    !checkout.value ||
    new Date(checkout.value) <= selected
  ){

    checkout.value = formatDate(nextDay);

  }

});


/* =========================================
   CHECK AVAILABILITY
========================================= */

function checkAvailability(){

  if (!checkin.value || !checkout.value){

    showToast("Select your dates first");

    return;

  }

  const inDate = new Date(checkin.value);
  const outDate = new Date(checkout.value);

  if (outDate <= inDate){

    showToast("Check-out must be after check-in");

    return;

  }

  summaryCheckin.textContent =
    formatReadableDate(checkin.value);

  summaryCheckout.textContent =
    formatReadableDate(checkout.value);

  summaryGuests.textContent =
    `${guests.value} Guest${guests.value === "1" ? "" : "s"}`;

  modal.classList.add("show");

  document.body.classList.add("modal-open");

}


/* =========================================
   DATE DISPLAY
========================================= */

function formatReadableDate(value){

  const date = new Date(value + "T00:00:00");

  return date.toLocaleDateString(
    "en-IN",
    {
      day:"numeric",
      month:"short",
      year:"numeric"
    }
  );

}


/* =========================================
   MODAL
========================================= */

function closeModal(){

  modal.classList.remove("show");

  document.body.classList.remove("modal-open");

}


modal.addEventListener("click", event => {

  if (event.target === modal){

    closeModal();

  }

});


document.addEventListener("keydown", event => {

  if (event.key === "Escape"){

    closeModal();

  }

});


/* =========================================
   ROOM SELECTION
========================================= */

function selectRoom(roomName, price){

  showToast(
    `${roomName} selected · From ₹${price.toLocaleString("en-IN")}`
  );

  scrollToBooking();

}


/* =========================================
   RESERVATION CONTINUE
========================================= */

function continueReservation(){

  closeModal();

  showToast(
    "Reservation studio coming in the next build"
  );

}


/* =========================================
   TOAST
========================================= */

let toastTimer;

function showToast(message){

  toast.textContent = message;

  toast.classList.add("show");

  clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {

    toast.classList.remove("show");

  }, 2200);

}


/* =========================================
   REVEAL ON SCROLL
========================================= */

const revealElements =
  document.querySelectorAll(
    ".section-label, .intro-copy, .room-card, .experience-card, .feature-copy, .wellness-item"
  );


const observer =
  new IntersectionObserver(
    entries => {

      entries.forEach(entry => {

        if (entry.isIntersecting){

          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";

          observer.unobserve(entry.target);

        }

      });

    },
    {
      threshold:.12
    }
  );


revealElements.forEach(element => {

  element.style.opacity = "0";
  element.style.transform = "translateY(18px)";
  element.style.transition =
    "opacity .7s ease, transform .7s ease";

  observer.observe(element);

});
