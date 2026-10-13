// Démos interactives du cours. Chaque démo est un <div class="demo" data-demo="..."> dans un README.
(function () {
  "use strict";

  // Convention suisse du cours : 1'234'567,89
  function fmt(n, d = 0) {
    const [int, dec] = Math.abs(n).toFixed(d).split(".");
    const grouped = int.replace(/\B(?=(\d{3})+(?!\d))/g, "'");
    return (n < 0 ? "−" : "") + grouped + (dec ? "," + dec : "");
  }

  function humanSize(bytes) {
    const units = ["octets", "ko", "Mo", "Go", "To", "Po"];
    let i = 0;
    while (bytes >= 1000 && i < units.length - 1) { bytes /= 1000; i++; }
    const d = i === 0 || bytes >= 100 ? 0 : bytes >= 10 ? 1 : 2;
    return fmt(bytes, d) + " " + units[i];
  }

  function el(tag, attrs = {}, children = []) {
    const e = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (k === "text") e.textContent = v;
      else if (k === "html") e.innerHTML = v;
      else e.setAttribute(k, v);
    }
    for (const c of children) e.appendChild(c);
    return e;
  }

  function loadImage(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  }

  // ---------------------------------------------------------------- Pixels
  // Affiche une petite image agrandie : valeurs RVB, binaire, coordonnées MN95,
  // et effet de la profondeur de codage (bits par canal).
  async function demoPixels(root) {
    const src = root.dataset.src;
    const x0 = parseFloat(root.dataset.x0), y0 = parseFloat(root.dataset.y0), px = parseFloat(root.dataset.pixel);
    const img = await loadImage(src);
    const w = img.width, h = img.height;
    const off = el("canvas", { width: w, height: h });
    const octx = off.getContext("2d");
    octx.drawImage(img, 0, 0);
    const orig = octx.getImageData(0, 0, w, h);

    const scale = Math.max(1, Math.floor(480 / w));
    const canvas = el("canvas", { width: w * scale, height: h * scale, class: "demo-canvas" });
    const ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = false;

    const slider = el("input", { type: "range", min: "1", max: "8", value: "8", step: "1" });
    const bitsLabel = el("span", { class: "demo-strong" });
    const info = el("div", { class: "demo-info", html: "Survolez ou touchez un pixel." });
    const stats = el("div", { class: "demo-stats" });

    let bits = 8, current = orig;

    function quantize() {
      const levels = 2 ** bits;
      const q = new ImageData(new Uint8ClampedArray(orig.data), w, h);
      const step = 255 / (levels - 1);
      for (let i = 0; i < q.data.length; i += 4) {
        for (let c = 0; c < 3; c++) q.data[i + c] = Math.round(Math.round(q.data[i + c] / step) * step);
      }
      current = q;
      octx.putImageData(q, 0, 0);
      ctx.drawImage(off, 0, 0, w * scale, h * scale);
      bitsLabel.textContent = bits + " bit" + (bits > 1 ? "s" : "") + " par canal";
      const colors = 2 ** (3 * bits);
      stats.innerHTML =
        `${fmt(levels)} niveaux par canal · ${fmt(colors)} couleurs possibles · ` +
        `taille brute : ${w} × ${h} pixels × 3 canaux × ${bits} bits = <b>${humanSize((w * h * 3 * bits) / 8)}</b>`;
    }

    function showPixel(evt) {
      const r = canvas.getBoundingClientRect();
      const t = evt.touches ? evt.touches[0] : evt;
      const c = Math.floor(((t.clientX - r.left) / r.width) * w);
      const l = Math.floor(((t.clientY - r.top) / r.height) * h);
      if (c < 0 || l < 0 || c >= w || l >= h) return;
      const i = (l * w + c) * 4;
      // Valeur réellement stockée sur `bits` bits (indice du niveau), puis valeur affichée sur 0-255
      const step = 255 / (2 ** bits - 1);
      const stored = [0, 1, 2].map((k) => Math.round(orig.data[i + k] / step));
      const shown = [0, 1, 2].map((k) => current.data[i + k]);
      const bin = (v) => v.toString(2).padStart(bits, "0");
      const part = (cls, name, k) =>
        `<span class="${cls}">${name} = ${stored[k]}</span> (<code>${bin(stored[k])}</code>` +
        (bits < 8 ? ` → affiché ${shown[k]}` : "") + ")";
      const E = x0 + (c + 0.5) * px, N = y0 - (l + 0.5) * px;
      info.innerHTML =
        `Colonne ${c}, ligne ${l} → centre du pixel en MN95 : E = ${fmt(E, 2)} m, N = ${fmt(N, 2)} m<br>` +
        `${part("demo-r", "R", 0)} · ${part("demo-g", "V", 1)} · ${part("demo-b", "B", 2)}`;
      evt.preventDefault && evt.type === "touchmove" && evt.preventDefault();
    }

    slider.addEventListener("input", () => { bits = parseInt(slider.value, 10); quantize(); });
    canvas.addEventListener("mousemove", showPixel);
    canvas.addEventListener("click", showPixel);
    canvas.addEventListener("touchmove", showPixel, { passive: false });

    root.append(
      canvas,
      info,
      el("label", { class: "demo-row" }, [el("span", { text: "Profondeur de codage : " }), slider, bitsLabel]),
      stats
    );
    quantize();
  }

  // ---------------------------------------------------------------- Compression
  // Recompresse une image dans le navigateur (JPEG ou WebP) et affiche taille et artefacts.
  async function demoCompression(root) {
    const img = await loadImage(root.dataset.src);
    const w = img.width, h = img.height, raw = w * h * 3;

    const srcCanvas = el("canvas", { width: w, height: h });
    srcCanvas.getContext("2d").drawImage(img, 0, 0);

    const left = el("canvas", { width: w, height: h, class: "demo-canvas demo-half" });
    const right = el("canvas", { width: w, height: h, class: "demo-canvas demo-half" });
    const lctx = left.getContext("2d"), rctx = right.getContext("2d");
    lctx.imageSmoothingEnabled = rctx.imageSmoothingEnabled = false;

    const quality = el("input", { type: "range", min: "1", max: "100", value: "75", step: "1" });
    const qLabel = el("span", { class: "demo-strong" });
    const format = el("select", {}, [
      el("option", { value: "image/jpeg", text: "JPEG" }),
      el("option", { value: "image/webp", text: "WebP" }),
    ]);
    const zoom = el("input", { type: "checkbox" });
    const stats = el("div", { class: "demo-stats" });

    let blobUrl = null, compressed = null, busy = false, pending = false;

    function draw() {
      const z = zoom.checked ? 4 : 1;
      const sw = w / z, sh = h / z, sx = (w - sw) / 2, sy = (h - sh) / 2;
      lctx.drawImage(srcCanvas, sx, sy, sw, sh, 0, 0, w, h);
      if (compressed) rctx.drawImage(compressed, sx, sy, sw, sh, 0, 0, w, h);
    }

    function update() {
      if (busy) { pending = true; return; }
      busy = true;
      const q = parseInt(quality.value, 10);
      qLabel.textContent = "qualité " + q;
      srcCanvas.toBlob(async (blob) => {
        if (blobUrl) URL.revokeObjectURL(blobUrl);
        blobUrl = URL.createObjectURL(blob);
        compressed = await loadImage(blobUrl);
        draw();
        const supported = blob.type === format.value;
        const name = supported ? format.options[format.selectedIndex].text : "PNG (format non pris en charge par ce navigateur)";
        stats.innerHTML =
          `Image brute : ${w} × ${h} × 3 octets = ${humanSize(raw)} · ` +
          `${name} : <b>${humanSize(blob.size)}</b> · ratio <b>${fmt(raw / blob.size, 1)}:1</b>`;
        busy = false;
        if (pending) { pending = false; update(); }
      }, format.value, q / 100);
    }

    quality.addEventListener("input", update);
    format.addEventListener("change", update);
    zoom.addEventListener("change", draw);

    root.append(
      el("div", { class: "demo-pair" }, [
        el("figure", {}, [left, el("figcaption", { text: "Original (PNG, sans perte)" })]),
        el("figure", {}, [right, el("figcaption", { text: "Recompressé" })]),
      ]),
      el("label", { class: "demo-row" }, [el("span", { text: "Format : " }), format, el("span", { text: " Qualité : " }), quality, qLabel]),
      el("label", { class: "demo-row" }, [zoom, el("span", { text: " Zoom ×4 au centre (pour voir les artefacts)" })]),
      stats
    );
    update();
  }

  // ---------------------------------------------------------------- Taille
  // Calcule la taille brute d'un raster à partir de l'emprise, du pixel, des bandes et du type.
  function demoTaille(root) {
    const presets = [
      { n: "Fil rouge : SWISSIMAGE, 1 km²", a: 1, r: 0.1, b: 3, t: 1 },
      { n: "Fil rouge : swissALTI3D, 1 km²", a: 1, r: 0.5, b: 1, t: 4 },
      { n: "SWISSIMAGE 10 cm, toute la Suisse", a: 41285, r: 0.1, b: 3, t: 1 },
      { n: "swissALTI3D 0,5 m, toute la Suisse", a: 41285, r: 0.5, b: 1, t: 4 },
      { n: "Sentinel-2, 4 bandes à 10 m, Suisse", a: 41285, r: 10, b: 4, t: 2 },
      { n: "Sentinel-2, 4 bandes, Suisse, 1 an tous les 5 jours", a: 41285 * 73, r: 10, b: 4, t: 2 },
    ];
    const types = [
      { v: 1, n: "Byte / UInt8 (1 octet)" },
      { v: 2, n: "UInt16 / Int16 (2 octets)" },
      { v: 4, n: "Float32 (4 octets)" },
      { v: 8, n: "Float64 (8 octets)" },
    ];
    const preset = el("select", {}, presets.map((p, i) => el("option", { value: i, text: p.n })));
    const area = el("input", { type: "number", min: "0", step: "any", value: "1" });
    const res = el("input", { type: "number", min: "0.01", step: "any", value: "0.1" });
    const bands = el("input", { type: "number", min: "1", step: "1", value: "3" });
    const type = el("select", {}, types.map((t) => el("option", { value: t.v, text: t.n })));
    const out = el("div", { class: "demo-stats" });

    function apply() {
      const p = presets[preset.value];
      area.value = p.a; res.value = p.r; bands.value = p.b; type.value = p.t;
      calc();
    }
    function calc() {
      const a = parseFloat(area.value) || 0, r = parseFloat(res.value) || 1;
      const b = parseInt(bands.value, 10) || 1, t = parseInt(type.value, 10);
      const pixels = (a * 1e6) / (r * r);
      const bytes = pixels * b * t;
      out.innerHTML =
        `${fmt(pixels)} pixels par bande × ${b} bande${b > 1 ? "s" : ""} × ${t} octet${t > 1 ? "s" : ""} = ` +
        `<b>${humanSize(bytes)}</b> non compressés`;
    }
    preset.addEventListener("change", apply);
    [area, res, bands, type].forEach((i) => i.addEventListener("input", calc));

    const row = (label, input, unit = "") =>
      el("label", { class: "demo-row" }, [el("span", { class: "demo-lbl", text: label }), input, el("span", { text: unit })]);
    root.append(
      row("Exemple : ", preset),
      row("Surface : ", area, " km²"),
      row("Taille du pixel : ", res, " m"),
      row("Nombre de bandes : ", bands),
      row("Type de données : ", type),
      out
    );
    apply();
  }

  // ---------------------------------------------------------------- Bibliothèques externes
  // Chargées uniquement sur les pages qui contiennent une démo cartographique.
  const LIBS = {
    maplibreJs: "https://unpkg.com/maplibre-gl@4.7.1/dist/maplibre-gl.js",
    maplibreCss: "https://unpkg.com/maplibre-gl@4.7.1/dist/maplibre-gl.css",
    pmtilesJs: "https://unpkg.com/pmtiles@3.2.1/dist/pmtiles.js",
  };

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      if (document.querySelector(`script[src="${src}"]`)) return resolve();
      const s = el("script", { src });
      s.onload = resolve;
      s.onerror = () => reject(new Error("impossible de charger " + src));
      document.head.appendChild(s);
    });
  }

  function loadCss(href) {
    if (!document.querySelector(`link[href="${href}"]`)) document.head.appendChild(el("link", { rel: "stylesheet", href }));
  }

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  // ---------------------------------------------------------------- PMTiles
  // Carte MapLibre lisant un fichier PMTiles : limites des tuiles affichées,
  // journal des tuiles demandées et des requêtes HTTP partielles, mode ralenti.
  async function demoPmtiles(root) {
    loadCss(LIBS.maplibreCss);
    await loadScript(LIBS.maplibreJs);
    await loadScript(LIBS.pmtilesJs);
    const url = new URL(root.dataset.src, location.href).href;
    const fileSize = parseInt(root.dataset.size || "0", 10);

    const mapDiv = el("div", { class: "demo-map" });
    root.appendChild(mapDiv); // la carte doit être dans la page avant sa création (mesure de la taille)
    const slow = el("input", { type: "checkbox" });
    slow.checked = true;
    const bounds = el("input", { type: "checkbox" });
    bounds.checked = true;
    const zoomInfo = el("span", { class: "demo-strong" });
    const stats = el("div", { class: "demo-stats" });
    const log = el("ol", { class: "demo-log", reversed: "" });
    const reset = el("button", { type: "button", class: "demo-btn", text: "Recommencer" });

    let tiles = 0, requests = 0, bytes = 0;
    const seen = new Set();

    function addLog(html) {
      const li = el("li", { html });
      log.prepend(li);
      while (log.children.length > 60) log.lastChild.remove();
    }
    function updateStats() {
      stats.innerHTML =
        `<b>${tiles}</b> tuile${tiles > 1 ? "s" : ""} demandée${tiles > 1 ? "s" : ""} · ` +
        `<b>${requests}</b> requête${requests > 1 ? "s" : ""} HTTP partielle${requests > 1 ? "s" : ""} · ` +
        `<b>${humanSize(bytes)}</b> téléchargés` +
        (fileSize ? ` sur ${humanSize(fileSize)} (${fmt((100 * bytes) / fileSize, 0)} % du fichier)` : "");
    }

    // Source qui journalise chaque lecture d'octets (requête HTTP « Range »)
    class LoggingSource {
      constructor(u) { this.inner = new pmtiles.FetchSource(u); }
      getKey() { return this.inner.getKey(); }
      async getBytes(offset, length, signal, etag) {
        const r = await this.inner.getBytes(offset, length, signal, etag);
        requests++;
        bytes += r.data.byteLength;
        addLog(`<span class="demo-req">HTTP Range</span> octets ${fmt(offset)} – ${fmt(offset + length - 1)} (${humanSize(r.data.byteLength)})`);
        updateStats();
        return r;
      }
    }

    // Un protocole « pmtiles:// » par page ; chaque (re)création de la démo remplace son archive
    const protocol = new pmtiles.Protocol();
    const archive = new pmtiles.PMTiles(new LoggingSource(url));
    protocol.add(archive);
    if (!maplibregl.__cfgeoHandlers) {
      maplibregl.__cfgeoHandlers = new Map();
      maplibregl.addProtocol("pmtiles", async (params, abort) => {
        const m = params.url.match(/\/(\d+)\/(\d+)\/(\d+)$/);
        const h = maplibregl.__cfgeoHandlers.get(params.url.replace(/\/\d+\/\d+\/\d+$/, "")) ||
          maplibregl.__cfgeoHandlers.get(params.url);
        if (m && h) await h.onTile(+m[1], +m[2], +m[3]);
        return (h ? h.protocol : protocol).tile(params, abort);
      });
    }
    maplibregl.__cfgeoHandlers.set("pmtiles://" + url, {
      protocol,
      onTile: async (z, x, y) => {
        const key = `${z}/${x}/${y}`;
        if (!seen.has(key)) {
          seen.add(key);
          tiles++;
          addLog(`<span class="demo-tile">Tuile</span> z ${z} · x ${x} · y ${y}`);
          updateStats();
        }
        if (slow.checked) await sleep(350);
      },
    });

    const header = await archive.getHeader();
    const center = root.dataset.center
      ? root.dataset.center.split(",").map(Number)
      : [(header.minLon + header.maxLon) / 2, (header.minLat + header.maxLat) / 2];
    const startZoom = parseFloat(root.dataset.zoom || "14");

    const map = new maplibregl.Map({
      container: mapDiv,
      center,
      zoom: startZoom,
      minZoom: 10,
      maxZoom: 19,
      attributionControl: { compact: true },
      style: {
        version: 8,
        sources: {
          fond: {
            type: "raster",
            tiles: ["https://wmts.geo.admin.ch/1.0.0/ch.swisstopo.pixelkarte-grau/default/current/3857/{z}/{x}/{y}.jpeg"],
            tileSize: 256,
            attribution: "© swisstopo",
          },
          fr: { type: "vector", url: "pmtiles://" + url, attribution: "swissBUILDINGS3D, swissTLM3D, OFT © swisstopo" },
        },
        layers: [
          { id: "fond", type: "raster", source: "fond", paint: { "raster-opacity": 0.3 } },
          { id: "commune", type: "line", source: "fr", "source-layer": "commune", paint: { "line-color": "#6a3d9a", "line-width": 2, "line-dasharray": [3, 2] } },
          { id: "routes", type: "line", source: "fr", "source-layer": "routes", paint: { "line-color": "#555", "line-width": ["interpolate", ["linear"], ["zoom"], 13, 0.8, 18, 4] } },
          {
            id: "batiments", type: "fill", source: "fr", "source-layer": "batiments",
            paint: {
              "fill-color": ["interpolate", ["linear"], ["coalesce", ["get", "hauteur"], 8], 5, "#fdd49e", 15, "#ef6548", 30, "#990000"],
              "fill-outline-color": "#7f0000",
            },
          },
          { id: "arrets", type: "circle", source: "fr", "source-layer": "arrets_tp", paint: { "circle-radius": 6, "circle-color": "#2166ac", "circle-stroke-color": "#fff", "circle-stroke-width": 2 } },
          { id: "tuile", type: "line", source: "fr", "source-layer": "tuile", paint: { "line-color": "#00796b", "line-width": 3 } },
        ],
      },
    });
    map.showTileBoundaries = true;
    // Attribution repliée au départ (MapLibre l'ouvre par défaut en mode compact)
    map.on("load", () => mapDiv.querySelector(".maplibregl-ctrl-attrib")?.classList.remove("maplibregl-compact-show"));
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }));

    const showZoom = () => { zoomInfo.textContent = "niveau de zoom " + fmt(map.getZoom(), 1); };
    map.on("zoom", showZoom);
    map.on("click", "batiments", (e) => {
      const p = e.features[0].properties;
      new maplibregl.Popup()
        .setLngLat(e.lngLat)
        .setHTML(`<b>${p.genre || "Bâtiment"}</b>${p.nom ? "<br>" + p.nom : ""}<br>hauteur : ${p.hauteur ? fmt(+p.hauteur, 1) + " m" : "?"}`)
        .addTo(map);
    });
    map.on("mouseenter", "batiments", () => { map.getCanvas().style.cursor = "pointer"; });
    map.on("mouseleave", "batiments", () => { map.getCanvas().style.cursor = ""; });
    bounds.addEventListener("change", () => { map.showTileBoundaries = bounds.checked; });

    // Recommencer = nouvelle carte et nouvelle archive : le cache est vide, tout est relu
    reset.addEventListener("click", () => {
      map.remove();
      root.querySelectorAll(":scope > :not(.demo-keep)").forEach((n) => n.remove());
      demoPmtiles(root);
    });

    showZoom();
    updateStats();
    root.append(
      el("div", { class: "demo-row" }, [
        el("label", {}, [slow, el("span", { text: " Ralentir le chargement" })]),
        el("label", {}, [bounds, el("span", { text: " Afficher les limites des tuiles" })]),
        reset,
        zoomInfo,
      ]),
      stats,
      el("details", { class: "demo-details", open: "" }, [el("summary", { text: "Journal : tuiles et requêtes HTTP (la plus récente en haut)" }), log])
    );
  }

  // ---------------------------------------------------------------- Quiz
  const QUIZZES = {
    "formats-vecteur": [
      {
        q: "Vous envoyez un plan de situation à un bureau d'architectes qui travaille avec AutoCAD.",
        a: ["DXF", "GeoPackage", "GeoParquet", "PMTiles"], ok: 0,
        e: "DXF est le format d'échange du monde DAO/CAO. Attention : il ne transmet ni système de coordonnées, ni vraie table d'attributs.",
      },
      {
        q: "Vous transmettez à un collègue les couches d'un projet QGIS (bâtiments, routes, arrêts) pour qu'il continue le travail.",
        a: ["Shapefile", "GeoPackage", "KML", "CSV"], ok: 1,
        e: "Un seul fichier, plusieurs couches, système de coordonnées inclus, aucune limite sur les noms de champs : GeoPackage est le format de travail courant.",
      },
      {
        q: "Un développeur web veut afficher une cinquantaine d'arrêts de bus sur la carte de son site, en JavaScript.",
        a: ["GML", "INTERLIS", "GeoJSON", "File Geodatabase"], ok: 2,
        e: "GeoJSON est lu nativement par les navigateurs et les bibliothèques web. Pour un petit jeu de données, sa lourdeur n'est pas un problème.",
      },
      {
        q: "Vous livrez au canton des données de la mensuration officielle.",
        a: ["GeoPackage", "DXF", "Shapefile", "INTERLIS"], ok: 3,
        e: "Pour les géodonnées de base en Suisse, la législation impose un modèle de données décrit en INTERLIS et un transfert dans ce format.",
      },
      {
        q: "Vous voulez publier une carte web interactive des 3 millions de bâtiments de Suisse, sans installer de serveur cartographique.",
        a: ["GeoJSON", "PMTiles", "KML", "GeoPackage"], ok: 1,
        e: "PMTiles contient des tuiles vectorielles prêtes à afficher, lues par morceaux sur un simple serveur web. Rappel : ce sont des données pour l'affichage, simplifiées selon le zoom.",
      },
      {
        q: "Un analyste veut calculer la surface bâtie moyenne par commune sur ces 3 millions de bâtiments, avec des requêtes SQL.",
        a: ["GeoParquet", "PMTiles", "KML", "DXF"], ok: 0,
        e: "GeoParquet stocke les données par colonnes et compressées : idéal pour l'analyse de gros volumes avec DuckDB, Python ou d'autres outils de données.",
      },
      {
        q: "Un client veut visualiser le tracé de sa randonnée dans Google Earth.",
        a: ["GeoParquet", "KML / KMZ", "INTERLIS", "FlatGeobuf"], ok: 1,
        e: "KML est le format natif de Google Earth (standard OGC). Les coordonnées doivent être en WGS84.",
      },
      {
        q: "Votre partenaire utilise un ancien logiciel qui ne lit que « le format SIG classique ».",
        a: ["Shapefile", "GeoParquet", "PMTiles", "GeoPackage"], ok: 0,
        e: "Le Shapefile reste le plus petit dénominateur commun. Pensez à envoyer tous les fichiers (.shp, .shx, .dbf, .prj, .cpg) et vérifiez les noms de champs (10 caractères).",
      },
    ],
  };

  function demoQuiz(root) {
    const qs = QUIZZES[root.dataset.quiz] || [];
    let answered = 0, good = 0;
    const score = el("div", { class: "demo-stats" });
    const showScore = () => {
      score.innerHTML = answered < qs.length
        ? `Réponses : ${answered} / ${qs.length}`
        : `<b>Score : ${good} / ${qs.length}</b>${good === qs.length ? " — parfait !" : ""}`;
    };
    qs.forEach((item, i) => {
      const box = el("div", { class: "demo-quiz-q" });
      const fb = el("div", { class: "demo-quiz-fb" });
      const btns = item.a.map((label, k) => {
        const b = el("button", { type: "button", class: "demo-btn", text: label });
        b.addEventListener("click", () => {
          if (box.dataset.done) return;
          box.dataset.done = "1";
          answered++;
          const right = k === item.ok;
          if (right) good++;
          b.classList.add(right ? "demo-ok" : "demo-ko");
          btns[item.ok].classList.add("demo-ok");
          fb.innerHTML = (right ? "✅ " : "❌ ") + item.e;
          showScore();
        });
        return b;
      });
      box.append(el("p", { html: `<b>${i + 1}.</b> ${item.q}` }), el("div", { class: "demo-row" }, btns), fb);
      root.appendChild(box);
    });
    root.appendChild(score);
    showScore();
  }

  const demos = { pixels: demoPixels, compression: demoCompression, taille: demoTaille, pmtiles: demoPmtiles, quiz: demoQuiz };

  function init() {
    document.querySelectorAll(".demo[data-demo]").forEach((root) => {
      if (root.dataset.ready) return;
      root.dataset.ready = "1";
      const f = demos[root.dataset.demo];
      if (f) Promise.resolve(f(root)).catch((e) => { root.textContent = "Démo indisponible : " + e; });
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
