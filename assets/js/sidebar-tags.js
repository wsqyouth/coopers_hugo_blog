// Preserve the original DOM, form state and scroll position when switching views.
document.querySelectorAll('.main-container').forEach((layout) => {
    const original = layout.querySelector('.content-left');
    const template = layout.querySelector('[data-tags-directory]');
    const toggles = layout.querySelectorAll('[data-tags-toggle]');
    if (!original || !template || !toggles.length) return;

    const panel = document.createElement('div');
    panel.id = 'all-tags-panel';
    panel.className = 'content-left';
    panel.hidden = true;
    panel.append(template.content.cloneNode(true));
    original.after(panel);
    const heading = panel.querySelector('h1');
    let previousScroll = 0;
    let trigger = null;

    function setOpen(opening) {
        original.hidden = opening;
        panel.hidden = !opening;
        toggles.forEach((toggle) => {
            toggle.setAttribute('aria-expanded', String(opening));
            toggle.textContent = opening ? '收起全部标签 ←' : '全部标签 →';
        });
        if (opening) {
            heading.focus({ preventScroll: true });
            panel.scrollIntoView({ block: 'start', behavior: 'instant' });
        } else {
            // A viewport change may hide the original trigger. Use the visible one.
            const target = trigger?.getClientRects().length ? trigger :
                Array.from(toggles).find((toggle) => toggle.getClientRects().length);
            target?.focus({ preventScroll: true });
            window.scrollTo({ top: previousScroll, behavior: 'instant' });
        }
    }

    toggles.forEach((toggle) => {
        toggle.setAttribute('role', 'button');
        toggle.setAttribute('aria-controls', panel.id);
        toggle.setAttribute('aria-expanded', 'false');
        toggle.addEventListener('click', (event) => {
            if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
            event.preventDefault();
            const opening = panel.hidden;
            if (opening) {
                previousScroll = window.scrollY;
                trigger = toggle;
            }
            setOpen(opening);
        });
        toggle.addEventListener('keydown', (event) => {
            if (event.key === ' ') {
                event.preventDefault();
                toggle.click();
            }
        });
    });
    panel.querySelector('[data-tags-return]').addEventListener('click', () => setOpen(false));
    panel.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            event.preventDefault();
            setOpen(false);
        }
    });
});
