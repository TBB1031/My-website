document.getElementById('contact-form').addEventListener('submit', function (e) {
  e.preventDefault();

  const response = document.getElementById('form-response');
  response.textContent = "Thanks for your message! We'll get back to you soon.";
  response.style.color = "green";

  this.reset();
});
