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
    const seen = new Set();      // tuiles chargées (z/x/y)
    const pending = new Set();   // tuiles demandées, en attente
    const SLOW_MS = 2000;
    let queue = Promise.resolve();

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
        if (!seen.has(key)) { pending.add(key); updateGrid(); }
        // Mode ralenti : les tuiles passent une par une dans une file, une toutes les 2 secondes
        if (slow.checked) {
          const turn = queue.then(() => sleep(SLOW_MS));
          queue = turn;
          await turn;
        }
        pending.delete(key);
        if (!seen.has(key)) {
          seen.add(key);
          tiles++;
          addLog(`<span class="demo-tile">Tuile</span> z ${z} · x ${x} · y ${y}`);
          updateStats();
        }
        updateGrid();
      },
    });

    const header = await archive.getHeader();

    // Grille des tuiles dessinée par nos soins (plus visible que la grille de débogage de MapLibre)
    const lon2x = (lon, z) => Math.floor(((lon + 180) / 360) * 2 ** z);
    const lat2y = (lat, z) => {
      const r = (lat * Math.PI) / 180;
      return Math.floor(((1 - Math.log(Math.tan(r) + 1 / Math.cos(r)) / Math.PI) / 2) * 2 ** z);
    };
    const x2lon = (x, z) => (x / 2 ** z) * 360 - 180;
    const y2lat = (y, z) => {
      const n = Math.PI - (2 * Math.PI * y) / 2 ** z;
      return (180 / Math.PI) * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n)));
    };
    let map = null;
    const labels = new Map();
    function updateGrid() {
      if (!map || !map.getSource("grille")) return;
      const show = bounds.checked;
      // Les tuiles vectorielles font 512 px : niveau de tuile = partie entière du zoom, limité au contenu du fichier
      const z = Math.min(header.maxZoom, Math.max(header.minZoom, Math.floor(map.getZoom())));
      const b = map.getBounds();
      const w = Math.max(b.getWest(), header.minLon), e = Math.min(b.getEast(), header.maxLon);
      const s = Math.max(b.getSouth(), header.minLat), n = Math.min(b.getNorth(), header.maxLat);
      const feats = [];
      const keep = new Set();
      if (show && w < e && s < n) {
        for (let x = lon2x(w, z); x <= lon2x(e, z); x++) {
          for (let y = lat2y(n, z); y <= lat2y(s, z); y++) {
            const key = `${z}/${x}/${y}`;
            const etat = seen.has(key) ? "chargee" : pending.has(key) ? "attente" : "vide";
            const [x0, x1, y0, y1] = [x2lon(x, z), x2lon(x + 1, z), y2lat(y, z), y2lat(y + 1, z)];
            feats.push({
              type: "Feature",
              properties: { etat },
              geometry: { type: "Polygon", coordinates: [[[x0, y0], [x1, y0], [x1, y1], [x0, y1], [x0, y0]]] },
            });
            keep.add(key);
            if (!labels.has(key)) {
              const div = el("div", { class: "demo-tile-label" });
              labels.set(key, { div, marker: new maplibregl.Marker({ element: div, anchor: "top-left" }).setLngLat([x0, y0]).addTo(map) });
            }
            const lab = labels.get(key);
            lab.div.textContent = `${key}${etat === "attente" ? " ⏳" : etat === "chargee" ? " ✓" : ""}`;
            lab.div.dataset.etat = etat;
          }
        }
      }
      for (const [key, lab] of labels) if (!keep.has(key)) { lab.marker.remove(); labels.delete(key); }
      map.getSource("grille").setData({ type: "FeatureCollection", features: feats });
    }
    const center = root.dataset.center
      ? root.dataset.center.split(",").map(Number)
      : [(header.minLon + header.maxLon) / 2, (header.minLat + header.maxLat) / 2];
    const startZoom = parseFloat(root.dataset.zoom || "14");

    map = new maplibregl.Map({
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
          grille: { type: "geojson", data: { type: "FeatureCollection", features: [] } },
        },
        layers: [
          { id: "fond", type: "raster", source: "fond", paint: { "raster-opacity": 0.3 } },
          {
            id: "grille-fond", type: "fill", source: "grille",
            paint: {
              "fill-color": ["match", ["get", "etat"], "chargee", "#2e7d32", "attente", "#ff9800", "#000000"],
              "fill-opacity": ["match", ["get", "etat"], "chargee", 0.15, "attente", 0.35, 0],
            },
          },
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
          { id: "grille-liseré", type: "line", source: "grille", paint: { "line-color": "#ffffff", "line-width": 8 } },
          {
            id: "grille-bord", type: "line", source: "grille",
            paint: {
              "line-color": ["match", ["get", "etat"], "attente", "#e65100", "chargee", "#2e7d32", "#c62828"],
              "line-width": 4,
            },
          },
        ],
      },
    });
    map.on("load", updateGrid);
    map.on("moveend", updateGrid);
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
    bounds.addEventListener("change", updateGrid);

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
        el("label", {}, [slow, el("span", { text: " Ralentir (une tuile toutes les 2 s)" })]),
        el("label", {}, [bounds, el("span", { text: " Afficher les limites des tuiles" })]),
        reset,
        zoomInfo,
      ]),
      stats,
      el("details", { class: "demo-details", open: "" }, [el("summary", { text: "Journal : tuiles et requêtes HTTP (la plus récente en haut)" }), log])
    );
  }

  // ---------------------------------------------------------------- Chapitre 1 : outils
  const hex2 = (b) => b.toString(16).toUpperCase().padStart(2, "0");
  const hexBytes = (arr) => Array.from(arr, hex2).join(" ");

  // ---------------------------------------------------------------- Bits
  // Interrupteurs cliquables : un octet (entier) ou trois octets (couleur RVB).
  function demoBits(root) {
    const mode = el("select", {}, [
      el("option", { value: "1", text: "Un octet (entier de 0 à 255)" }),
      el("option", { value: "3", text: "Trois octets (couleur RVB)" }),
    ]);
    const preset = el("button", { type: "button", class: "demo-btn", text: "🧵 Pixel du fil rouge (#CCD3E6)" });
    const zero = el("button", { type: "button", class: "demo-btn", text: "Tout à 0" });
    const grid = el("div", { class: "demo-bits" });
    const out = el("div", { class: "demo-stats" });
    const swatch = el("div", { class: "demo-swatch" });
    let bytes = [42];

    function render() {
      grid.innerHTML = "";
      const names = bytes.length === 3 ? ["Rouge", "Vert", "Bleu"] : ["Octet"];
      bytes.forEach((val, k) => {
        const row = el("div", { class: "demo-bitrow" }, [el("span", { class: "demo-bitname", text: names[k] })]);
        for (let i = 7; i >= 0; i--) {
          const on = (val >> i) & 1;
          const b = el("button", { type: "button", class: "demo-bit" + (on ? " on" : ""), title: `2^${i} = ${2 ** i}` }, [
            el("span", { class: "demo-bitval", text: on ? "1" : "0" }),
            el("span", { class: "demo-bitw", text: String(2 ** i) }),
          ]);
          b.addEventListener("click", () => { bytes[k] ^= 1 << i; render(); });
          row.appendChild(b);
        }
        row.appendChild(el("span", { class: "demo-bitres", html: `= <b>${val}</b> · hexa <b>${hex2(val)}</b>` }));
        grid.appendChild(row);
      });
      if (bytes.length === 3) {
        const [r, g, b] = bytes;
        swatch.style.background = `rgb(${r},${g},${b})`;
        out.innerHTML = `Couleur <b>#${hexBytes(bytes).replace(/ /g, "")}</b> · rgb(${r}, ${g}, ${b}) · 3 octets = 24 bits → ${fmt(2 ** 24)} couleurs possibles`;
      } else {
        const v = bytes[0];
        swatch.style.background = `rgb(${v},${v},${v})`;
        out.innerHTML = `Binaire <b>${v.toString(2).padStart(8, "0")}</b> = décimal <b>${v}</b> = hexa <b>${hex2(v)}</b> · comme niveau de gris : ${v === 0 ? "noir" : v === 255 ? "blanc" : "gris"}`;
      }
    }
    mode.addEventListener("change", () => { bytes = mode.value === "3" ? [204, 211, 230] : [42]; render(); });
    preset.addEventListener("click", () => { mode.value = "3"; bytes = [204, 211, 230]; render(); });
    zero.addEventListener("click", () => { bytes = bytes.map(() => 0); render(); });
    root.append(el("div", { class: "demo-row" }, [mode, preset, zero]), el("div", { class: "demo-bitwrap" }, [grid, swatch]), out);
    render();
  }

  // ---------------------------------------------------------------- Exercices de conversion
  // Générateur d'exercices aléatoires avec vérification et correction détaillée.
  function demoExercices(root) {
    const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
    const bin8 = (n) => n.toString(2).padStart(8, "0");
    const clean = (str) => str.replace(/[\s'_]/g, "").toUpperCase();

    // Tableau des poids pour un octet
    const weights = (n) => {
      const bits = bin8(n).split("");
      const cells = bits.map((b, i) => 2 ** (7 - i));
      return `<table class="demo-table"><tr><th>Poids</th>${cells.map((w) => `<td>${w}</td>`).join("")}</tr>
        <tr><th>Bit</th>${bits.map((b) => `<td><b>${b}</b></td>`).join("")}</tr>
        <tr><th>Valeur</th>${bits.map((b, i) => `<td>${b === "1" ? cells[i] : "·"}</td>`).join("")}</tr></table>`;
    };
    const divisions = (n) => {
      const rows = [];
      let q = n;
      while (q > 0) { rows.push(`<tr><td>${q} / 2</td><td>${Math.floor(q / 2)}</td><td><b>${q % 2}</b></td></tr>`); q = Math.floor(q / 2); }
      return `<table class="demo-table"><tr><th>Division</th><th>Quotient</th><th>Reste</th></tr>${rows.join("")}</table>
        Lecture des restes de bas en haut : <b>${n.toString(2)}</b>, soit <b>${bin8(n)}</b> sur 8 bits.`;
    };

    const TYPES = {
      b2d: () => {
        const n = rnd(1, 255);
        return {
          q: `Convertissez <b>${bin8(n)}</b>₍₂₎ en décimal.`,
          ok: (r) => parseInt(clean(r), 10) === n,
          sol: `Somme des poids des bits à 1 : ${bin8(n).split("").map((b, i) => (b === "1" ? 2 ** (7 - i) : null)).filter((x) => x !== null).join(" + ")} = <b>${n}</b>${weights(n)}`,
        };
      },
      d2b: () => {
        const n = rnd(1, 255);
        return {
          q: `Convertissez <b>${n}</b>₍₁₀₎ en binaire sur 8 bits.`,
          ok: (r) => /^[01]+$/.test(clean(r)) && parseInt(clean(r), 2) === n,
          sol: divisions(n),
        };
      },
      bits: () => {
        const items = [
          ["les 26 lettres de l'alphabet", 26], ["les 2'136 communes de Suisse", 2136], ["les 26 cantons", 26],
          ["les 7 jours de la semaine", 7], ["les 300 communes vaudoises", 300], ["les 405 bâtiments de la tuile du fil rouge", 405],
          ["les 12 mois de l'année", 12], ["les 1'000 numéros de parcelle d'un domaine de numérotation", 1000],
        ];
        const [label, n] = items[rnd(0, items.length - 1)];
        const k = Math.ceil(Math.log2(n));
        return {
          q: `Combien de bits faut-il au minimum pour attribuer un numéro différent à ${label} (${fmt(n)}) ?`,
          ok: (r) => parseInt(clean(r), 10) === k,
          sol: `Il faut 2<sup>k</sup> ≥ ${fmt(n)} : 2<sup>${k - 1}</sup> = ${fmt(2 ** (k - 1))} ne suffit pas, 2<sup>${k}</sup> = ${fmt(2 ** k)} suffit → <b>${k} bits</b>.`,
        };
      },
      h2d: () => {
        const n = rnd(16, 255);
        const h = hex2(n);
        const d = [parseInt(h[0], 16), parseInt(h[1], 16)];
        return {
          q: `Convertissez l'octet hexadécimal <b>${h}</b> en décimal (par exemple une composante de couleur <code>#${h}${h}${h}</code>).`,
          ok: (r) => parseInt(clean(r), 10) === n,
          sol: `${h[0]} = ${d[0]} et ${h[1]} = ${d[1]} → ${d[0]} × 16 + ${d[1]} = <b>${n}</b>. En binaire : ${d[0].toString(2).padStart(4, "0")} ${d[1].toString(2).padStart(4, "0")}.`,
        };
      },
      d2h: () => {
        const n = rnd(16, 255);
        return {
          q: `Écrivez <b>${n}</b>₍₁₀₎ en hexadécimal (2 chiffres).`,
          ok: (r) => clean(r).replace(/^0X|^#/, "") === hex2(n),
          sol: `${n} = ${Math.floor(n / 16)} × 16 + ${n % 16} → chiffres ${Math.floor(n / 16).toString(16).toUpperCase()} et ${(n % 16).toString(16).toUpperCase()} → <b>${hex2(n)}</b>.`,
        };
      },
    };
    const LABELS = { b2d: "Binaire → décimal", d2b: "Décimal → binaire", bits: "Nombre de bits", h2d: "Hexa → décimal", d2h: "Décimal → hexa" };

    const type = el("select", {}, [el("option", { value: "mix", text: "Mélange" }), ...Object.entries(LABELS).map(([v, t]) => el("option", { value: v, text: t }))]);
    const next = el("button", { type: "button", class: "demo-btn", text: "Nouvel exercice" });
    const question = el("p", { class: "demo-ex-q" });
    const answer = el("input", { type: "text", class: "demo-ex-a", autocomplete: "off", placeholder: "Votre réponse" });
    const check = el("button", { type: "button", class: "demo-btn", text: "Vérifier" });
    const showSol = el("button", { type: "button", class: "demo-btn", text: "Voir la correction" });
    const feedback = el("div", { class: "demo-quiz-fb" });
    const score = el("div", { class: "demo-stats" });
    let ex = null, good = 0, total = 0, done = false;

    function newEx() {
      const keys = Object.keys(TYPES);
      const k = type.value === "mix" ? keys[rnd(0, keys.length - 1)] : type.value;
      ex = TYPES[k]();
      done = false;
      question.innerHTML = `<span class="demo-ex-tag">${LABELS[k]}</span> ${ex.q}`;
      answer.value = "";
      answer.classList.remove("demo-ok", "demo-ko");
      feedback.innerHTML = "";
      answer.focus({ preventScroll: true });
    }
    function verify() {
      if (!ex || !answer.value.trim()) return;
      const right = ex.ok(answer.value);
      if (!done) { total++; if (right) good++; done = true; }
      answer.classList.toggle("demo-ok", right);
      answer.classList.toggle("demo-ko", !right);
      feedback.innerHTML = right ? `✅ Juste ! ${ex.sol}` : `❌ Pas tout à fait. Réessayez ou affichez la correction.`;
      score.textContent = `Score : ${good} / ${total}`;
    }
    next.addEventListener("click", newEx);
    type.addEventListener("change", newEx);
    check.addEventListener("click", verify);
    answer.addEventListener("keydown", (e) => { if (e.key === "Enter") verify(); });
    showSol.addEventListener("click", () => { if (ex) feedback.innerHTML = `💡 ${ex.sol}`; });

    root.append(
      el("div", { class: "demo-row" }, [el("span", { text: "Type : " }), type, next]),
      question,
      el("div", { class: "demo-row" }, [answer, check, showSol]),
      feedback,
      score
    );
    newEx();
    score.textContent = "Score : 0 / 0";
  }

  // ---------------------------------------------------------------- Nombres à virgule
  function demoFloat(root) {
    const input = el("input", { type: "text", value: "2538500.12", inputmode: "decimal" });
    const presets = [
      ["Altitude 433,17 m", "433.17"],
      ["Coordonnée N 1'180'500,12", "1180500.12"],
      ["Coordonnée E 2'538'500,12", "2538500.12"],
    ].map(([t, v]) => {
      const b = el("button", { type: "button", class: "demo-btn", text: "🧵 " + t });
      b.addEventListener("click", () => { input.value = v; calc(); });
      return b;
    });
    const table = el("div");
    function bytesOf(v, size) {
      const buf = new ArrayBuffer(size), dv = new DataView(buf);
      size === 4 ? dv.setFloat32(0, v, true) : dv.setFloat64(0, v, true);
      return new Uint8Array(buf);
    }
    // Valeur représentable voisine (k = +1 ou -1) en Float32 et Float64
    function next32(f, k) {
      const dv = new DataView(new ArrayBuffer(4));
      dv.setFloat32(0, f);
      const sign = f < 0 ? -1 : 1;
      dv.setUint32(0, dv.getUint32(0) + k * sign);
      return dv.getFloat32(0);
    }
    function next64(f, k) {
      const dv = new DataView(new ArrayBuffer(8));
      dv.setFloat64(0, f);
      const sign = f < 0 ? -1n : 1n;
      dv.setBigUint64(0, dv.getBigUint64(0) + BigInt(k) * sign);
      return dv.getFloat64(0);
    }
    // Longueur lisible (le nombre est supposé en mètres)
    function len(x) {
      x = Math.abs(x);
      if (x >= 1) return fmt(x, 2) + " m";
      if (x >= 0.01) return fmt(x * 100, 1) + " cm";
      if (x >= 1e-6) return fmt(x * 1000, x >= 1e-4 ? 2 : 4) + " mm";
      if (x >= 1e-12) return fmt(x * 1e9, 3) + " nanomètre";
      if (x > 0) return fmt(x * 1e12, 3) + " picomètre";
      return "0";
    }
    const num = (x, d) => fmt(x, d);
    function calc() {
      const v = parseFloat(input.value.replace(/'/g, "").replace(",", "."));
      if (!isFinite(v)) { table.textContent = "Saisissez un nombre."; return; }
      const f32 = Math.fround(v);
      const s32 = Math.abs(next32(f32, 1) - f32);
      const s64 = Math.abs(next64(v, 1) - v);
      const dec = s32 >= 1 ? 1 : s32 >= 0.01 ? 3 : 6;
      // Règle graduée : 5 graduations Float32 autour du nombre saisi
      const ticks = [-2, -1, 0, 1, 2].map((k) => (k === 0 ? f32 : k < 0 ? next32(next32(f32, -1), k + 1) : next32(next32(f32, 1), k - 1)));
      const lo = ticks[0], hi = ticks[4];
      const pos = (x) => 10 + (80 * (x - lo)) / (hi - lo); // marge pour les étiquettes
      const ruler = `
        <div class="demo-ruler">
          ${ticks.map((t) => `<div class="demo-tick${t === f32 ? " demo-tick-on" : ""}" style="left:${pos(t)}%"><span>${num(t, dec)}</span></div>`).join("")}
          <div class="demo-mark" style="left:${pos(v)}%"><span>votre nombre<br><b>${num(v, dec + 2)}</b></span></div>
        </div>`;
      table.innerHTML = `
        <p><b>Float32</b> : autour de ce nombre, seules les valeurs de la règle ci-dessous existent, <b>espacées de ${len(s32)}</b>.
        Votre nombre tombe entre deux graduations : il est <b>arrondi à la plus proche</b>, ${num(f32, dec)}.</p>
        <p>Pourquoi cet espacement ? Votre nombre est compris entre <b>${num(2 ** Math.floor(Math.log2(Math.abs(v) || 1)), 0)}</b> et <b>${num(2 ** (Math.floor(Math.log2(Math.abs(v) || 1)) + 1), 0)}</b> :
        dans cette plage, un Float32 ne dispose que de 8'388'608 graduations (2<sup>23</sup>), soit une tous les ${len(s32)}. Plus le nombre est grand, plus la plage est large et plus les graduations s'écartent.</p>
        ${ruler}
        <table class="demo-table">
          <tr><th></th><th>Float32 (4 octets)</th><th>Float64 (8 octets)</th></tr>
          <tr><td>Valeur réellement stockée</td><td><b>${num(f32, dec)}</b></td><td><b>${num(v, 6)}</b>…</td></tr>
          <tr><td>Espacement des graduations</td><td class="${s32 >= 0.01 ? "demo-bad" : ""}">${len(s32)}</td><td>${len(s64)}</td></tr>
          <tr><td>Erreur d'arrondi (au pire la moitié de l'espacement)</td><td class="${Math.abs(f32 - v) >= 0.01 ? "demo-bad" : ""}">${len(f32 - v)}</td><td>moins de ${len(s64 / 2)}</td></tr>
          <tr><td>Les octets écrits dans le fichier</td><td><code>${hexBytes(bytesOf(v, 4))}</code></td><td><code>${hexBytes(bytesOf(v, 8))}</code></td></tr>
        </table>
        <p>${Math.abs(f32 - v) >= 0.01
          ? `⚠️ En <b>Float32</b>, ce nombre perd <b>${len(f32 - v)}</b> : inacceptable pour une coordonnée. En <b>Float64</b>, les graduations sont espacées de ${len(s64)} : l'arrondi est invisible.`
          : `✅ En <b>Float32</b>, l'arrondi (${len(f32 - v)}) est négligeable pour ce nombre : 4 octets suffisent.`}</p>`;
    }
    input.addEventListener("input", calc);
    root.append(el("label", { class: "demo-row" }, [el("span", { text: "Nombre : " }), input]), el("div", { class: "demo-row" }, presets), table);
    calc();
  }

  // ---------------------------------------------------------------- Unités
  function demoUnites(root) {
    const input = el("input", { type: "number", min: "0", step: "1", value: "65004150" });
    const presets = [
      ["🧵 Tuile SWISSIMAGE", 65004150],
      ["🧵 GeoPackage du fil rouge", 438272],
      ["Disque « 1 To »", 1e12],
      ["Clé USB « 64 Go »", 64e9],
    ].map(([t, v]) => {
      const b = el("button", { type: "button", class: "demo-btn", text: t });
      b.addEventListener("click", () => { input.value = v; calc(); });
      return b;
    });
    const out = el("div");
    function calc() {
      const n = Math.max(0, parseFloat(input.value) || 0);
      const si = ["ko", "Mo", "Go", "To"].map((u, i) => [u, n / 1000 ** (i + 1)]);
      const bi = ["Kio", "Mio", "Gio", "Tio"].map((u, i) => [u, n / 1024 ** (i + 1)]);
      const cell = ([u, v]) => `<td>${v >= 0.01 ? fmt(v, v < 10 ? 2 : 1) : "&lt; 0,01"} ${u}</td>`;
      out.innerHTML = `
        <table class="demo-table">
          <tr><th>Décimal (SI) — fabricants, macOS</th>${si.map(cell).join("")}</tr>
          <tr><th>Binaire (CEI) — Windows (affiché « ko, Mo, Go »)</th>${bi.map(cell).join("")}</tr>
        </table>
        <p>${fmt(n)} octets = ${fmt(n * 8)} bits</p>`;
    }
    input.addEventListener("input", calc);
    root.append(el("label", { class: "demo-row" }, [el("span", { text: "Taille en octets : " }), input]), el("div", { class: "demo-row" }, presets), out);
    calc();
  }

  // ---------------------------------------------------------------- Texte
  function demoTexte(root) {
    const input = el("input", { type: "text", value: "Yverdon-les-Bains, Faïencerie", class: "demo-wide" });
    const out = el("div");
    const latin1 = (str) => {
      const b = [];
      for (const ch of str) { const c = ch.codePointAt(0); b.push(c < 256 ? c : null); }
      return b;
    };
    function chips(str, encode) {
      return Array.from(str).map((ch) => {
        const bytes = encode(ch);
        const bad = bytes.some((x) => x === null);
        const multi = bytes.length > 1;
        return `<span class="demo-chip${bad ? " demo-chip-bad" : multi ? " demo-chip-multi" : ""}"><span class="demo-chip-c">${ch === " " ? "␣" : ch}</span><span class="demo-chip-b">${bad ? "??" : bytes.map(hex2).join(" ")}</span></span>`;
      }).join("");
    }
    function calc() {
      const str = input.value;
      const utf8 = new TextEncoder().encode(str);
      const lat = latin1(str);
      const ascii = Array.from(str).map((ch) => (ch.codePointAt(0) < 128 ? ch.codePointAt(0) : null));
      const nOk = (a) => a.filter((x) => x !== null).length;
      const asciiBad = ascii.some((x) => x === null), latBad = lat.some((x) => x === null);
      // Lecture avec le mauvais codage : octets UTF-8 interprétés comme du Windows-1252/Latin-1
      const moji = new TextDecoder("windows-1252").decode(utf8);
      const back = latBad ? null : new TextDecoder("utf-8").decode(new Uint8Array(lat));
      out.innerHTML = `
        <p><b>ASCII</b> : ${asciiBad ? "<span class='demo-bad'>impossible (caractères hors ASCII en rouge)</span>" : nOk(ascii) + " octets"}</p>
        <div class="demo-chips">${chips(str, (c) => [c.codePointAt(0) < 128 ? c.codePointAt(0) : null])}</div>
        <p><b>Latin-1 / Windows-1252</b> : ${latBad ? "<span class='demo-bad'>impossible pour certains caractères</span>" : lat.length + " octets"}</p>
        <div class="demo-chips">${chips(str, (c) => latin1(c))}</div>
        <p><b>UTF-8</b> : ${utf8.length} octets (en bleu : caractères sur plusieurs octets)</p>
        <div class="demo-chips">${chips(str, (c) => Array.from(new TextEncoder().encode(c)))}</div>
        <p>⚠️ Texte UTF-8 lu comme du Windows-1252 : <b class="demo-bad">${moji}</b></p>
        ${back !== null ? `<p>⚠️ Texte Latin-1 lu comme de l'UTF-8 : <b class="demo-bad">${back}</b></p>` : ""}`;
    }
    input.addEventListener("input", calc);
    root.append(el("label", { class: "demo-row" }, [el("span", { text: "Texte : " }), input]), out);
    calc();
  }

  // ---------------------------------------------------------------- Fichier texte / binaire
  // Les mêmes octets vus par un éditeur de texte, un éditeur hexadécimal et un logiciel qui connaît le format.
  const SHP_HEADER = "00 00 27 0A 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 CE 9E E8 03 00 00 05 00 00 00 70 34 80 D7 3D 5D 43 41 20 75 02 9A 72 01 32 41 58 B1 BF 8C 0E 5F 43 41 00 DE 02 A9 7F 05 32 41 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00";
  const DXF_TEXT = "  0\nPOINT\n  8\n0\n 10\n2538235\n 20\n1180434\n";

  function demoFichier(root) {
    const files = {
      dxf: {
        label: "arrets.dxf (texte)",
        bytes: new TextEncoder().encode(DXF_TEXT),
        fields: [
          [0, 9, "Code 0 → nouvelle entité : POINT", "POINT"],
          [10, 15, "Code 8 → calque", "0"],
          [16, 27, "Code 10 → coordonnée X (écrite en caractères)", "2'538'235"],
          [28, 39, "Code 20 → coordonnée Y (écrite en caractères)", "1'180'434"],
        ],
      },
      shp: {
        label: "batiments.shp (binaire)",
        bytes: Uint8Array.from(SHP_HEADER.split(" "), (h) => parseInt(h, 16)),
        fields: [
          [0, 3, "Code du fichier (entier 32 bits)", "9'994"],
          [24, 27, "Longueur (entier 32 bits, en mots de 2 octets)", "52'894 → 105'788 octets"],
          [28, 31, "Version (entier 32 bits)", "1'000"],
          [32, 35, "Type de géométrie (entier 32 bits)", "5 = polygone"],
          [36, 43, "X min (Float64)", "2'538'107,68"],
          [44, 51, "Y min (Float64)", "1'180'018,60"],
          [52, 59, "X max (Float64)", "2'539'037,10"],
          [60, 67, "Y max (Float64)", "1'181'055,66"],
        ],
      },
    };
    let current = "shp";
    const tabs = el("div", { class: "demo-row" });
    const views = el("div", { class: "demo-views" });
    const textView = el("pre", { class: "demo-pre" });
    const hexView = el("pre", { class: "demo-pre" });
    const specView = el("div");
    views.append(
      el("div", {}, [el("b", { text: "1. Éditeur de texte" }), textView]),
      el("div", {}, [el("b", { text: "2. Éditeur hexadécimal" }), hexView]),
      el("div", {}, [el("b", { text: "3. Logiciel qui connaît le format" }), specView])
    );
    const dec1252 = new TextDecoder("windows-1252");
    function show(i) {
      root.querySelectorAll("[data-i]").forEach((n) => n.classList.toggle("demo-hl", i !== null && n.dataset.i.split(",").includes(String(i))));
    }
    function render() {
      const f = files[current];
      const fieldOf = (pos) => f.fields.findIndex(([a, b]) => pos >= a && pos <= b);
      let txt = "", hx = "";
      f.bytes.forEach((b, pos) => {
        const k = fieldOf(pos);
        let ch = b === 10 ? "↵\n" : dec1252.decode(new Uint8Array([b]));
        if (b !== 10 && (b < 32 || b === 127 || b === 0x81 || b === 0x8d || b === 0x8f || b === 0x90 || b === 0x9d)) ch = "·";
        const attr = k >= 0 ? ` data-i="${k}" class="demo-f"` : "";
        txt += `<span${attr}>${ch.replace(/&/g, "&amp;").replace(/</g, "&lt;")}</span>`;
        hx += `<span${attr}>${hex2(b)}</span>` + ((pos + 1) % 8 === 0 ? "\n" : " ");
      });
      textView.innerHTML = txt;
      hexView.innerHTML = hx;
      specView.innerHTML = `<table class="demo-table">${f.fields
        .map(([a, b, what, val], k) => `<tr data-i="${k}" class="demo-f"><td>${a}–${b}</td><td>${what}</td><td><b>${val}</b></td></tr>`)
        .join("")}</table>`;
      root.querySelectorAll(".demo-f").forEach((n) => {
        n.addEventListener("mouseenter", () => show(n.dataset.i));
        n.addEventListener("mouseleave", () => show(null));
      });
      tabs.querySelectorAll("button").forEach((b) => b.classList.toggle("demo-ok", b.dataset.f === current));
    }
    for (const [key, f] of Object.entries(files)) {
      const b = el("button", { type: "button", class: "demo-btn", text: f.label });
      b.dataset.f = key;
      b.addEventListener("click", () => { current = key; render(); });
      tabs.appendChild(b);
    }
    root.append(tabs, views, el("p", { class: "demo-stats", text: "Survolez une zone pour voir les mêmes octets dans les trois vues." }));
    render();
  }

  // ---------------------------------------------------------------- Quiz
  const QUIZZES = {
    codage: [
      {
        q: "Combien de valeurs différentes peut-on coder avec un octet ?",
        a: ["8", "255", "256", "1'024"], ok: 2,
        e: "Un octet = 8 bits → 2⁸ = 256 valeurs, de 0 à 255.",
      },
      {
        q: "La couleur d'un pixel s'écrit #CCD3E6. Que vaut la composante rouge en décimal ?",
        a: ["204", "211", "230", "12"], ok: 0,
        e: "Le premier octet, CC, vaut 12 × 16 + 12 = 204.",
      },
      {
        q: "Combien d'octets occupe le mot « Faïencerie » codé en UTF-8 ?",
        a: ["10", "11", "20", "Impossible en UTF-8"], ok: 1,
        e: "10 caractères, dont le « ï » qui occupe 2 octets en UTF-8 (C3 AF) : 11 octets.",
      },
      {
        q: "Un fichier affiche « GenÃ¨ve » au lieu de « Genève ». Que s'est-il passé ?",
        a: ["Le fichier est corrompu", "Un texte UTF-8 a été lu avec un autre codage (Latin-1)", "Le fichier est binaire", "Le nom est mal orthographié dans la source"], ok: 1,
        e: "Les 2 octets UTF-8 du « è » ont été interprétés comme 2 caractères Latin-1. Pour un shapefile, c'est souvent le fichier .cpg qui manque.",
      },
      {
        q: "Pourquoi ne faut-il pas stocker des coordonnées MN95 en Float32 ?",
        a: ["Le Float32 n'accepte pas les nombres négatifs", "Un Float32 occupe trop de place", "Avec environ 7 chiffres significatifs, la précision tombe à 25 cm vers 2'500'000", "Le Float32 n'existe pas dans les SIG"], ok: 2,
        e: "Une coordonnée MN95 a déjà 7 chiffres avant la virgule : en Float32, deux valeurs voisines sont séparées de 25 cm. On utilise le Float64.",
      },
      {
        q: "Vous ouvrez un fichier .shp dans le Bloc-notes : il affiche des symboles incompréhensibles. Le fichier est-il abîmé ?",
        a: ["Oui, il faut le retélécharger", "Non : c'est un fichier binaire, ses octets sont des nombres et non des caractères", "Oui, son encodage est faux", "Non, mais il faut l'ouvrir en UTF-8"], ok: 1,
        e: "Un fichier binaire n'est pas fait pour être lu comme du texte. QGIS, qui connaît la spécification du Shapefile, le lit parfaitement.",
      },
      {
        q: "Un disque vendu « 1 To » apparaît comme « 931 Go » dans Windows. Pourquoi ?",
        a: ["Une partie est réservée au système", "Windows compte en puissances de 2 : ce sont 931 Gio", "Le disque est défectueux", "Le fabricant a menti"], ok: 1,
        e: "10¹² octets / 2³⁰ ≈ 931 Gio. Rien n'a disparu : c'est une question d'unité.",
      },
    ],
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

  const demos = {
    pixels: demoPixels, compression: demoCompression, taille: demoTaille, pmtiles: demoPmtiles, quiz: demoQuiz,
    bits: demoBits, float: demoFloat, unites: demoUnites, texte: demoTexte, fichier: demoFichier, exercices: demoExercices,
  };

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
