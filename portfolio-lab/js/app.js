/* =========================================================================
   The maker app
   ========================================================================= */
const STORE = "portfolio-lab-v1";
let state = load();
function load() {
  try { const s = JSON.parse(localStorage.getItem(STORE)); if (s && s.profiles && s.profiles.length) return s; } catch (e) {}
  const ex = exampleProfile(); return { current: ex.id, profiles: [ex] };
}
function save() { try { localStorage.setItem(STORE, JSON.stringify(state)); } catch (e) { toast("Couldn't save in this browser (storage is full or blocked). Copy a backup from Publish."); } }
const cur = () => state.profiles.find((p) => p.id === state.current) || state.profiles[0];

function toast(msg) { const t = $("#toast"); t.textContent = msg; t.classList.add("show"); clearTimeout(toast.h); toast.h = setTimeout(() => t.classList.remove("show"), 2600); }

// ---- profiles ----
function renderProfiles() {
  $("#profileSelect").innerHTML = state.profiles.map((p) => `<option value="${p.id}" ${p.id === state.current ? "selected" : ""}>${esc(p.name || p.label || "Untitled")}${p.example ? " (example)" : ""}</option>`).join("");
}
$("#profileSelect").addEventListener("change", (e) => { state.current = e.target.value; save(); fillForm(); });
$("#newProfile").addEventListener("click", () => { const p = blankProfile(); state.profiles.push(p); state.current = p.id; save(); fillForm(); selectTab("me"); toast("New profile started. It has its own random design."); $("#f-name").focus(); });

// ---- form binding ----
function fillForm() {
  const p = cur();
  $$("[data-bind]").forEach((el) => { const k = el.dataset.bind; if (el.type === "checkbox") el.checked = !!p[k]; else el.value = p[k] || ""; });
  $("#exampleNotice").hidden = !p.example;
  renderPhoto(); renderProjects(); renderDesign(); renderProfiles(); updateRepoName(); schedule(true);
}
$$("[data-bind]").forEach((el) => el.addEventListener("input", () => {
  const p = cur(), k = el.dataset.bind;
  p[k] = el.type === "checkbox" ? el.checked : el.value;
  if (k === "name") { renderProfiles(); $("#photoPreview").textContent = p.photo ? "" : initials(p.name); }
  if (k === "github") updateRepoName();
  save(); schedule();
}));
function updateRepoName() {
  const g = String(cur().github || "").trim().replace(/^@/, "") || "your-username";
  $("#repoName").textContent = g + ".github.io"; $("#siteUrl").textContent = "https://" + g + ".github.io";
}
$("#clearExample").addEventListener("click", () => {
  const p = cur(), keep = { id: p.id, design: p.design };
  Object.assign(p, blankProfile(), keep); delete p.example; p.label = "My portfolio";
  save(); fillForm(); toast("Cleared. Your design stayed the same.");
});

// ---- images ----
function readImage(file, maxSide, quality) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith("image/")) return reject(new Error("That file isn't an image."));
    const fr = new FileReader();
    fr.onerror = () => reject(new Error("Couldn't read that file."));
    fr.onload = () => { const img = new Image(); img.onload = () => {
      const k = Math.min(1, maxSide / Math.max(img.width, img.height)), w = Math.round(img.width * k), h = Math.round(img.height * k);
      const c = document.createElement("canvas"); c.width = w; c.height = h; const g = c.getContext("2d");
      g.fillStyle = "#fff"; g.fillRect(0, 0, w, h); g.drawImage(img, 0, 0, w, h); resolve(c.toDataURL("image/jpeg", quality));
    }; img.onerror = () => reject(new Error("That image couldn't be opened. Try a JPG or PNG.")); img.src = fr.result; };
    fr.readAsDataURL(file);
  });
}
function cropSquare(dataUrl, side) {
  return new Promise((resolve) => { const img = new Image(); img.onload = () => {
    const s = Math.min(img.width, img.height), c = document.createElement("canvas"); c.width = c.height = Math.min(side, s);
    c.getContext("2d").drawImage(img, (img.width - s) / 2, (img.height - s) * 0.3, s, s, 0, 0, c.width, c.height); resolve(c.toDataURL("image/jpeg", 0.84));
  }; img.src = dataUrl; });
}
async function setPhoto(file) {
  try { const d = await readImage(file, 1200, 0.9); cur().photo = await cropSquare(d, 560); save(); renderPhoto(); schedule(); toast("Photo added."); }
  catch (e) { toast(e.message); }
}
function renderPhoto() { const p = cur(), el = $("#photoPreview"); el.style.backgroundImage = p.photo ? `url("${p.photo}")` : ""; el.textContent = p.photo ? "" : initials(p.name); $("#photoRemove").hidden = !p.photo; }
$("#photoInput").addEventListener("change", (e) => { if (e.target.files[0]) setPhoto(e.target.files[0]); e.target.value = ""; });
$("#photoRemove").addEventListener("click", () => { cur().photo = ""; save(); renderPhoto(); schedule(); });
function dropZone(el, onFile) {
  el.addEventListener("dragover", (e) => { e.preventDefault(); el.classList.add("is-over"); });
  el.addEventListener("dragleave", () => el.classList.remove("is-over"));
  el.addEventListener("drop", (e) => { e.preventDefault(); el.classList.remove("is-over"); const f = e.dataTransfer.files[0]; if (f) onFile(f); });
}
dropZone($("#photoDrop"), setPhoto);

