function showReceiptFullScreen(imageSrc) {
    const modal = document.getElementById('receipt-modal');
    if (!modal) {
        window.open(imageSrc, '_blank');
        return;
    }

    const image = modal.querySelector('#receipt-modal-image');
    if (image) {
        image.src = imageSrc;
    }

    ensureReceiptModalHandlers();
    modal.classList.add('active');
}

function closeReceiptModal() {
    const modal = document.getElementById('receipt-modal');
    if (!modal) return;

    modal.classList.remove('active');

    const image = modal.querySelector('#receipt-modal-image');
    if (image) {
        image.src = '';
    }
}

function ensureReceiptModalHandlers() {
    const modal = document.getElementById('receipt-modal');
    if (!modal || modal.dataset.bound === 'true') return;

    const closeBtn = modal.querySelector('[data-receipt-close]');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeReceiptModal);
    }

    modal.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeReceiptModal();
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeReceiptModal();
        }
    });

    modal.dataset.bound = 'true';
}
