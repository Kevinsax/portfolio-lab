/* =========================================================================
   The generated website: markup + styles
   ========================================================================= */
function buildSite(p, opts = {}) {
  const pick = resolveDesign(p.design);
  const pal = PALETTES[pick.palette], font = FONTS[pick.fonts], hero = HEROES[pick.hero].id, motif = MOTIFS[pick.motif].id, cards = CARDS[pick.cards].id;
  const name = p.name || "Your Name", first = name.split(/\s+/)[0];
  const stats = parseStats(p.stats), skills = parseSkills(p.skills);
  const projects = (p.projects || []).filter((x) => x.title || x.summary);
  const gh = String(p.github || "").trim().replace(/^@/, "").replace(/^https?:\/\/github\.com\//i, "").split("/")[0];
  const email = String(p.email || "").trim();
  const links = [
    gh && ["GitHub", "https://github.com/" + gh], p.linkedin && ["LinkedIn", safeUrl(p.linkedin)], p.x && ["X", safeUrl(p.x)],
    p.website && ["Website", safeUrl(p.website)], p.cv && ["CV", safeUrl(p.cv)],
  ].filter((l) => l && l[1]);
  const year = new Date().getFullYear();
  const photo = p.photo
    ? `<img src="${p.photo}" alt="Photo of ${esc(name)}" class="avatar__img">`
    : `<div class="avatar__mono" aria-label="${esc(name)}">${esc(initials(name))}</div>`;
  const status = p.status ? `<span class="status"><i></i>${esc(p.status)}</span>` : "";
  const ctas = `<div class="ctas">${projects.length ? `<a class="btn btn--main" href="#work">See my work</a>` : ""}${email ? `<a class="btn" href="#contact">Get in touch</a>` : ""}${p.cv ? `<a class="btn btn--ghost" href="${esc(safeUrl(p.cv))}" target="_blank" rel="noopener">CV ↗</a>` : ""}</div>`;
  const statTiles = stats.map((s, i) => `<div class="stat rv" style="--d:${i * 80}ms"><b ${s.num !== null ? `data-count="${esc(String(s.num))}" data-suffix="${esc(s.suffix)}"` : ""}>${esc(s.value)}</b><span>${esc(s.label)}</span></div>`).join("");

  let heroHTML;
  if (hero === "terminal") {
    const lines = [
      `<span class="tl" style="--i:0"><em>$</em> whoami</span>`,
      `<span class="tl tl--out" style="--i:1">${esc(name)}</span>`,
      p.role ? `<span class="tl" style="--i:2"><em>$</em> cat role.txt</span><span class="tl tl--out" style="--i:3">${esc(p.role)}${p.location ? " · " + esc(p.location) : ""}</span>` : "",
      p.focus ? `<span class="tl" style="--i:4"><em>$</em> echo $FOCUS</span><span class="tl tl--out" style="--i:5">${esc(p.focus)}</span>` : "",
      `<span class="tl" style="--i:6"><em>$</em> <span class="caret"></span></span>`,
    ].join("");
    heroHTML = `<section class="hero hero--terminal"><div class="wrap hero__grid">
      <div class="hero__copy">${status}<h1 class="h1 rv">${esc(p.tagline || "Hi, I'm " + first + ".")}</h1>
        <div class="term rv" style="--d:120ms"><div class="term__bar"><i></i><i></i><i></i><span>~/${esc((first || "me").toLowerCase())} — zsh</span></div><pre class="term__body">${lines}</pre></div>${ctas}</div>
      <figure class="avatar avatar--frame rv" style="--d:200ms">${photo}<figcaption>fig. 1 — ${esc(name)}</figcaption></figure>
    </div></section>`;
  } else if (hero === "poster") {
    const words = name.split(/\s+/).slice(0, 3);
    const unit = ((p.status || p.role || "portfolio") + " ✦ " + (p.location || "data") + " ✦ ").toUpperCase();
    let ring = unit; while (ring.length < 38) ring += unit;
    const longest = Math.max(4, ...words.map((w) => w.length));
    heroHTML = `<section class="hero hero--poster"><div class="wrap">
      <div class="poster__top">${status}<span class="mono muted">${esc(p.role)}</span></div>
      <h1 class="poster__name" style="--len:${longest}">${words.map((w, i) => `<span class="rv" style="--d:${i * 90}ms">${esc(w)}</span>`).join("")}</h1>
      <div class="poster__row"><p class="lede rv">${esc(p.tagline)}</p>
        <figure class="sticker rv" style="--d:250ms">${photo}<svg viewBox="0 0 200 200" class="sticker__ring" aria-hidden="true"><defs><path id="ring" d="M100,100 m-82,0 a82,82 0 1,1 164,0 a82,82 0 1,1 -164,0"/></defs><text textLength="512" lengthAdjust="spacingAndGlyphs"><textPath href="#ring" textLength="512" lengthAdjust="spacingAndGlyphs">${esc(ring)}</textPath></text></svg></figure></div>
      ${ctas}</div></section>`;
  } else if (hero === "dashboard") {
    heroHTML = `<section class="hero hero--dash"><div class="wrap dash">
      <div class="tile tile--name rv">${status}<h1 class="h1">${esc(name)}</h1><p class="lede">${esc(p.tagline)}</p>${ctas}</div>
      <figure class="tile tile--photo rv avatar" style="--d:100ms">${photo}</figure>
      <div class="tile tile--meta rv" style="--d:160ms;--span:${1 + ((4 - (1 + stats.length) % 4) % 4)};--mspan:${(1 + stats.length) % 2 ? 2 : 1}"><span class="mono muted">role</span><b>${esc(p.role || "—")}</b><span class="mono muted">based in</span><b>${esc(p.location || "—")}</b></div>
      ${stats.map((s, i) => `<div class="tile tile--stat rv" style="--d:${200 + i * 70}ms"><span class="mono muted">${esc(s.label)}</span><b ${s.num !== null ? `data-count="${esc(String(s.num))}" data-suffix="${esc(s.suffix)}"` : ""}>${esc(s.value)}</b><svg viewBox="0 0 100 24" preserveAspectRatio="none" class="spark" aria-hidden="true"><polyline points="${Array.from({ length: 12 }, (_, k) => `${k * 9.1},${(20 - 16 * (0.5 + 0.5 * Math.sin(k * 0.9 + i * 1.7)) * (k / 11)).toFixed(1)}`).join(" ")}"/></svg></div>`).join("")}
    </div></section>`;
  } else {
    heroHTML = `<section class="hero hero--detect"><div class="wrap hero__grid">
      <div class="hero__copy">${status}<p class="mono muted rv">${esc(p.role)}${p.location ? " — " + esc(p.location) : ""}</p>
        <h1 class="h1 h1--name rv" style="--d:80ms">${esc(name)}</h1><p class="lede rv" style="--d:160ms">${esc(p.tagline)}</p>${ctas}</div>
      <figure class="avatar avatar--detect rv" style="--d:200ms">${photo}<span class="bbox"><em>human · 0.99</em></span><span class="xy xy--a">x:0.42 y:0.31</span><span class="xy xy--b">n=1</span></figure>
    </div></section>`;
  }

  const projectCards = projects.map((x, i) => {
    const t = tagsOf(x.tags), id = "case-" + i;
    const img = x.image ? `<img src="${x.image}" alt="Screenshot of ${esc(x.title)}" loading="lazy">` : `<div class="thumb__gen" aria-hidden="true"><span>${esc((x.title || "?").slice(0, 2))}</span></div>`;
    const code = safeUrl(x.code), live = safeUrl(x.live);
    const caseHTML = `<p class="mono muted">case study · ${String(i + 1).padStart(2, "0")}</p><h3>${esc(x.title)}</h3>${x.summary ? `<p class="lede">${esc(x.summary)}</p>` : ""}
      ${x.problem ? `<h4>The problem</h4><p>${esc(x.problem)}</p>` : ""}${x.part ? `<h4>What I did</h4><p>${esc(x.part)}</p>` : ""}${x.result ? `<h4>What it does / results</h4><p>${esc(x.result)}</p>` : ""}
      ${t.length ? `<div class="tags">${t.map((g) => `<span>${esc(g)}</span>`).join("")}</div>` : ""}
      <div class="ctas">${live ? `<a class="btn btn--main" href="${esc(live)}" target="_blank" rel="noopener">Live demo ↗</a>` : ""}${code ? `<a class="btn" href="${esc(code)}" target="_blank" rel="noopener">Code ↗</a>` : ""}</div>`;
    return `<article class="card rv" style="--d:${(i % 3) * 90}ms">
      <div class="thumb">${img}<span class="thumb__no mono">${String(i + 1).padStart(2, "0")}</span></div>
      <div class="card__body"><h3>${esc(x.title || "Untitled project")}</h3>${x.summary ? `<p>${esc(x.summary)}</p>` : ""}
        ${x.part ? `<p class="mine"><span class="mono">my part</span> ${esc(x.part)}</p>` : ""}
        ${t.length ? `<div class="tags">${t.slice(0, 6).map((g) => `<span>${esc(g)}</span>`).join("")}</div>` : ""}
        <div class="card__links">${(x.problem || x.result || x.part) ? `<button class="link" data-case="${id}">Case study →</button>` : ""}${live ? `<a class="link" href="${esc(live)}" target="_blank" rel="noopener">Live ↗</a>` : ""}${code ? `<a class="link" href="${esc(code)}" target="_blank" rel="noopener">Code ↗</a>` : ""}</div>
      </div><template id="${id}">${caseHTML}</template></article>`;
  }).join("");

  const skillBars = skills.rated.map((s, i) => `<li class="rv" style="--d:${i * 50}ms"><span>${esc(s.name)}</span><div class="bar"><i style="--w:${s.level * 20}%"></i></div><em class="mono">${s.level}/5</em></li>`).join("");
  const allSkills = [...skills.rated.map((s) => s.name), ...skills.tags];
  const marquee = allSkills.length ? `<div class="marquee" aria-hidden="true"><div>${(allSkills.map((s) => `<span>${esc(s)}</span><i>✦</i>`).join("")).repeat(2)}</div></div>` : "";
  const nav = [["about", "About"], projects.length && ["work", "Work"], allSkills.length && ["stack", "Stack"], gh && ["github", "GitHub"], ["contact", "Contact"]].filter(Boolean);
  const series = [pal.accent, pal.accent2, pal.muted, pal.text, pal.line, pal.surface];
  const config = { motif, gh, preview: !!opts.preview, colors: { bg: pal.bg, text: pal.text, muted: pal.muted, accent: pal.accent, accent2: pal.accent2 }, series, mono: `"${font.mono}", monospace` };
  const fontStack = (f, fb) => `"${f}", ${fb}`;
  const desc = [p.role, p.location].filter(Boolean).join(" · ") + (p.tagline ? " — " + p.tagline : "");

  const css = `
:root{--bg:${pal.bg};--surface:${pal.surface};--text:${pal.text};--muted:${pal.muted};--line:${pal.line};--accent:${pal.accent};--accent2:${pal.accent2};--on:${pal.onAccent};
--display:${fontStack(font.display, '"Arial Black", system-ui, sans-serif')};--body:${fontStack(font.body, 'system-ui, -apple-system, "Segoe UI", sans-serif')};--mono:${fontStack(font.mono, 'ui-monospace, Menlo, monospace')};
--dscale:${font.scale};--dweight:${font.weight};--r:${cards === "brutal" ? "6px" : cards === "sticker" ? "22px" : "16px"};color-scheme:${pal.dark ? "dark" : "light"}}
*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:var(--bg);color:var(--text);font:16px/1.6 var(--body);-webkit-font-smoothing:antialiased;overflow-x:hidden}
img{max-width:100%;display:block}a{color:inherit}::selection{background:var(--accent);color:var(--on)}
:focus-visible{outline:2px solid var(--accent2);outline-offset:3px}
.wrap{width:min(1120px,100%);margin:0 auto;padding-left:max(20px,env(safe-area-inset-left,0px));padding-right:max(20px,env(safe-area-inset-right,0px))}
.mono{font-family:var(--mono);font-size:.8rem;letter-spacing:.02em}.muted{color:var(--muted)}
#bgfx{position:fixed;inset:0;width:100%;height:100%;z-index:-1;opacity:${pal.dark ? 0.55 : 0.45};pointer-events:none}
.progress{position:fixed;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,var(--accent),var(--accent2));transform-origin:0 50%;transform:scaleX(0);z-index:30}
.nav{position:sticky;top:0;z-index:20;transition:background .3s,border-color .3s;border-bottom:1px solid transparent}
.scrolled .nav{background:color-mix(in srgb,var(--bg) 78%,transparent);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);border-color:var(--line)}
.nav .wrap{display:flex;align-items:center;gap:20px;height:64px}.logo{font:var(--dweight) 1.05rem/1 var(--display);text-decoration:none;letter-spacing:-.01em;margin-right:auto;display:flex;align-items:center;gap:10px}
.logo i{width:10px;height:10px;border-radius:50%;background:var(--accent);box-shadow:14px 0 0 var(--accent2)}.logo span{margin-left:14px}
.nav a.nl{font-size:.9rem;text-decoration:none;color:var(--muted);transition:color .2s}.nav a.nl:hover{color:var(--text)}
@media(max-width:640px){.nav a.nl{display:none}.nav a.nl:last-child{display:inline}}
.h1{font:var(--dweight) calc(clamp(2.4rem,6vw,4.6rem)*var(--dscale))/1.02 var(--display);letter-spacing:-.025em;margin:.2em 0 .25em;text-wrap:balance}
.h1--name{font-size:calc(clamp(3rem,9vw,7.2rem)*var(--dscale));line-height:.92}
.lede{font-size:clamp(1.05rem,1.6vw,1.3rem);color:var(--muted);max-width:34ch;margin:.4em 0 0;text-wrap:balance}
.status{display:inline-flex;align-items:center;gap:8px;font:500 .78rem var(--mono);padding:6px 12px;border-radius:999px;border:1px solid var(--line);background:color-mix(in srgb,var(--surface) 70%,transparent)}
.status i{width:8px;height:8px;border-radius:50%;background:var(--accent2);box-shadow:0 0 0 0 var(--accent2);animation:ping 2s infinite}
@keyframes ping{70%{box-shadow:0 0 0 9px transparent}100%{box-shadow:0 0 0 0 transparent}}
.ctas{display:flex;flex-wrap:wrap;gap:10px;margin-top:28px}
.btn{display:inline-flex;align-items:center;gap:8px;padding:12px 20px;border-radius:999px;border:1.5px solid var(--text);text-decoration:none;font-weight:600;font-size:.95rem;transition:transform .25s cubic-bezier(.2,.8,.2,1),background .2s,color .2s;background:transparent;cursor:pointer;font-family:inherit;color:inherit}
.btn:hover{transform:translateY(-3px)}.btn--main{background:var(--accent);color:var(--on);border-color:var(--accent)}.btn--ghost{border-color:var(--line)}
.hero{padding:clamp(40px,8vw,100px) 0 clamp(40px,6vw,80px)}
.hero__grid{display:grid;grid-template-columns:1.2fr .8fr;gap:clamp(28px,5vw,64px);align-items:center}
.hero__copy{min-width:0}
@media(max-width:820px){.hero__grid{grid-template-columns:1fr}.hero__grid .avatar{max-width:340px}}
.avatar{margin:0;position:relative;border-radius:var(--r);overflow:hidden;aspect-ratio:1/1;max-width:100%}
.avatar__img{width:100%;height:100%;object-fit:cover}
.avatar__mono{width:100%;height:100%;display:grid;place-items:center;font:var(--dweight) calc(clamp(3rem,10vw,7rem)*var(--dscale))/1 var(--display);color:var(--on);background:radial-gradient(circle at 30% 25%,var(--accent2),transparent 55%),linear-gradient(135deg,var(--accent),color-mix(in srgb,var(--accent) 50%,var(--accent2)))}
.avatar--detect{overflow:visible}.avatar--detect img,.avatar--detect .avatar__mono{border-radius:var(--r)}
.bbox{position:absolute;inset:12% 16% 8% 16%;border:2px solid var(--accent2);border-radius:4px;animation:scan 4s ease-in-out infinite}
.bbox em{position:absolute;top:-26px;left:-2px;font:500 .72rem var(--mono);font-style:normal;background:var(--accent2);color:var(--bg);padding:3px 7px;border-radius:4px 4px 4px 0;white-space:nowrap}
@keyframes scan{50%{inset:10% 14% 6% 14%}}
.xy{position:absolute;font:500 .7rem var(--mono);color:var(--muted);background:color-mix(in srgb,var(--bg) 80%,transparent);padding:2px 6px;border-radius:4px}.xy--a{left:0;bottom:-26px}.xy--b{right:0;top:-26px}
.avatar--frame{border:1px solid var(--line);padding:10px;background:var(--surface)}.avatar--frame img,.avatar--frame .avatar__mono{border-radius:calc(var(--r) - 6px);aspect-ratio:1/1;height:auto}
.avatar--frame figcaption{font:500 .72rem var(--mono);color:var(--muted);padding:10px 4px 2px}
.avatar--frame::after{content:"";position:absolute;inset:10px 10px 40px;border-radius:calc(var(--r) - 6px);background:repeating-linear-gradient(0deg,transparent 0 3px,rgba(0,0,0,.08) 3px 4px);pointer-events:none}
.term{margin-top:18px;border-radius:14px;border:1px solid var(--line);background:color-mix(in srgb,var(--surface) 92%,transparent);overflow:hidden;max-width:560px}
.term__bar{display:flex;align-items:center;gap:6px;padding:10px 12px;border-bottom:1px solid var(--line);font:500 .72rem var(--mono);color:var(--muted)}
.term__bar i{width:10px;height:10px;border-radius:50%;background:var(--line)}.term__bar i:first-child{background:var(--accent)}.term__bar i:nth-child(2){background:var(--accent2)}.term__bar span{margin-left:8px}
.term__body{margin:0;padding:16px 18px;font:.88rem/1.7 var(--mono);white-space:pre-wrap;overflow-wrap:anywhere}
.tl{display:block}.tl em{color:var(--accent);font-style:normal}.tl--out{color:var(--muted)}
.js .tl{clip-path:inset(0 100% 0 0);animation:type .7s steps(24,end) forwards;animation-delay:calc(var(--i)*.45s + .3s)}
@keyframes type{to{clip-path:inset(0 0 0 0)}}
.caret{display:inline-block;width:.6em;height:1.1em;vertical-align:-.15em;background:var(--accent2);animation:blink 1s steps(2) infinite}@keyframes blink{50%{opacity:0}}
.poster__top{display:flex;align-items:center;gap:14px;flex-wrap:wrap}
.poster__name{font:var(--dweight) min(calc(clamp(3.4rem,15vw,12rem)*var(--dscale)),calc((min(1120px,100vw) - 48px)/(var(--len)*.78)))/.86 var(--display);letter-spacing:-.04em;margin:.18em 0 .1em;text-transform:uppercase;overflow-wrap:anywhere}
.poster__name span{display:block}.poster__name span:nth-child(2){color:transparent;-webkit-text-stroke:2px var(--text);padding-left:.25em}
.poster__name span:nth-child(3){color:var(--accent)}
.poster__row{display:flex;align-items:center;justify-content:space-between;gap:24px;flex-wrap:wrap}
.sticker{margin:0;position:relative;width:min(230px,60vw);aspect-ratio:1/1}
.sticker .avatar__img,.sticker .avatar__mono{position:absolute;inset:16%;width:68%;height:68%;border-radius:50%;object-fit:cover;font-size:2.4rem}
.sticker__ring{position:absolute;inset:0;animation:spin 18s linear infinite}.sticker__ring text{font:600 13.5px var(--mono);fill:var(--text);letter-spacing:2px}
@keyframes spin{to{transform:rotate(360deg)}}
.dash{display:grid;grid-template-columns:repeat(4,1fr);gap:14px}
.tile{border:1px solid var(--line);border-radius:var(--r);background:color-mix(in srgb,var(--surface) 85%,transparent);padding:20px;min-width:0;display:flex;flex-direction:column;gap:6px}
.tile--name{grid-column:span 3;grid-row:span 2;justify-content:flex-end;padding:28px;background:linear-gradient(140deg,color-mix(in srgb,var(--accent) 22%,var(--surface)),var(--surface) 60%)}
.tile--name .status{align-self:flex-start}.tile--photo{padding:0;grid-row:span 2;aspect-ratio:auto;min-height:220px}.tile--photo .avatar__img,.tile--photo .avatar__mono{height:100%;min-height:220px}
.tile--meta{grid-column:span var(--span,1)}.tile b{font:var(--dweight) calc(1.6rem*var(--dscale))/1.1 var(--display)}.tile--meta b{font-size:calc(1.1rem*var(--dscale))}
.spark{width:100%;height:28px;margin-top:auto}.spark polyline{fill:none;stroke:var(--accent2);stroke-width:2;vector-effect:non-scaling-stroke}
@media(max-width:820px){.dash{grid-template-columns:1fr 1fr}.tile--name{grid-column:1/-1}.tile--photo{grid-row:auto;grid-column:1/-1;aspect-ratio:1/1;max-height:420px}.tile--meta{grid-column:span var(--mspan,1)}}
.sec{padding:clamp(56px,9vw,110px) 0}.eyebrow{font:500 .8rem var(--mono);color:var(--accent);display:flex;align-items:center;gap:10px;margin-bottom:14px}
.eyebrow::after{content:"";height:1px;width:60px;background:var(--line)}
.h2{font:var(--dweight) calc(clamp(2rem,4.4vw,3.4rem)*var(--dscale))/1.05 var(--display);letter-spacing:-.02em;margin:0 0 28px;text-wrap:balance}
.about{display:grid;grid-template-columns:1.3fr 1fr;gap:clamp(28px,5vw,64px);align-items:start}@media(max-width:820px){.about{grid-template-columns:1fr}}
.about p.bio{font-size:clamp(1.1rem,1.7vw,1.35rem);line-height:1.55;margin:0;max-width:60ch}
.facts{margin:0;display:grid;gap:0;border-top:1px solid var(--line)}.facts div{display:grid;grid-template-columns:130px 1fr;gap:12px;padding:14px 0;border-bottom:1px solid var(--line)}
.facts dt{font:500 .8rem var(--mono);color:var(--muted)}.facts dd{margin:0;font-weight:500}
.stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:14px;margin-top:40px}
.stat{padding:20px;border-radius:var(--r);border:1px solid var(--line);background:color-mix(in srgb,var(--surface) 80%,transparent)}
.stat b{display:block;font:var(--dweight) calc(clamp(2rem,3.6vw,2.8rem)*var(--dscale))/1 var(--display);background:linear-gradient(90deg,var(--accent),var(--accent2));-webkit-background-clip:text;background-clip:text;color:transparent}
.stat span{font-size:.88rem;color:var(--muted)}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:22px}
.card{position:relative;border-radius:var(--r);display:flex;flex-direction:column;transition:transform .35s cubic-bezier(.2,.8,.2,1),box-shadow .3s;transform-style:preserve-3d;min-width:0}
.card::before{content:"";position:absolute;inset:0;border-radius:inherit;background:radial-gradient(420px circle at var(--mx,50%) var(--my,0%),color-mix(in srgb,var(--accent) 16%,transparent),transparent 60%);opacity:0;transition:opacity .3s;pointer-events:none;z-index:1}
.card:hover::before{opacity:1}
.thumb{position:relative;aspect-ratio:16/10;overflow:hidden;border-radius:calc(var(--r) - 4px);margin:8px 8px 0}
.thumb img{width:100%;height:100%;object-fit:cover;object-position:top;transition:transform .6s cubic-bezier(.2,.8,.2,1)}.card:hover .thumb img{transform:scale(1.05)}
.thumb__gen{width:100%;height:100%;display:grid;place-items:center;background:conic-gradient(from 210deg at 70% 30%,var(--accent),var(--accent2),var(--accent));}
.thumb__gen span{font:var(--dweight) calc(3.4rem*var(--dscale))/1 var(--display);color:var(--on);text-transform:uppercase;mix-blend-mode:overlay}
.thumb__no{position:absolute;top:10px;left:10px;background:color-mix(in srgb,var(--bg) 80%,transparent);padding:3px 8px;border-radius:999px;backdrop-filter:blur(6px)}
.card__body{padding:18px 20px 20px;display:flex;flex-direction:column;gap:10px;flex:1;position:relative;z-index:2}
.card h3{font:var(--dweight) calc(1.4rem*var(--dscale))/1.15 var(--display);margin:0;letter-spacing:-.01em}.card p{margin:0;color:var(--muted)}
.mine{font-size:.92rem}.mine .mono{color:var(--accent);margin-right:6px}
.tags{display:flex;flex-wrap:wrap;gap:6px}.tags span{font:500 .72rem var(--mono);padding:4px 9px;border-radius:999px;border:1px solid var(--line);color:var(--muted)}
.card__links{display:flex;gap:16px;margin-top:auto;padding-top:6px}
.link{background:none;border:0;padding:0;font:600 .92rem var(--body);color:var(--text);cursor:pointer;text-decoration:none;border-bottom:1.5px solid var(--accent)}.link:hover{color:var(--accent)}
.cards-glass .card{background:color-mix(in srgb,var(--surface) 62%,transparent);border:1px solid var(--line);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px)}
.cards-brutal .card{background:var(--surface);border:2px solid var(--text);box-shadow:6px 6px 0 var(--accent)}.cards-brutal .card:hover{box-shadow:10px 10px 0 var(--accent2)}
.cards-outline .card{border:1px solid var(--line);background:transparent}.cards-outline .card:hover{border-color:var(--accent)}
.cards-sticker .card{background:color-mix(in srgb,var(--accent) 10%,var(--surface));border:1px solid var(--line)}.cards-sticker .card:nth-child(odd){rotate:-1.2deg}.cards-sticker .card:nth-child(even){rotate:1deg}.cards-sticker .card:hover{rotate:0deg}
.cards-brutal .tile,.cards-brutal .stat{border:2px solid var(--text)}
.skills{list-style:none;margin:0;padding:0;display:grid;gap:14px;max-width:760px}
.skills li{display:grid;grid-template-columns:minmax(110px,180px) 1fr 40px;align-items:center;gap:14px}
.bar{height:12px;border-radius:999px;background:color-mix(in srgb,var(--line) 70%,transparent);overflow:hidden}
.bar i{display:block;height:100%;width:var(--w);border-radius:inherit;background:linear-gradient(90deg,var(--accent),var(--accent2))}
.js .rv .bar i{width:0;transition:width 1.1s cubic-bezier(.2,.8,.2,1) .15s}.js .rv.in .bar i{width:var(--w)}
.skills em{font-style:normal;color:var(--muted);text-align:right}
@media(max-width:560px){.skills li{grid-template-columns:1fr 40px}.skills .bar{grid-column:1/-1;grid-row:2}}
.marquee{overflow:hidden;border-block:1px solid var(--line);margin-top:48px;padding:16px 0;mask:linear-gradient(90deg,transparent,#000 10%,#000 90%,transparent)}
.marquee div{display:flex;gap:22px;width:max-content;animation:slide 32s linear infinite;font:var(--dweight) calc(1.6rem*var(--dscale))/1 var(--display);white-space:nowrap}
.marquee i{color:var(--accent);font-style:normal}@keyframes slide{to{transform:translateX(-50%)}}
.gh{display:grid;grid-template-columns:1fr 1.6fr;gap:22px;align-items:start}@media(max-width:820px){.gh{grid-template-columns:1fr}}
.gh__side{display:grid;gap:14px}.gh__kpis{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.kpi{padding:14px;border:1px solid var(--line);border-radius:12px;background:color-mix(in srgb,var(--surface) 80%,transparent)}.kpi span{display:block;font:500 .72rem var(--mono);color:var(--muted)}.kpi b{font:var(--dweight) calc(1.4rem*var(--dscale))/1.2 var(--display);overflow-wrap:anywhere}
.gh__donut{display:flex;gap:16px;align-items:center;padding:16px;border:1px solid var(--line);border-radius:12px}.gh__donut svg{width:120px;flex:none;transform:rotate(-90deg)}
.gh__donut svg text{transform:rotate(90deg);transform-origin:21px 21px;font:700 7px var(--body);fill:var(--text)}.gh__donut svg text.sm{font:500 3.2px var(--mono);fill:var(--muted)}
.gh__donut ul{list-style:none;margin:0;padding:0;display:grid;gap:6px;font-size:.88rem;flex:1}.gh__donut li{display:flex;align-items:center;gap:8px}.gh__donut li span{margin-left:auto;font-family:var(--mono);color:var(--muted)}
.gh__donut i,.repo__meta i{width:10px;height:10px;border-radius:3px;display:inline-block}
.gh__repos{display:grid;grid-template-columns:1fr 1fr;gap:12px}@media(max-width:560px){.gh__repos{grid-template-columns:1fr}}
.repo{display:flex;flex-direction:column;gap:6px;padding:16px;border:1px solid var(--line);border-radius:12px;text-decoration:none;transition:border-color .2s,transform .25s;background:color-mix(in srgb,var(--surface) 70%,transparent);min-width:0}.repo:hover{border-color:var(--accent);transform:translateY(-3px)}
.repo b{overflow-wrap:anywhere}.repo p{margin:0;font-size:.88rem;color:var(--muted)}.repo__meta{display:flex;gap:12px;align-items:center;font:500 .72rem var(--mono);color:var(--muted);margin-top:auto}
.gh__status{font:500 .78rem var(--mono);color:var(--muted)}
.skel{height:86px;border-radius:12px;background:linear-gradient(90deg,var(--line),color-mix(in srgb,var(--line) 40%,transparent),var(--line));background-size:200% 100%;animation:sh 1.4s infinite}@keyframes sh{to{background-position:-200% 0}}
.gh--off .gh__kpis,.gh--off .gh__donut,.gh--off .gh__repos{display:none}
.contact{display:grid;grid-template-columns:1.1fr 1fr;gap:clamp(28px,5vw,64px);align-items:start}@media(max-width:820px){.contact{grid-template-columns:1fr}}
.big-mail{font:var(--dweight) calc(clamp(1.5rem,4vw,2.8rem)*var(--dscale))/1.1 var(--display);overflow-wrap:anywhere;text-decoration:none;background:linear-gradient(90deg,var(--accent),var(--accent2));-webkit-background-clip:text;background-clip:text;color:transparent}
.pills{display:flex;flex-wrap:wrap;gap:10px;margin-top:22px}.pills a{padding:10px 16px;border-radius:999px;border:1px solid var(--line);text-decoration:none;font-weight:600;transition:background .2s,color .2s}.pills a:hover{background:var(--text);color:var(--bg)}
.cform{display:grid;gap:12px;padding:22px;border-radius:var(--r);border:1px solid var(--line);background:color-mix(in srgb,var(--surface) 80%,transparent)}
.cform label{display:grid;gap:6px;font:500 .78rem var(--mono);color:var(--muted)}
.cform input,.cform textarea{font:inherit;font-family:var(--body);font-size:1rem;color:var(--text);background:var(--bg);border:1px solid var(--line);border-radius:10px;padding:12px}
.cform input:focus,.cform textarea:focus{outline:none;border-color:var(--accent)}.cform__note{font-size:.85rem;color:var(--muted);min-height:1em;margin:0}
footer{padding:36px 0 48px;border-top:1px solid var(--line);font:500 .8rem var(--mono);color:var(--muted)}footer .wrap{display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap}
dialog.case{border:1px solid var(--line);border-radius:var(--r);background:var(--surface);color:var(--text);padding:0;width:min(680px,calc(100% - 32px));max-height:85vh}
dialog.case::backdrop{background:color-mix(in srgb,var(--bg) 60%,transparent);backdrop-filter:blur(6px)}
.case__inner{padding:28px;overflow:auto;max-height:85vh}.case__body h3{font:var(--dweight) calc(2rem*var(--dscale))/1.1 var(--display);margin:.2em 0}.case__body h4{font:500 .8rem var(--mono);color:var(--accent);margin:22px 0 6px;text-transform:uppercase;letter-spacing:.06em}.case__body p{margin:0}
.case__close{position:sticky;top:0;float:right;margin:-8px -8px 0 0;width:36px;height:36px;border-radius:50%;border:1px solid var(--line);background:var(--bg);color:var(--text);cursor:pointer;font-size:1.1rem}
.js .rv{opacity:0;transform:translateY(22px);transition:opacity .8s cubic-bezier(.2,.8,.2,1),transform .8s cubic-bezier(.2,.8,.2,1);transition-delay:var(--d,0ms)}
.js .rv.in{opacity:1;transform:none}
.cards-sticker .card.rv.in:nth-child(odd){transform:none}
@media(prefers-reduced-motion:reduce){*,*::before,*::after{animation:none!important;transition:none!important}.js .rv{opacity:1;transform:none}.js .tl{clip-path:none}html{scroll-behavior:auto}}
`;

  const body = `
<canvas id="bgfx" aria-hidden="true"></canvas><div class="progress" aria-hidden="true"></div>
<header class="nav"><div class="wrap"><a class="logo" href="#top"><i></i><span>${esc(name)}</span></a>${nav.map(([id, label]) => `<a class="nl" href="#${id}">${label}</a>`).join("")}</div></header>
<main id="top">
${heroHTML}
<section class="sec" id="about"><div class="wrap">
  <div class="eyebrow">about.md</div><h2 class="h2 rv">${esc(p.name ? "Hi, I'm " + first + "." : "About me")}</h2>
  <div class="about"><p class="bio rv">${esc(p.bio || "Write a short introduction in the maker.")}</p>
  <dl class="facts rv" style="--d:120ms">${[["role", p.role], ["based in", p.location], ["focus", p.focus], ["learning", p.learning]].filter((f) => f[1]).map(([k, v]) => `<div><dt>${k}</dt><dd>${esc(v)}</dd></div>`).join("")}</dl></div>
  ${hero !== "dashboard" && stats.length ? `<div class="stats">${statTiles}</div>` : ""}
</div></section>
${projects.length ? `<section class="sec" id="work"><div class="wrap"><div class="eyebrow">projects/</div><h2 class="h2 rv">Selected work</h2><div class="grid">${projectCards}</div></div></section>` : ""}
${allSkills.length ? `<section class="sec" id="stack"><div class="wrap"><div class="eyebrow">stack.json</div><h2 class="h2 rv">What I work with</h2>${skillBars ? `<ul class="skills">${skillBars}</ul>` : ""}</div>${marquee}</section>` : ""}
${gh ? `<section class="sec" id="github"><div class="wrap"><div class="eyebrow">github.api</div><h2 class="h2 rv">Fresh from GitHub</h2>
  <div class="gh" id="gh"><div class="gh__side"><p class="gh__status">Loading @${esc(gh)}…</p><div class="gh__kpis"><div class="skel"></div><div class="skel"></div></div><div class="gh__donut"></div><a class="btn" href="https://github.com/${esc(gh)}" target="_blank" rel="noopener">@${esc(gh)} on GitHub ↗</a></div>
  <div class="gh__repos"><div class="skel"></div><div class="skel"></div><div class="skel"></div><div class="skel"></div></div></div></div></section>` : ""}
<section class="sec" id="contact"><div class="wrap"><div class="eyebrow">contact()</div>
  <div class="contact"><div><h2 class="h2 rv">Let's build something.</h2>
    ${email ? `<a class="big-mail rv" href="mailto:${esc(email)}">${esc(email)}</a><div class="ctas"><button class="btn btn--ghost" data-copy="${esc(email)}">Copy email</button></div>` : ""}
    ${links.length ? `<div class="pills rv">${links.map(([l, u]) => `<a href="${esc(u)}" target="_blank" rel="noopener">${l} ↗</a>`).join("")}</div>` : ""}</div>
  ${p.contactForm && email ? `<form class="cform rv" action="https://formsubmit.co/${esc(email)}" method="POST"><input type="hidden" name="_subject" value="New message from your portfolio"><input type="hidden" name="_template" value="table"><input type="text" name="_honey" style="display:none" tabindex="-1" autocomplete="off">
    <label>your name<input name="name" required autocomplete="name"></label><label>your email<input type="email" name="email" required autocomplete="email"></label><label>message<textarea name="message" rows="5" required></textarea></label>
    <button class="btn btn--main" type="submit">Send message</button><p class="cform__note"></p></form>` : ""}
  </div></div></section>
</main>
<footer><div class="wrap"><span>© ${year} ${esc(name)}</span><span>${esc([PALETTES[pick.palette].name, HEROES[pick.hero].name, MOTIFS[pick.motif].name].join(" · "))}</span></div></footer>
<dialog class="case" id="case" aria-label="Case study"><div class="case__inner"><button class="case__close" data-close aria-label="Close">×</button><div class="case__body"></div></div></dialog>
<script>(${siteRuntime.toString()})(${JSON.stringify(config).replace(/</g, "\\u003c")});<\/script>`;

  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(name)}${p.role ? " · " + esc(p.role) : ""}</title>
<meta name="description" content="${esc(desc)}">
<meta property="og:title" content="${esc(name)}"><meta property="og:description" content="${esc(desc)}">
<meta name="theme-color" content="${pal.bg}">
<link rel="icon" href="data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'><rect width='64' height='64' rx='16' fill='${pal.accent}'/><text x='32' y='42' font-family='Arial' font-weight='700' font-size='28' text-anchor='middle' fill='${pal.onAccent}'>${initials(name)}</text></svg>`)}">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=${font.url}&display=swap">
<style>${css}</style></head>
<body class="cards-${cards}">${body}
</body></html>`;
}
