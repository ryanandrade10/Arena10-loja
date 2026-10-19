if (sessionStorage.getItem("arena10Logged") !== "true") {
  location.href = "login.html";
}

const __dummy = document.createElement("div");
const $ = (s) => document.querySelector(s) || __dummy,
  $$ = (s) => document.querySelectorAll(s);
const money = (n) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const products = [
  {
    id: 1,
    name: "Chuteira Nike Hypervenom Phantom  Campo",
    category: "Chuteiras",
    price: 399.9,
    old: 499.9,
    rating: 4.9,
    icon: "👟",
    image: "img/Hypervenom-laranja.png",
    badge: "-30%",
    sale: true,
  },
  {
    id: 2,
    name: "Camisa Brasil 2026 Torcedor Away Jordan Dri-Fit ",
    category: "Camisas",
    price: 249.9,
    old: null,
    rating: 4.8,
    icon: "👕",
    image: "img/Camisa-Brasil.jpg",
    badge: "NOVO",
    sale: false,
  },
  {
    id: 3,
    name: "Bola Futebol de Campo Adidas Training UCL 2026",
    category: "Bolas",
    price: 179.9,
    old: 219.9,
    rating: 4.7,
    icon: "⚽",
    image: "img/Bola-Champions.jpg",
    badge: "OFERTA",
    sale: true,
  },
  {
    id: 4,
    name: "Chuteira Street Gato Futsal",
    category: "Chuteiras",
    price: 289.9,
    old: null,
    rating: 4.6,
    icon: "👟",
    image: "img/Futsal-gatobordo.png",
    badge: "",
    sale: false,
  },
  {
    id: 5,
    name: "Kit Treino Performance",
    category: "Treino",
    price: 159.9,
    old: 199.9,
    rating: 4.8,
    icon: "🏃",
    image: "img/Kit-treino.jpg",
    badge: "-20%",
    sale: true,
  },
  {
    id: 6,
    name: "Luva de Goleiro Adidas Predator",
    category: "Acessórios",
    price: 139.9,
    old: null,
    rating: 4.5,
    icon: "🧤",
    image: "img/Luva-goleiro.webp",
    badge: "",
    sale: false,
  },
  {
    id: 7,
    name: "Camisa Brasil 2026 Torcedor Home Dri-Fit",
    category: "Camisas",
    price: 219.9,
    old: 279.9,
    rating: 4.9,
    icon: "👕",
    image: "img/Camisa-BrasilCASA.jpg",
    badge: "OFERTA",
    sale: true,
  },
  {
    id: 8,
    name: "Mochila Futebol Everbag street",
    category: "Acessórios",
    price: 189.9,
    old: null,
    rating: 4.4,
    icon: "🎒",
    image: "img/mochila-futebol.jpg",
    badge: "",
    sale: false,
  },
  {
    id: 9,
    name: "Chuteira Nike Vapor 17 Elite Society ",
    category: "Chuteiras",
    price: 349.9,
    old: 429.9,
    rating: 4.8,
    icon: "👟",
    image: "img/chuteira-societyamarela.png",
    badge: "-19%",
    sale: true,
  },
];
let cart = [],
  favorites = new Set(),
  activeCategory = "Todos";
let appliedCoupon = null;
let selectedShipping = null;

function toast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 2600);
}
function showError(id, msg) {
  $("#" + id).textContent = msg;
}
function validEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}
$$(".show-password").forEach(
  (b) =>
    (b.onclick = () => {
      const i = $("#" + b.dataset.target);
      i.type = i.type === "password" ? "text" : "password";
      b.textContent = i.type === "password" ? "Ver" : "Ocultar";
    }),
);
$("#openRegister").onclick = () => {
  $("#loginBox").classList.add("hidden");
  $("#registerBox").classList.remove("hidden");
};
$("#backLogin").onclick = () => {
  $("#registerBox").classList.add("hidden");
  $("#loginBox").classList.remove("hidden");
};
$("#forgotBtn").onclick = () =>
  toast("Demonstração: recuperação de senha não envia e-mail.");
$("#loginForm").onsubmit = (e) => {
  e.preventDefault();
  const email = $("#loginEmail").value.trim(),
    pass = $("#loginPassword").value;
  showError(
    "loginEmailError",
    validEmail(email) ? "" : "Digite um e-mail válido.",
  );
  showError(
    "loginPasswordError",
    pass.length >= 6 ? "" : "A senha deve ter pelo menos 6 caracteres.",
  );
  if (validEmail(email) && pass.length >= 6) enterStore();
};
$("#regCpf").oninput = (e) => {
  let v = e.target.value.replace(/\D/g, "").slice(0, 11);
  v = v
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  e.target.value = v;
};
$("#regPhone").oninput = (e) => {
  let v = e.target.value.replace(/\D/g, "").slice(0, 11);
  v = v.replace(/^(\d{2})(\d)/, "($1) $2").replace(/(\d{5})(\d)/, "$1-$2");
  e.target.value = v;
};
$("#registerForm").onsubmit = (e) => {
  e.preventDefault();
  let ok = true;
  const checks = [
    [
      "regNameError",
      $("#regName").value.trim().split(" ").length >= 2,
      "Informe nome e sobrenome.",
    ],
    [
      "regCpfError",
      $("#regCpf").value.replace(/\D/g, "").length === 11,
      "Informe 11 dígitos.",
    ],
    [
      "regEmailError",
      validEmail($("#regEmail").value.trim()),
      "Digite um e-mail válido.",
    ],
    [
      "regPhoneError",
      $("#regPhone").value.replace(/\D/g, "").length >= 10,
      "Informe um celular válido.",
    ],
    ["regBirthError", !!$("#regBirth").value, "Informe a data de nascimento."],
    [
      "regPasswordError",
      $("#regPassword").value.length >= 6,
      "Use pelo menos 6 caracteres.",
    ],
    [
      "regConfirmError",
      $("#regConfirm").value === $("#regPassword").value &&
        $("#regConfirm").value,
      "As senhas não conferem.",
    ],
    [
      "privacyError",
      $("#privacy").checked,
      "É necessário aceitar a Política de Privacidade.",
    ],
  ];
  checks.forEach(([id, test, msg]) => {
    showError(id, test ? "" : msg);
    if (!test) ok = false;
  });
  if (ok) {
    toast("Cadastro validado com sucesso!");
    setTimeout(enterStore, 550);
  }
};
function enterStore() {
  $("#authPage").classList.add("hidden");
  $("#storePage").classList.remove("hidden");
  window.scrollTo(0, 0);
  renderProducts();
}
function productHasSize(productId, selectedSize) {
  if (selectedSize === "Todos") return true;
  const sizes = productDetails?.[productId]?.sizes;
  return Boolean(sizes && Number(sizes[selectedSize]) > 0);
}

