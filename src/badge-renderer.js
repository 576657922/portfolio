/** Flat ribbon geometry shares the hook position with the metal hardware. */
const f = (value) => value.toFixed(2);
const move = (p) => `${f(p.x)} ${f(p.y)}`;
const line = (points) => `M${points.map(move).join('L')}`;

function band(samples, from, to) {
    const edge = (s, offset) => ({
        x: s.x + s.nx * s.width * offset,
        y: s.y + s.ny * s.width * offset,
    });
    return line(samples.map((s) => edge(s, from))) + 'L'
        + samples.map((s) => edge(s, to)).reverse().map(move).join('L') + 'Z';
}

function edge(samples, offset) {
    return line(samples.map((s) => ({
        x: s.x + s.nx * s.width * offset,
        y: s.y + s.ny * s.width * offset,
    })));
}

// Sample the smooth centerline densely so a ribbon has real edges instead of
// the round caps and overlapping joints of a thick SVG stroke.
function ribbonSamples(points, rear, twist) {
    const centers = [];
    const last = points.length - 1;
    for (let i = 0; i < last; i++) {
        const a = points[Math.max(0, i - 1)];
        const b = points[i];
        const c = points[i + 1];
        const d = points[Math.min(last, i + 2)];
        for (let j = 0; j < 6; j++) {
            const u = j / 6;
            const t = (i + u) / last;
            const interpolate = (key) => 0.5 * (
                2 * b[key] + (-a[key] + c[key]) * u
                + (2 * a[key] - 5 * b[key] + 4 * c[key] - d[key]) * u * u
                + (-a[key] + 3 * b[key] - 3 * c[key] + d[key]) * u * u * u
            );
            // The return side of the neck loop converges into the same clasp.
            const separation = (rear ? 32 : -5) * Math.pow(1 - t, 1.3);
            centers.push({
                x: interpolate('x') + separation,
                y: interpolate('y'),
                t,
            });
        }
    }
    centers.push({ ...points[last], t: 1 });
    return centers.map((p, index) => {
        const a = centers[Math.max(0, index - 1)];
        const b = centers[Math.min(centers.length - 1, index + 1)];
        const length = Math.hypot(b.x - a.x, b.y - a.y) || 1;
        // A small turn through the depth changes the projected fabric width.
        const turn = Math.sin(p.t * Math.PI) * (rear ? 0.8 : 0.58) + twist * 0.004;
        return {
            ...p,
            nx: (b.y - a.y) / length,
            ny: -(b.x - a.x) / length,
            width: (rear ? 7.2 : 9) * (0.96 - 0.12 * p.t) * Math.cos(turn),
        };
    });
}

export function createBadgeRenderer(wrap, card) {
    const ribbons = [...wrap.querySelectorAll('[data-ribbon]')].map((element) => ({
        rear: element.dataset.ribbon === 'rear',
        paths: Object.fromEntries([...element.querySelectorAll('[data-part]')]
            .map((path) => [path.dataset.part, path])),
    }));

    return ({ points, rotation }) => {
        if (points.length < 2) return;
        for (const { rear, paths } of ribbons) {
            const samples = ribbonSamples(points, rear, rotation.y);
            const body = band(samples, -1, 1);
            paths.body.setAttribute('d', body);
            paths.shadow.setAttribute('d', body);
            paths.weave.setAttribute('d', body);
            paths.satin.setAttribute('d', band(samples, -0.75, 0.12));
            paths.left.setAttribute('d', edge(samples, -0.88));
            paths.right.setAttribute('d', edge(samples, 0.88));
            paths.stitch.setAttribute('d', edge(samples, -0.69) + edge(samples, 0.69));
            paths.guide?.setAttribute('d', edge(samples, 0));
        }

        const hook = points[points.length - 1];
        // The card's -32px transform origin is at the loop, so every rotation
        // leaves the fabric, loop and swivel joined without a floating gap.
        card.style.transform = `translate3d(${f(hook.x)}px, ${f(hook.y + 32)}px, 0)`
            + ` translateX(-50%) rotateZ(${f(rotation.z)}deg)`
            + ` rotateY(${f(rotation.y)}deg) rotateX(${f(rotation.x)}deg)`;
        card.style.setProperty('--roty', f(rotation.y));
        card.style.setProperty('--shine-x', `${f(48 - rotation.y * 1.1)}%`);
    };
}
