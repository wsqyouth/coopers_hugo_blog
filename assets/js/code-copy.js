// 代码复制功能
document.addEventListener('DOMContentLoaded', function() {
    // 只为顶层代码块添加复制按钮，避免嵌套元素重复添加
    const codeBlocks = document.querySelectorAll('.post-content > div.highlight, .post-content > pre');

    codeBlocks.forEach(function(codeBlock) {
        // 避免重复添加
        if (codeBlock.querySelector('.code-copy-btn')) {
            return;
        }

        // 避免为已经包含在其他代码块中的元素添加按钮
        const parent = codeBlock.parentElement;
        if (parent && parent.classList.contains('highlight')) {
            return;
        }

        // 创建复制按钮
        const copyButton = document.createElement('button');
        copyButton.className = 'code-copy-btn';
        copyButton.innerHTML = `
            <svg class="copy-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
            <span class="copy-text">复制</span>
        `;
        copyButton.title = '复制代码';

        // 点击复制
        copyButton.addEventListener('click', async function(e) {
            e.preventDefault();
            e.stopPropagation();

            // 获取代码内容 - 优化的提取逻辑，避免重复
            let textToCopy = '';

            // 方法1: 尝试从 table 结构获取（Hugo 带行号的格式）
            const codeTable = codeBlock.querySelector('table.lntable');
            if (codeTable) {
                // 获取所有代码行（第二列的所有 td）
                const codeCells = codeTable.querySelectorAll('tbody tr td:nth-child(2)');
                if (codeCells.length > 0) {
                    // 每个 td 是一行代码
                    textToCopy = Array.from(codeCells)
                        .map(td => td.textContent || td.innerText || '')
                        .join('\n');
                }
            }

            // 方法2: 如果没有 table，从普通 code 元素获取
            if (!textToCopy) {
                // 先尝试找到最深层的 code 元素
                const codeElement = codeBlock.querySelector('pre code');
                if (codeElement) {
                    textToCopy = codeElement.textContent || codeElement.innerText || '';
                }
            }

            // 方法3: 从 pre 元素获取（但排除 table）
            if (!textToCopy) {
                const preElement = codeBlock.querySelector('div:not(.lntable) > pre');
                if (preElement && !preElement.querySelector('table')) {
                    textToCopy = preElement.textContent || preElement.innerText || '';
                }
            }

            // 清理文本：移除行号和多余空白
            if (textToCopy) {
                const lines = textToCopy.split('\n');
                textToCopy = lines
                    .map(line => {
                        // 移除开头的纯数字行号（如 "1 ", "2 " 等）
                        return line.replace(/^\s*\d+\s+/, '');
                    })
                    .join('\n')
                    .trim();

                // 调试：输出到控制台（生产环境可删除）
                console.log('复制的代码长度:', textToCopy.length, '行数:', textToCopy.split('\n').length);

                // 去除可能的重复
                // 按行检测是否整体重复
                const allLines = textToCopy.split('\n');
                const lineCount = allLines.length;
                if (lineCount > 0 && lineCount % 2 === 0) {
                    const halfCount = lineCount / 2;
                    const firstHalfLines = allLines.slice(0, halfCount);
                    const secondHalfLines = allLines.slice(halfCount);

                    // 检查两半是否完全相同
                    const isDuplicate = firstHalfLines.every((line, index) =>
                        line === secondHalfLines[index]
                    );

                    if (isDuplicate) {
                        console.log('检测到重复内容，已去重');
                        textToCopy = firstHalfLines.join('\n');
                    }
                }
            }

            try {
                // 使用现代 Clipboard API
                await navigator.clipboard.writeText(textToCopy);

                // 显示成功提示
                copyButton.classList.add('copied');
                copyButton.innerHTML = `
                    <svg class="check-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    <span class="copy-text">已复制</span>
                `;

                // 2秒后恢复按钮状态
                setTimeout(() => {
                    copyButton.classList.remove('copied');
                    copyButton.innerHTML = `
                        <svg class="copy-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                        </svg>
                        <span class="copy-text">复制</span>
                    `;
                }, 2000);
            } catch (err) {
                // 降级方案：使用 execCommand
                const textarea = document.createElement('textarea');
                textarea.value = textToCopy;
                textarea.style.position = 'fixed';
                textarea.style.opacity = '0';
                document.body.appendChild(textarea);
                textarea.select();

                try {
                    document.execCommand('copy');
                    copyButton.innerHTML = '✓ 已复制';
                    setTimeout(() => {
                        copyButton.innerHTML = `
                            <svg class="copy-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                            </svg>
                            <span class="copy-text">复制</span>
                        `;
                    }, 2000);
                } catch (err2) {
                    copyButton.innerHTML = '✗ 失败';
                    setTimeout(() => {
                        copyButton.innerHTML = `
                            <svg class="copy-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                            </svg>
                            <span class="copy-text">复制</span>
                        `;
                    }, 2000);
                }

                document.body.removeChild(textarea);
            }
        });

        // 将按钮添加到代码块
        codeBlock.style.position = 'relative';
        codeBlock.appendChild(copyButton);
    });
});