function productHasColor(productId, selectedColor) {
  if (selectedColor === "Todas") return true;
  const colors = productDetails?.[productId]?.colors || [];
  return colors.some((color) => color.name === selectedColor);
}

function renderProducts() {
  let list = products.filter(
    (p) =>
      (activeCategory === "Todos" ||
        (activeCategory === "Ofertas"
          ? p.sale
          : p.category === activeCategory)) &&
      p.price <= Number($("#priceFilter").value) &&
      productHasSize(p.id, $("#sizeFilter").value) &&
      productHasColor(p.id, $("#colorFilter").value) &&
      (!$("#saleFilter").checked || p.sale) &&
      p.name.toLowerCase().includes($("#searchInput").value.toLowerCase()),
  );
  const sort = $("#sortFilter").value;
  if (sort === "low") list.sort((a, b) => a.price - b.price);
  if (sort === "high") list.sort((a, b) => b.price - a.price);
  if (sort === "rating") list.sort((a, b) => b.rating - a.rating);
  $("#resultCount").textContent = `${list.length} produto(s)`;
  $("#productsGrid").innerHTML = list.length
    ? list
        .map(
          (p) =>
            `<article class="product-card"><div class="product-visual" onclick="openProduct(${p.id})">${p.badge ? `<b class="badge ${p.sale ? "sale" : ""}">${p.badge}</b>` : ""}<button class="favorite ${favorites.has(p.id) ? "active" : ""}" onclick="toggleFavorite(${p.id})">${favorites.has(p.id) ? "♥" : "♡"}</button><img class="product-image" src="${p.image}" alt="${p.name}" onerror="this.src='img/chuteira-speed.svg'"></div><div class="product-info"><small class="product-category">${p.category}</small><h3 class="product-name-link" onclick="openProduct(${p.id})">${p.name}</h3><div class="rating">★★★★★ <span>${p.rating}</span></div><span class="old-price">${p.old ? money(p.old) : ""}</span><div class="price">${money(p.price)}</div><span class="installments">ou 10x de ${money(p.price / 10)} sem juros</span><button class="add-btn" onclick="openProduct(${p.id})">VER PRODUTO</button></div></article>`,
        )
        .join("")
    : '<div class="empty-products"><h3>Nenhum produto encontrado</h3><p>Tente limpar os filtros ou buscar outro termo.</p></div>';
}
window.toggleFavorite = (id) => {
  favorites.has(id) ? favorites.delete(id) : favorites.add(id);
  renderProducts();
  toast(favorites.has(id) ? "Produto favoritado!" : "Favorito removido.");
};
window.addCart = (id) => {
  const item = cart.find((i) => i.id === id);
  item
    ? item.qty++
    : cart.push({ ...products.find((p) => p.id === id), qty: 1 });
  updateCart();
  toast("Produto adicionado ao carrinho!");
};
function getCartKey(item) {
  return `${item.id}|${item.selectedSize || ""}|${item.selectedColor || ""}`;
}

function getVariantStock(item) {
  if (!item.selectedSize) return null;
  return productDetails[item.id]?.sizes?.[item.selectedSize] ?? null;
}

const availableCoupons = {
  ARENA10: {
    type: "percent",
    value: 10,
    minimum: 200,
    label: "10% de desconto",
  },
  FRETEGRATIS: {
    type: "shipping",
    value: 0,
    minimum: 0,
    label: "Frete econômico grátis",
  },
  BOLA20: {
    type: "category",
    value: 20,
    category: "Bolas",
    minimum: 0,
    label: "20% em bolas",
  },
};

function calculateCouponDiscount(subtotal) {
  if (!appliedCoupon) return 0;
  const coupon = availableCoupons[appliedCoupon];
  if (!coupon || subtotal < coupon.minimum) return 0;
  if (coupon.type === "percent") return (subtotal * coupon.value) / 100;
  if (coupon.type === "category") {
    return (
      (cart
        .filter((item) => item.category === coupon.category)
        .reduce((sum, item) => sum + item.price * item.qty, 0) *
        coupon.value) /
      100
    );
  }
  return 0;
}

function getShippingCost() {
  if (!selectedShipping) return 0;
  if (appliedCoupon === "FRETEGRATIS" && selectedShipping.id === "economic")
    return 0;
  return selectedShipping.price;
}

function getOrderTotals() {
  const subtotal = cart.reduce((sum, item) => sum + item.qty * item.price, 0);
  const discount = calculateCouponDiscount(subtotal);
  const shipping = getShippingCost();
  return {
    subtotal,
    discount,
    shipping,
    total: Math.max(subtotal - discount + shipping, 0),
  };
}

