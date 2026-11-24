
document.addEventListener("DOMContentLoaded", () => {

    // ==================================
    // MENÚ
    // ==================================

    const menuBtn = document.getElementById("menuBtn");
    const nav = document.getElementById("nav");
    const sideMenu = document.getElementById("sideMenu");
    const menuOverlay = document.getElementById("menuOverlay");
    const closeMenu = document.getElementById("closeMenu");

    function openMenu() {
        if (sideMenu && menuOverlay) {
            sideMenu.classList.add("active");
            menuOverlay.classList.add("active");
            sideMenu.setAttribute("aria-hidden", "false");
            menuBtn?.setAttribute("aria-expanded", "true");
        } else if (nav) {
            nav.classList.add("active");
        }
    }

    function hideMenu() {
        sideMenu?.classList.remove("active");
        menuOverlay?.classList.remove("active");

        if (sideMenu) {
            sideMenu.setAttribute("aria-hidden", "true");
        }

        menuBtn?.setAttribute("aria-expanded", "false");
        nav?.classList.remove("active");
    }

    menuBtn?.addEventListener("click", () => {
        if (sideMenu) {
            sideMenu.classList.contains("active")
                ? hideMenu()
                : openMenu();
        } else {
            nav?.classList.toggle("active");
        }
    });

    closeMenu?.addEventListener("click", hideMenu);
    menuOverlay?.addEventListener("click", hideMenu);

    document.querySelectorAll(
        "#sideMenu a, #nav a"
    ).forEach(link => {
        link.addEventListener("click", hideMenu);
    });


    // ==================================
    // BUSCADOR Y FILTROS
    // ==================================

    const search = document.getElementById("search");
    const brand = document.getElementById("brand");
    const type = document.getElementById("type");

    const products = document.querySelectorAll(".product");
    const resultCount = document.getElementById("resultCount");
    const clearFilters = document.getElementById("clearFilters");
    const noResults = document.getElementById("noResults");

    function filterProducts() {

        const searchText =
            search?.value.toLowerCase().trim() || "";

        const selectedBrand = brand?.value || "all";
        const selectedType = type?.value || "all";

        let visibleProducts = 0;

        products.forEach(product => {

            const name =
                (product.dataset.name || "").toLowerCase();

            const model =
                (product.dataset.model || "").toLowerCase();

            const productBrand =
                product.dataset.brand || "";

            const productType =
                product.dataset.type || "";

            const matchesSearch =
                name.includes(searchText) ||
                model.toLowerCase().includes(searchText) ||
                productBrand.toLowerCase().includes(searchText) ||
                productType.toLowerCase().includes(searchText);

            const matchesBrand =
                selectedBrand === "all" ||
                productBrand === selectedBrand;

            const matchesType =
                selectedType === "all" ||
                productType === selectedType;

            const visible =
                matchesSearch && matchesBrand && matchesType;

            product.hidden = !visible;

            if (visible) visibleProducts++;

        });

        if (resultCount) {
            resultCount.textContent =
                `${visibleProducts} productos encontrados`;
        }

        if (noResults) {
            noResults.hidden = visibleProducts !== 0;
        }
    }

    search?.addEventListener("input", filterProducts);
    brand?.addEventListener("change", filterProducts);
    type?.addEventListener("change", filterProducts);

    clearFilters?.addEventListener("click", () => {

        if (search) search.value = "";
        if (brand) brand.value = "all";
        if (type) type.value = "all";

        filterProducts();

    });


    // ==================================
    // VENTANA DE DETALLES
    // ==================================

    const modal = document.getElementById("productModal");
    const closeModal = document.getElementById("closeModal");

    const modalTitle = document.getElementById("modalTitle");
    const modalImage = document.getElementById("modalImage");
    const modalDescription =
        document.getElementById("modalDescription");

    const modalTechnology =
        document.getElementById("modalTechnology");

    const modalPrice = document.getElementById("modalPrice");
    const modalWhatsApp =
        document.getElementById("modalWhatsApp");

    let selectedProduct = null;

    function openProductModal(product) {

        if (!product || !modal) return;

        selectedProduct = product;

        const image = product.querySelector(".product-image img");

        if (modalImage && image) {
            modalImage.src = image.src;
            modalImage.alt = image.alt;
        }

        if (modalTitle) {
            modalTitle.textContent =
                product.dataset.name || "Producto SCREENLAB";
        }

        if (modalDescription) {
            modalDescription.textContent =
                product.dataset.description || "";
        }

        if (modalTechnology) {
            modalTechnology.textContent =
                `Marca: ${product.dataset.brand || "Consultar"} · ` +
                `Tecnología: ${product.dataset.type || "Consultar"}`;
        }

        if (modalPrice) {
            modalPrice.textContent =
                `Bs ${product.dataset.price || "Consultar"}`;
        }

        modal.classList.add("active");
        modal.setAttribute("aria-hidden", "false");

        document.body.classList.add("modal-open");

        closeModal?.focus();
    }

    function closeProductModal() {

        if (!modal) return;

        modal.classList.remove("active");
        modal.setAttribute("aria-hidden", "true");

        document.body.classList.remove("modal-open");

        selectedProduct = null;
    }

    // Detectar botones de detalles
    document.addEventListener("click", event => {

        const button = event.target.closest(".details-btn");

        if (!button) return;

        const product = button.closest(".product");

        openProductModal(product);

    });

    closeModal?.addEventListener("click", closeProductModal);

    modal?.addEventListener("click", event => {

        if (event.target === modal) {
            closeProductModal();
        }

    });

    document.addEventListener("keydown", event => {

        if (event.key === "Escape") {
            closeProductModal();
            hideMenu();
        }

    });


    // ==================================
    // WHATSAPP
    // ==================================

    const whatsappNumber = "59170036675";

    function sendWhatsApp(product) {

        if (!product) return;

        const name =
            product.dataset.name || "Producto SCREENLAB";

        const model =
            product.dataset.model || "No especificado";

        const price =
            product.dataset.price || "Consultar";

        const message =
            "Hola, SCREENLAB. Quiero consultar por este producto:\n\n" +
            "Producto: " + name + "\n" +
            "Modelo: " + model + "\n" +
            "Precio: Bs " + price + "\n\n" +
            "¿Tienen disponibilidad?";

        const url =
            "https://wa.me/" + whatsappNumber +
            "?text=" + encodeURIComponent(message);

        // Abrir WhatsApp
        window.location.href = url;
    }

    // Botones WhatsApp de cada producto
    document.addEventListener("click", event => {

        const button = event.target.closest(".whatsapp-btn");

        if (!button) return;

        const product = button.closest(".product");

        sendWhatsApp(product);

    });

    // WhatsApp desde la ventana de detalles
    modalWhatsApp?.addEventListener("click", () => {

        if (selectedProduct) {
            sendWhatsApp(selectedProduct);
        }

    });


    // ==================================
    // INICIALIZACIÓN
    // ==================================

    filterProducts();

});
