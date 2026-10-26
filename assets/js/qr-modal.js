/* 二维码放大弹窗：图片即触发器，点一下弹窗放大，不用再切到图片标签页。
 *
 * 用原生 <dialog>：ESC 关闭、焦点管理、::backdrop 遮罩都免费拿到，无需任何依赖。
 * 渐进增强：触发器是 <a href="原图">，脚本不可用或浏览器不支持 showModal 时，
 * 点击照常打开原图（仍可长按保存），功能不失效。
 */
(function () {
    'use strict';

    var triggers = document.querySelectorAll('[data-qr-modal]');
    if (!triggers.length) return;

    function openModal(id) {
        var dlg = document.getElementById(id);
        if (!dlg || typeof dlg.showModal !== 'function' || dlg.open) return false;
        dlg.showModal();
        return true;
    }

    triggers.forEach(function (trigger) {
        trigger.addEventListener('click', function (e) {
            if (openModal(trigger.getAttribute('data-qr-modal'))) {
                e.preventDefault();
            }
            // 弹窗打不开时不 preventDefault —— 让浏览器照常跳到原图。
        });
    });

    // 点遮罩关闭：只有点在弹窗**外面**（::backdrop 区域）才关，
    // 点弹窗内部的留白（padding）不该误关 —— 用坐标与 bounding rect 判定。
    document.querySelectorAll('dialog.qr-modal').forEach(function (dlg) {
        dlg.addEventListener('click', function (e) {
            if (e.target !== dlg) return;
            var r = dlg.getBoundingClientRect();
            var outside = e.clientX < r.left || e.clientX > r.right ||
                e.clientY < r.top || e.clientY > r.bottom;
            if (outside) dlg.close();
        });
    });
})();