function updateCart() {
  const quantity = cart.reduce((sum, item) => sum + item.qty, 0);
  const { subtotal, discount, shipping, total } = getOrderTotals();

  $("#cartCount").textContent = quantity;
  $("#detailCartCount").textContent = quantity;
  $("#cartSummary").textContent = money(total);
  $("#cartFooterQuantity").textContent = quantity;
  $("#cartProductsTotal").textContent = money(subtotal);
  $("#cartFreightValue").textContent = selectedShipping
    ? shipping
      ? money(shipping)
      : "Grátis"
    : "A calcular";
  $("#cartDiscountRow").classList.toggle(
    "hidden",
    discount <= 0 && appliedCoupon !== "FRETEGRATIS",
  );
  $("#cartDiscountValue").textContent =
    discount > 0 ? `- ${money(discount)}` : "Frete grátis aplicado";
  $("#cartTotal").textContent = money(total);

  $("#cartItems").innerHTML = cart.length
    ? cart
        .map((item) => {
          const key = getCartKey(item);
          const stock = getVariantStock(item);
          const remainingStock =
            stock === null ? null : Math.max(stock - item.qty, 0);
          const variationTotal = item.price * item.qty;
          const encodedKey = encodeURIComponent(key);
          const variations = [
            item.selectedColor
              ? `<span><b>Cor</b>${item.selectedColor}</span>`
              : "",
            item.selectedSize
              ? `<span><b>Tamanho</b>${item.selectedSize}</span>`
              : "",
          ]
            .filter(Boolean)
            .join("");
          const stockLabel =
            stock === null
              ? `<span class="stock-status available"><i></i>Produto disponível</span>`
              : remainingStock > 0
                ? `<span class="stock-status available"><i></i>${remainingStock} unidade(s) restante(s) nesta variação</span>`
                : `<span class="stock-status last"><i></i>Você adicionou todo o estoque disponível</span>`;

          return `<article class="professional-cart-item">
          <div class="cart-product-image"><img src="${item.image}" alt="${item.name}"></div>
          <div class="cart-product-content">
            <div class="cart-product-top"><div><small>${item.category}</small><h4>${item.name}</h4></div><button class="cart-remove-icon" onclick="removeItemByEncodedKey('${encodedKey}')" aria-label="Remover ${item.name}">×</button></div>
            <div class="cart-variation-grid">${variations}</div>
            ${stockLabel}
            <div class="cart-product-bottom">
              <div class="cart-unit-price"><small>Preço unitário</small><b>${money(item.price)}</b></div>
              <div class="quantity-control" aria-label="Controle de quantidade"><button onclick="changeQtyByEncodedKey('${encodedKey}',-1)" aria-label="Diminuir quantidade">−</button><strong>${item.qty}</strong><button onclick="changeQtyByEncodedKey('${encodedKey}',1)" aria-label="Aumentar quantidade" ${remainingStock === 0 ? "disabled" : ""}>+</button></div>
              <div class="variation-total"><small>Total da variação</small><strong>${money(variationTotal)}</strong></div>
            </div>
            <button class="cart-remove-link" onclick="removeItemByEncodedKey('${encodedKey}')">Remover item</button>
          </div>
        </article>`;
        })
        .join("")
    : `<div class="empty-cart professional-empty"><span>🛒</span><h3>Seu carrinho está vazio</h3><p>Escolha seus produtos e volte aqui para finalizar.</p><button onclick="closeCart()">Ver produtos</button></div>`;

  $("#checkoutBtn").disabled = cart.length === 0;
}

window.changeQtyByEncodedKey = (encodedKey, difference) => {
  window.changeQtyByKey(decodeURIComponent(encodedKey), difference);
};

window.removeItemByEncodedKey = (encodedKey) => {
  window.removeItemByKey(decodeURIComponent(encodedKey));
};

window.changeQtyByKey = (key, difference) => {
  const item = cart.find((product) => getCartKey(product) === key);
  if (!item) return;
  const stock = getVariantStock(item);
  if (difference > 0 && stock !== null && item.qty >= stock) {
    toast(`Limite de estoque atingido: ${stock} unidade(s).`);
    return;
  }
  item.qty += difference;
  if (item.qty <= 0)
    cart = cart.filter((product) => getCartKey(product) !== key);
  updateCart();
};

window.removeItemByKey = (key) => {
  const removedItem = cart.find((product) => getCartKey(product) === key);
  cart = cart.filter((product) => getCartKey(product) !== key);
  updateCart();
  if (removedItem) toast(`${removedItem.name} removido do carrinho.`);
};

function openCart() {
  updateCart();
  $("#cartDrawer").classList.add("open");
  $("#overlay").classList.remove("hidden");
}
window.closeCart = function closeCart() {
  $("#cartDrawer").classList.remove("open");
  $("#overlay").classList.add("hidden");
};
$("#openCart").onclick = openCart;
$("#closeCart").onclick = closeCart;
$("#overlay").onclick = closeCart;
$("#continueBtn").onclick = closeCart;
$("#checkoutBtn").onclick = () => {
  if (!cart.length) {
    toast("Seu carrinho está vazio.");
    return;
  }
  closeCart();
  openCheckout();
};
$$("[data-close-modal]").forEach(
  (b) => (b.onclick = () => b.closest(".modal").classList.add("hidden")),
);
$("#privacyBtn").onclick = () => $("#privacyModal").classList.remove("hidden");
$("#searchForm").onsubmit = (e) => {
  e.preventDefault();
  renderProducts();
  $("#productsSection").scrollIntoView();
};
$("#searchInput").oninput = renderProducts;
$("#categoryNav").onclick = (e) => {
  if (!e.target.dataset.category) return;
  activeCategory = e.target.dataset.category;
  $$("#categoryNav button").forEach((b) =>
    b.classList.toggle("active", b === e.target),
  );
  $("#categoryFilter").value =
    activeCategory === "Ofertas" ? "Todos" : activeCategory;
  renderProducts();
  $("#productsSection").scrollIntoView();
};
$("#categoryFilter").onchange = (e) => {
  activeCategory = e.target.value;
  renderProducts();
};
$("#priceFilter").oninput = (e) => {
  $("#priceLabel").textContent = money(Number(e.target.value)).replace(
    ",00",
    "",
  );
  renderProducts();
};
$("#sortFilter").onchange = renderProducts;
$("#saleFilter").onchange = renderProducts;
$("#clearFilters").onclick = () => {
  activeCategory = "Todos";
  $("#categoryFilter").value = "Todos";
  $("#sizeFilter").value = "Todos";
  $("#colorFilter").value = "Todas";
  $("#priceFilter").value = 600;
  $("#priceLabel").textContent = "R$ 600";
  $("#sortFilter").value = "featured";
  $("#saleFilter").checked = false;
  $("#searchInput").value = "";
  renderProducts();
};
$("#filterMobile").onclick = () => $("#filters").classList.toggle("open");
$("[data-scroll-products]").onclick = () => {
  activeCategory = "Chuteiras";
  $("#categoryFilter").value = "Chuteiras";
  renderProducts();
  $("#productsSection").scrollIntoView();
};
$("#accountBtn").onclick = openAccount;
$("#mobileMenuBtn").onclick = () => $("#categoryNav").scrollIntoView();

