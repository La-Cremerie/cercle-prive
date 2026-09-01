const pptxgen = require("pptxgenjs");

/* ── Palette : travertin, graphite, bronze ─────────────────────────────── */
const DARK   = "1C1811";   // fond profond des slides de rupture
const DARK2  = "2A241A";   // cartes sur fond sombre
const WHITE  = "FFFFFF";
const STONE  = "EFEBE2";   // tuile pierre sur fond clair
const INK    = "1E1A14";
const MUTED  = "6B6355";
const BRONZE = "8A5A0E";   // accent sur fond clair
const BRONZE_L = "D9A544"; // accent sur fond sombre
const C1 = "BE7B12";       // neuf / contemporain
const C2 = "2064C0";       // ancien / rénové
const C3 = "B03024";       // standard

const HEAD = "Cambria";
const BODY = "Calibri";

const W = 10, H = 5.625, M = 0.5;

const pres = new pptxgen();
pres.layout = "LAYOUT_16x9";
pres.author = "La Crémerie / Cercle Privé";
pres.title = "Villa Roi de la Camargue — défense de prix";

const nf = (v) => v.toLocaleString("fr-FR").replace(/ | /g, " ");

/* ── Fabriques ─────────────────────────────────────────────────────────── */
function slideClaire(titre, surtitre) {
  const s = pres.addSlide();
  s.background = { color: WHITE };
  if (surtitre) {
    s.addText(surtitre.toUpperCase(), {
      x: M, y: 0.34, w: W - 2 * M, h: 0.22, isTextBox: true, margin: 0,
      fontFace: BODY, fontSize: 10, bold: true, charSpacing: 2, color: BRONZE,
    });
  }
  s.addText(titre, {
    x: M, y: surtitre ? 0.6 : 0.45, w: W - 2 * M, h: 0.62, isTextBox: true, margin: 0,
    fontFace: HEAD, fontSize: 28, color: INK, valign: "top",
  });
  return s;
}

function slideSombre(titre, surtitre, sous) {
  const s = pres.addSlide();
  s.background = { color: DARK };
  if (surtitre) {
    s.addText(surtitre.toUpperCase(), {
      x: M, y: 1.5, w: W - 2 * M, h: 0.25, isTextBox: true, margin: 0,
      fontFace: BODY, fontSize: 10.5, bold: true, charSpacing: 2.4, color: BRONZE_L,
    });
  }
  s.addText(titre, {
    x: M, y: 1.85, w: W - 2 * M, h: 1.1, isTextBox: true, margin: 0,
    fontFace: HEAD, fontSize: 38, color: WHITE, valign: "top",
  });
  if (sous) {
    s.addText(sous, {
      x: M, y: 3.05, w: 6.6, h: 1.1, isTextBox: true, margin: 0,
      fontFace: BODY, fontSize: 14, color: "B9B0A0", lineSpacing: 22,
    });
  }
  return s;
}

/** Tuile chiffre : grande valeur bronze, libellé au-dessus, note en dessous. */
function tuile(s, x, y, w, h, libelle, valeur, note, opts) {
  const o = opts || {};
  s.addShape(pres.ShapeType.rect, {
    x, y, w, h, fill: { color: o.fond || STONE },
    line: { color: o.fond || STONE, width: 0 },
  });
  s.addText(libelle.toUpperCase(), {
    x: x + 0.16, y: y + 0.13, w: w - 0.32, h: 0.36, isTextBox: true, margin: 0,
    fontFace: BODY, fontSize: 8.5, bold: true, charSpacing: 1.1,
    color: o.libelle || MUTED, valign: "top",
  });
  s.addText(valeur, {
    x: x + 0.16, y: y + 0.46, w: w - 0.32, h: 0.42, isTextBox: true, margin: 0,
    fontFace: HEAD, fontSize: o.taille || 20, color: o.accent || BRONZE, valign: "top",
  });
  if (note) {
    s.addText(note, {
      x: x + 0.16, y: y + 0.82, w: w - 0.32, h: h - 0.90, isTextBox: true, margin: 0,
      fontFace: BODY, fontSize: 9, color: o.note || MUTED, valign: "top", lineSpacing: 12,
    });
  }
}

/** Carte texte : titre + corps sur fond pierre. */
function carte(s, x, y, w, h, titre, corps, opts) {
  const o = opts || {};
  s.addShape(pres.ShapeType.rect, {
    x, y, w, h, fill: { color: o.fond || STONE },
    line: { color: o.fond || STONE, width: 0 },
  });
  s.addText(titre, {
    x: x + 0.18, y: y + 0.15, w: w - 0.36, h: 0.3, isTextBox: true, margin: 0,
    fontFace: BODY, fontSize: 12, bold: true, color: o.titre || INK, valign: "top",
  });
  s.addText(corps, {
    x: x + 0.18, y: y + 0.44, w: w - 0.36, h: h - 0.56, isTextBox: true, margin: 0,
    fontFace: BODY, fontSize: 10.5, color: o.corps || MUTED, valign: "top", lineSpacing: 14,
  });
}

