
(function () {

    const images = document.querySelectorAll(".certificado__image, .project__image");
    const certificadoButtons = document.querySelectorAll(".btn-certificado");

    if (!images.length) return; // si no hay imágenes, no hace nada

    // Crear modal dinámicamente (solo una vez)
    const modal = document.createElement("div");
    modal.id = "imageModal";
    modal.className = "modal";

    modal.innerHTML = `
        <span class="modal__close">&times;</span>
        <img class="modal__content" id="modalImg">
    `;

    document.body.appendChild(modal);

    const modalImg = modal.querySelector("#modalImg");
    const closeBtn = modal.querySelector(".modal__close");

    let scale = 1;
    let isDragging = false;
    let startX, startY;
    let translateX = 0;
    let translateY = 0;

    function updateTransform() {
        modalImg.style.transform =
            `translate(${translateX}px, ${translateY}px) scale(${scale})`;
    }

    function resetZoom() {
        scale = 1;
        translateX = 0;
        translateY = 0;
        updateTransform();
    }

    function openModal(src) {
        modal.classList.add("active");
        modalImg.src = src;
        document.body.style.overflow = "hidden";
        resetZoom();
    }

    function closeModal() {
        modal.classList.remove("active");
        document.body.style.overflow = "auto";
        resetZoom();
    }

    // Click en imágenes
    images.forEach(img => {
        img.style.cursor = "pointer";
        img.addEventListener("click", () => openModal(img.src));
    });

    // Click en botones de certificado
    certificadoButtons.forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();

            const card = btn.closest(".project__card");
            const img = card.querySelector(".certificado__image");

            if (img) {
                openModal(img.src);
            }
        });
    });

    // Zoom con rueda
    modalImg.addEventListener("wheel", (e) => {
        e.preventDefault();
        scale += e.deltaY * -0.001;
        scale = Math.min(Math.max(1, scale), 4);
        updateTransform();
    });

    // Drag
    modalImg.addEventListener("mousedown", (e) => {
        if (scale <= 1) return;
        isDragging = true;
        modalImg.style.cursor = "grabbing";
        startX = e.clientX - translateX;
        startY = e.clientY - translateY;
    });

    document.addEventListener("mousemove", (e) => {
        if (!isDragging) return;
        translateX = e.clientX - startX;
        translateY = e.clientY - startY;
        updateTransform();
    });

    document.addEventListener("mouseup", () => {
        isDragging = false;
        modalImg.style.cursor = "grab";
    });

    // Cerrar
    closeBtn.addEventListener("click", closeModal);

    modal.addEventListener("click", (e) => {
        if (e.target === modal) closeModal();
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") closeModal();
    });

})();