function formatCep(value) {
  return value
    .replace(/\D/g, "")
    .slice(0, 8)
    .replace(/(\d{5})(\d)/, "$1-$2");
}

$("#cartCep").oninput = (event) =>
  (event.target.value = formatCep(event.target.value));
$("#showCoupons").onclick = () => $("#couponList").classList.toggle("hidden");
$$("[data-coupon]").forEach(
  (button) =>
    (button.onclick = () => {
      $("#couponInput").value = button.dataset.coupon;
      $("#couponList").classList.add("hidden");
    }),
);

$("#applyCoupon").onclick = () => {
  const code = $("#couponInput").value.trim().toUpperCase();
  const coupon = availableCoupons[code];
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const feedback = $("#couponFeedback");
  feedback.classList.remove("hidden", "success", "error");
  if (!coupon) {
    appliedCoupon = null;
    feedback.classList.add("error");
    feedback.textContent =
      "Cupom inválido. Confira o código e tente novamente.";
  } else if (subtotal < coupon.minimum) {
    appliedCoupon = null;
    feedback.classList.add("error");
    feedback.textContent = `Este cupom exige compra mínima de ${money(coupon.minimum)}.`;
  } else {
    appliedCoupon = code;
    feedback.classList.add("success");
    feedback.innerHTML = `<b>${code}</b> aplicado: ${coupon.label}. <button type="button" id="removeCoupon">Remover</button>`;
    setTimeout(() => {
      const remove = $("#removeCoupon");
      if (remove)
        remove.onclick = () => {
          appliedCoupon = null;
          $("#couponInput").value = "";
          feedback.classList.add("hidden");
          updateCart();
        };
    });
  }
  updateCart();
};

$("#calculateShipping").onclick = () => {
  const cep = $("#cartCep").value.replace(/\D/g, "");
  if (cep.length !== 8) {
    toast("Digite um CEP com 8 números para calcular o frete.");
    $("#cartCep").focus();
    return;
  }
  const region = Number(cep[0]);
  const adjustment = region >= 8 ? 8 : region >= 5 ? 5 : 0;
  const options = [
    {
      id: "economic",
      name: "Entrega econômica",
      price: 14.9 + adjustment,
      days: "5 a 8 dias úteis",
    },
    {
      id: "express",
      name: "Entrega expressa",
      price: 29.9 + adjustment,
      days: "2 a 3 dias úteis",
    },
  ];
  $("#shippingResults").classList.remove("hidden");
  $("#shippingResults").innerHTML = options
    .map(
      (option, index) =>
        `<label class="shipping-option"><input type="radio" name="cartShipping" value="${option.id}" ${index === 0 ? "checked" : ""}><span><b>${option.name}</b><small>${option.days}</small></span><strong>${appliedCoupon === "FRETEGRATIS" && option.id === "economic" ? "Grátis" : money(option.price)}</strong></label>`,
    )
    .join("");
  selectedShipping = options[0];
  $$("input[name=cartShipping]").forEach(
    (input) =>
      (input.onchange = () => {
        selectedShipping = options.find((option) => option.id === input.value);
        syncCheckoutShipping();
        updateCart();
      }),
  );
  syncCheckoutShipping();
  updateCart();
};

function syncCheckoutShipping() {
  if (!selectedShipping) return;
  const checkoutOption = document.querySelector(
    `input[name=freight][value="${selectedShipping.id === "economic" ? "0" : "24.90"}"]`,
  );
  if (checkoutOption) checkoutOption.checked = true;
}

let checkoutStep = 1,
  paymentMethod = "card";