function tableau(s, x, y, w, entetes, lignes, largeurs, opts) {
  const o = opts || {};
  const fs = o.fontSize || 10;
  const hL = o.rowH || 0.30;
  const bornes = [];
  let acc = x;
  largeurs.forEach((lw) => { bornes.push(acc); acc += lw; });
  const alignDe = (i) => (i >= (o.numFrom != null ? o.numFrom : 99) ? "right" : "left");

  s.addShape(pres.ShapeType.rect, {
    x, y, w, h: 0.26, fill: { color: STONE }, line: { color: STONE, width: 0 },
  });
  entetes.forEach((t, i) => {
    if (!t) return;
    s.addText(t.toUpperCase(), {
      x: bornes[i] + 0.09, y: y + 0.03, w: largeurs[i] - 0.18, h: 0.2, isTextBox: true, margin: 0,
      fontFace: BODY, fontSize: 8.5, bold: true, charSpacing: 0.9, color: MUTED,
      align: alignDe(i), valign: "top",
    });
  });

  let cy = y + 0.26;
  lignes.forEach((ligne) => {
    const fort = !!ligne.fort;
    const cells = ligne.cells || ligne;
    if (fort) {
      s.addShape(pres.ShapeType.rect, {
        x, y: cy, w, h: hL, fill: { color: "F6EFE0" }, line: { color: "F6EFE0", width: 0 },
      });
    }
    s.addShape(pres.ShapeType.line, {
      x, y: cy + hL, w, h: 0, line: { color: "E2DCCF", width: 0.5 },
    });
    cells.forEach((t, i) => {
      s.addText(String(t), {
        x: bornes[i] + 0.09, y: cy + 0.045, w: largeurs[i] - 0.18, h: hL - 0.08,
        isTextBox: true, margin: 0, fontFace: BODY, fontSize: fs,
        bold: fort, color: fort ? INK : "3D362C", align: alignDe(i), valign: "top",
      });
    });
    cy += hL;
  });
}

function note(s, texte, y) {
  s.addText(texte, {
    x: M, y: y != null ? y : H - 0.52, w: W - 2 * M, h: 0.34, isTextBox: true, margin: 0,
    fontFace: BODY, fontSize: 8.5, italic: true, color: "8E877A", valign: "top",
  });
}


/** Barre empilée horizontale, dessinée en rectangles. */
function barreEmpilee(s, x, y, w, h, parts, total) {
  let cx = x;
  parts.forEach((p, i) => {
    const bw = w * p.val / total;
    const gap = i < parts.length - 1 ? 0.03 : 0;
    s.addShape(pres.ShapeType.rect, {
      x: cx, y, w: Math.max(bw - gap, 0.05), h,
      fill: { color: p.couleur }, line: { color: p.couleur, width: 0 },
    });
    if (bw > 0.85) {
      s.addText(p.etiquette, {
        x: cx, y: y + h / 2 - 0.15, w: bw - gap, h: 0.3, isTextBox: true, margin: 0,
        fontFace: BODY, fontSize: 12, bold: true, color: WHITE, align: "center",
      });
    }
    cx += bw;
  });
}

/** Barres horizontales, dessinées en rectangles. */
function barresH(s, x, y, wLabel, wBar, lignes, maxVal, hL) {
  let cy = y;
  lignes.forEach((l) => {
    s.addText(l.nom, {
      x, y: cy - 0.015, w: wLabel - 0.1, h: hL, isTextBox: true, margin: 0,
      fontFace: BODY, fontSize: 8.5, bold: !!l.fort,
      color: l.fort ? INK : "4A4237", align: "right", valign: "top",
    });
    const bw = wBar * l.val / maxVal;
    s.addShape(pres.ShapeType.rect, {
      x: x + wLabel, y: cy, w: bw, h: hL - 0.10,
      fill: { color: l.couleur }, line: { color: l.couleur, width: 0 },
    });
    s.addText(nf(l.val) + " €", {
      x: x + wLabel + bw + 0.07, y: cy - 0.015, w: 0.82, h: hL, isTextBox: true, margin: 0,
      fontFace: BODY, fontSize: 8.5, bold: !!l.fort, color: l.fort ? INK : "6B6355", valign: "top",
    });
    cy += hL;
  });
}

/** Colonnes verticales, dessinées en rectangles. */
function barresV(s, x, yBase, wCol, gap, hMax, lignes, maxVal) {
  lignes.forEach((l, i) => {
    const bh = hMax * l.val / maxVal;
    const cx = x + i * (wCol + gap);
    s.addShape(pres.ShapeType.rect, {
      x: cx, y: yBase - bh, w: wCol, h: bh,
      fill: { color: l.couleur }, line: { color: l.couleur, width: 0 },
    });
    s.addText(nf(l.val) + " €", {
      x: cx - 0.15, y: yBase - bh - 0.28, w: wCol + 0.3, h: 0.26, isTextBox: true, margin: 0,
      fontFace: BODY, fontSize: 10, bold: true, color: INK, align: "center",
    });
    s.addText(l.nom, {
      x: cx - 0.22, y: yBase + 0.07, w: wCol + 0.44, h: 0.42, isTextBox: true, margin: 0,
      fontFace: BODY, fontSize: 9, color: "4A4237", align: "center", valign: "top",
    });
  });
}


