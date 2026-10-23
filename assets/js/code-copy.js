// Copy only the code node; never infer line numbers or deduplicate source text.
(() => {
    document.querySelectorAll('.post-content .highlight, .post-content pre').forEach((block) => {
        if (block.matches('pre') && (block.closest('.highlight') || block.matches('.mermaid'))) return;
        const code = block.querySelector('.lntd:last-child code') || block.querySelector('code');
        if (!code) return;
        const source = code.cloneNode(true);
        source.querySelectorAll('.ln, .lnt').forEach((number) => number.remove());
        const text = source.textContent;
        block.classList.add('code-panel');
        if (text.split('\n').filter((_, i, lines) => i < lines.length - 1 || lines[i]).length <= 8) {
            block.classList.add('code-panel-short');
        }
        const custom = block.closest('.pe-code-block-wrap');
        let header = custom?.querySelector('.pe-code-block-header');
        if (!header) {
            header = document.createElement('div');
            header.className = 'code-header';
            const language = document.createElement('span');
            language.textContent = code.dataset.lang || 'text';
            header.append(language);
            block.prepend(header);
        }
        const button = custom?.querySelector('.pe-code-copy-button') || document.createElement('button');
        button.type = 'button';
        button.className = 'code-copy-btn';
        button.textContent = '复制';
        button.setAttribute('aria-label', '复制代码');
        const status = document.createElement('span');
        status.className = 'code-copy-status';
        status.setAttribute('role', 'status');
        header.append(button, status);
        let reset;
        button.addEventListener('click', async (event) => {
            event.stopPropagation();
            clearTimeout(reset);
            button.disabled = true;
            try {
                if (navigator.clipboard?.writeText) {
                    await navigator.clipboard.writeText(text);
                } else {
                    const input = document.createElement('textarea');
                    input.value = text;
                    input.style.cssText = 'position:fixed;left:-9999px;top:0';
                    document.body.append(input);
                    input.select();
                    try {
                        if (!document.execCommand('copy')) throw new Error('Copy failed');
                    } finally {
                        input.remove();
                        button.focus({ preventScroll: true });
                    }
                }
                button.textContent = '已复制';
                status.textContent = '代码已复制';
            } catch (_) {
                button.textContent = '请手动复制';
                status.textContent = '复制失败，请选中代码手动复制';
            } finally {
                button.disabled = false;
                reset = setTimeout(() => {
                    button.textContent = '复制';
                    status.textContent = '';
                }, 2500);
            }
        });
    });
})();
