/* =========================================================================
   The generated website: runtime (runs on the published site)
   It is written as a normal function and copied into the page as text.
   ========================================================================= */
function siteRuntime(C) {
  const d = document, root = d.documentElement;
  root.classList.add("js");
  const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = matchMedia("(pointer: fine)").matches;
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  // Scroll progress
  const bar = d.querySelector(".progress");
  const onScroll = () => { const h = d.documentElement; bar.style.transform = "scaleX(" + (h.scrollTop / ((h.scrollHeight - h.clientHeight) || 1)) + ")"; d.body.classList.toggle("scrolled", h.scrollTop > 10); };
  addEventListener("scroll", onScroll, { passive: true }); onScroll();

  // Reveal on scroll
  const rv = [...d.querySelectorAll(".rv")];
  if (still || !("IntersectionObserver" in window)) rv.forEach((e) => e.classList.add("in"));
  else {
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: 0.12 });
    rv.forEach((e) => io.observe(e));
    setTimeout(() => rv.forEach((e) => e.classList.add("in")), 4000);  // never leave content hidden
  }

  // Count-up numbers
  if (!still && "IntersectionObserver" in window) d.querySelectorAll("[data-count]").forEach((el) => {
    const target = parseFloat(el.dataset.count), suffix = el.dataset.suffix || "", dec = (el.dataset.count.split(".")[1] || "").length;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return; io.disconnect();
      const t0 = performance.now();
      const step = (n) => { const k = Math.min(1, (n - t0) / 1300), v = target * (1 - Math.pow(1 - k, 3)); el.textContent = v.toFixed(dec) + suffix; if (k < 1) requestAnimationFrame(step); };
      requestAnimationFrame(step);
    });
    io.observe(el);
  });

  // Card tilt + spotlight
  if (!still && fine) d.querySelectorAll(".card").forEach((c) => {
    c.addEventListener("pointermove", (e) => {
      const r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      c.style.setProperty("--mx", x * 100 + "%"); c.style.setProperty("--my", y * 100 + "%");
      c.style.transform = "perspective(900px) rotateX(" + ((0.5 - y) * 5).toFixed(2) + "deg) rotateY(" + ((x - 0.5) * 6).toFixed(2) + "deg)";
    });
    c.addEventListener("pointerleave", () => { c.style.transform = ""; });
  });

  // Case-study pop-up
  const dlg = d.getElementById("case");
  d.querySelectorAll("[data-case]").forEach((b) => b.addEventListener("click", () => {
    const tpl = d.getElementById(b.dataset.case);
    dlg.querySelector(".case__body").innerHTML = tpl.innerHTML;
    if (dlg.showModal) dlg.showModal(); else dlg.setAttribute("open", "");
  }));
  dlg.addEventListener("click", (e) => { if (e.target === dlg || e.target.closest("[data-close]")) dlg.close ? dlg.close() : dlg.removeAttribute("open"); });

  // Copy email
  d.querySelectorAll("[data-copy]").forEach((b) => b.addEventListener("click", () => {
    const done = () => { const t = b.textContent; b.textContent = "Copied ✓"; setTimeout(() => { b.textContent = t; }, 1600); };
    if (navigator.clipboard) navigator.clipboard.writeText(b.dataset.copy).then(done, () => {});
  }));

  // Contact form (disabled in the maker's preview)
  const form = d.querySelector(".cform");
  if (form && C.preview) form.addEventListener("submit", (e) => { e.preventDefault(); form.querySelector(".cform__note").textContent = "This is a preview. On your published site, messages go to your email."; });

  // Live GitHub repos + language chart
  const gh = d.getElementById("gh");
  if (gh && C.gh) {
    const off = (msg) => { gh.classList.add("gh--off"); gh.querySelector(".gh__status").textContent = msg; };
    if (C.preview) off("Preview mode: your public repos and language chart load here on the published site.");
    else Promise.all([
      fetch("https://api.github.com/users/" + encodeURIComponent(C.gh)),
      fetch("https://api.github.com/users/" + encodeURIComponent(C.gh) + "/repos?per_page=100&sort=pushed"),
    ]).then(async ([u, r]) => {
      if (!u.ok || !r.ok) throw new Error(u.status === 404 ? "No GitHub user called @" + C.gh + "." : "GitHub is busy right now.");
      const user = await u.json(), repos = (await r.json()).filter((x) => !x.fork);
      const stars = repos.reduce((s, x) => s + x.stargazers_count, 0);
      const langs = {}; repos.forEach((x) => { if (x.language) langs[x.language] = (langs[x.language] || 0) + 1; });
      const entries = Object.entries(langs).sort((a, b) => b[1] - a[1]); const top = entries.slice(0, 5);
      const rest = entries.slice(5).reduce((s, e) => s + e[1], 0); if (rest) top.push(["Other", rest]);
      const total = top.reduce((s, e) => s + e[1], 0) || 1;
      gh.querySelector(".gh__kpis").innerHTML = [["Public repos", user.public_repos], ["Followers", user.followers], ["Stars earned", stars], ["Top language", entries[0] ? entries[0][0] : "—"]]
        .map(([k, v]) => '<div class="kpi"><span>' + esc(k) + '</span><b>' + esc(v) + '</b></div>').join("");
      let acc = 0; const R = 15.915;
      const arcs = top.map(([n, c], i) => { const p = c / total * 100, a = '<circle r="' + R + '" cx="21" cy="21" fill="none" stroke="' + C.series[i % C.series.length] + '" stroke-width="6" stroke-dasharray="' + p.toFixed(2) + ' ' + (100 - p).toFixed(2) + '" stroke-dashoffset="' + (25 - acc).toFixed(2) + '"/>'; acc += p; return a; }).join("");
      gh.querySelector(".gh__donut").innerHTML = top.length ? '<svg viewBox="0 0 42 42" role="img" aria-label="Languages across public repos">' + arcs + '<text x="21" y="22.6" text-anchor="middle">' + repos.length + '</text><text x="21" y="27" text-anchor="middle" class="sm">repos</text></svg><ul>' +
        top.map(([n, c], i) => '<li><i style="background:' + C.series[i % C.series.length] + '"></i>' + esc(n) + '<span>' + Math.round(c / total * 100) + '%</span></li>').join("") + '</ul>' : "";
      const best = repos.slice().sort((a, b) => b.stargazers_count - a.stargazers_count || new Date(b.pushed_at) - new Date(a.pushed_at)).slice(0, 6);
      gh.querySelector(".gh__repos").innerHTML = best.map((x) => '<a class="repo" href="' + esc(x.html_url) + '" target="_blank" rel="noopener"><b>' + esc(x.name) + '</b><p>' + esc(x.description || "No description yet.") + '</p><span class="repo__meta">' +
        (x.language ? '<i style="background:' + C.series[Math.max(0, top.findIndex((t) => t[0] === x.language)) % C.series.length] + '"></i>' + esc(x.language) : "") + '<span>★ ' + x.stargazers_count + '</span><span>' + new Date(x.pushed_at).toLocaleDateString(undefined, { month: "short", year: "numeric" }) + '</span></span></a>').join("") || '<p class="muted">No public repos yet.</p>';
      gh.classList.add("gh--on"); gh.querySelector(".gh__status").textContent = "Live from the GitHub API · updated " + new Date().toLocaleDateString(undefined, { day: "numeric", month: "short" });
    }).catch((e) => off((e && e.message ? e.message + " " : "") + "See everything on GitHub instead."));
  }

  // Background animation
  const cv = d.getElementById("bgfx"); if (!cv) return;
  const ctx = cv.getContext("2d"); let W = 0, H = 0, dpr = Math.min(2, devicePixelRatio || 1);
  const size = () => { W = cv.clientWidth; H = cv.clientHeight; cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); };
  size(); addEventListener("resize", size);
  const col = C.colors; let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const gauss = () => { let u = 0, v = 0; while (!u) u = rnd(); while (!v) v = rnd(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); };
  const alpha = (hex, a) => { const n = parseInt(hex.slice(1), 16); return "rgba(" + (n >> 16) + "," + (n >> 8 & 255) + "," + (n & 255) + "," + a + ")"; };
  let draw;
  if (C.motif === "scatter") {
    const pts = Array.from({ length: 110 }, (_, i) => ({ c: i % 3, ox: gauss(), oy: gauss(), ph: rnd() * 6.28 }));
    draw = (t) => {
      ctx.clearRect(0, 0, W, H);
      ctx.strokeStyle = alpha(col.muted, 0.12); ctx.lineWidth = 1;
      for (let x = 0; x < W; x += 80) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
      for (let y = 0; y < H; y += 80) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
      const centers = [[0.22 + 0.05 * Math.sin(t / 5200), 0.3 + 0.06 * Math.cos(t / 4300)], [0.74 + 0.05 * Math.cos(t / 6100), 0.38 + 0.07 * Math.sin(t / 4700)], [0.5 + 0.08 * Math.sin(t / 7300), 0.78 + 0.04 * Math.cos(t / 3900)]];
      const cs = [col.accent, col.accent2, col.muted];
      pts.forEach((p) => { const c = centers[p.c], x = (c[0] + p.ox * 0.07 + 0.006 * Math.sin(t / 900 + p.ph)) * W, y = (c[1] + p.oy * 0.07 + 0.006 * Math.cos(t / 1100 + p.ph)) * H;
        ctx.fillStyle = alpha(cs[p.c], 0.55); ctx.beginPath(); ctx.arc(x, y, 3.2, 0, 6.28); ctx.fill(); });
      centers.forEach((c, i) => { ctx.strokeStyle = alpha(cs[i], 0.6); ctx.lineWidth = 1.5; const x = c[0] * W, y = c[1] * H; ctx.beginPath(); ctx.moveTo(x - 8, y); ctx.lineTo(x + 8, y); ctx.moveTo(x, y - 8); ctx.lineTo(x, y + 8); ctx.stroke(); });
    };
  } else if (C.motif === "network") {
    const n = Math.round(Math.min(80, W * H / 16000)), ps = Array.from({ length: n }, () => ({ x: rnd() * W, y: rnd() * H, vx: (rnd() - 0.5) * 0.25, vy: (rnd() - 0.5) * 0.25 }));
    draw = () => {
      ctx.clearRect(0, 0, W, H);
      ps.forEach((p) => { p.x += p.vx; p.y += p.vy; if (p.x < 0 || p.x > W) p.vx *= -1; if (p.y < 0 || p.y > H) p.vy *= -1; });
      for (let i = 0; i < ps.length; i++) for (let j = i + 1; j < ps.length; j++) { const a = ps[i], b = ps[j], dd = Math.hypot(a.x - b.x, a.y - b.y); if (dd < 150) { ctx.strokeStyle = alpha(i % 2 ? col.accent : col.accent2, 0.28 * (1 - dd / 150)); ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); } }
      ps.forEach((p, i) => { ctx.fillStyle = alpha(i % 2 ? col.accent : col.accent2, 0.7); ctx.beginPath(); ctx.arc(p.x, p.y, 2.2, 0, 6.28); ctx.fill(); });
    };
  } else if (C.motif === "ridgeline") {
    draw = (t) => {
      ctx.clearRect(0, 0, W, H);
      const rows = 16, gap = H / (rows + 2);
      for (let r = 0; r < rows; r++) {
        const base = gap * (r + 2); ctx.beginPath(); ctx.moveTo(0, base);
        for (let x = 0; x <= W; x += 8) { const u = x / W, peak = Math.exp(-Math.pow((u - 0.5 - 0.18 * Math.sin(r * 1.7 + t / 4000)) / 0.13, 2));
          const y = base - gap * 2.2 * peak * (0.6 + 0.4 * Math.sin(t / 1800 + r)) - 4 * Math.sin(u * 22 + r + t / 700); ctx.lineTo(x, y); }
        ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.closePath(); ctx.fillStyle = col.bg; ctx.fill();
        ctx.strokeStyle = alpha(r % 3 ? col.accent : col.accent2, 0.5); ctx.lineWidth = 1.4; ctx.stroke();
      }
    };
  } else if (C.motif === "rain") {
    const cw = 18, cols = Math.ceil(W / cw), ys = Array.from({ length: cols }, () => rnd() * H), sp = Array.from({ length: cols }, () => 0.6 + rnd() * 1.6);
    const glyphs = "0123456789.%Σμσ∂λ{}[]<>=+";
    ctx.font = "13px " + C.mono;
    draw = () => {
      ctx.fillStyle = alpha(col.bg, 0.18); ctx.fillRect(0, 0, W, H); ctx.font = "13px " + C.mono;
      for (let i = 0; i < cols; i++) { const ch = glyphs[Math.floor(rnd() * glyphs.length)]; ctx.fillStyle = alpha(i % 4 ? col.accent : col.accent2, 0.6); ctx.fillText(ch, i * cw, ys[i]); ys[i] += sp[i] * 6; if (ys[i] > H + 20) ys[i] = -20 - rnd() * 200; }
    };
  } else {
    const bins = 48;
    draw = (t) => {
      ctx.clearRect(0, 0, W, H); const bw = W / bins;
      for (let i = 0; i < bins; i++) { const u = i / (bins - 1), g = Math.exp(-Math.pow((u - 0.5 - 0.12 * Math.sin(t / 3000)) / 0.17, 2)), h = (0.08 + 0.85 * g * (0.75 + 0.25 * Math.sin(t / 600 + i * 0.7))) * H * 0.42;
        ctx.fillStyle = alpha(i % 6 ? col.accent : col.accent2, 0.32); ctx.fillRect(i * bw + 2, H - h, bw - 4, h); }
      ctx.strokeStyle = alpha(col.text, 0.35); ctx.lineWidth = 1.5; ctx.beginPath();
      for (let i = 0; i <= 100; i++) { const u = i / 100, g = Math.exp(-Math.pow((u - 0.5 - 0.12 * Math.sin(t / 3000)) / 0.17, 2)); const y = H - (0.08 + 0.85 * g) * H * 0.42; i ? ctx.lineTo(u * W, y) : ctx.moveTo(u * W, y); }
      ctx.stroke();
    };
  }
  if (still) { draw(4000); return; }
  let last = 0;
  const loop = (t) => { if (!d.hidden && t - last > 30) { draw(t); last = t; } requestAnimationFrame(loop); };
  requestAnimationFrame(loop);
}