/** Graphique d'intervalles : fourchettes de marché et valeurs ponctuelles. */
function intervalles(s, x, y, wLabel, wBar, lignes, x0, x1, hL, jalons) {
  const px = (v) => x + wLabel + (v - x0) / (x1 - x0) * wBar;
  const bas = y + lignes.length * hL;
  jalons.forEach((v) => {
    s.addShape(pres.ShapeType.line, {
      x: px(v), y, w: 0, h: lignes.length * hL, line: { color: "E2DCCF", width: 0.75 },
    });
    s.addText(nf(v / 1000) + " k€", {
      x: px(v) - 0.4, y: bas + 0.07, w: 0.8, h: 0.24, isTextBox: true, margin: 0,
      fontFace: BODY, fontSize: 9, color: MUTED, align: "center",
    });
  });
  lignes.forEach((l, i) => {
    const cy = y + i * hL + hL / 2;
    s.addText(l.nom, {
      x, y: cy - 0.115, w: wLabel - 0.14, h: 0.24, isTextBox: true, margin: 0,
      fontFace: BODY, fontSize: 9.5, bold: !!l.moi,
      color: l.moi ? INK : "4A4237", align: "right", valign: "top",
    });
    if (l.lo != null) {
      s.addShape(pres.ShapeType.rect, {
        x: px(l.lo), y: cy - 0.085, w: px(l.hi) - px(l.lo), h: 0.17,
        fill: { color: C1 }, line: { color: C1, width: 0 },
      });
      s.addText(nf(l.hi / 1000) + " k€", {
        x: px(l.hi) + 0.07, y: cy - 0.115, w: 0.7, h: 0.24, isTextBox: true, margin: 0,
        fontFace: BODY, fontSize: 9, color: MUTED, valign: "top",
      });
    } else {
      if (l.moi) {
        s.addShape(pres.ShapeType.ellipse, {
          x: px(l.pt) - 0.115, y: cy - 0.115, w: 0.23, h: 0.23,
          fill: { color: "FFFFFF" }, line: { color: BRONZE, width: 1.25 },
        });
      }
      s.addShape(pres.ShapeType.ellipse, {
        x: px(l.pt) - 0.065, y: cy - 0.065, w: 0.13, h: 0.13,
        fill: { color: l.moi ? INK : C2 }, line: { color: l.moi ? INK : C2, width: 0 },
      });
      s.addText(nf(l.pt) + " €", {
        x: px(l.pt) + (l.moi ? 0.19 : 0.13), y: cy - 0.115, w: 1.1, h: 0.24,
        isTextBox: true, margin: 0, fontFace: BODY, fontSize: 9.5,
        bold: !!l.moi, color: l.moi ? BRONZE : MUTED, valign: "top",
      });
    }
  });
}

/* ══ 1. Couverture ═════════════════════════════════════════════════════ */
{
  const s = pres.addSlide();
  s.background = { color: DARK };
  s.addText("LA CRÉMERIE · CERCLE PRIVÉ", { x: M, y: 0.5, w: 6, h: 0.25, isTextBox: true, margin: 0, fontFace: BODY, fontSize: 10, bold: true, charSpacing: 2.4, color: BRONZE_L });
  s.addText("Villa Roi de la Camargue", { x: M, y: 1.24, w: 8.6, h: 0.95, isTextBox: true, margin: 0, fontFace: HEAD, fontSize: 44, color: WHITE, valign: "top" });
  s.addText("9, avenue du Roi de la Camargue — La Nartelle, 83120 Sainte-Maxime · Parcelle AF 168", { x: M, y: 2.2, w: 8.6, h: 0.3, isTextBox: true, margin: 0, fontFace: BODY, fontSize: 12, color: "B9B0A0" });
  s.addText("Villa neuve de 421,82 m² sur 2 033 m², quatre suites, livrée équipée et meublée.", { x: M, y: 2.58, w: 8.6, h: 0.3, isTextBox: true, margin: 0, fontFace: BODY, fontSize: 12, italic: true, color: BRONZE_L });

  s.addShape(pres.ShapeType.rect, { x: M, y: 3.3, w: 4.35, h: 1.34, fill: { color: DARK2 }, line: { color: DARK2, width: 0 } });
  s.addText("PRIX DE PRÉSENTATION", { x: M + 0.2, y: 3.46, w: 3.9, h: 0.24, isTextBox: true, margin: 0, fontFace: BODY, fontSize: 8.5, bold: true, charSpacing: 1.1, color: "9A9080" });
  s.addText("8 450 000 €", { x: M + 0.2, y: 3.74, w: 3.9, h: 0.74, isTextBox: true, margin: 0, fontFace: HEAD, fontSize: 36, color: WHITE });

  s.addShape(pres.ShapeType.rect, { x: 5.15, y: 3.3, w: 4.35, h: 1.34, fill: { color: DARK2 }, line: { color: DARK2, width: 0 } });
  s.addText("SOIT, SUR 421,82 M² INTÉRIEURS", { x: 5.35, y: 3.46, w: 3.9, h: 0.24, isTextBox: true, margin: 0, fontFace: BODY, fontSize: 8.5, bold: true, charSpacing: 1.1, color: "9A9080" });
  s.addText("20 032 €/m²", { x: 5.35, y: 3.74, w: 3.9, h: 0.74, isTextBox: true, margin: 0, fontFace: HEAD, fontSize: 36, color: BRONZE_L });

  s.addText("Septembre 2026", { x: M, y: H - 0.6, w: 4, h: 0.28, isTextBox: true, margin: 0, fontFace: BODY, fontSize: 9.5, color: "7A7263" });
}

