(() => {
    const params = new URLSearchParams(window.location.search);
    const selected = [...document.querySelectorAll("[data-picks-filter]")].find(
        ({ dataset }) => params.get(dataset.picksFilter) === dataset.picksValue
    );
    if (!selected) return;

    const { picksFilter, picksValue } = selected.dataset;
    const cards = document.querySelector("[data-picks-list]").children;
    let count = 0;
    for (const card of cards) {
        card.hidden = card.dataset[picksFilter] !== picksValue;
        if (!card.hidden) count++;
    }

    selected.setAttribute("aria-current", "true");
    const summary = document.querySelector("[data-picks-summary]");
    const label = selected.querySelector("[data-picks-label]").textContent;
    summary.querySelector("span").textContent = `${label} · ${count} 篇`;
    summary.hidden = false;
})();