// ---- projects ----
const ICON = {
  up: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 15 6-6 6 6"/></svg>',
  down: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg>',
  del: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/></svg>',
};
let openProject = 0;
function renderProjects() {
  const list = cur().projects;
  $("#projCount").textContent = list.length;
  $("#projectList").innerHTML = list.map((x, i) => `
    <details class="proj" data-i="${i}" ${i === openProject ? "open" : ""}>
      <summary class="proj__head"><span class="chev">›</span><b>${esc(x.title || "Untitled project")}</b>
        <button class="iconbtn" data-act="up" title="Move up" ${i === 0 ? "disabled" : ""}>${ICON.up}</button>
        <button class="iconbtn" data-act="down" title="Move down" ${i === list.length - 1 ? "disabled" : ""}>${ICON.down}</button>
        <button class="iconbtn" data-act="del" title="Remove project">${ICON.del}</button></summary>
      <div class="proj__body">
        <label class="field"><span>Project name</span><input type="text" id="p${i}-title" data-pf="title" value="${esc(x.title)}" placeholder="e.g. DineAnalytics"></label>
        <label class="field"><span>One-line summary</span><input type="text" id="p${i}-summary" data-pf="summary" value="${esc(x.summary)}" placeholder="What is it, in one sentence?"></label>
        <div class="drop" data-drop="${i}"><div class="field"><span>Screenshot</span>
          <label class="pimg ${x.image ? "has" : ""}" style="${x.image ? `background-image:url('${x.image}')` : ""}" for="p${i}-img">${x.image ? "" : "Click or drop an image. Without one, the card gets a generated cover."}</label>
          <input type="file" accept="image/*" class="sr" id="p${i}-img" data-pimg>
          ${x.image ? `<button class="btn btn--sm btn--ghost btn--danger" data-act="noimg" style="justify-self:start">Remove screenshot</button>` : ""}</div></div>
        <label class="field"><span>The problem</span><textarea id="p${i}-problem" data-pf="problem" rows="2" placeholder="What question or pain point did it tackle?">${esc(x.problem)}</textarea></label>
        <label class="field"><span>What I did</span><textarea id="p${i}-part" data-pf="part" rows="2" placeholder="Your part. On team projects, be specific: 'I built the pricing engine and dashboard.'">${esc(x.part)}</textarea></label>
        <label class="field"><span>What it does / results</span><textarea id="p${i}-result" data-pf="result" rows="3" placeholder="Features, findings or numbers: accuracy, time saved, users, tests…">${esc(x.result)}</textarea></label>
        <label class="field"><span>Tools (comma-separated)</span><input type="text" id="p${i}-tags" data-pf="tags" value="${esc(x.tags)}" placeholder="Python, pandas, Matplotlib"></label>
        <div class="row"><label class="field"><span>Code link</span><input type="url" id="p${i}-code" data-pf="code" value="${esc(x.code)}" placeholder="https://github.com/…"></label>
          <label class="field"><span>Live demo link</span><input type="url" id="p${i}-live" data-pf="live" value="${esc(x.live)}" placeholder="https://…"></label></div>
      </div>
    </details>`).join("");
  $$(".proj").forEach((d) => {
    const i = +d.dataset.i;
    d.addEventListener("toggle", () => { if (d.open) openProject = i; });
    $$("[data-pf]", d).forEach((el) => el.addEventListener("input", () => { cur().projects[i][el.dataset.pf] = el.value; if (el.dataset.pf === "title") $("b", d).textContent = el.value || "Untitled project"; save(); schedule(); }));
    $("[data-pimg]", d).addEventListener("change", (e) => { if (e.target.files[0]) setProjectImage(i, e.target.files[0]); });
    dropZone($("[data-drop]", d), (f) => setProjectImage(i, f));
    $$("[data-act]", d).forEach((b) => b.addEventListener("click", (e) => {
      e.preventDefault(); e.stopPropagation(); const L = cur().projects, a = b.dataset.act;
      if (a === "up" && i > 0) { [L[i - 1], L[i]] = [L[i], L[i - 1]]; openProject = i - 1; }
      if (a === "down" && i < L.length - 1) { [L[i + 1], L[i]] = [L[i], L[i + 1]]; openProject = i + 1; }
      if (a === "del") { L.splice(i, 1); toast("Project removed."); }
      if (a === "noimg") L[i].image = "";
      save(); renderProjects(); schedule();
    }));
  });
}
async function setProjectImage(i, file) {
  try { cur().projects[i].image = await readImage(file, 1100, 0.74); openProject = i; save(); renderProjects(); schedule(); toast("Screenshot added."); }
  catch (e) { toast(e.message); }
}
$("#addProject").addEventListener("click", () => { const L = cur().projects; L.push({ title: "", summary: "", problem: "", part: "", result: "", tags: "", code: "", live: "", image: "" }); openProject = L.length - 1; save(); renderProjects(); schedule(); $(`#p${openProject}-title`).focus(); });