/* ══ 2. Le bien en un regard ═══════════════════════════════════════════ */
{
  const s = slideClaire("Le bien en un regard", "I · Le bien");
  const w = 2.94, h = 1.3, g = 0.19, col = (i) => M + i * (w + g);
  tuile(s, col(0), 1.4, w, h, "Parcelle AF 168", "2 033 m²", "dont 1 635 m² d'extérieurs");
  tuile(s, col(1), 1.4, w, h, "Surface intérieure", "421,82 m²", "hors garage et local technique");
  tuile(s, col(2), 1.4, w, h, "Suites", "4 × 39,85 m²", "de 36,54 à 41,16 m²");
  tuile(s, col(0), 1.4 + h + g, w, h, "Emprise au sol", "19,6 %", "397,68 m² sur 2 033 m²");
  tuile(s, col(1), 1.4 + h + g, w, h, "Terrasses", "151,73 m²", "36 % de la surface intérieure");
  tuile(s, col(2), 1.4 + h + g, w, h, "Livraison", "Neuve", "meublée et décorée, RE2020");
  s.addText("19,6 % d'emprise seulement. Un ratio rare sur un secteur où la contrainte foncière pousse partout à la densification.", {
    x: M, y: 4.42, w: 9, h: 0.4, isTextBox: true, margin: 0, fontFace: BODY, fontSize: 12, color: INK });
}

/* ══ 3. Le programme ═══════════════════════════════════════════════════ */
{
  const s = slideClaire("Deux niveaux, 421,82 m² intérieurs", "I · Le bien");
  carte(s, M, 1.38, 4.4, 2.5, "R+1  —  187,55 m²",
    "Séjour 54,75 · Suite 1 40,85 · Suite 2 36,54\nCuisine 18,15 · Bureau 13,48 · Entrée 9,79\nCave 6,11 · Vestibule 3,62 · WC 3,16 · SAS 1,10\n\nOuvert sur 96,49 m² de terrasse sud, terrasse couverte de 30,69 m², piscine et cuisine d'été.");
  carte(s, 5.1, 1.38, 4.4, 2.5, "R-0  —  234,27 m²",
    "Suite 3 40,86 · Suite 4 41,16 · Hall 34,88\nSalle de musculation 36,52 · Salle de projection 30,22\nLingerie 24,14 · Chambre froide 10,38\nSauna 8,59 · Sanitaires 7,52\n\nUn programme d'hôtellerie de luxe intégré à la villa.");
  s.addText("Extérieurs 151,73 m² · Garage 74,67 m² · Zone technique 6,00 m²", {
    x: M, y: 4.04, w: 9, h: 0.3, isTextBox: true, margin: 0, fontFace: BODY, fontSize: 11.5, color: INK });
  note(s, "Surfaces relevées sur les plans d'esquisse ESQ.2 / ESQ.3 du 30/05/2025, à faire attester par un géomètre à la livraison.");
}

/* ══ 4. Quatre suites ══════════════════════════════════════════════════ */
{
  const s = slideClaire("Quatre suites, pas quatre chambres", "I · Le bien");
  const w = 4.4, h = 1.5;
  tuile(s, M, 1.4, w, h, "Villa Roi de la Camargue", "4 suites de 39,85 m²",
    "159,41 m² de surface de couchage.\nDressings aménagés sur mesure dans chacune.", { taille: 18 });
  tuile(s, 5.1, 1.4, w, h, "Comparables du Golfe", "5 à 6 chambres de 15 à 20 m²",
    "90 à 120 m² de surface de couchage.\nPlus de pièces, moins de surface.",
    { taille: 14, fond: "F4F2ED", accent: "5B5347" });
  s.addShape(pres.ShapeType.rect, { x: M, y: 3.16, w: 9, h: 1.04, fill: { color: DARK }, line: { color: DARK, width: 0 } });
  s.addText("À surface de couchage égale, le programme égale les comparables à six chambres — mais en quatre volumes de standard hôtelier au lieu de six pièces standard. Un acquéreur de ce segment n'achète pas des lits, il achète des suites.", {
    x: M + 0.24, y: 3.32, w: 8.52, h: 0.76, isTextBox: true, margin: 0, fontFace: BODY, fontSize: 12, color: "EFE9DC", lineSpacing: 17 });
}

/* ══ 5. Prestations 1/2 ════════════════════════════════════════════════ */
{
  const s = slideClaire("Les prestations d'exception", "II · Les prestations");
  const w = 4.4, h = 1.42, g = 0.2;
  carte(s, M, 1.38, w, h, "Salle de projection · 30,22 m²", "Vidéoprojecteur Epson Pro Cinema, système Bowers & Wilkins, fauteuils cuir Fermob, traitement acoustique Vicoustic, Ecophon et Armstrong.");
  carte(s, 5.1, 1.38, w, h, "Salle de musculation · 36,52 m²", "Station Technogym Kinesis, presse Powertec, banc ATX Warrior, cardio Precor. Sanitaires et douche dédiés.");
  carte(s, M, 1.38 + h + g, w, h, "Sauna sur mesure · 8,59 m²", "Cabine 6 à 8 personnes, habillage cèdre rouge massif, poêle Harvia Vega Lux à pierres volcaniques.");
  carte(s, 5.1, 1.38 + h + g, w, h, "Jacuzzi extérieur", "Coque acrylique renforcée, pompe Balboa, habillage travertin, jets hydromassants réglables, éclairage LED multicolore.");
}

