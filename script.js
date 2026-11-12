document.addEventListener("DOMContentLoaded", () => {
  // 1. Mobile Hamburger Navigation Toggle
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("navLinks");

  if (hamburger && navLinks) {
    hamburger.addEventListener("click", () => {
      navLinks.classList.toggle("active");
    });
  }

  // 2. Gallery Category Filter (for gallery.html)
  const filterBtns = document.querySelectorAll(".filter-btn");
  const galleryItems = document.querySelectorAll(".gallery-item");

  if (filterBtns.length > 0) {
    filterBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        filterBtns.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");

        const filter = btn.getAttribute("data-filter");

        galleryItems.forEach((item) => {
          const category = item.getAttribute("data-category");
          if (filter === "all" || category === filter) {
            item.style.display = "block";
          } else {
            item.style.display = "none";
          }
        });
      });
    });
  }

  // 3. Gallery Lightbox Preview Modal (for gallery.html)
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  const lightboxCaption = document.getElementById("lightboxCaption");
  const lightboxClose = document.getElementById("lightboxClose");

  if (lightbox && galleryItems.length > 0) {
    galleryItems.forEach((item) => {
      item.addEventListener("click", () => {
        const img = item.querySelector("img");
        const title = item.querySelector("h4").textContent;
        lightboxImg.src = img.src;
        lightboxCaption.textContent = title;
        lightbox.classList.add("open");
      });
    });

    lightboxClose.addEventListener("click", () => {
      lightbox.classList.remove("open");
    });

    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) {
        lightbox.classList.remove("open");
      }
    });
  }

  // 4. Contact Form Client-Side Validation (for contact.html)
  const inquiryForm = document.getElementById("inquiryForm");
  const formFeedback = document.getElementById("formFeedback");

  if (inquiryForm) {
    inquiryForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const fullName = document.getElementById("fullName").value.trim();
      const contactInput = document.getElementById("contactInput").value.trim();
      const serviceType = document.getElementById("serviceType").value;
      const message = document.getElementById("message").value.trim();

      if (!fullName || !contactInput || !serviceType || !message) {
        formFeedback.style.color = "#C0392B";
        formFeedback.textContent = "Please complete all required fields before sending your inquiry.";
        return;
      }

      formFeedback.style.color = "#1E8449";
      formFeedback.textContent = `Thank you, ${fullName}! Your inquiry for ${serviceType} has been recorded. Gina's Photo & Video Services will reach out to you shortly.`;
      inquiryForm.reset();
    });
  }
});