// ---- design ----
function renderDesign() {
  const d = cur().design, r = resolveDesign(d);
  $("#seedLabel").textContent = "design #" + String(d.seed >>> 0).toString(36).toUpperCase();
  $("#dna").innerHTML = AXES.map(([key, label, list]) => `
    <label class="field"><span>${label}</span>
      <select id="ax-${key}" data-axis="${key}"><option value="-1">Remix picks · ${esc(list[r[key]].name)}</option>${list.map((o, i) => `<option value="${i}" ${d[key] === i ? "selected" : ""}>🔒 ${esc(o.name)}</option>`).join("")}</select>
      ${key === "palette" ? `<span class="swatches">${["bg", "surface", "accent", "accent2", "text"].map((c) => `<i style="background:${PALETTES[r.palette][c]}"></i>`).join("")}</span>` : ""}
      ${key === "hero" ? `<span class="hint">${esc(HEROES[r.hero].blurb)}</span>` : ""}
    </label>`).join("");
  $$("[data-axis]").forEach((s) => s.addEventListener("change", () => { cur().design[s.dataset.axis] = +s.value; save(); renderDesign(); schedule(true); }));
  $("#chips").innerHTML = AXES.map(([key, label, list]) => `<span class="chip">${label.toLowerCase()} <b>${esc(list[r[key]].name)}</b></span>`).join("");
}
function remix() {
  cur().design.seed = Math.floor(Math.random() * 4294967295); save(); renderDesign(); schedule(true);
  const f = $("#flash"); f.classList.remove("go"); void f.offsetWidth; f.classList.add("go");
  if (matchMedia("(max-width: 860px)").matches) setView("preview");
}
$("#remix").addEventListener("click", remix); $("#remixTop").addEventListener("click", remix);

// ---- preview ----
let timer = 0, lastScroll = 0;
function schedule(now) { clearTimeout(timer); timer = setTimeout(renderPreview, now ? 0 : 350); }
function renderPreview() {
  const frame = $("#preview");
  try { lastScroll = frame.contentWindow ? frame.contentWindow.scrollY : 0; } catch (e) { lastScroll = 0; }
  const html = buildSite(cur(), { preview: true });
  frame.onload = () => { try { frame.contentWindow.scrollTo(0, lastScroll); } catch (e) {} };
  frame.srcdoc = html;
  $("#sizeLabel").textContent = "Your site: one file, " + (new Blob([buildSite(cur())]).size / 1024).toFixed(0) + " KB (photos included).";
}
function setDevice(phone) { $("#device").classList.toggle("is-phone", phone); $("#devPhone").setAttribute("aria-pressed", phone); $("#devDesk").setAttribute("aria-pressed", !phone); }
$("#devDesk").addEventListener("click", () => setDevice(false)); $("#devPhone").addEventListener("click", () => setDevice(true));
function setView(v) { $("#work").dataset.view = v; $("#viewEdit").setAttribute("aria-pressed", v === "edit"); $("#viewPreview").setAttribute("aria-pressed", v === "preview"); }
$("#viewEdit").addEventListener("click", () => setView("edit")); $("#viewPreview").addEventListener("click", () => setView("preview"));