/* ══ 6. Prestations 2/2 ════════════════════════════════════════════════ */
{
  const s = slideClaire("Matériaux, enveloppe et logistique", "II · Les prestations");
  const w = 2.94, h = 1.34, g = 0.19, col = (i) => M + i * (w + g);
  carte(s, col(0), 1.38, w, h, "Logistique de réception", "Lingerie 24,14 m² Miele Professional, table active Laurastar, adoucisseur ; chambre froide professionnelle 10,38 m² Fricon et Isocab.");
  carte(s, col(1), 1.38, w, h, "Cave à vin climatisée · 7 m²", "Régulation température et hygrométrie Liebherr, façade bois exotique et vitrage trempé, étagères bois massif.");
  carte(s, col(2), 1.38, w, h, "Cuisine sur mesure", "Îlot monolithique à retombée pierre, plan quartzite ou Dekton, façades chêne ou noyer, Miele et Gaggenau, robinetterie Dornbracht.");
  carte(s, col(0), 1.38 + h + g, w, h, "Matériaux", "Travertin premium grand format en continuité intérieur-extérieur, seuils affleurants, parquet Panaget, enduits minéraux Mortex.");
  carte(s, col(1), 1.38 + h + g, w, h, "Enveloppe RE2020", "Isolation biosourcée fibre de bois, VMC double flux, pompe à chaleur gainable Daikin, menuiseries Technal, vitrage anti-effraction.");
  carte(s, col(2), 1.38 + h + g, w, h, "Domotique et sûreté NIKO", "Commande centralisée éclairages et volets, thermostat connecté, vidéosurveillance, portillon à reconnaissance faciale.");
}

/* ══ 7. Livrée meublée ═════════════════════════════════════════════════ */
{
  const s = slideSombre("Livrée meublée et décorée", "II · Les prestations",
    "Sélection La Crémerie : Bonaldo, La Chance, De Padova, Red Edition, Hamilton Conte, Luceplan, Saba Italia, Talenti.");
  const w = 2.94, g = 0.19, col = (i) => M + i * (w + g);
  [["Exploitable immédiatement", "Un actif prêt dès la remise des clés, sans achat de mobilier ni période de mise en état."],
   ["Aucun délai", "Reconstituer l'équivalent demande 18 à 24 mois de chantier, avec l'aléa de coût et de calendrier."],
   ["Cohérence d'ensemble", "Une décoration pensée avec l'architecture, que l'on n'obtient pas en meublant après coup."]]
    .forEach(([t, d], i) => {
      s.addShape(pres.ShapeType.rect, { x: col(i), y: 4.02, w, h: 1.06, fill: { color: DARK2 }, line: { color: DARK2, width: 0 } });
      s.addText(t, { x: col(i) + 0.17, y: 4.14, w: w - 0.34, h: 0.26, isTextBox: true, margin: 0, fontFace: BODY, fontSize: 11, bold: true, color: BRONZE_L });
      s.addText(d, { x: col(i) + 0.17, y: 4.42, w: w - 0.34, h: 0.58, isTextBox: true, margin: 0, fontFace: BODY, fontSize: 9, color: "B9B0A0", lineSpacing: 12 });
    });
}

/* ══ 8. Le prix plancheré ══════════════════════════════════════════════ */
{
  const s = slideClaire("Un prix contraint par le coût", "III · Le prix");
  s.addText("Reproduire cette villa à l'identique coûte 4 761 814 € hors foncier. Le prix ne se défend pas malgré ce coût : il est contraint par lui.", {
    x: M, y: 1.3, w: 9, h: 0.4, isTextBox: true, margin: 0, fontFace: BODY, fontSize: 12, color: INK });
  s.addText("Prix au m² de surface intérieure", { x: M, y: 1.82, w: 5, h: 0.24, isTextBox: true, margin: 0, fontFace: BODY, fontSize: 10.5, color: MUTED });
  s.addText("20 000 €/m²", { x: 6.5, y: 1.8, w: 3, h: 0.28, isTextBox: true, margin: 0, fontFace: BODY, fontSize: 12, bold: true, color: INK, align: "right" });
  barreEmpilee(s, M, 2.16, 9, 0.66, [
    { val: 11289, couleur: C1, etiquette: "11 289 €" },
    { val: 5711, couleur: C2, etiquette: "5 711 €" },
    { val: 3000, couleur: C3, etiquette: "3 000 €" },
  ], 20000);
  [["Coût de production hors foncier", C1, M, 3.0, "left"],
   ["Foncier", C2, M + 9 * 11289 / 20000, 2.0, "left"],
   ["Marge et frais financiers", C3, M + 9 * 16000 / 20000, 1.8, "right"]]
    .forEach(([t, c, x, lw, al]) => {
      s.addText(t, { x, y: 2.94, w: lw, h: 0.24, isTextBox: true, margin: 0, fontFace: BODY, fontSize: 9.5, color: c, align: al });
    });
  const w = 2.94, g = 0.19, col = (i) => M + i * (w + g);
  tuile(s, col(0), 3.36, w, 1.3, "Production hors foncier", "11 289 €/m²", "56,4 % — construction, équipements, extérieurs, mobilier, honoraires", { taille: 17 });
  tuile(s, col(1), 3.36, w, 1.3, "Foncier", "5 711 €/m²", "28,6 % — 2 409 126 € pour 2 033 m² de terrain", { taille: 17 });
  tuile(s, col(2), 3.36, w, 1.3, "Marge et frais", "3 000 €/m²", "15,0 % — marge d'opération et portage", { taille: 17 });
}