const digits = (v) => v.replace(/\D/g, "");
function setFieldError(id, msg) {
  $("#" + id).textContent = msg;
}
function maskCpf(v) {
  v = digits(v).slice(0, 11);
  return v
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}
function maskPhone(v) {
  v = digits(v).slice(0, 11);
  return v.replace(/^(\d{2})(\d)/, "($1) $2").replace(/(\d{5})(\d)/, "$1-$2");
}
function openCheckout() {
  $("#checkoutPage").classList.remove("hidden");
  document.body.style.overflow = "hidden";
  goCheckoutStep(1);
  renderCheckoutSummary();
}
function closeCheckout() {
  $("#checkoutPage").classList.add("hidden");
  document.body.style.overflow = "";
}
function goCheckoutStep(n) {
  checkoutStep = n;
  $$(".checkout-step").forEach((s) =>
    s.classList.toggle("hidden", Number(s.dataset.step) !== n),
  );
  $$("[data-step-dot]").forEach((d) =>
    d.classList.toggle("active", Number(d.dataset.step) <= Math.min(n, 3)),
  );
  $("#checkoutPage").scrollTo(0, 0);
  renderCheckoutSummary();
}
function renderCheckoutSummary() {
  const order = getOrderTotals();
  const pixDiscount = paymentMethod === "pix" ? order.subtotal * 0.1 : 0;
  const subtotal = order.subtotal;
  const freight = order.shipping;
  const discount = order.discount + pixDiscount;
  const total = Math.max(subtotal + freight - discount, 0);
  $("#checkoutItems").innerHTML = cart
    .map(
      (i) =>
        `<div class="summary-product"><i>${i.icon}</i><span>${i.name}<small>Quantidade: ${i.qty}</small></span><b>${money(i.price * i.qty)}</b></div>`,
    )
    .join("");
  $("#checkoutSubtotal").textContent = money(subtotal);
  $("#checkoutFreight").textContent = freight ? money(freight) : "Grátis";
  $("#discountRow").classList.toggle("hidden", !discount);
  $("#checkoutDiscount").textContent = "- " + money(discount);
  $("#checkoutTotal").textContent = money(total);
  $("#installments").innerHTML = [1, 2, 3, 5, 10]
    .map(
      (n) =>
        `<option value="${n}">${n}x de ${money(total / n)} sem juros</option>`,
    )
    .join("");
}
$("#checkoutBack").onclick = () => {
  closeCheckout();
  openCart();
};
$("#shipCpf").oninput = (e) => (e.target.value = maskCpf(e.target.value));
$("#shipPhone").oninput = (e) => (e.target.value = maskPhone(e.target.value));
$("#shipCep").oninput = (e) => {
  let v = digits(e.target.value).slice(0, 8);
  e.target.value = v.replace(/(\d{5})(\d)/, "$1-$2");
};
$("#findCep").onclick = () => {
  if (digits($("#shipCep").value).length !== 8) {
    setFieldError("shipCepError", "Digite 8 números.");
    return;
  }
  setFieldError("shipCepError", "");
  $("#shipStreet").value = "Avenida Demonstração";
  $("#shipDistrict").value = "Centro";
  $("#shipCity").value = "Cidade Exemplo";
  $("#shipState").value = "SP";
  toast("Endereço fictício preenchido para a atividade.");
};
function validateDelivery() {
  const tests = [
    [
      "shipNameError",
      $("#shipName").value.trim().split(" ").length >= 2,
      "Informe nome e sobrenome.",
    ],
    [
      "shipCpfError",
      digits($("#shipCpf").value).length === 11,
      "Informe 11 dígitos.",
    ],
    [
      "shipPhoneError",
      digits($("#shipPhone").value).length >= 10,
      "Informe um celular válido.",
    ],
    [
      "shipCepError",
      digits($("#shipCep").value).length === 8,
      "Informe 8 dígitos.",
    ],
    ["shipStateError", !!$("#shipState").value, "Selecione o estado."],
    ["shipStreetError", !!$("#shipStreet").value.trim(), "Informe o endereço."],
    ["shipNumberError", !!$("#shipNumber").value.trim(), "Informe o número."],
    [
      "shipDistrictError",
      !!$("#shipDistrict").value.trim(),
      "Informe o bairro.",
    ],
    ["shipCityError", !!$("#shipCity").value.trim(), "Informe a cidade."],
  ];
  let ok = true;
  tests.forEach(([id, t, msg]) => {
    setFieldError(id, t ? "" : msg);
    if (!t) ok = false;
  });
  return ok;
}
$("#toPayment").onclick = () => {
  if (validateDelivery()) goCheckoutStep(2);
};
$$("input[name=freight]").forEach((i) => (i.onchange = renderCheckoutSummary));
$$(".payment-tabs button").forEach(
  (b) =>
    (b.onclick = () => {
      paymentMethod = b.dataset.payment;
      $$(".payment-tabs button").forEach((x) =>
        x.classList.toggle("active", x === b),
      );
      $$("[data-payment-panel]").forEach((p) =>
        p.classList.toggle("hidden", p.dataset.paymentPanel !== paymentMethod),
      );
      renderCheckoutSummary();
    }),
);
$("#cardNumber").oninput = (e) => {
  e.target.value = digits(e.target.value)
    .slice(0, 16)
    .replace(/(\d{4})(?=\d)/g, "$1 ");
  $("#cardPreviewNumber").textContent = e.target.value || "•••• •••• •••• ••••";
};
$("#cardName").oninput = (e) =>
  ($("#cardPreviewName").textContent =
    e.target.value.toUpperCase() || "NOME NO CARTÃO");
$("#cardExpiry").oninput = (e) => {
  let v = digits(e.target.value)
    .slice(0, 4)
    .replace(/(\d{2})(\d)/, "$1/$2");
  e.target.value = v;
  $("#cardPreviewExpiry").textContent = v || "MM/AA";
};
$("#cardCvv").oninput = (e) =>
  (e.target.value = digits(e.target.value).slice(0, 3));
function validatePayment() {
  if (paymentMethod !== "card") return true;
  const exp = $("#cardExpiry").value;
  const tests = [
    [
      "cardNameError",
      $("#cardName").value.trim().length >= 3,
      "Informe o nome fictício.",
    ],
    [
      "cardNumberError",
      digits($("#cardNumber").value).length === 16,
      "Use 16 números fictícios.",
    ],
    ["cardExpiryError", /^(0[1-9]|1[0-2])\/\d{2}$/.test(exp), "Use MM/AA."],
    [
      "cardCvvError",
      digits($("#cardCvv").value).length === 3,
      "Use 3 números.",
    ],
  ];
  let ok = true;
  tests.forEach(([id, t, msg]) => {
    setFieldError(id, t ? "" : msg);
    if (!t) ok = false;
  });
  return ok;
}
$("#toReview").onclick = () => {
  if (!validatePayment()) return;
  const complement = $("#shipComplement").value.trim();
  $("#reviewAddress").textContent =
    `${$("#shipName").value} • ${$("#shipStreet").value}, ${$("#shipNumber").value}${complement ? " - " + complement : ""} • ${$("#shipDistrict").value}, ${$("#shipCity").value}/${$("#shipState").value} • CEP ${$("#shipCep").value}`;
  let text = "",
    code = "";
  if (paymentMethod === "card")
    text = `Cartão final ${digits($("#cardNumber").value).slice(-4)} • ${$("#installments").value}x sem juros`;
  if (paymentMethod === "pix") {
    text = "PIX • 10% de desconto";
    code = "PIX-DEMONSTRACAO-ARENA10-SEM-VALOR-BANCARIO";
  }
  if (paymentMethod === "boleto") {
    text = "Boleto bancário demonstrativo";
    code = "00000.00000 00000.000000 00000.000000 0 00000000000000";
  }
  $("#reviewPayment").textContent = text;
  $("#paymentCodeBox").textContent = code;
  $("#paymentCodeBox").classList.toggle("hidden", !code);
  goCheckoutStep(3);
};
$$("[data-go-step]").forEach(
  (b) => (b.onclick = () => goCheckoutStep(Number(b.dataset.goStep))),
);
$("#confirmOrder").onclick = () => {
  if (!$("#checkoutConsent").checked) {
    setFieldError(
      "checkoutConsentError",
      "Marque a confirmação para continuar.",
    );
    return;
  }
  setFieldError("checkoutConsentError", "");
  const order = "A10-" + Date.now().toString().slice(-8);
  const total = $("#checkoutTotal").textContent;
  $("#orderNumber").textContent = order;
  $("#confirmationPayment").textContent =
    paymentMethod === "card"
      ? "Cartão final " + digits($("#cardNumber").value).slice(-4)
      : paymentMethod.toUpperCase();
  $("#confirmationDelivery").textContent = Number(
    document.querySelector("input[name=freight]:checked").value,
  )
    ? "2 a 3 dias úteis"
    : "5 a 8 dias úteis";
  $("#confirmationTotal").textContent = total;
  sessionOrders.unshift({
    number: order,
    total,
    payment: paymentMethod,
    date: new Date().toLocaleDateString("pt-BR"),
  });
  renderOrders();
  goCheckoutStep(4);
  cart = [];
  updateCart();
};
$("#finishCheckout").onclick = () => {
  closeCheckout();
  toast("Simulação concluída com sucesso!");
};

