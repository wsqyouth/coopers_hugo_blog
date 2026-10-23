const picker = document.querySelector('.theme-picker');
if (picker) {
    const buttons = picker.querySelectorAll('[data-theme]');
    const summary = picker.querySelector('summary');
    function selectTheme(theme) {
        document.body.classList.toggle('dark', theme === 'dark');
        document.body.classList.toggle('warm', theme === 'warm');
        buttons.forEach((button) => {
            button.setAttribute('aria-pressed', String(button.dataset.theme === theme));
        });
    }
    selectTheme(document.body.classList.contains('dark') ? 'dark' :
        document.body.classList.contains('warm') ? 'warm' : 'light');
    buttons.forEach((button) => button.addEventListener('click', () => {
        selectTheme(button.dataset.theme);
        try { localStorage.setItem('pref-theme', button.dataset.theme); } catch (_) {}
        picker.open = false;
        summary.focus();
    }));
    picker.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && picker.open) {
            event.preventDefault();
            picker.open = false;
            summary.focus();
        }
    });
    document.addEventListener('click', (event) => {
        if (!picker.contains(event.target)) picker.open = false;
    });
}
