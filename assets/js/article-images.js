// Progressive enhancement: linked images keep their original destination.
(() => {
    const images = document.querySelectorAll('.post-content img:not(.in-text)');
    if (!images.length || typeof HTMLDialogElement === 'undefined') return;

    const dialog = document.createElement('dialog');
    dialog.className = 'image-lightbox';
    dialog.setAttribute('aria-label', '图片预览');
    dialog.innerHTML = `
        <button type="button" class="image-lightbox-close" aria-label="关闭图片预览" autofocus>×</button>
        <div class="image-lightbox-viewport">
            <button type="button" class="image-lightbox-size" aria-label="按原始尺寸查看图片" aria-pressed="false">
                <img alt="">
            </button>
        </div>`;
    document.body.append(dialog);
    const close = dialog.querySelector('.image-lightbox-close');
    const viewport = dialog.querySelector('.image-lightbox-viewport');
    const size = dialog.querySelector('.image-lightbox-size');
    const preview = size.querySelector('img');
    let trigger;

    close.addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', (event) => {
        if (event.target === dialog || event.target === viewport) dialog.close();
    });
    size.addEventListener('click', () => {
        const zoomed = size.getAttribute('aria-pressed') !== 'true';
        size.setAttribute('aria-pressed', String(zoomed));
        size.setAttribute('aria-label', zoomed ? '适应屏幕查看图片' : '按原始尺寸查看图片');
        viewport.scrollTo(0, 0);
    });
    dialog.addEventListener('close', () => {
        document.documentElement.classList.remove('image-lightbox-open');
        size.setAttribute('aria-pressed', 'false');
        size.setAttribute('aria-label', '按原始尺寸查看图片');
        preview.removeAttribute('src');
        trigger?.focus({ preventScroll: true });
    });

    images.forEach((img) => {
        if (img.closest('a, button')) return;
        function enableZoom() {
            if (!img.naturalWidth) return;
            const media = img.closest('picture') || img;
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'image-zoom';
            if (img.classList.contains('image-wide')) button.classList.add('image-wide');
            button.setAttribute('aria-haspopup', 'dialog');
            button.setAttribute('aria-label', img.alt ? `放大图片：${img.alt}` : '放大图片');
            media.before(button);
            button.append(media);
            button.addEventListener('click', () => {
                trigger = button;
                preview.src = img.currentSrc || img.src;
                preview.alt = img.alt;
                dialog.showModal();
                document.documentElement.classList.add('image-lightbox-open');
                viewport.scrollTo(0, 0);
            });
        }
        if (img.complete) enableZoom();
        else img.addEventListener('load', enableZoom, { once: true });
    });
})();
