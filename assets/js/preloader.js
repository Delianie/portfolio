/* ============================================================
   PRELOADER
============================================================ */

window.Preloader = (() => {

    function buildList(projects) {

        return projects
            .filter(project => project.slider)
            .map(project => ({
                slug: project.slug,
                file: project.slider,
                src: `media/${project.slug}/${project.slider}`
            }));

    }

    function preloadImage(item) {

        return new Promise(resolve => {

            const img = new Image();

            img.onload = () => resolve(item);
            img.onerror = () => resolve(item);

            img.src = item.src;

        });

    }

    function appendLine(tree, item, isLast) {

        const branch = isLast ? "└── " : "├── ";

        const line = document.createElement("div");
        line.className = "preloader-line";
        line.textContent = `${branch}${item.slug}/${item.file}`;

        tree.appendChild(line);

    }

    function updatePercent(percentEl, loaded, total) {

        const percent = Math.round((loaded / total) * 100);
        percentEl.textContent = `${percent}%`;

    }

    function hide(preloader) {

        preloader.classList.add("is-hidden");

        setTimeout(() => {
            preloader.remove();
        }, 600);

    }

    async function run(projects) {

        const preloader = document.getElementById("preloader");
        if (!preloader) return;

        const tree = document.getElementById("preloader-tree");
        const percentEl = document.getElementById("preloader-percent");

        const items = buildList(projects);
        const total = items.length;

        if (total === 0) {
            hide(preloader);
            return;
        }

        const pending = items.map(preloadImage);

        for (let i = 0; i < pending.length; i++) {

            await pending[i];

            if (tree) appendLine(tree, items[i], i === items.length - 1);
            if (percentEl) updatePercent(percentEl, i + 1, total);

        }

        await new Promise(resolve => setTimeout(resolve, 250));

        hide(preloader);

    }

    return { run };

})();