let sessionOrders = [];
function openAccount() {
  closeCheckout();
  $("#accountPage").classList.remove("hidden");
  document.body.style.overflow = "hidden";
  renderOrders();
}
function closeAccount() {
  $("#accountPage").classList.add("hidden");
  document.body.style.overflow = "";
}
$("#closeAccount").onclick = closeAccount;
$$("[data-account-tab]").forEach(
  (b) =>
    (b.onclick = () => {
      $$("[data-account-tab]").forEach((x) =>
        x.classList.toggle("active", x === b),
      );
      $$("[data-account-panel]").forEach((p) =>
        p.classList.toggle(
          "hidden",
          p.dataset.accountPanel !== b.dataset.accountTab,
        ),
      );
    }),
);
$("#profileCpf").oninput = (e) => (e.target.value = maskCpf(e.target.value));
$("#profilePhone").oninput = (e) =>
  (e.target.value = maskPhone(e.target.value));
$("#saveProfile").onclick = () => {
  const name = $("#profileName").value.trim(),
    email = $("#profileEmail").value.trim();
  if (name.length < 3 || !validEmail(email)) {
    toast("Preencha nome e e-mail válidos.");
    return;
  }
  $("#profileSideName").textContent = name;
  $("#profileSideEmail").textContent = email;
  $("#profileInitials").textContent = name
    .split(" ")
    .slice(0, 2)
    .map((x) => x[0])
    .join("")
    .toUpperCase();
  toast("Perfil atualizado nesta sessão!");
};
$("#savePreferences").onclick = () =>
  toast("Preferências atualizadas nesta sessão!");
$("#useCheckoutAddress").onclick = () => {
  if (!$("#shipStreet").value) {
    toast("Preencha um endereço no checkout primeiro.");
    return;
  }
  $("#savedAddress").textContent =
    `${$("#shipStreet").value}, ${$("#shipNumber").value} - ${$("#shipCity").value}/${$("#shipState").value}`;
  toast("Endereço demonstrativo adicionado.");
};
$("#newAddressBtn").onclick = () => {
  closeAccount();
  openCheckout();
  goCheckoutStep(1);
};
$("#logoutBtn").onclick = () => {
  sessionStorage.removeItem("arena10Logged");
  location.href = "login.html";
};
function renderOrders() {
  $("#ordersList").innerHTML = sessionOrders.length
    ? sessionOrders
        .map(
          (o) =>
            `<article class="order-history"><div><span>Pedido ${o.number}</span><small>${o.date}</small></div><b>${o.total}</b><em>Confirmado</em><small>Pagamento: ${o.payment.toUpperCase()}</small></article>`,
        )
        .join("")
    : '<div class="empty-account">Nenhum pedido simulado foi concluído ainda.</div>';
}
$("#copyPix").onclick = async () => {
  try {
    await navigator.clipboard.writeText($("#pixCode").textContent);
    toast("Código PIX fictício copiado!");
  } catch {
    toast("Código selecionado para cópia.");
  }
};
$("#viewOrderProfile").onclick = () => {
  openAccount();
  const btn = $('[data-account-tab="orders"]');
  btn.click();
};

$("#sizeFilter").onchange = renderProducts;
$("#colorFilter").onchange = renderProducts;

/* ==========================================================
   PAGINA DE DETALHES DOS PRODUTOS
   ========================================================== */
