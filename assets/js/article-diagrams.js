const diagrams = [...document.querySelectorAll('.post-content .mermaid')].map((source) => {
    const frame = document.createElement('figure');
    frame.className = 'article-diagram';
    source.before(frame);
    frame.append(source);
    return { frame, source, text: source.textContent };
});

if (diagrams.length) {
    let dialog;
    let trigger;
    function openDiagram(button) {
        if (typeof HTMLDialogElement === 'undefined') return;
        if (!dialog) {
            dialog = document.createElement('dialog');
            dialog.className = 'image-lightbox diagram-lightbox';
            dialog.setAttribute('aria-label', '图表预览');
            dialog.innerHTML = '<span class="diagram-preview-hint">点击图表查看原尺寸</span><button type="button" class="image-lightbox-close" aria-label="关闭图表预览" autofocus>×</button><div class="image-lightbox-viewport"><button type="button" class="image-lightbox-size" aria-label="按原始尺寸查看图表" aria-pressed="false"></button></div>';
            document.body.append(dialog);
            dialog.querySelector('.image-lightbox-close').addEventListener('click', () => dialog.close());
            dialog.addEventListener('click', (event) => {
                if (event.target === dialog || event.target.classList.contains('image-lightbox-viewport')) dialog.close();
            });
            const size = dialog.querySelector('.image-lightbox-size');
            size.addEventListener('click', () => {
                const zoomed = size.getAttribute('aria-pressed') !== 'true';
                size.setAttribute('aria-pressed', String(zoomed));
                size.setAttribute('aria-label', zoomed ? '适应屏幕查看图表' : '按原始尺寸查看图表');
                dialog.querySelector('.diagram-preview-hint').textContent = zoomed ? '点击图表适应屏幕' : '点击图表查看原尺寸';
            });
            dialog.addEventListener('close', () => {
                document.documentElement.classList.remove('image-lightbox-open');
                size.replaceChildren();
                trigger?.focus({ preventScroll: true });
            });
        }
        trigger = button;
        const svg = button.querySelector('svg');
        const size = dialog.querySelector('.image-lightbox-size');
        // Mermaid scopes its styles and marker references to the render ID.
        size.innerHTML = svg.outerHTML.replaceAll(svg.id, `${svg.id}-preview`);
        size.setAttribute('aria-pressed', 'false');
        size.setAttribute('aria-label', '按原始尺寸查看图表');
        dialog.querySelector('.diagram-preview-hint').textContent = '点击图表查看原尺寸';
        dialog.showModal();
        document.documentElement.classList.add('image-lightbox-open');
        dialog.querySelector('.image-lightbox-viewport').scrollTo(0, 0);
    }

    function showFailure(item) {
        const details = document.createElement('details');
        const summary = document.createElement('summary');
        summary.textContent = '图表暂时无法显示，查看源文';
        details.append(summary, item.source);
        item.frame.replaceChildren(details);
    }

    try {
        const { default: mermaid } = await import('https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs');
        let version = 0;
        let running = false;
        let serial = 0;
        async function renderDiagrams() {
            version++;
            if (running) return;
            running = true;
            let rendered;
            do {
                rendered = version;
                const style = getComputedStyle(document.body);
                const color = (name) => style.getPropertyValue(name).trim();
                mermaid.initialize({
                    startOnLoad: false,
                    securityLevel: 'strict',
                    theme: 'base',
                    themeVariables: {
                        darkMode: document.body.classList.contains('dark'),
                        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                        fontSize: '16px',
                        primaryColor: color('--diagram-fill'),
                        primaryTextColor: color('--diagram-ink'),
                        primaryBorderColor: color('--diagram-line'),
                        secondaryColor: color('--code-surface'),
                        tertiaryColor: color('--code-surface'),
                        lineColor: color('--diagram-line'),
                        textColor: color('--diagram-ink'),
                        edgeLabelBackground: color('--code-surface'),
                        clusterBkg: color('--code-surface'),
                        clusterBorder: color('--diagram-line')
                    }
                });
                for (const item of diagrams) {
                    const id = `article-diagram-${serial++}`;
                    try {
                        const { svg } = await mermaid.render(id, item.text);
                        if (rendered !== version) break;
                        const button = document.createElement('button');
                        button.type = 'button';
                        button.className = 'diagram-zoom';
                        button.setAttribute('aria-label', '放大图表');
                        button.setAttribute('aria-haspopup', 'dialog');
                        button.title = '点击放大图表';
                        button.innerHTML = svg;
                        const graphic = button.querySelector('svg');
                        const bounds = graphic.viewBox.baseVal;
                        graphic.setAttribute('width', bounds.width);
                        graphic.setAttribute('height', bounds.height);
                        graphic.style.cssText = 'max-width:none';
                        const scroll = document.createElement('div');
                        scroll.className = 'diagram-scroll';
                        scroll.append(button);
                        const caption = document.createElement('figcaption');
                        caption.textContent = '点击图表放大';
                        item.frame.replaceChildren(scroll, caption);
                        button.addEventListener('click', () => openDiagram(button));
                    } catch (_) {
                        document.getElementById(`d${id}`)?.remove();
                        if (rendered === version) showFailure(item);
                    }
                }
            } while (rendered !== version);
            running = false;
        }
        new MutationObserver(renderDiagrams).observe(document.body, { attributes: true, attributeFilter: ['class'] });
        await renderDiagrams();
    } catch (_) {
        diagrams.forEach(showFailure);
    }
}
