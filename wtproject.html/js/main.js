document.addEventListener("DOMContentLoaded", () => {
  /* ------------------ Sidebar toggle (mobile) ------------------ */
  const menuToggle = document.getElementById("menuToggle");
  const sidebar = document.querySelector(".sidebar");
  if (menuToggle && sidebar) {
    menuToggle.addEventListener("click", () => {
      sidebar.classList.toggle("open");
      // change icon if desired
      menuToggle.innerHTML = sidebar.classList.contains("open") ? '✕' : '<i class="fa-solid fa-bars"></i>';
    });
  }

  /* ------------------ LocalStorage helpers ------------------ */
  const save = (key, val) => localStorage.setItem(key, JSON.stringify(val));
  const load = (key) => JSON.parse(localStorage.getItem(key) || "[]");

  /* ------------------ Ensure keys exist (demo) ------------------ */
  if (!localStorage.getItem("appointments")) save("appointments", []);
  if (!localStorage.getItem("tokens")) save("tokens", []);
  if (!localStorage.getItem("bills")) save("bills", []);
  if (!localStorage.getItem("messages")) save("messages", []);
  if (!localStorage.getItem("users")) save("users", [
    { name: "Demo Patient", email: "patient@demo", password: "1234" }
  ]);

  /* ------------------ Appointments ------------------ */
  const apptForm = document.querySelector("#patientForm");
  if (apptForm) {
    apptForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("patientName").value.trim();
      const doctor = document.getElementById("patientDoctor").value;
      const date = document.getElementById("patientDate").value;
      if (!name || !date) return alert("Please fill required fields.");
      const appts = load("appointments");
      const obj = { id: "APPT" + Date.now(), patient: name, doctor, date, status: "Scheduled" };
      appts.push(obj); save("appointments", appts);
      alert("Appointment booked: " + obj.id);
      apptForm.reset();
      renderMyAppointments();
      renderDoctorAppts();
      updateStats();
    });
  }

  function renderMyAppointments() {
    const container = document.getElementById("myAppointments");
    if (!container) return;
    const appts = load("appointments");
    if (appts.length === 0) {
      container.innerHTML = "<p class='small-muted'>No appointments yet.</p>";
      return;
    }
    container.innerHTML = "";
    appts.forEach(a => {
      const div = document.createElement("div");
      div.className = "card";
      div.innerHTML = `<h4>${a.doctor} — ${a.date}</h4><p>Status: ${a.status}</p><p>ID: ${a.id}</p>`;
      container.appendChild(div);
    });
  }

  function renderDoctorAppts() {
    const container = document.getElementById("doctorAppts");
    if (!container) return;
    const appts = load("appointments");
    if (appts.length === 0) {
      container.innerHTML = "<p class='small-muted'>No appointments scheduled.</p>";
      return;
    }
    container.innerHTML = "";
    appts.forEach(a => {
      const li = document.createElement("li");
      li.textContent = `${a.patient} — ${a.date} — ${a.doctor} (ID: ${a.id})`;
      container.appendChild(li);
    });
  }

  /* ------------------ Lab tokens ------------------ */
  const labForm = document.querySelector("#labForm");
  if (labForm) {
    labForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const token = document.getElementById("labToken").value.trim();
      if (!token) return alert("Enter token.");
      const tokens = load("tokens");
      const obj = { id: token, test: "General Test", status: "Collected", date: new Date().toLocaleString() };
      tokens.push(obj); save("tokens", tokens);
      alert("Token created: " + token);
      labForm.reset();
      renderTokens();
      updateStats();
    });
  }

  function renderTokens() {
    const container = document.getElementById("tokenList");
    if (!container) return;
    const tokens = load("tokens");
    if (tokens.length === 0) {
      container.innerHTML = "<p class='small-muted'>No tokens.</p>";
      return;
    }
    container.innerHTML = "";
    tokens.forEach(t => {
      const div = document.createElement("div");
      div.className = "card";
      div.innerHTML = `<h4>${t.id} — ${t.test}</h4><p>${t.date}</p><p>Status: ${t.status}</p>`;
      container.appendChild(div);
    });
  }

  /* ------------------ Billing ------------------ */
  const billingForm = document.querySelector("#billingForm");
  if (billingForm) {
    billingForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("billPatient").value.trim();
      const amount = parseFloat(document.getElementById("billAmount").value);
      const method = document.getElementById("billMethod").value;
      if (!name || isNaN(amount)) return alert("Fill bill fields.");
      const bills = load("bills");
      const obj = { id: "BILL" + Date.now(), name, amount, method, status: "Paid", date: new Date().toLocaleString() };
      bills.push(obj); save("bills", bills);
      alert("Bill created: " + obj.id);
      billingForm.reset();
      renderBills();
      updateStats();
    });
  }

  function renderBills() {
    const container = document.getElementById("billList");
    if (!container) return;
    const bills = load("bills");
    if (bills.length === 0) { container.innerHTML = "<p class='small-muted'>No bills yet.</p>"; return; }
    container.innerHTML = "";
    bills.forEach(b => {
      const div = document.createElement("div");
      div.className = "card";
      div.innerHTML = `<h4>${b.name} — PKR ${b.amount.toFixed(2)}</h4><p>Method: ${b.method} • ${b.date}</p><p>ID: ${b.id}</p>`;
      container.appendChild(div);
    });
  }

  /* ------------------ Contact / Messages ------------------ */
  const contactForm = document.querySelector("#contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("c_name").value.trim();
      const email = document.getElementById("c_email").value.trim();
      const msg = document.getElementById("c_message").value.trim();
      if (!name || !email || !msg) return alert("Please fill all fields.");
      const messages = load("messages");
      const obj = { id: "MSG" + Date.now(), name, email, message: msg, date: new Date().toLocaleString() };
      messages.push(obj); save("messages", messages);
      alert("Message sent. We'll get back to you.");
      contactForm.reset();
      renderMessages();
    });
  }

  function renderMessages() {
    const el = document.getElementById("messagesList");
    if (!el) return;
    const messages = load("messages");
    if (messages.length === 0) { el.innerHTML = "<p class='small-muted'>No messages.</p>"; return; }
    el.innerHTML = "";
    messages.forEach(m => {
      const div = document.createElement("div");
      div.className = "card";
      div.innerHTML = `<h4>${m.name} • ${m.email}</h4><p>${m.message}</p><small>${m.date}</small>`;
      el.appendChild(div);
    });
  }

  /* ------------------ Simple User register/login (optional) ------------------ */
  // Not strictly required by pages but safe to include for demo
  function registerDemoUser(name, email, password) {
    const users = load("users");
    if (users.find(u => u.email === email)) { alert("Email already used."); return; }
    users.push({ name, email, password });
    save("users", users);
    alert("Registered: " + name);
  }
  function loginDemoUser(email, password) {
    const users = load("users");
    const found = users.find(u => u.email === email && u.password === password);
    if (!found) { alert("Invalid credentials."); return; }
    localStorage.setItem("loggedUser", JSON.stringify(found));
    alert("Welcome " + found.name);
  }

  /* ------------------ Update stats (home) ------------------ */
  function updateStats() {
    const elDocs = document.getElementById("stat-doctors");
    const elPatients = document.getElementById("stat-patients");
    const elServices = document.getElementById("stat-services");
    const elAppts = document.getElementById("stat-appointments");
    if (elDocs) elDocs.textContent = "120+";
    if (elPatients) elPatients.textContent = (load("users").length || 1);
    if (elServices) elServices.textContent = "50+";
    if (elAppts) elAppts.textContent = load("appointments").length;
  }

  /* ------------------ Initial render calls ------------------ */
  renderMyAppointments();
  renderDoctorAppts();
  renderTokens();
  renderBills();
  renderMessages();
  updateStats();

  /* Expose small helpers to window for quick console testing (optional) */
  window._pkli = {
    save, load, registerDemoUser, loginDemoUser, bookAppointment: (p,d,t)=>{ const appts = load("appointments"); appts.push({id:"APPT"+Date.now(),patient:p,doctor:d,date:t,status:"Scheduled"}); save("appointments",appts); updateStats(); }
  };
});
________________________________________