const productDetails = {
  1: {
    description:
      "Chuteira de campo leve, criada para velocidade e mudanças rápidas de direção.",
    model: "Hypervenom Phantom 3",
    type: "Campo",
    material: "Cabedal sintético texturizado",
    sole: "Travas fixas",
    weight: "Aproximadamente 230 g",
    colors: [
      {
        name: "Laranja",
        hex: "#f17c0e",
        image: "img/Hypervenom-laranja.webp",
      },
      { name: "Verde", hex: "#98f502", image: "img/hypervenom-verde.webp" },
      {
        name: "Salmão",
        hex: "#FF7E70",
        image: "img/hypervenom-vermelha.webp",
      },
    ],
    sizes: { 37: 4, 38: 7, 39: 0, 40: 9, 41: 6, 42: 2, 43: 8, 44: 3, 45: 1 },
    features: [
      "Ajuste firme e confortável",
      "Textura para controle de bola",
      "Solado indicado para gramado natural",
    ],
    reviews: [
      {
        name: "Carlos",
        stars: 5,
        text: "Produto leve e confortável para a atividade.",
      },
      {
        name: "Rafael",
        stars: 4,
        text: "Bom ajuste e acabamento demonstrativo.",
      },
    ],
  },
  2: {
    description: "Camisa esportiva de torcedor com tecido leve e respirável.",
    model: "Torcedor 2026",
    type: "Camisa de futebol",
    material: "Poliéster respirável",
    fit: "Modelagem regular",
    origin: "Produto demonstrativo",
    sizes: { P: 5, M: 12, G: 8, XG: 3, G1: 0 },
    features: [
      "Tecido de secagem rápida",
      "Gola reforçada",
      "Escudo demonstrativo",
    ],
    reviews: [
      { name: "Bruno", stars: 5, text: "Tecido leve e tamanho adequado." },
    ],
  },
  3: {
    description:
      "Bola termocolada desenvolvida para partidas e treinos de alta intensidade.",
    model: "Pro Match",
    type: "Bola de campo",
    material: "PU laminado",
    circumference: "68 a 70 cm",
    weight: "410 a 450 g",
    features: [
      "Construção termocolada",
      "Baixa absorção de água",
      "Câmara com retenção de ar",
    ],
    reviews: [
      {
        name: "André",
        stars: 5,
        text: "Boa apresentação e acabamento visual.",
      },
      { name: "Paulo", stars: 4, text: "Características bem detalhadas." },
    ],
  },
  4: {
    description:
      "Chuteira de futsal com solado de borracha e aderência para quadras.",
    model: "Street Gato Indoor",
    type: "Futsal",
    material: "Sintético reforçado",
    sole: "Borracha non-marking",
    weight: "Aproximadamente 260 g",
    colors: [
      { name: "Bordo", hex: "#800000", image: "img/Futsal-gatobordo.webp" },
      { name: "Salmao", hex: "#FF7E70", image: "img/Futsal-gatosalmao.webp" },
      {
        name: "Aqua",
        hex: "#019999",
        image: "img/Futsal-gatoaqua.webp",
      },
    ],
    sizes: { 37: 2, 38: 0, 39: 5, 40: 6, 41: 4, 42: 7, 43: 2, 44: 0, 45: 1 },
    features: [
      "Solado que não marca a quadra",
      "Reforço frontal",
      "Palmilha macia removível",
    ],
    reviews: [{ name: "Diego", stars: 4, text: "Boa opção para quadra." }],
  },
  5: {
    description:
      "Conjunto para treino composto por camiseta e shorts esportivos.",
    model: "Performance",
    type: "Kit de treino",
    material: "Poliéster com elastano",
    fit: "Modelagem esportiva",
    sizes: { P: 4, M: 9, G: 7, XG: 2, G1: 1 },
    features: ["Liberdade de movimento", "Secagem rápida", "Cós elástico"],
    reviews: [
      { name: "Felipe", stars: 5, text: "Kit completo e confortável." },
    ],
  },
  6: {
    description: "Luva de goleiro com palma aderente para treinos e partidas.",
    model: "Grip Pro",
    type: "Luva de goleiro",
    material: "Látex e tecido respirável",
    closure: "Fecho ajustável",
    sizes: { P: 3, M: 6, G: 5, XG: 2, G1: 0 },
    features: ["Palma com aderência", "Punho ajustável", "Dorso ventilado"],
    reviews: [
      { name: "Marcos", stars: 4, text: "Boa aderência na simulação." },
    ],
  },
  7: {
    description:
      "Camisa clássica de clube com acabamento confortável para uso diário.",
    model: "Club Classic",
    type: "Camisa de futebol",
    material: "Poliéster",
    fit: "Modelagem regular",
    sizes: { P: 0, M: 8, G: 10, XG: 4, G1: 2 },
    features: ["Tecido leve", "Costuras reforçadas", "Estilo clássico"],
    reviews: [
      { name: "Lucas", stars: 5, text: "Visual clássico e bom caimento." },
    ],
  },
  8: {
    description:
      "Mochila esportiva com compartimentos para chuteira, roupas e acessórios.",
    model: "Locker 30L",
    type: "Mochila esportiva",
    material: "Poliéster resistente",
    dimensions: "48 × 32 × 20 cm",
    capacity: "30 litros",
    weight: "Aproximadamente 650 g",
    features: [
      "Compartimento inferior para chuteira",
      "Bolso frontal com zíper",
      "Alças acolchoadas e ajustáveis",
      "Painel traseiro respirável",
    ],
    reviews: [
      {
        name: "Henrique",
        stars: 4,
        text: "Boa divisão interna e tamanho adequado.",
      },
    ],
  },
  9: {
    description: "Chuteira society com travas baixas para gramado sintético.",
    model: "Vapor 17 Elite",
    type: "Society",
    material: "Sintético texturizado",
    sole: "Travas baixas em borracha",
    weight: "Aproximadamente 245 g",
    colors: [
      {
        name: "Amarelo",
        hex: "#e0cb08",
        image: "img/chuteira-societyamarela.webp",
      },
      {
        name: "Laranja",
        hex: "#f78e16",
        image: "img/chuteira-societylaranja.webp",
      },
      {
        name: "Verde",
        hex: "#45d801",
        image: "img/chuteira-societyverde.webp",
      },
    ],
    sizes: { 37: 1, 38: 4, 39: 5, 40: 0, 41: 8, 42: 6, 43: 3, 44: 2, 45: 0 },
    features: [
      "Travas para grama sintética",
      "Cabedal texturizado",
      "Ajuste anatômico",
    ],
    reviews: [
      {
        name: "Gustavo",
        stars: 5,
        text: "Ótima página para escolher tamanho e cor.",
      },
    ],
  },
};
let currentProduct = null,
  currentColor = null,
  currentSize = null,
  currentReviewStars = 5;
