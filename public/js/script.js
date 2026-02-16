document.addEventListener("DOMContentLoaded", () => {
  const cart = document.querySelector(".shopping-list");
  if (!cart) return;

  // Create a floating toggle button
  const toggleButton = document.createElement("button");
  toggleButton.textContent = "Toggle Cart";
  toggleButton.setAttribute("aria-expanded", "false");
  toggleButton.setAttribute("aria-controls", "shopping-list");
  Object.assign(toggleButton.style, {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    padding: "10px 14px",
    backgroundColor: "#0077cc",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
    cursor: "pointer",
    zIndex: "1200",
    fontWeight: "600"
  });
  document.body.appendChild(toggleButton);

  // Ensure the cart has an id for aria-controls
  if (!cart.id) cart.id = "shopping-list";

  // Helpers
  const showCart = () => {
    cart.style.display = "block";
    toggleButton.setAttribute("aria-expanded", "true");
  };

  const hideCart = () => {
    cart.style.display = "none";
    toggleButton.setAttribute("aria-expanded", "false");
  };

  const toggleCart = () => {
    const isVisible = cart.style.display === "block";
    isVisible ? hideCart() : showCart();
  };

  // Toggle on button click
  toggleButton.addEventListener("click", toggleCart);

  // Close when clicking outside
  document.addEventListener("click", (e) => {
    const clickedInsideCart = cart.contains(e.target);
    const clickedToggle = toggleButton.contains(e.target);
    if (!clickedInsideCart && !clickedToggle && cart.style.display === "block") {
      hideCart();
    }
  });

  // Close with Esc
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && cart.style.display === "block") hideCart();
  });

  // Responsive behavior: click-to-open on mobile, hover on desktop
  const applyResponsiveBehavior = () => {
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    if (isMobile) {
      cart.classList.add("js-controlled");
      hideCart();
    } else {
      cart.classList.remove("js-controlled");
    }
  };

  applyResponsiveBehavior();
  window.addEventListener("resize", applyResponsiveBehavior);
});
