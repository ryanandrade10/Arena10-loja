const $ = (s) => document.querySelector(s),
  $$ = (s) => document.querySelectorAll(s);
let timer;
function emailOk(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}
function notify(type, title, text) {
  const t = $("#authToast");
  clearTimeout(timer);
  t.className = "auth-toast show " + type;
  $("#authToastTitle").textContent = title;
  $("#authToastText").textContent = text;
  $("#authToastIcon").textContent = type === "success" ? "✓" : "!";
  timer = setTimeout(() => t.classList.remove("show"), 4200);
}
$("#authToastClose").onclick = () => $("#authToast").classList.remove("show");
$$(".show-password").forEach(
  (b) =>
    (b.onclick = () => {
      const i = $("#" + b.dataset.target);
      i.type = i.type === "password" ? "text" : "password";
      b.textContent = i.type === "password" ? "Ver" : "Ocultar";
    }),
);
function rules(v) {
  return {
    length: v.length >= 8,
    upper: /[A-Z]/.test(v),
    lower: /[a-z]/.test(v),
    number: /\d/.test(v),
    special: /[^A-Za-z0-9]/.test(v),
  };
}
function strong(v) {
  return Object.values(rules(v)).every(Boolean);
}
if ($("#loginForm")) {
  $("#loginForm").onsubmit = (e) => {
    e.preventDefault();
    const mail = $("#loginEmail").value.trim(),
      pass = $("#loginPassword").value;
    if (!emailOk(mail)) {
      notify("error", "E-mail inválido", "Digite um e-mail completo.");
      return;
    }
    if (pass.length < 6) {
      notify("error", "Senha incompleta", "Use pelo menos 6 caracteres.");
      return;
    }
    sessionStorage.setItem("arena10Logged", "true");
    location.href = "index.html";
  };
}
if ($("#regPassword")) {
  $("#regPassword").oninput = (e) =>
    $$("[data-rule]").forEach((x) => {
      const ok = rules(e.target.value)[x.dataset.rule];
      x.classList.toggle("passed", ok);
      x.textContent = (ok ? "✓" : "○") + " " + x.textContent.slice(2);
    });
}
if ($("#regCpf")) {
  $("#regCpf").oninput = (e) => {
    let v = e.target.value.replace(/\D/g, "").slice(0, 11);
    e.target.value = v
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  };
}
if ($("#registerForm")) {
  $("#registerForm").onsubmit = (e) => {
    e.preventDefault();
    const checks = [
      [
        $("#regName").value.trim().split(/\s+/).length >= 2,
        "Informe nome e sobrenome.",
      ],
      [
        $("#regCpf").value.replace(/\D/g, "").length === 11,
        "O CPF precisa de 11 números.",
      ],
      [emailOk($("#regEmail").value), "Digite um e-mail válido."],
      [
        $("#regPhone").value.replace(/\D/g, "").length >= 10,
        "Informe celular com DDD.",
      ],
      [!!$("#regBirth").value, "Informe a data de nascimento."],
      [
        strong($("#regPassword").value),
        "Use 8 caracteres, maiúscula, minúscula, número e especial.",
      ],
      [
        $("#regConfirm").value === $("#regPassword").value,
        "As senhas não conferem.",
      ],
      [$("#privacy").checked, "Aceite a política de privacidade."],
    ];
    const fail = checks.find((x) => !x[0]);
    if (fail) {
      notify("error", "Cadastro incompleto", fail[1]);
      return;
    }
    notify("success", "Cadastro validado", "Redirecionando ao login.");
    setTimeout(() => (location.href = "login.html"), 1000);
  };
}
function step(n) {
  $$("[data-step]").forEach((s) =>
    s.classList.toggle("hidden", Number(s.dataset.step) !== n),
  );
  $$("[data-dot]").forEach((d) =>
    d.classList.toggle("active", Number(d.dataset.dot) <= Math.min(n, 3)),
  );
}
if ($("#recoveryEmailForm")) {
  $("#recoveryEmailForm").onsubmit = (e) => {
    e.preventDefault();
    const mail = $("#recoveryEmail").value.trim();
    if (!emailOk(mail)) {
      notify("error", "E-mail inválido", "Digite o e-mail completo.");
      return;
    }
    $("#sentEmail").textContent = mail;
    notify(
      "success",
      "E-mail enviado",
      "Código enviado para " + mail + ".",
    );
    step(2);
  };
}
if ($("#recoveryCodeForm")) {
  $("#recoveryCodeForm").onsubmit = (e) => {
    e.preventDefault();
    if ($("#recoveryCode").value !== "123456") {
      notify("error", "Código incorreto", "Use 123456.");
      return;
    }
    step(3);
  };
}
if ($("#newPasswordForm")) {
  $("#newPasswordForm").onsubmit = (e) => {
    e.preventDefault();
    const a = $("#newPassword").value,
      b = $("#confirmPassword").value;
    if (!strong(a)) {
      notify(
        "error",
        "Senha fraca",
        "Use 8 caracteres, maiúscula, minúscula, número e especial.",
      );
      return;
    }
    if (a !== b) {
      notify("error", "Senhas diferentes", "Repita a mesma senha.");
      return;
    }
    step(4);
  };
}
