// element toggle function
const elementToggleFunc = function (elem) { elem.classList.toggle("active"); }


// sidebar variables
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

// sidebar toggle functionality for mobile
sidebarBtn.addEventListener("click", function () { elementToggleFunc(sidebar); });

// testimonials variables
const testimonialsItem = document.querySelectorAll("[data-testimonials-item]");
const modalContainer = document.querySelector("[data-modal-container]");
const modalCloseBtn = document.querySelector("[data-modal-close-btn]");
const overlay = document.querySelector("[data-overlay]");

// modal variable
const modalImg = document.querySelector("[data-modal-img]");
const modalTitle = document.querySelector("[data-modal-title]");
const modalText = document.querySelector("[data-modal-text]");

// modal toggle function
const testimonialsModalFunc = function () {
  modalContainer.classList.toggle("active");
  overlay.classList.toggle("active");
}

// add click event to all modal items
for (let i = 0; i < testimonialsItem.length; i++) {

  testimonialsItem[i].addEventListener("click", function () {

    modalImg.src = this.querySelector("[data-testimonials-avatar]").src;
    modalImg.alt = this.querySelector("[data-testimonials-avatar]").alt;
    modalTitle.innerHTML = this.querySelector("[data-testimonials-title]").innerHTML;
    modalText.innerHTML = this.querySelector("[data-testimonials-text]").innerHTML;

    testimonialsModalFunc();

  });

}

// add click event to modal close button
modalCloseBtn.addEventListener("click", testimonialsModalFunc);
overlay.addEventListener("click", testimonialsModalFunc);



// custom select variables
const select = document.querySelector("[data-select]");
const selectItems = document.querySelectorAll("[data-select-item]");
const selectValue = document.querySelector("[data-selecct-value]");
const filterBtn = document.querySelectorAll("[data-filter-btn]");

select.addEventListener("click", function () { elementToggleFunc(this); });

// add event in all select items
for (let i = 0; i < selectItems.length; i++) {
  selectItems[i].addEventListener("click", function () {

    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    elementToggleFunc(select);
    filterFunc(selectedValue);

  });
}

// filter variables
const filterItems = document.querySelectorAll("[data-filter-item]");

const filterFunc = function (selectedValue) {

  for (let i = 0; i < filterItems.length; i++) {

    if (selectedValue === "all") {
      filterItems[i].classList.add("active");
    } else if (selectedValue === filterItems[i].dataset.category) {
      filterItems[i].classList.add("active");
    } else {
      filterItems[i].classList.remove("active");
    }

  }

}

// add event in all filter button items for large screen
let lastClickedBtn = filterBtn[0];

for (let i = 0; i < filterBtn.length; i++) {

  filterBtn[i].addEventListener("click", function () {

    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    filterFunc(selectedValue);

    lastClickedBtn.classList.remove("active");
    this.classList.add("active");
    lastClickedBtn = this;

  });

}



// contact form variables
const forms = document.querySelectorAll("[data-form]");

forms.forEach(form => {
  const formInputs = form.querySelectorAll("[data-form-input]");
  const formBtn = form.querySelector("[data-form-btn]");

  // add event to all form input fields
  formInputs.forEach(input => {
    input.addEventListener("input", () => {
      // check form validation
      if (form.checkValidity()) {
        formBtn.removeAttribute("disabled");
      } else {
        formBtn.setAttribute("disabled", "");
      }
    });
  });
});



// page navigation variables
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

// add event to all nav link
for (let i = 0; i < navigationLinks.length; i++) {
  navigationLinks[i].addEventListener("click", function () {

    for (let i = 0; i < pages.length; i++) {
      if (this.innerHTML.toLowerCase() === pages[i].dataset.page) {
        pages[i].classList.add("active");
        navigationLinks[i].classList.add("active");
        window.scrollTo(0, 0);
      } else {
        pages[i].classList.remove("active");
        navigationLinks[i].classList.remove("active");
      }
    }

  });
}


