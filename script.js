// Scroll event listener for the address bar
window.addEventListener("scroll", function () {
  const addressBar = document.getElementById("address");
  const scrollTrigger = 100;

  if (window.scrollY >= scrollTrigger) {
    addressBar.classList.add("scrolled");
  } else {
    addressBar.classList.remove("scrolled");
  }
});

// Scroll event listener for the actual section (with scrolling effect)
window.addEventListener("scroll", function () {
  const actual = document.getElementById("actual");
  const scrollTrigger = 700;

  if (window.scrollY >= scrollTrigger) {
    actual.classList.add("scroller");
  } else {
    actual.classList.remove("scroller");
  }
});

// Intersection Observer to trigger the pop-up effect for last-section
const lastSection = document.getElementById("last-section");
const popUpObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("pop-up");
    } else {
      entry.target.classList.remove("pop-up");
    }
  });
}, { threshold: 0.5 });

if (lastSection) {
  popUpObserver.observe(lastSection);
}

// Function to add a new task to the list
function add() {
  const input = document.getElementById("inputt");
  const value = input.value.trim();
  if (value === "") return;

  const box = document.createElement("div");
  box.className = "item-box slide-in";
  box.innerHTML = `
    <span>${value}</span>
    <button onclick="editTask(this)">✏️</button>
    <button onclick="if(confirm('Are you sure?')) { this.parentElement.remove(); saveTasks(); }">&#10060;</button>
  `;
  document.getElementById("display").appendChild(box);
  input.value = "";
  saveTasks();
}

// Dark Mode Toggle function
function mode() {
  const body = document.body;
  const button = document.querySelector("#about > button");
  body.classList.toggle("dark-mode");
  button.textContent = body.classList.contains("dark-mode") ? "Light Mode" : "Dark Mode";
}

// Function to edit a task
function editTask(button) {
  const span = button.parentElement.querySelector("span");
  const isEditing = span.isContentEditable;

  if (isEditing) {
    span.contentEditable = "false";
    button.innerHTML = "✏️";
    saveTasks();
  } else {
    span.contentEditable = "true";
    span.focus();
    button.innerHTML = "💾"; // Save button
  }
}

// Save tasks to localStorage
function saveTasks() {
  const tasks = [];
  document.querySelectorAll("#display .item-box").forEach(box => {
    const task = box.querySelector("span").textContent;
    tasks.push({ task });
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Load saved tasks from localStorage on page load
window.addEventListener("load", function () {
  const saved = JSON.parse(localStorage.getItem("tasks")) || [];
  saved.forEach(item => {
    const box = document.createElement("div");
    box.className = "item-box slide-in";
    box.innerHTML = `
      <span>${item.task}</span>
      <button onclick="editTask(this)">✏️</button>
      <button onclick="if(confirm('Are you sure?')) { this.parentElement.remove(); saveTasks(); }">&#10060;</button>
    `;
    document.getElementById("display").appendChild(box);
  });
});

// Search tasks function
function searchTasks() {
  const query = document.getElementById("search").value.toLowerCase();
  const tasks = document.querySelectorAll("#display .item-box");
  tasks.forEach(box => {
    const text = box.querySelector("span").textContent.toLowerCase();
    box.style.display = text.includes(query) ? "flex" : "none";
  });
}

// Smooth scroll to the top section
function scrollToSection() {
  document.getElementById("app-head").scrollIntoView({ behavior: "smooth" });
}

// Function to type text letter by letter
function typeText(text, element, delay = 100) {
  element.textContent = ""; // Clear the initial text
  let index = 0;
  const interval = setInterval(() => {
    element.textContent += text.charAt(index);
    index++;
    if (index === text.length) clearInterval(interval);
  }, delay);
}

// Intersection Observer for typing animation
const typingObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && entry.target.textContent === "") {
        const originalText = entry.target.getAttribute("data-text"); // Get the original text stored in data attribute
        typeText(originalText, entry.target); // Apply typing effect
        observer.unobserve(entry.target); // Trigger only once
      }
    });
  },
  { threshold: 0.6 } // Trigger when 60% of the element is in view
);

// Select all `h2` elements on the page
const h2Elements = document.querySelectorAll("h2");

// Loop through each `h2` element and apply the typing effect
h2Elements.forEach(h2 => {
  const originalText = h2.textContent; // Get the original text content
  h2.setAttribute("data-text", originalText); // Store it in data-text attribute
  h2.textContent = ""; // Clear the element's text content
  typingObserver.observe(h2); // Start observing the `h2` element
});