/* ══ 9. Le bilan détaillé ══════════════════════════════════════════════ */
{
  const s = slideClaire("Le bilan, poste par poste", "III · Le prix");
  tableau(s, M, 1.34, 9, ["Poste", "Montant HT"], [
    ["Gros œuvre et second œuvre — 421,82 m² × 5 200 €/m²", "2 193 464 €"],
    ["Garage et local technique — 80,67 m² × 1 800 €/m²", "145 206 €"],
    ["Équipements d'exception — projection, cuisine, sport, sauna, chambre froide, domotique", "550 000 €"],
    ["Aménagements extérieurs — soutènements, paysagisme, terrasses travertin, piscine", "680 000 €"],
    ["Mobilier et décoration — sélection La Crémerie", "550 000 €"],
    ["Honoraires, assurances et taxes — maîtrise d'œuvre 13 %, DO et RCD", "643 144 €"],
    { cells: ["Coût de production hors foncier", "4 761 814 €"], fort: true },
    ["Marge d'opération et frais financiers", "1 265 460 €"],
    { cells: ["Foncier implicite — 1 185 €/m² de terrain", "2 409 126 €"], fort: true },
  ], [7.1, 1.9], { numFrom: 1, fontSize: 9.5, rowH: 0.33 });
  note(s, "Ordres de grandeur de marché, à substituer par les coûts réels de l'opération.");
}

/* ══ 10. Le foncier implicite ══════════════════════════════════════════ */
{
  const s = pres.addSlide();
  s.background = { color: DARK };
  s.addText("III · LE PRIX — LE RÉSULTAT", { x: M, y: 0.72, w: 8.4, h: 0.25, isTextBox: true, margin: 0, fontFace: BODY, fontSize: 10, bold: true, charSpacing: 2.2, color: BRONZE_L });
  s.addText("1 185 €/m²", { x: M, y: 1.18, w: 8.4, h: 1.3, isTextBox: true, margin: 0, fontFace: HEAD, fontSize: 68, color: BRONZE_L });
  s.addText("C'est la valeur foncière qu'implique un prix de 8 450 000 €, pour une parcelle de 2 033 m² avec vue mer à La Nartelle. C'est le bas de la fourchette du foncier constructible vue mer du Golfe.", {
    x: M, y: 2.6, w: 8.2, h: 0.9, isTextBox: true, margin: 0, fontFace: BODY, fontSize: 14, color: "CFC7B7", lineSpacing: 21 });
  s.addShape(pres.ShapeType.rect, { x: M, y: 3.7, w: 9, h: 1.02, fill: { color: DARK2 }, line: { color: DARK2, width: 0 } });
  s.addText("Descendre sous 8 M€ reviendrait à valoriser ce terrain à moins de 900 €/m², ce qu'aucun propriétaire foncier de La Nartelle n'accepterait.", {
    x: M + 0.26, y: 3.9, w: 8.48, h: 0.68, isTextBox: true, margin: 0, fontFace: HEAD, fontSize: 14, italic: true, color: WHITE, lineSpacing: 20 });
}

/* ══ 11. Le segment > 20 000 €/m² ══════════════════════════════════════ */
{
  const s = slideClaire("Le segment au-delà de 20 000 €/m²", "IV · Le marché");
  s.addText("Le Golfe de Saint-Tropez dispose d'un segment établi au-delà de 20 000 €/m². Ce sont les références du marché dans lequel la villa se positionne.", {
    x: M, y: 1.28, w: 9, h: 0.4, isTextBox: true, margin: 0, fontFace: BODY, fontSize: 11.5, color: INK });
  intervalles(s, M, 1.78, 3.05, 4.55, [
    { nom: "Saint-Tropez — biens d'exception", lo: 25000, hi: 50000 },
    { nom: "Saint-Tropez — Les Salins, pieds dans l'eau", lo: 20000, hi: 40000 },
    { nom: "Saint-Tropez — médiane villa", pt: 25000 },
    { nom: "Sainte-Maxime — contemporaine 295 m², vue mer", pt: 23390 },
    { nom: "Saint-Tropez — moyenne maisons", pt: 21228 },
    { nom: "Villa Roi de la Camargue — 421,82 m²", pt: 20032, moi: true },
  ], 18000, 52000, 0.44, [20000, 30000, 40000, 50000]);
  note(s, "Fourchettes et valeurs relevées en septembre 2026. Panel volontairement restreint au segment supérieur à 20 000 €/m² : le marché de Sainte-Maxime comporte des biens à des niveaux inférieurs, non représentés ici.");
}