// ---- tabs ----
function selectTab(name) {
  $$(".tab").forEach((t) => t.setAttribute("aria-selected", t.dataset.tab === name));
  $$(".panel").forEach((p) => { p.hidden = p.dataset.panel !== name; });
  try { localStorage.setItem(STORE + "-tab", name); } catch (e) {}
}
$$(".tab").forEach((t) => t.addEventListener("click", () => selectTab(t.dataset.tab)));

// ---- publish ----
function finalHtml() { return buildSite(cur()); }
function copyText(text, okMsg) {
  const fb = () => { $("#fallback").hidden = false; const ta = $("#fallbackText"); ta.value = text; selectTab("publish"); ta.focus(); ta.select(); toast("Select all and copy the text shown under Publish."); };
  if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(() => toast(okMsg), fb); else fb();
}
$("#copyHtml").addEventListener("click", () => copyText(finalHtml(), "Website code copied. Paste it into index.html on GitHub."));
$("#copyTop").addEventListener("click", () => { copyText(finalHtml(), "Website code copied. See Publish for the GitHub steps."); selectTab("publish"); });
let downloads = null;
if (window.claude && window.claude.use) window.claude.use("downloads").then((d) => { downloads = d; }).catch(() => {});
$("#downloadHtml").addEventListener("click", async () => {
  const html = finalHtml();
  if (downloads) {
    try { await downloads.save({ filename: "index.html", data: new Blob([html], { type: "text/html" }) }); toast("Saved index.html. Upload it to your GitHub repo."); }
    catch (e) { if (e && e.code !== "declined") toast("Download isn't available here. Use Copy website code instead."); }
    return;
  }
  const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([html], { type: "text/html" })); a.download = "index.html";
  document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
});
$("#copyBackup").addEventListener("click", () => { const p = { ...cur() }; delete p.id; copyText(JSON.stringify(p), "Profile backup copied. Paste it somewhere safe."); });
$("#showImport").addEventListener("click", () => { $("#importBox").hidden = false; $("#importText").focus(); });
$("#cancelImport").addEventListener("click", () => { $("#importBox").hidden = true; });
$("#doImport").addEventListener("click", () => {
  try { const data = JSON.parse($("#importText").value); if (!data || typeof data !== "object" || !Array.isArray(data.projects)) throw 0;
    const p = Object.assign(blankProfile(), data, { id: uid() }); delete p.example; state.profiles.push(p); state.current = p.id; save(); fillForm();
    $("#importBox").hidden = true; $("#importText").value = ""; toast("Profile loaded."); }
  catch (e) { toast("That isn't a profile backup. Copy it again with Copy profile backup."); }
});
$("#deleteProfile").addEventListener("click", () => { $("#confirmDelete").hidden = false; });
$("#noDelete").addEventListener("click", () => { $("#confirmDelete").hidden = true; });
$("#yesDelete").addEventListener("click", () => {
  state.profiles = state.profiles.filter((p) => p.id !== state.current);
  if (!state.profiles.length) state.profiles.push(exampleProfile());
  state.current = state.profiles[0].id; save(); fillForm(); $("#confirmDelete").hidden = true; toast("Profile deleted.");
});

// ---- example screenshots ship as image files; embed them so the copied site works anywhere ----
async function loadExampleImages() {
  const toData = (blob) => new Promise((ok, no) => { const r = new FileReader(); r.onload = () => ok(r.result); r.onerror = no; r.readAsDataURL(blob); });
  let changed = false;
  for (const prof of state.profiles) for (const proj of prof.projects || []) {
    if (!proj.exampleImage) continue;
    const path = EXAMPLE_IMAGES[proj.exampleImage];
    delete proj.exampleImage;
    if (proj.image || !path) continue;
    try { const res = await fetch(path); if (res.ok) { proj.image = await toData(await res.blob()); changed = true; } } catch (e) { /* opened from disk: no example image */ }
  }
  if (changed) { save(); renderProjects(); schedule(true); }
}

// ---- start ----
try { const t = localStorage.getItem(STORE + "-tab"); if (t) selectTab(t); } catch (e) {}
fillForm();
loadExampleImages();
