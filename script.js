const cart = [];

fetch("data.json")
  .then((response) => response.json())
  .then((dataJSON) => {
    const productsContainer = document.querySelector("#products");

    dataJSON.forEach((product) => {
      const article = document.createElement("article");
      const img = document.createElement("img");
      const h2 = document.createElement("h2");
      const h3 = document.createElement("h3");
      const p = document.createElement("p");
      const button = document.createElement("button");

      const icon = document.createElement("img");
      icon.src = "./assets/images/icon-add-to-cart.svg";
      icon.alt = "";

      button.append(icon);
      button.type = "button";
      button.append("Add to Cart");

      img.src = product.image.desktop;
      img.alt = product.name;

      article.append(img);
      article.append(button);

      h3.textContent = product.category;
      article.append(h3);

      h2.textContent = product.name;
      article.append(h2);

      p.textContent = "$" + product.price.toFixed(2);
      article.append(p);

      productsContainer.append(article);

      
      button.addEventListener("click", () => {
        
        const countAll = document.querySelector("#count");
        let currentCount = Number(countAll.textContent);
        currentCount++;
        countAll.textContent = currentCount;

        const emptyCart = document.querySelector(".empty-cart");
        emptyCart.style.display = "none";

        const cartBottom = document.querySelector("#cart-bottom");
        cartBottom.style.display = "block";

        const existingProduct = cart.find((item) => item.name === product.name);
        const cartItemsList = document.querySelector("#cart-items");

        if (existingProduct) {
          existingProduct.quantity++;

          const cartItem = cartItemsList.querySelector(`[data-name="${product.name}"]`);
          const qty = cartItem.querySelector(".item-qty");
          const total = cartItem.querySelector(".item-total");

          qty.textContent = existingProduct.quantity + "x";
          total.textContent = "$" + (product.price * existingProduct.quantity).toFixed(2);
        } else {
          const cartProduct = {
            ...product,
            quantity: 1,
          };

          cart.push(cartProduct);

          const cartItem = document.createElement("div");
          cartItem.dataset.name = product.name;
          cartItem.classList.add("cart-item");

          const nameP = document.createElement("p");
          nameP.textContent = product.name;
          nameP.classList.add("item-name");

          const pricesDiv = document.createElement("div");
          pricesDiv.classList.add("item-prices");

          const qtySpan = document.createElement("span");
          qtySpan.classList.add("item-qty");
          qtySpan.textContent = cartProduct.quantity + "x";

          const unitSpan = document.createElement("span");
          unitSpan.classList.add("item-unit");
          unitSpan.textContent = "@ $" + product.price.toFixed(2);

          const totalSpan = document.createElement("span");
          totalSpan.classList.add("item-total");
          totalSpan.textContent = "$" + product.price.toFixed(2);

          pricesDiv.append(qtySpan, unitSpan, totalSpan);

          const removeBtn = document.createElement("button");
          removeBtn.classList.add("btn-remove");
          const removeIcon = document.createElement("img");
          removeIcon.src = "./assets/images/icon-remove-item.svg";
          removeIcon.alt = "Remove item";
          removeBtn.append(removeIcon);

         
          removeBtn.addEventListener("click", () => {
            const itemIndex = cart.findIndex((item) => item.name === product.name);
            if (itemIndex > -1) {
              const removedQty = cart[itemIndex].quantity;
              cart.splice(itemIndex, 1);
              cartItem.remove();

            
              let currentTotalCount = Number(countAll.textContent) - removedQty;
              countAll.textContent = currentTotalCount;

              
              const updatedGrandTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
              totalPriceAll.textContent = "$" + updatedGrandTotal.toFixed(2);

              
              if (cart.length === 0) {
                emptyCart.style.display = "flex";
                cartBottom.style.display = "none";
              }
            }
          });

          cartItem.append(nameP, pricesDiv, removeBtn);
          cartItemsList.append(cartItem);
        }

       
        const grandTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const totalPriceAll = document.querySelector(".total-price-all");
        totalPriceAll.textContent = "$" + grandTotal.toFixed(2);
      });
    });
  });


const confirmBtn = document.querySelector(".btn-confirm");
const modalOverlay = document.querySelector(".modal-overlay");
const modalItemsContainer = document.querySelector("#modal-items");
const modalGrandTotal = document.querySelector(".modal-grand-total");

confirmBtn.addEventListener("click", () => {
  modalItemsContainer.innerHTML = "";
  let grandTotal = 0;

  cart.forEach((item) => {
    const itemTotal = item.price * item.quantity;
    grandTotal += itemTotal;

    const modalItem = document.createElement("div");
    modalItem.classList.add("modal-item");

    const leftDiv = document.createElement("div");
    leftDiv.classList.add("modal-item-left");

    const img = document.createElement("img");
    img.src = item.image.thumbnail;
    img.alt = item.name;
    img.classList.add("modal-item-img");

    const infoDiv = document.createElement("div");
    const nameP = document.createElement("p");
    nameP.textContent = item.name;
    nameP.classList.add("modal-item-name");

    const pricingDiv = document.createElement("div");
    pricingDiv.classList.add("modal-item-pricing");
    pricingDiv.innerHTML = `<span class="item-qty">${item.quantity}x</span> <span class="item-unit">@ $${item.price.toFixed(2)}</span>`;

    infoDiv.append(nameP, pricingDiv);
    leftDiv.append(img, infoDiv);

    const totalP = document.createElement("p");
    totalP.classList.add("modal-item-total");
    totalP.textContent = "$" + itemTotal.toFixed(2);

    modalItem.append(leftDiv, totalP);
    modalItemsContainer.append(modalItem);
  });

  modalGrandTotal.textContent = "$" + grandTotal.toFixed(2);
  modalOverlay.style.display = "flex";
});

const newOrderBtn = document.querySelector(".btn-new-order");
newOrderBtn.addEventListener("click", () => {
  location.reload();
});