/* ══ 12. La position dans le Golfe ═════════════════════════════════════ */
{
  const s = slideClaire("La position dans le Golfe", "IV · Le marché");
  s.addText("Sainte-Maxime fait face à Saint-Tropez, à quinze minutes par la mer. À 20 032 €/m², la villa se situe au seuil d'entrée du segment supérieur.", {
    x: M, y: 1.3, w: 9, h: 0.4, isTextBox: true, margin: 0, fontFace: BODY, fontSize: 12, color: INK });
  tableau(s, M, 1.84, 9, ["Référence du segment", "Secteur", "€/m²", "Écart"], [
    ["Biens d'exception, vue et emplacement réunis", "Saint-Tropez", "jusqu'à 50 000 €", "— 60 %"],
    ["Villas pieds dans l'eau", "Saint-Tropez, Les Salins", "20 000 – 40 000 €", "— 20 %"],
    ["Prix médian d'une villa", "Saint-Tropez", "≈ 25 000 €", "— 20 %"],
    ["Villa contemporaine 295 m², vue mer", "Sainte-Maxime, réf. 2025-17", "23 390 €", "— 14 %"],
    ["Prix moyen des maisons", "Saint-Tropez", "≈ 21 228 €", "— 6 %"],
    { cells: ["Villa Roi de la Camargue — neuve, meublée", "Sainte-Maxime, La Nartelle", "20 032 €", "—"], fort: true },
  ], [3.9, 2.5, 1.6, 1.0], { numFrom: 2, fontSize: 9.5, rowH: 0.36 });
  s.addText("La villa se positionne sous chacune des références du segment. L'écart indique de combien elle leur est inférieure.", {
    x: M, y: 4.36, w: 9, h: 0.32, isTextBox: true, margin: 0, fontFace: BODY, fontSize: 11, color: INK });
}

/* ══ 13. L'avantage fiscal ═════════════════════════════════════════════ */
{
  const s = slideClaire("L'avantage fiscal du neuf : 422 500 €", "V · Les avantages du neuf");
  tableau(s, M, 1.36, 9, ["", "Villa neuve sous TVA", "Villa ancienne"], [
    ["Prix affiché", "8 450 000 €", "8 450 000 €"],
    ["Frais d'acte", "≈ 2,5 % — 211 250 €", "≈ 7,5 % — 633 750 €"],
    { cells: ["Coût total d'acquisition", "8 661 250 €", "9 083 750 €"], fort: true },
  ], [3.6, 2.7, 2.7], { numFrom: 1, fontSize: 11, rowH: 0.38 });
  s.addShape(pres.ShapeType.rect, { x: M, y: 3.0, w: 9, h: 1.5, fill: { color: DARK }, line: { color: DARK, width: 0 } });
  s.addText("422 500 € d'écart, soit 1 002 €/m²", { x: M + 0.26, y: 3.18, w: 8.48, h: 0.5, isTextBox: true, margin: 0, fontFace: HEAD, fontSize: 26, color: BRONZE_L });
  s.addText("Ce bien neuf à 8 450 000 € coûte moins cher, tout compris, qu'une villa ancienne affichée à 8 030 000 €. Cet avantage n'apparaît jamais dans une comparaison au m² brute.", {
    x: M + 0.26, y: 3.76, w: 8.48, h: 0.62, isTextBox: true, margin: 0, fontFace: BODY, fontSize: 12, color: "CFC7B7", lineSpacing: 17 });
  note(s, "Régime de TVA et taux de frais d'acte à confirmer auprès du notaire chargé de la vente.");
}

/* ══ 14. Zéro travaux ══════════════════════════════════════════════════ */
{
  const s = slideClaire("Zéro travaux, et six avantages de plus", "V · Les avantages du neuf");
  tuile(s, M, 1.30, 9, 1.24, "Travaux pendant vingt ans", "0 €",
    "Décennale, dommages-ouvrage et parfait achèvement. Une villa ancienne équivalente demande 845 000 à 1 267 500 € de remise à niveau dans les cinq ans.", { taille: 22 });
  tableau(s, M, 2.62, 9, ["Avantage", "Contenu"], [
    ["Aucun délai", "Livraison clé en main. Reconstituer l'équivalent demande 18 à 24 mois de chantier."],
    ["Exploitation immédiate", "Actif locatif opérationnel dès la première saison, sans achat de mobilier."],
    ["Valeur verte", "Conformité RE2020. Le marché secondaire décote désormais les biens énergivores."],
    ["Foncier non reproductible", "La loi Littoral interdit toute création nouvelle en frange côtière."],
    ["Emprise et respiration", "19,6 % d'emprise, 1 635 m² d'extérieurs, 151,73 m² de terrasses."],
    ["Marché porteur", "≈ 40 % des ventes françaises au-delà de 5 M€ ; +54 % de volume sur le segment > 3 M€ au S1 2026."],
  ], [2.3, 6.7], { fontSize: 9.5, rowH: 0.34 });
}