window.openProduct = (id) => {
  currentProduct = products.find((p) => p.id === id);
  currentColor = null;
  currentSize = null;
  const d = productDetails[id];
  $("#detailName").textContent = currentProduct.name;
  $("#detailCategory").textContent = currentProduct.category;
  $("#detailDescription").textContent = d.description;
  $("#detailPrice").textContent = money(currentProduct.price);
  $("#detailOldPrice").textContent = currentProduct.old
    ? money(currentProduct.old)
    : "";
  $("#detailInstallments").textContent =
    `ou 10x de ${money(currentProduct.price / 10)} sem juros`;
  $("#detailImage").src = d.colors ? d.colors[0].image : currentProduct.image;
  $("#detailRating").innerHTML =
    `★★★★★ <span>${currentProduct.rating} (${d.reviews.length} avaliações)</span>`;
  renderColors(d);
  renderSizes(d);
  renderSpecifications(d);
  renderReviews(d);
  $("#detailAlert").classList.add("hidden");
  $("#productDetailPage").classList.remove("hidden");
  document.body.style.overflow = "hidden";
};
function renderColors(d) {
  const box = $("#colorSelector");
  box.classList.toggle("hidden", !d.colors);
  if (!d.colors) {
    $("#colorOptions").innerHTML = "";
    return;
  }
  $("#colorOptions").innerHTML = d.colors
    .map(
      (c, i) =>
        `<button type="button" class="color-choice ${i === 0 ? "active" : ""}" style="--swatch:${c.hex}" onclick="selectColor(${i})"><i></i><span>${c.name}</span></button>`,
    )
    .join("");
  currentColor = d.colors[0];
  $("#selectedColor").textContent = currentColor.name;
}
window.selectColor = (i) => {
  const d = productDetails[currentProduct.id];
  currentColor = d.colors[i];
  $("#detailImage").src = currentColor.image;
  $("#selectedColor").textContent = currentColor.name;
  $$(".color-choice").forEach((b, n) => b.classList.toggle("active", n === i));
};
function renderSizes(d) {
  const box = $("#sizeSelector");
  const has = Boolean(d.sizes);
  box.classList.toggle("hidden", !has);
  if (!has) {
    $("#sizeOptions").innerHTML = "";
    return;
  }
  const isShoe = currentProduct.category === "Chuteiras";
  $("#sizeTitle").textContent = isShoe
    ? "Escolha a numeração"
    : "Escolha o tamanho";
  $("#sizeOptions").innerHTML = Object.entries(d.sizes)
    .map(
      ([size, stock]) =>
        `<button type="button" ${stock === 0 ? "disabled" : ""} onclick="selectSize('${size}',${stock})"><b>${size}</b><small>${stock === 0 ? "Esgotado" : stock + " em estoque"}</small></button>`,
    )
    .join("");
  $("#selectedStock").textContent = "";
}
window.selectSize = (size, stock) => {
  currentSize = size;
  $$("#sizeOptions button").forEach((b) =>
    b.classList.toggle(
      "active",
      b.querySelector("b").textContent === String(size),
    ),
  );
  $("#selectedStock").textContent = `${stock} unidade(s) disponível(is)`;
};
function renderSpecifications(d) {
  const label = {
    model: "Modelo",
    type: "Tipo",
    material: "Material",
    sole: "Solado",
    weight: "Peso",
    fit: "Modelagem",
    origin: "Origem",
    circumference: "Circunferência",
    dimensions: "Dimensões",
    capacity: "Capacidade",
    closure: "Fechamento",
  };
  $("#specificationsList").innerHTML = Object.entries(label)
    .filter(([k]) => d[k])
    .map(([k, v]) => `<div><dt>${v}</dt><dd>${d[k]}</dd></div>`)
    .join("");
  $("#featuresList").innerHTML = d.features
    .map((x) => `<li>✓ ${x}</li>`)
    .join("");
}
function renderReviews(d) {
  const avg = d.reviews.length
    ? (d.reviews.reduce((s, r) => s + r.stars, 0) / d.reviews.length).toFixed(1)
    : "0.0";
  $("#reviewAverage").textContent = avg;
  $("#reviewCount").textContent = `${d.reviews.length} avaliação(ões)`;
  $("#reviewsList").innerHTML = d.reviews
    .map(
      (r) =>
        `<article class="customer-review"><div><b>${r.name}</b><span>${"★".repeat(r.stars)}${"☆".repeat(5 - r.stars)}</span></div><p>${r.text}</p></article>`,
    )
    .join("");
}
$("#closeProductDetail").onclick = () => {
  $("#productDetailPage").classList.add("hidden");
  document.body.style.overflow = "";
};
$("#detailCartButton").onclick = () => {
  $("#productDetailPage").classList.add("hidden");
  document.body.style.overflow = "";
  openCart();
};
$("#detailAddCart").onclick = () => {
  const d = productDetails[currentProduct.id];
  if (d.sizes && !currentSize) {
    showDetailAlert(
      currentProduct.category === "Chuteiras"
        ? "Escolha uma numeração disponível antes de adicionar."
        : "Escolha um tamanho disponível antes de adicionar.",
    );
    return;
  }
  const item = cart.find(
    (i) =>
      i.id === currentProduct.id &&
      i.selectedSize === currentSize &&
      i.selectedColor === (currentColor?.name || null),
  );
  const selectedStock = currentSize ? Number(d.sizes[currentSize]) : null;
  if (item && selectedStock !== null && item.qty >= selectedStock) {
    showDetailAlert(
      `Estoque máximo para esta variação: ${selectedStock} unidade(s).`,
    );
    return;
  }
  if (item) item.qty++;
  else
    cart.push({
      ...currentProduct,
      image: currentColor?.image || currentProduct.image,
      qty: 1,
      selectedSize: currentSize,
      selectedColor: currentColor?.name || null,
      variantStock: selectedStock,
    });
  updateCart();
  $("#detailCartCount").textContent = cart.reduce((s, i) => s + i.qty, 0);
  showDetailAlert("Produto adicionado ao carrinho!", true);
};
function showDetailAlert(text, success = false) {
  const a = $("#detailAlert");
  a.textContent = text;
  a.className = `detail-alert ${success ? "success" : ""}`;
}
$$("[data-info-tab]").forEach(
  (b) =>
    (b.onclick = () => {
      $$("[data-info-tab]").forEach((x) =>
        x.classList.toggle("active", x === b),
      );
      $$("[data-info-panel]").forEach((p) =>
        p.classList.toggle("hidden", p.dataset.infoPanel !== b.dataset.infoTab),
      );
    }),
);
$$("#reviewStars button").forEach(
  (b) =>
    (b.onclick = () => {
      currentReviewStars = Number(b.dataset.stars);
      $$("#reviewStars button").forEach((x) =>
        x.classList.toggle(
          "active",
          Number(x.dataset.stars) <= currentReviewStars,
        ),
      );
    }),
);
$("#reviewForm").onsubmit = (e) => {
  e.preventDefault();
  const name = $("#reviewName").value.trim(),
    text = $("#reviewText").value.trim();
  if (name.length < 2 || text.length < 5) {
    showDetailAlert(
      "Informe seu nome e escreva uma avaliação com pelo menos 5 caracteres.",
    );
    return;
  }
  productDetails[currentProduct.id].reviews.unshift({
    name,
    stars: currentReviewStars,
    text,
  });
  renderReviews(productDetails[currentProduct.id]);
  e.target.reset();
  showDetailAlert("Avaliação simulada adicionada!", true);
};