document.addEventListener("DOMContentLoaded", function() {
  const navLinks = document.querySelectorAll(".navbar-link");

  navLinks.forEach(link => {
    link.addEventListener("click", function() {
      // Remove "active" class from all links
      navLinks.forEach(navLink => {
        navLink.classList.remove("active");
      });

      // Add "active" class to the clicked link
      this.classList.add("active");

      // Save the selected tab ID in localStorage
      const selectedTabId = this.id;
      localStorage.setItem("selectedTab", selectedTabId);
    });
  });

  // Check if there's a selected tab in localStorage and highlight it.
  const selectedTabId = localStorage.getItem("selectedTab");
  if (selectedTabId) {
    const selectedTab = document.getElementById(selectedTabId);
    if (selectedTab) {
      selectedTab.classList.add("active");
    }
  }
});

document.addEventListener('DOMContentLoaded', function() {
  // Stripe initialization
  fetch('https://portfolio-app-1-ba5193e0d8bf.herokuapp.com/full-stack-stripe-key')
    .then(response => response.json())
    .then(data => {
      const stripe = Stripe(data.fullStackPublishableKey);

      // Handle Stripe checkout buttons (basic and universal packages)
      const stripeButtons = ['checkout-button-basic', 'checkout-button-universal'];
      stripeButtons.forEach(buttonId => {
        document.getElementById(buttonId)?.addEventListener('click', function () {
          let packageType = buttonId.split('-')[2];
          fetch('https://portfolio-app-1-ba5193e0d8bf.herokuapp.com/create-checkout-session', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ packageType: packageType })
          })
          .then(function (response) {
            return response.json();
          })
          .then(function (session) {
            return stripe.redirectToCheckout({ sessionId: session.id });
          })
          .catch(function (error) {
            console.error('Error:', error);
          });
        });
      });
    });

  // Custom Package Calendly Integration
  const customPackageBtn = document.getElementById('custom-package-btn');

  customPackageBtn?.addEventListener('click', function(e) {
    e.preventDefault();
    // Open Calendly in a new tab
    window.open('https://calendly.com/nicklopacki/30min', '_blank');
  });
});

// Chat widget functionality
document.addEventListener('DOMContentLoaded', function() {
  const chatWidget = document.getElementById('chatWidget');
  const chatToggle = document.getElementById('chatToggle');
  const chatForm = document.getElementById('chatForm');
  const chatInput = document.getElementById('chatInput');
  const chatMessages = document.getElementById('chatMessages');

  // Toggle chat widget
  chatToggle.addEventListener('click', () => {
    chatWidget.classList.toggle('active');
  });

  // Auto-resize input
  chatInput.addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = (this.scrollHeight) + 'px';
  });

  // Handle chat submission
  chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const message = chatInput.value.trim();
    if (!message) return;

    // Add user message
    appendMessage('user', message);
    chatInput.value = '';
    chatInput.style.height = 'auto';

    // Show loading state
    const loadingMessage = appendMessage('assistant', '...');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message })
      });

      const data = await response.json();
      
      // Replace loading message with response
      loadingMessage.querySelector('p').textContent = data.response;
    } catch (error) {
      console.error('Chat error:', error);
      loadingMessage.querySelector('p').textContent = 'Sorry, there was an error processing your message.';
    }

    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
  });

  function appendMessage(role, content) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${role}`;
    messageDiv.innerHTML = `<p>${content}</p>`;
    chatMessages.appendChild(messageDiv);
    return messageDiv;
  }
});

async function handleXRPPayment(packageType, amount) {
    const modal = document.createElement('div');
    modal.className = 'custom-package-modal active';
    modal.innerHTML = `
      <div class="custom-package-form-modal">
        <button class="modal-close-btn" onclick="this.parentElement.parentElement.remove()">
          <ion-icon name="close-outline"></ion-icon>
        </button>
        <h3 class="form-title">XRP Payment Details</h3>
        <div class="xrp-payment-container">
          <p>Please send XRP to this address:</p>
          <div class="xrp-payment-details">
            <p>rNte4z4XTJCFuBePU7hoUjCyYJpDvouGSz</p>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);

}