/* ══ 15. Volume 7–15 M€ ════════════════════════════════════════════════ */
{
  const s = slideClaire("Le marché de la tranche 7 – 15 M€", "VI · Le volume");
  const w = 2.94, h = 1.14, g = 0.19, col = (i) => M + i * (w + g);
  tuile(s, col(0), 1.3, w, h, "Part de la Côte d'Azur", "≈ 40 %", "des ventes françaises au-delà de 5 M€", { taille: 19 });
  tuile(s, col(1), 1.3, w, h, "Cœur du marché tropézien", "15 – 30 M€", "8,45 M€ y est un point d'entrée", { taille: 19 });
  tuile(s, col(2), 1.3, w, h, "Segment supérieur à 3 M€", "+ 54 %", "de volume au S1 2026, source Barnes", { taille: 19 });
  tuile(s, col(0), 1.3 + h + g, w, h, "Acquéreurs étrangers", "> 70 %", "américains, scandinaves, germanophones", { taille: 19 });
  tuile(s, col(1), 1.3 + h + g, w, h, "Résidences secondaires", "80 – 85 %", "des acquisitions du Golfe", { taille: 19 });
  tuile(s, col(2), 1.3 + h + g, w, h, "Tendance des prix", "Maintenus", "moins de ventes, pas de baisse", { taille: 19 });
  s.addShape(pres.ShapeType.rect, { x: M, y: 3.92, w: 9, h: 0.86, fill: { color: STONE }, line: { color: STONE, width: 0 } });
  s.addText("Le comptage sur dix ans s'obtient en interrogeant directement la base des mutations. Le résultat sera un plancher : les cessions de parts de SCI et les ventes off-market, majoritaires sur cette tranche, n'y figurent jamais. Le marché réel est plus profond que ce que les statistiques laissent voir.", {
    x: M + 0.22, y: 4.06, w: 8.56, h: 0.62, isTextBox: true, margin: 0, fontFace: BODY, fontSize: 10.5, color: "3D362C", lineSpacing: 14 });
}

/* ══ 16. Références de ventes ══════════════════════════════════════════ */
{
  const s = slideClaire("Références de ventes comparables", "VII · Comparables");
  s.addText("Grille à compléter avec les comparables privés de l'agence — ventes off-market, cessions de parts de SCI, dossiers confrères. Ce sont les seules références de ventes actées qui puissent figurer ici.", {
    x: M, y: 1.28, w: 9, h: 0.44, isTextBox: true, margin: 0, fontFace: BODY, fontSize: 11.5, color: INK, lineSpacing: 16 });
  tableau(s, M, 1.86, 9, ["Date", "Commune / secteur", "Surface", "Terrain", "Prix", "€/m²", "Nature et source"], [
    ["—", "à compléter", "—", "—", "—", "—", "vente actée / parts de SCI"],
    ["—", "à compléter", "—", "—", "—", "—", "—"],
    ["—", "à compléter", "—", "—", "—", "—", "—"],
    ["—", "à compléter", "—", "—", "—", "—", "—"],
    ["—", "à compléter", "—", "—", "—", "—", "—"],
  ], [0.9, 2.0, 0.9, 0.9, 1.1, 0.9, 2.3], { numFrom: 2, fontSize: 9, rowH: 0.34 });
  note(s, "Pour chaque ligne, indiquer si la référence est attestable et par qui — une vente attestée par le professionnel qui l'a réalisée a valeur probante, y compris en appui bancaire.");
}

/* ══ 17. Synthèse ══════════════════════════════════════════════════════ */
{
  const s = pres.addSlide();
  s.background = { color: DARK };
  s.addText("VII · SYNTHÈSE", { x: M, y: 0.6, w: 8.4, h: 0.25, isTextBox: true, margin: 0, fontFace: BODY, fontSize: 10, bold: true, charSpacing: 2.2, color: BRONZE_L });
  s.addText("Quatre chiffres", { x: M, y: 0.98, w: 8.4, h: 0.6, isTextBox: true, margin: 0, fontFace: HEAD, fontSize: 32, color: WHITE });
  const w = 4.35, h = 1.16, g = 0.3;
  [["4 761 814 €", "Coût de production hors foncier", "Le prix est contraint par le coût, pas par une ambition de marge.", M, 1.74],
   ["1 185 €/m²", "Foncier implicite", "Pour une parcelle vue mer de 2 033 m². Le bas de la fourchette du Golfe.", 5.15, 1.74],
   ["422 500 €", "Avantage fiscal du neuf", "Encaissé par l'acquéreur dès la signature, soit 1 002 €/m².", M, 1.74 + h + g],
   ["20 032 €/m²", "Positionnement", "Au seuil d'entrée du segment supérieur, sous la moyenne tropézienne.", 5.15, 1.74 + h + g]]
    .forEach(([v, t, d, x, y]) => {
      s.addShape(pres.ShapeType.rect, { x, y, w, h, fill: { color: DARK2 }, line: { color: DARK2, width: 0 } });
      s.addText(v, { x: x + 0.2, y: y + 0.12, w: w - 0.4, h: 0.44, isTextBox: true, margin: 0, fontFace: HEAD, fontSize: 24, color: BRONZE_L });
      s.addText(t, { x: x + 0.2, y: y + 0.58, w: w - 0.4, h: 0.24, isTextBox: true, margin: 0, fontFace: BODY, fontSize: 10.5, bold: true, color: WHITE });
      s.addText(d, { x: x + 0.2, y: y + 0.82, w: w - 0.4, h: 0.3, isTextBox: true, margin: 0, fontFace: BODY, fontSize: 9, color: "B9B0A0", lineSpacing: 12 });
    });
  s.addText("Une villa neuve de 421,82 m², quatre suites, cinéma, spa et cave à vin, livrée meublée sur 2 033 m² — pour le prix d'entrée du segment que Saint-Tropez traite entre 20 000 et 40 000 €/m².", {
    x: M, y: 4.66, w: 9, h: 0.5, isTextBox: true, margin: 0, fontFace: BODY, fontSize: 10.5, italic: true, color: "9A9080", lineSpacing: 14 });
}

pres.writeFile({ fileName: "Villa-Roi-de-la-Camargue-dossier.pptx" }).then((f) => console.log("écrit :", f));
