$(function () {
  
  setTimeout(function () { $("#pageLoader").addClass("done"); }, 650);

  
  function onScroll() {
    const y = $(window).scrollTop();
    $("#siteNav").toggleClass("scrolled", y > 35);
    $("#backToTop").toggleClass("show", y > 450);
  }
  $(window).on("scroll", onScroll);
  onScroll();
  $("#backToTop").on("click", () => $("html, body").animate({ scrollTop: 0 }, 650));

  
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

  
  $('a.nav-link[href^="#"]').on("click", function () {
    $(".navbar-collapse").collapse("hide");
    $(".nav-link").removeClass("active");
    $(this).addClass("active");
  });
  const sections = document.querySelectorAll("main section[id]");
  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        $(".nav-link").removeClass("active");
        $('.nav-link[href="#' + id + '"]').addClass("active");
      }
    });
  }, { rootMargin: "-35% 0px -55% 0px" });
  sections.forEach(section => navObserver.observe(section));

  
  $(".filter-btn").on("click", function () {
    const filter = $(this).data("filter");
    $(".filter-btn").removeClass("active");
    $(this).addClass("active");
    $(".menu-card-wrap").each(function () {
      const show = filter === "all" || $(this).data("category") === filter;
      $(this).toggleClass("hidden", !show);
      if (show) $(this).find(".menu-card").css("animation", "none").hide().fadeIn(260);
    });
  });

  
  let toastTimer;
  function toast(message) {
    $("#toastMessage").text(message).addClass("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => $("#toastMessage").removeClass("show"), 2400);
  }

  
  let cart = [];
  function renderCart() {
    const count = cart.reduce((sum, item) => sum + item.qty, 0);
    const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    $("#cartCount").text(count);
    $("#cartTotal").text("$" + total.toFixed(2));
    if (!cart.length) {
      $("#cartItems").html('<p class="empty-cart">Your bag is waiting for something delicious.</p>');
      return;
    }
    $("#cartItems").html(cart.map((item, index) =>
      `<div class="cart-row"><div><b>${item.name}</b><small>Qty: ${item.qty} × $${item.price.toFixed(2)}</small></div><div><b>$${(item.qty * item.price).toFixed(2)}</b><button class="remove-item" data-index="${index}" aria-label="Remove ${item.name}"><i class="bi bi-trash3"></i></button></div></div>`
    ).join(""));
  }
  function addToCart(name, price) {
    const found = cart.find(item => item.name === name);
    if (found) found.qty++;
    else cart.push({ name, price: Number(price), qty: 1 });
    renderCart();
    toast(name + " added to your bag!");
  }
  $(".add-cart, .quick-add").on("click", function () {
    addToCart($(this).data("name"), $(this).data("price"));
  });
  $("#cartItems").on("click", ".remove-item", function () {
    cart.splice(Number($(this).data("index")), 1);
    renderCart();
  });
  function openCart() { $("#cartPanel").addClass("open"); $("#cartBackdrop").addClass("show"); $("body").css("overflow", "hidden"); }
  function closeCart() { $("#cartPanel").removeClass("open"); $("#cartBackdrop").removeClass("show"); $("body").css("overflow", ""); }
  $(".cart-toggle").on("click", openCart);
  $("#closeCart, #cartBackdrop").on("click", closeCart);
  $("#checkoutBtn").on("click", function () {
    if (!cart.length) return toast("Add a dish to your bag first.");
    toast("Demo checkout: connect a backend to place real orders.");
  });


  $(".hero-dots span").on("click", function () {
    $(".hero-dots span").removeClass("active");
    $(this).addClass("active");
    $(".hero-title").css("animation", "none");
    setTimeout(() => $(".hero-title").css("animation", ""), 10);
  });

  const today = new Date();
  const localDate = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().split("T")[0];
  $('input[name="date"]').attr("min", localDate);
  $("#reservationForm").on("submit", function (event) {
    event.preventDefault();
    if (!this.checkValidity()) { this.reportValidity(); return; }
    const name = $('input[name="name"]').val().trim();
    $("#reservationMessage").text("Thanks, " + name + "! Your demo request is ready. Connect PHP/backend to save bookings.");
    this.reset();
    $('input[name="date"]').attr("min", localDate);
  });

  
  $("#contactForm").on("submit", function (event) {
    event.preventDefault();
    if (!this.checkValidity()) { this.reportValidity(); return; }
    $("#contactMessage").text("Thanks for reaching out! This demo form is ready to connect to a backend.");
    this.reset();
  });

  
  $("#newsletterForm").on("submit", function (event) {
    event.preventDefault();
    const email = $(this).find('input[type="email"]').val();
    $("#newsletterMessage").text("Thanks! " + email + " has been added in this demo.");
    this.reset();
  });

  $(".search-toggle").on("click", function () {
    const query = window.prompt("What are you craving? Try pizza, burger, pasta or drinks.");
    if (!query) return;
    const q = query.toLowerCase();
    const found = $(".menu-card-wrap").filter(function () {
      return $(this).text().toLowerCase().includes(q);
    });
    if (found.length) {
      $(".filter-btn").removeClass("active");
      $('.filter-btn[data-filter="all"]').addClass("active");
      $(".menu-card-wrap").removeClass("hidden");
      $("html, body").animate({ scrollTop: $("#menu").offset().top - 85 }, 600);
      found.addClass("search-highlight");
      setTimeout(() => found.removeClass("search-highlight"), 1500);
    } else toast("No matching dish found in this sample menu.");
  });
});
