const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);


/* =========================
   GLOBAL STATE
========================= */

const state = {
  guests: 2,
  roomPrice: 28000,
  roomName: "Desert Suite",
  extras: 0,
  nights: 1
};


/* =========================
   NAVIGATION
========================= */

function scrollToSection(id){
  document.getElementById(id)?.scrollIntoView({
    behavior:"smooth"
  });

  $("#mobileMenu")?.classList.remove("show");
}

window.addEventListener("scroll", () => {
  $("#nav")?.classList.toggle("scrolled", window.scrollY > 40);
});


/* =========================
   MOBILE MENU
========================= */

$("#menuBtn")?.addEventListener("click", () => {
  $("#mobileMenu").classList.toggle("show");
});

$$(".mobile-menu a").forEach(link => {
  link.addEventListener("click", () => {
    $("#mobileMenu").classList.remove("show");
  });
});


/* =========================
   TOAST
========================= */

let toastTimer;

function showToast(message){

  const toast = $("#toast");

  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2200);
}


/* =========================
   ROOM SELECTION
========================= */

function selectRoom(name, price){

  state.roomName = name;
  state.roomPrice = price;

  $("#roomSelect").value = price;

  updateEstimate();

  scrollToSection("booking");

  showToast(name + " selected");
}


/* =========================
   GUEST CONTROL
========================= */

function changeGuests(amount){

  state.guests += amount;

  if(state.guests < 1){
    state.guests = 1;
  }

  if(state.guests > 8){
    state.guests = 8;
    showToast("Maximum 8 guests");
  }

  $("#guestCount").textContent = state.guests;

  updateEstimate();
}


/* =========================
   DATE SETUP
========================= */

const today = new Date();

const tomorrow = new Date(today);
tomorrow.setDate(today.getDate() + 1);

const dayAfter = new Date(today);
dayAfter.setDate(today.getDate() + 2);

function formatDate(date){

  return date.toISOString().split("T")[0];

}

$("#checkin").min = formatDate(today);
$("#checkin").value = formatDate(tomorrow);

$("#checkout").min = formatDate(dayAfter);
$("#checkout").value = formatDate(dayAfter);


/* =========================
   NIGHT CALCULATOR
========================= */

function calculateNights(){

  const checkin = $("#checkin").value;
  const checkout = $("#checkout").value;

  if(!checkin || !checkout){
    return 1;
  }

  const start = new Date(checkin);
  const end = new Date(checkout);

  const difference =
    (end - start) / (1000 * 60 * 60 * 24);

  return Math.max(1, difference);
}


/* =========================
   ROOM SELECT
========================= */

$("#roomSelect")?.addEventListener("change", function(){

  state.roomPrice = Number(this.value);

  state.roomName =
    this.options[this.selectedIndex].text.split(" — ")[0];

  updateEstimate();

});


/* =========================
   DATE EVENTS
========================= */

$("#checkin")?.addEventListener("change", () => {

  const checkin = new Date($("#checkin").value);

  const nextDay = new Date(checkin);

  nextDay.setDate(checkin.getDate() + 1);

  $("#checkout").min = formatDate(nextDay);

  if(new Date($("#checkout").value) <= checkin){
    $("#checkout").value = formatDate(nextDay);
  }

  updateEstimate();

});


$("#checkout")?.addEventListener("change", updateEstimate);


/* =========================
   EXTRAS
========================= */

$$(".extra").forEach(extra => {

  extra.addEventListener("click", () => {

    extra.classList.toggle("active");

    state.extras =
      [...$$(".extra.active")]
      .reduce((sum, item) => {
        return sum + Number(item.dataset.price);
      }, 0);

    updateEstimate();

  });

});


/* =========================
   LIVE ESTIMATE
========================= */

function updateEstimate(){

  state.nights = calculateNights();

  const roomTotal =
    state.roomPrice * state.nights;

  const extraTotal =
    state.extras * state.nights;

  const service =
    Math.round((roomTotal + extraTotal) * 0.10);

  const total =
    roomTotal + extraTotal + service;


  $("#estimateRoom").textContent =
    state.roomName;

  $("#estimateGuests").textContent =
    state.guests + (state.guests === 1 ? " guest" : " guests");


  const checkin = $("#checkin").value;
  const checkout = $("#checkout").value;

  if(checkin && checkout){

    $("#estimateDates").textContent =
      `${checkin} → ${checkout} · ${state.nights} night${state.nights > 1 ? "s" : ""}`;

  }


  $("#roomPrice").textContent =
    money(roomTotal);

  $("#extrasPrice").textContent =
    money(extraTotal);

  $("#servicePrice").textContent =
    money(service);

  $("#totalPrice").textContent =
    money(total);
}


/* =========================
   MONEY FORMAT
========================= */

function money(value){

  return "₹" +
    Number(value).toLocaleString("en-IN");

}


/* =========================
   RESERVATION
========================= */

function startReservation(){

  updateEstimate();

  $("#reservationModal").classList.add("show");

}


function confirmReservation(){

  const name = $("#guestName").value.trim();
  const email = $("#guestEmail").value.trim();

  if(!name){

    showToast("Please enter your name");

    return;
  }

  if(!email || !email.includes("@")){

    showToast("Enter a valid email");

    return;
  }


  closeModal("reservationModal");

  $("#successText").textContent =
    `Thank you ${name}. Your request for ${state.roomName} has been captured. Estimated stay: ${money(getTotal())}.`;

  $("#successModal").classList.add("show");

}


function getTotal(){

  const roomTotal =
    state.roomPrice * state.nights;

  const extraTotal =
    state.extras * state.nights;

  const service =
    Math.round((roomTotal + extraTotal) * .10);

  return roomTotal + extraTotal + service;

}


/* =========================
   MODALS
========================= */

function closeModal(id){

  document.getElementById(id)?.classList.remove("show");

}


$$(".modal").forEach(modal => {

  modal.addEventListener("click", event => {

    if(event.target === modal){
      modal.classList.remove("show");
    }

  });

});


document.addEventListener("keydown", event => {

  if(event.key === "Escape"){

    $$(".modal.show").forEach(modal => {
      modal.classList.remove("show");
    });

  }

});


/* =========================
   GALLERY
========================= */

function openGallery(title){

  const modal = $("#galleryModal");

  $("#galleryTitle").textContent = title;

  const image = $("#galleryModalImage");

  const backgrounds = {

    "Arrival":
      "linear-gradient(145deg,#9a8059,#29241c)",

    "The Courtyard":
      "linear-gradient(145deg,#7e8a6b,#272d23)",

    "Pool":
      "linear-gradient(145deg,#567484,#18242a)",

    "Dinner":
      "linear-gradient(145deg,#7c5b43,#241814)",

    "The Suite":
      "linear-gradient(145deg,#a38c6a,#332a20)"
  };

  image.style.background =
    backgrounds[title] ||
    backgrounds["Arrival"];

  modal.classList.add("show");

}


/* =========================
   INITIAL UPDATE
========================= */

updateEstimate();


/* =========================
   SMALL UX POLISH
========================= */

document.querySelectorAll("a[href^='#']").forEach(link => {

  link.addEventListener("click", event => {

    const target =
      document.querySelector(link.getAttribute("href"));

    if(target){

      event.preventDefault();

      target.scrollIntoView({
        behavior:"smooth"
      });

    }

  });

});
