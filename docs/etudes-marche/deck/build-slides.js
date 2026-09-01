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

/* ══ 1. Couverture ═════════════════════════════════════════════════════ */
{
  const s = pres.addSlide();
  s.background = { color: DARK };
  s.addText("LA CRÉMERIE · CERCLE PRIVÉ", {
    x: M, y: 0.5, w: 6, h: 0.25, isTextBox: true, margin: 0,
    fontFace: BODY, fontSize: 10, bold: true, charSpacing: 2.4, color: BRONZE_L,
  });
  s.addText("Villa Roi de la Camargue", {
    x: M, y: 1.28, w: 8.4, h: 0.95, isTextBox: true, margin: 0,
    fontFace: HEAD, fontSize: 44, color: WHITE, valign: "top",
  });
  s.addText("9, avenue du Roi de la Camargue — La Nartelle, 83120 Sainte-Maxime · Parcelle AF 168", {
    x: M, y: 2.24, w: 8.4, h: 0.3, isTextBox: true, margin: 0,
    fontFace: BODY, fontSize: 12, color: "B9B0A0",
  });
  s.addText("Dossier de défense de prix", {
    x: M, y: 2.62, w: 8.4, h: 0.3, isTextBox: true, margin: 0,
    fontFace: BODY, fontSize: 12, italic: true, color: BRONZE_L,
  });

  s.addShape(pres.ShapeType.rect, { x: M, y: 3.35, w: 4.35, h: 1.32, fill: { color: DARK2 }, line: { color: DARK2, width: 0 } });
  s.addText("PRIX DE PRÉSENTATION", { x: M + 0.2, y: 3.5, w: 3.9, h: 0.24, isTextBox: true, margin: 0, fontFace: BODY, fontSize: 8.5, bold: true, charSpacing: 1.1, color: "9A9080" });
  s.addText("8 450 000 €", { x: M + 0.2, y: 3.78, w: 3.9, h: 0.72, isTextBox: true, margin: 0, fontFace: HEAD, fontSize: 36, color: WHITE });

  s.addShape(pres.ShapeType.rect, { x: 5.15, y: 3.35, w: 4.35, h: 1.32, fill: { color: DARK2 }, line: { color: DARK2, width: 0 } });
  s.addText("SOIT, SUR 421,82 M² INTÉRIEURS", { x: 5.35, y: 3.5, w: 3.9, h: 0.24, isTextBox: true, margin: 0, fontFace: BODY, fontSize: 8.5, bold: true, charSpacing: 1.1, color: "9A9080" });
  s.addText("20 032 €/m²", { x: 5.35, y: 3.78, w: 3.9, h: 0.72, isTextBox: true, margin: 0, fontFace: HEAD, fontSize: 36, color: BRONZE_L });

  s.addText("Septembre 2026", { x: M, y: H - 0.62, w: 4, h: 0.28, isTextBox: true, margin: 0, fontFace: BODY, fontSize: 9.5, color: "7A7263" });
}

/* ══ 2. Le bien en un regard ═══════════════════════════════════════════ */
{
  const s = slideClaire("Le bien en un regard", "I · Le programme");
  const w = 2.94, h = 1.32, g = 0.19;
  const col = (i) => M + i * (w + g);
  tuile(s, col(0), 1.42, w, h, "Parcelle AF 168", "2 033 m²", "dont 1 635 m² d'extérieurs");
  tuile(s, col(1), 1.42, w, h, "Surface intérieure", "421,82 m²", "hors garage et local technique");
  tuile(s, col(2), 1.42, w, h, "Suites", "4 × 39,85 m²", "de 36,54 à 41,16 m²");
  tuile(s, col(0), 1.42 + h + g, w, h, "Emprise au sol", "397,68 m²", "19,6 % de la parcelle");
  tuile(s, col(1), 1.42 + h + g, w, h, "Terrasses", "151,73 m²", "dont 30,69 m² couverts");
  tuile(s, col(2), 1.42 + h + g, w, h, "Surface de plancher", "502,49 m²", "garage 74,67 m² inclus");
  s.addText("Villa neuve, livrée équipée et meublée. Position perchée vue mer, entre +37,92 et +44,77 NGF.", {
    x: M, y: 4.52, w: W - 2 * M, h: 0.36, isTextBox: true, margin: 0,
    fontFace: BODY, fontSize: 12, color: INK,
  });
  note(s, "Surfaces relevées sur les plans d'esquisse ESQ.2 / ESQ.3 du 30/05/2025, indice 120 — à faire attester par un géomètre à la livraison.");
}

/* ══ 3. Le programme par niveau ════════════════════════════════════════ */
{
  const s = slideClaire("Deux niveaux, 421,82 m² intérieurs", "I · Le programme");
  carte(s, M, 1.4, 4.4, 2.62, "R+1  —  187,55 m²",
    "Séjour 54,75 · Suite 1 40,85 · Suite 2 36,54\nCuisine 18,15 · Bureau 13,48 · Entrée 9,79\nCave 6,11 · Vestibule 3,62 · WC 3,16 · SAS 1,10\n\nOuvert sur 96,49 m² de terrasse sud, terrasse couverte de 30,69 m², piscine et cuisine d'été.");
  carte(s, 5.1, 1.4, 4.4, 2.62, "R-0  —  234,27 m²",
    "Suite 3 40,86 · Suite 4 41,16 · Hall 34,88\nSalle de musculation 36,52 · Salle de projection 30,22\nLingerie 24,14 · Chambre froide 10,38\nSauna 8,59 · Sanitaires 7,52\n\nUn programme d'hôtellerie de luxe intégré à la villa.");
  s.addText("Le R-0 conserve la réserve de transformation d'une partie des espaces de loisirs en couchages supplémentaires.", {
    x: M, y: 4.18, w: W - 2 * M, h: 0.36, isTextBox: true, margin: 0,
    fontFace: BODY, fontSize: 11.5, color: INK,
  });
  note(s, "Trois variantes du R+1 coexistent au dossier ; la surface totale est stable d'une version à l'autre.");
}

/* ══ 4. Suites ═════════════════════════════════════════════════════════ */
{
  const s = slideClaire("Quatre suites, pas quatre chambres", "I · Le programme");
  s.addText("L'objection « quatre chambres seulement, pour 8,4 M€ » compare des unités qui ne le sont pas.", {
    x: M, y: 1.32, w: 9, h: 0.34, isTextBox: true, margin: 0,
    fontFace: BODY, fontSize: 13, color: INK,
  });
  const w = 4.4, h = 1.55;
  tuile(s, M, 1.82, w, h, "Villa Roi de la Camargue", "4 suites de 39,85 m²",
    "159,41 m² de surface de couchage.\nDressings aménagés sur mesure dans chacune.", { taille: 19 });
  tuile(s, 5.1, 1.82, w, h, "Comparables du relevé", "5 à 6 chambres de 15 à 20 m²",
    "90 à 120 m² de surface de couchage.\nPlus de pièces, moins de surface.",
    { taille: 15, fond: "F4F2ED", accent: "5B5347" });
  s.addShape(pres.ShapeType.rect, { x: M, y: 3.58, w: W - 2 * M, h: 0.98, fill: { color: DARK }, line: { color: DARK, width: 0 } });
  s.addText("À surface de couchage égale, le programme égale les comparables à six chambres — mais en quatre volumes de standard hôtelier au lieu de six pièces standard. Un acquéreur de ce segment n'achète pas des lits, il achète des suites.", {
    x: M + 0.24, y: 3.74, w: W - 2 * M - 0.48, h: 0.7, isTextBox: true, margin: 0,
    fontFace: BODY, fontSize: 12, color: "EFE9DC", lineSpacing: 17,
  });
}

/* ══ 5. Prestations ════════════════════════════════════════════════════ */
{
  const s = slideClaire("Ce que contiennent les 421 m²", "I · Le programme");
  const w = 2.94, h = 1.28, g = 0.19;
  const col = (i) => M + i * (w + g);
  carte(s, col(0), 1.4, w, h, "Salle de projection · 30,22 m²", "Epson Pro Cinema, Bowers & Wilkins, fauteuils cuir, acoustique Vicoustic et Ecophon.");
  carte(s, col(1), 1.4, w, h, "Salle de sport · 36,52 m²", "Technogym Kinesis, Powertec, ATX Warrior, cardio Precor. Sanitaires dédiés.");
  carte(s, col(2), 1.4, w, h, "Sauna et jacuzzi · 8,59 m²", "Cabine cèdre rouge sur mesure, poêle Harvia. Jacuzzi extérieur Balboa, habillage travertin.");
  carte(s, col(0), 1.4 + h + g, w, h, "Logistique de réception", "Lingerie 24,14 m² Miele Professional, chambre froide professionnelle 10,38 m², cave à vin Liebherr.");
  carte(s, col(1), 1.4 + h + g, w, h, "Second œuvre", "Travertin premium grand format, menuiseries Technal, VMC double flux, PAC gainable Daikin.");
  carte(s, col(2), 1.4 + h + g, w, h, "Domotique et sûreté", "NIKO connecté, vidéosurveillance, visiophone à reconnaissance faciale, éclairage architectural.");
  s.addText("Villa livrée meublée et décorée — sélection La Crémerie : Bonaldo, La Chance, De Padova, Red Edition, Luceplan, Talenti.", {
    x: M, y: 4.34, w: W - 2 * M, h: 0.36, isTextBox: true, margin: 0,
    fontFace: BODY, fontSize: 11.5, color: INK,
  });
}

/* ══ 6. Rupture : la question ══════════════════════════════════════════ */
slideSombre("20 000 €/m², est-ce défendable ?", "II · La démonstration",
  "La moyenne communale de Sainte-Maxime est de 6 100 €/m². Trois méthodes indépendantes vont montrer que ce n'est pas le bon terme de comparaison.");

/* ══ 7. Convention de surface ══════════════════════════════════════════ */
{
  const s = slideClaire("Le ratio dépend de la convention retenue", "II · La démonstration");
  s.addText("20 000 €/m² est un chiffre de convention, pas une donnée physique. Le même prix rapporté à une autre base — toutes usuelles en expertise — produit des ratios très différents.", {
    x: M, y: 1.3, w: 9, h: 0.5, isTextBox: true, margin: 0,
    fontFace: BODY, fontSize: 12, color: INK, lineSpacing: 17,
  });
  tableau(s, M, 1.92, 9,
    ["Base de calcul", "Surface", "Ratio"],
    [
      { cells: ["Surface intérieure — base retenue", "421,82 m²", "20 000 €/m²"], fort: true },
      ["Surface intérieure + terrasses pondérées à 40 %", "482,51 m²", "17 484 €/m²"],
      ["Surface de plancher, garage et local technique inclus", "502,49 m²", "16 789 €/m²"],
      ["Surface bâtie totale + terrasses", "654,22 m²", "12 895 €/m²"],
    ],
    [5.4, 1.8, 1.8], { numFrom: 1 });
  s.addShape(pres.ShapeType.rect, { x: M, y: 3.92, w: W - 2 * M, h: 0.92, fill: { color: DARK }, line: { color: DARK, width: 0 } });
  s.addText("Nous retenons volontairement la base la plus défavorable. Sur la surface de plancher, convention usuelle en évaluation de villa neuve, le ratio ressort à 16 789 €/m² — sous la moyenne du segment contemporain de Sainte-Maxime.", {
    x: M + 0.24, y: 4.06, w: W - 2 * M - 0.48, h: 0.68, isTextBox: true, margin: 0,
    fontFace: BODY, fontSize: 11.5, color: "EFE9DC", lineSpacing: 16,
  });
}

/* ══ 8. Trois méthodes ═════════════════════════════════════════════════ */
{
  const s = slideClaire("Trois méthodes, une valeur", "II · La démonstration");
  const w = 2.94, g = 0.19;
  const col = (i) => M + i * (w + g);
  const bloc = (i, num, titre, res, txt) => {
    s.addShape(pres.ShapeType.rect, { x: col(i), y: 1.42, w, h: 2.5, fill: { color: STONE }, line: { color: STONE, width: 0 } });
    s.addText(num, { x: col(i) + 0.18, y: 1.5, w: 1, h: 0.6, isTextBox: true, margin: 0, fontFace: HEAD, fontSize: 34, color: "D6CDB8" });
    s.addText(titre, { x: col(i) + 0.18, y: 2.12, w: w - 0.36, h: 0.34, isTextBox: true, margin: 0, fontFace: BODY, fontSize: 11.5, bold: true, color: INK });
    s.addText(res, { x: col(i) + 0.18, y: 2.5, w: w - 0.36, h: 0.46, isTextBox: true, margin: 0, fontFace: HEAD, fontSize: 22, color: BRONZE });
    s.addText(txt, { x: col(i) + 0.18, y: 3.0, w: w - 0.36, h: 0.84, isTextBox: true, margin: 0, fontFace: BODY, fontSize: 10, color: MUTED, lineSpacing: 13 });
  };
  bloc(0, "1", "Bilan de reconstitution", "1 185 €/m²",
    "Le prix n'implique qu'une valeur foncière de 1 185 €/m² de terrain — prudente pour une parcelle vue mer de 2 033 m².");
  bloc(1, "2", "Comparables d'offre actuels", "19 854 €/m²",
    "Moyenne du segment neuf et contemporain en vente à Sainte-Maxime. Le prix visé s'en écarte de 0,7 %.");
  bloc(2, "3", "Prime du neuf mesurée", "+ 22,6 %",
    "Écart constaté entre le segment neuf-contemporain et le segment ancien-rénové sur le même marché.");
  s.addText("Ces trois méthodes n'ont aucune donnée en commun : l'une part des coûts, l'autre du marché de l'offre, la troisième d'un différentiel de segment. Leur convergence est l'argument central du dossier.", {
    x: M, y: 4.14, w: 9, h: 0.56, isTextBox: true, margin: 0,
    fontFace: BODY, fontSize: 12, color: INK, lineSpacing: 17,
  });
}

/* ══ 9. Méthode 1 — décomposition ══════════════════════════════════════ */
{
  const s = slideClaire("Ce que le prix contient réellement", "II · Méthode 1 — bilan de reconstitution");
  s.addText("Prix au m² de surface intérieure", {
    x: M, y: 1.32, w: 5, h: 0.24, isTextBox: true, margin: 0,
    fontFace: BODY, fontSize: 10.5, color: MUTED,
  });
  s.addText("20 000 €/m²", {
    x: 6.5, y: 1.3, w: 3, h: 0.28, isTextBox: true, margin: 0,
    fontFace: BODY, fontSize: 12, bold: true, color: INK, align: "right",
  });
  barreEmpilee(s, M, 1.66, 9, 0.62, [
    { val: 11289, couleur: C1, etiquette: "11 289 €" },
    { val: 5711, couleur: C2, etiquette: "5 711 €" },
    { val: 3000, couleur: C3, etiquette: "3 000 €" },
  ], 20000);
  // largeurs calées sur les segments pour éviter tout chevauchement
  [["Coût de production hors foncier", C1, M, 3.0, "left"],
   ["Foncier implicite", C2, M + 9 * 11289 / 20000, 2.0, "left"],
   ["Marge et frais financiers", C3, M + 9 * 16000 / 20000, 1.8, "right"]]
    .forEach(([t, c, x, lw, al]) => {
      s.addText(t, {
        x, y: 2.4, w: lw, h: 0.24, isTextBox: true, margin: 0,
        fontFace: BODY, fontSize: 9.5, color: c, align: al,
      });
    });
  const w = 2.94, g = 0.19;
  const col = (i) => M + i * (w + g);
  tuile(s, col(0), 3.18, w, 1.40, "Coût de production", "11 289 €/m²", "56,4 % — construction, équipements, extérieurs, mobilier, honoraires", { taille: 18 });
  tuile(s, col(1), 3.18, w, 1.40, "Foncier implicite", "5 711 €/m²", "28,6 % — soit 2 409 126 € pour 2 033 m² de terrain", { taille: 18 });
  tuile(s, col(2), 3.18, w, 1.40, "Marge et frais", "3 000 €/m²", "15,0 % — marge d'opération 12 % et portage 3 %", { taille: 18 });
  note(s, "Coûts d'ordre de grandeur, à substituer par les coûts réels de l'opération.");
}

/* ══ 10. Méthode 1 — bilan détaillé ════════════════════════════════════ */
{
  const s = slideClaire("Le bilan, poste par poste", "II · Méthode 1 — bilan de reconstitution");
  tableau(s, M, 1.32, 9,
    ["Poste", "Montant HT"],
    [
      ["Gros œuvre et second œuvre — 421,82 m² × 5 200 €/m²", "2 193 464 €"],
      ["Garage et local technique — 80,67 m² × 1 800 €/m²", "145 206 €"],
      ["Équipements d'exception — projection, cuisine, sport, domotique, sauna, chambre froide", "550 000 €"],
      ["Aménagements extérieurs — soutènements, paysagisme, terrasses, piscine, cuisine d'été", "680 000 €"],
      ["Mobilier et décoration — sélection La Crémerie", "550 000 €"],
      ["Honoraires, assurances et taxes — maîtrise d'œuvre 13 %, DO et RCD 2,5 %", "643 144 €"],
      { cells: ["Coût de production hors foncier", "4 761 814 €"], fort: true },
      ["Marge d'opération (12 %) et frais financiers (3 %)", "1 265 460 €"],
      { cells: ["Foncier implicite — résidu", "2 409 126 €"], fort: true },
    ],
    [7.1, 1.9], { numFrom: 1, fontSize: 9.5 });
  note(s, "Le prix d'acquisition effectif de la parcelle AF 168 doit remplacer le foncier implicite : c'est la donnée qui verrouille définitivement ce bilan.");
}

/* ══ 11. Méthode 1 — conclusion ════════════════════════════════════════ */
{
  const s = pres.addSlide();
  s.background = { color: DARK };
  s.addText("II · MÉTHODE 1 — LE RÉSULTAT", {
    x: M, y: 0.72, w: 8.4, h: 0.25, isTextBox: true, margin: 0,
    fontFace: BODY, fontSize: 10, bold: true, charSpacing: 2.2, color: BRONZE_L,
  });
  s.addText("1 185 €/m²", {
    x: M, y: 1.18, w: 8.4, h: 1.3, isTextBox: true, margin: 0,
    fontFace: HEAD, fontSize: 68, color: BRONZE_L,
  });
  s.addText("C'est la valeur foncière qu'implique un prix de 8 436 400 €, pour une parcelle de 2 033 m² avec vue mer à La Nartelle. Ce niveau est cohérent avec le marché du foncier constructible vue mer du Golfe — il en est même plutôt le bas.", {
    x: M, y: 2.6, w: 8.2, h: 0.9, isTextBox: true, margin: 0,
    fontFace: BODY, fontSize: 14, color: "CFC7B7", lineSpacing: 21,
  });
  s.addShape(pres.ShapeType.rect, { x: M, y: 3.68, w: W - 2 * M, h: 1.06, fill: { color: DARK2 }, line: { color: DARK2, width: 0 } });
  s.addText("Le prix ne se défend pas malgré le coût de production : il est contraint par lui. Descendre sous 8 M€ reviendrait à valoriser le terrain à moins de 900 €/m², ce qu'aucun propriétaire foncier de La Nartelle n'accepterait.", {
    x: M + 0.26, y: 3.86, w: W - 2 * M - 0.52, h: 0.74, isTextBox: true, margin: 0,
    fontFace: HEAD, fontSize: 13, italic: true, color: WHITE, lineSpacing: 19,
  });
}

/* ══ 12. Méthode 2 — les annonces ══════════════════════════════════════ */
{
  const s = slideClaire("Les annonces en cours à Sainte-Maxime", "II · Méthode 2 — comparables d'offre");
  barresH(s, M, 1.34, 2.85, 5.05, [
    { nom: "Contemporaine vue mer, 295 m²", val: 23390, couleur: C1 },
    { nom: "VILLA ROI DE LA CAMARGUE, 422 m²", val: 20000, couleur: INK, fort: true },
    { nom: "Villa neuve centre, 320 m²", val: 19688, couleur: C1 },
    { nom: "Contemporaine neuve, 264 m²", val: 18182, couleur: C1 },
    { nom: "Surplombant la mer, 358 m²", val: 18156, couleur: C1 },
    { nom: "Méditerranéenne, 365 m²", val: 17808, couleur: C2 },
    { nom: "Vue mer exceptionnelle, 347 m²", val: 16398, couleur: C2 },
    { nom: "Bord de mer, 340 m²", val: 16176, couleur: C2 },
    { nom: "Provençale, 350 m²", val: 15714, couleur: C2 },
    { nom: "Vue mer, 350 m²", val: 14857, couleur: C2 },
    { nom: "Standard vue mer, 400 m²", val: 10625, couleur: C3 },
  ], 25500, 0.295);
  note(s, "Prix affichés relevés en septembre 2026, non des prix de vente — à re-sourcer et horodater avant remise à un tiers. Bronze : neuf et contemporain · bleu : ancien et rénové · rouge : standard.");
}

/* ══ 13. Méthode 2 — position et effet de taille ═══════════════════════ */
{
  const s = slideClaire("Le bien est au centre de son segment", "II · Méthode 2 — comparables d'offre");
  tableau(s, M, 1.3, 5.3,
    ["Comparable neuf", "€/m²", "Écart du bien"],
    [
      ["Contemporaine vue mer, 295 m²", "23 390 €", "− 14,5 %"],
      { cells: ["Villa neuve centre-ville, 320 m²", "19 688 €", "+ 1,6 %"], fort: true },
      ["Contemporaine neuve, 264 m²", "18 182 €", "+ 10,0 %"],
      ["Surplombant la mer, 358 m²", "18 156 €", "+ 10,2 %"],
    ],
    [2.7, 1.25, 1.35], { numFrom: 1, fontSize: 9.5 });

  tuile(s, 6.1, 1.3, 3.4, 1.1, "Moyenne du segment neuf", "19 854 €/m²", "Le prix visé s'en écarte de 0,7 %", { taille: 19 });
  tuile(s, 6.1, 2.52, 3.4, 1.1, "Médiane du segment neuf", "18 935 €/m²", "Borne haute du plancher de négociation", { taille: 19 });

  s.addShape(pres.ShapeType.rect, { x: M, y: 2.9, w: 5.3, h: 1.68, fill: { color: DARK }, line: { color: DARK, width: 0 } });
  s.addText("L'effet de taille ne joue pas ici", {
    x: M + 0.22, y: 3.04, w: 4.86, h: 0.28, isTextBox: true, margin: 0,
    fontFace: BODY, fontSize: 11.5, bold: true, color: BRONZE_L,
  });
  s.addText("Sur les quatre comparables neufs, de 264 à 358 m², le €/m² ne suit aucune tendance de surface : R² = 0,04. Le plus cher au m² n'est pas le plus petit, le moins cher n'est pas le plus grand. L'objection « plus grand donc moins cher au m² » n'a aucun appui local.", {
    x: M + 0.22, y: 3.38, w: 4.86, h: 1.1, isTextBox: true, margin: 0,
    fontFace: BODY, fontSize: 10, color: "CFC7B7", lineSpacing: 14,
  });

  s.addShape(pres.ShapeType.rect, { x: 6.1, y: 3.74, w: 3.4, h: 0.84, fill: { color: "F6E9E7" }, line: { color: "F6E9E7", width: 0 } });
  s.addText("La limite honnête : l'extrapolation du prix total des mêmes comparables à 421,82 m² donne 7 764 000 € (R² = 0,40). C'est ce qui fonde le plancher, pas le prix de présentation.", {
    x: 6.28, y: 3.86, w: 3.04, h: 0.64, isTextBox: true, margin: 0,
    fontFace: BODY, fontSize: 9, color: "6E2A22", lineSpacing: 12,
  });
}

/* ══ 14. Méthode 3 — prime du neuf ═════════════════════════════════════ */
{
  const s = slideClaire("La prime du neuf, mesurée sur ce marché", "II · Méthode 3 — prime du neuf");
  barresV(s, 0.95, 3.72, 0.95, 0.62, 2.0, [
    { nom: "Neuf et contemporain", val: 19854, couleur: C1 },
    { nom: "Ancien et rénové", val: 16191, couleur: C2 },
    { nom: "Standard vue mer", val: 10625, couleur: C3 },
  ], 19854);
  s.addText("+ 22,6 %", {
    x: 5.3, y: 1.34, w: 4.2, h: 0.72, isTextBox: true, margin: 0,
    fontFace: HEAD, fontSize: 40, color: BRONZE,
  });
  s.addText("d'écart entre le segment neuf-contemporain et le segment ancien-rénové, à situation et surface comparables. Cette prime n'est pas une opinion : elle se lit dans les prix pratiqués sur la commune.", {
    x: 5.3, y: 2.1, w: 4.2, h: 0.8, isTextBox: true, margin: 0,
    fontFace: BODY, fontSize: 11, color: MUTED, lineSpacing: 15,
  });
  s.addText([
    { text: "Garanties décennale, dommages-ouvrage et parfait achèvement · RE2020", options: { bullet: true, breakLine: true } },
    { text: "Livrée meublée et décorée — actif exploitable dès la remise des clés", options: { bullet: true, breakLine: true } },
    { text: "Quatre suites de standard hôtelier, dressings sur mesure", options: { bullet: true, breakLine: true } },
    { text: "112 m² d'espaces de bien-être et de loisirs", options: { bullet: true, breakLine: true } },
    { text: "34,52 m² de logistique de réception", options: { bullet: true } },
  ], {
    x: 5.3, y: 3.0, w: 4.2, h: 1.6, isTextBox: true, margin: 0,
    fontFace: BODY, fontSize: 10, color: INK, paraSpaceAfter: 5, lineSpacing: 13,
  });
  note(s, "Aucun travaux à prévoir avant vingt ans.");
}

/* ══ 15. La tranche 7–12 M€ ════════════════════════════════════════════ */
{
  const s = slideClaire("À 8,4 M€, le bien change de marché", "III · La tranche 7 – 12 M€");
  const w = 2.94, g = 0.19;
  const col = (i) => M + i * (w + g);
  tuile(s, col(0), 1.3, w, 1.16, "Part de la Côte d'Azur", "≈ 40 %", "des ventes françaises au-delà de 5 M€", { taille: 20 });
  tuile(s, col(1), 1.3, w, 1.16, "Cœur du marché tropézien", "15 – 30 M€", "8,4 M€ y est un point d'entrée", { taille: 20 });
  tuile(s, col(2), 1.3, w, 1.16, "Segment supérieur à 3 M€", "+ 54 %", "de volume au S1 2026, source Barnes", { taille: 20 });
  tableau(s, M, 2.62, 9,
    ["", "Favorable", "À assumer"],
    [
      ["Concurrence", "Aucune offre directe à ce niveau sur la commune", "Aucun précédent local à opposer"],
      ["Acquéreurs", "Clientèle internationale et patrimoniale", "Quelques dizaines par an sur tout le Golfe"],
      ["Délai", "Les prix ne cèdent pas sur cette tranche", "Mandat de 12 à 24 mois, diffusion internationale"],
    ],
    [1.5, 3.75, 3.75], { fontSize: 9.5 });
  s.addText("Le plus haut prix affiché du relevé communal est de 6,9 M€ : mise sur le marché à 8,45 M€, la villa serait le bien le plus cher proposé à Sainte-Maxime. Un bien sans comparable local n'est pas surévalué — c'est un bien dont le prix se fixe ailleurs.", {
    x: M, y: 4.14, w: 9, h: 0.72, isTextBox: true, margin: 0,
    fontFace: BODY, fontSize: 11, color: INK, lineSpacing: 15,
  });
  note(s, "Aucune source publique ne publie le nombre de ventes actées entre 7 et 12 M€. Le script tools/dvf/volumes_tranche_prix.py le produit à partir de DVF — le résultat sera un plancher, les cessions de parts de SCI en étant absentes.");
}

/* ══ 16. Objections ════════════════════════════════════════════════════ */
{
  const s = slideClaire("Ce qui sera attaqué, et quoi répondre", "IV · Défense");
  const w = 4.4, h = 1.02, g = 0.14;
  const L = M, R = 5.1;
  const obj = (x, y, q, r) => carte(s, x, y, w, h, q, r, { corps: "5B5347" });
  obj(L, 1.3, "« Ce n'est pas un pieds dans l'eau. »", "Exact — position perchée, +37,92 à +44,77 NGF. Aucune des trois méthodes ne s'appuie sur le front de mer.");
  obj(L, 1.3 + h + g, "« La piscine est petite. »", "Fondé. 27 m² pour 421,82 m² habitables. À agrandir ou à documenter avant commercialisation.");
  obj(L, 1.3 + 2 * (h + g), "« Quatre chambres seulement. »", "Quatre suites de 39,85 m². À surface de couchage égale, le programme égale les comparables à six chambres.");
  obj(R, 1.3, "« Vos surfaces viennent d'esquisses. »", "Fondé. Figer la variante et faire attester les surfaces avant toute remise à un tiers.");
  obj(R, 1.3 + h + g, "« Vos comparables sont des prix affichés. »", "C'est pourquoi le bilan de reconstitution porte le dossier : un bilan de coûts ne dépend d'aucune annonce.");
  obj(R, 1.3 + 2 * (h + g), "« 20 000 €/m² dépasse la moyenne locale. »", "La moyenne communale agrège collines et parc ancien. Le repère est le segment neuf, à 19 854 €/m².");
  s.addText("Deux de ces six objections sont fondées — les traiter avant de sortir le bien, pas pendant la négociation.", {
    x: M, y: 4.76, w: 9, h: 0.34, isTextBox: true, margin: 0,
    fontFace: BODY, fontSize: 11, bold: true, color: INK,
  });
}

/* ══ 17. Actions ═══════════════════════════════════════════════════════ */
{
  const s = slideClaire("À traiter avant commercialisation", "IV · Défense");
  const items = [
    ["1", "Trancher la question de la piscine", "27 m² pour une villa de 421,82 m² sur 2 033 m². Seule faiblesse matérielle du dossier — le foncier permet largement d'agrandir. En l'état, un acquéreur avisé en tirera 300 000 à 500 000 € de remise."],
    ["2", "Figer la variante de plan et faire attester les surfaces", "Trois versions du R+1 circulent, avec des séjours de 41,71 à 59,00 m². Un acquéreur qui les découvre perd confiance dans le reste du dossier."],
    ["3", "Substituer le prix d'acquisition réel du foncier", "C'est la donnée qui transforme la reconstitution en démonstration opposable."],
    ["4", "Lancer le comptage DVF de la tranche 7 – 12 M€", "Et caler la durée du mandat sur cette tranche : douze à vingt-quatre mois, diffusion internationale."],
  ];
  let y = 1.3;
  items.forEach(([n, t, d]) => {
    const h = 0.78;
    s.addShape(pres.ShapeType.rect, { x: M, y, w: 9, h, fill: { color: STONE }, line: { color: STONE, width: 0 } });
    s.addText(n, { x: M + 0.16, y: y + 0.14, w: 0.5, h: 0.5, isTextBox: true, margin: 0, fontFace: HEAD, fontSize: 26, color: "D6CDB8", align: "center" });
    s.addText(t, { x: M + 0.78, y: y + 0.1, w: 8, h: 0.26, isTextBox: true, margin: 0, fontFace: BODY, fontSize: 11.5, bold: true, color: INK });
    s.addText(d, { x: M + 0.78, y: y + 0.36, w: 8, h: 0.38, isTextBox: true, margin: 0, fontFace: BODY, fontSize: 9.5, color: MUTED, lineSpacing: 12 });
    y += h + 0.16;
  });
}

/* ══ 18. Recommandation ════════════════════════════════════════════════ */
{
  const s = pres.addSlide();
  s.background = { color: DARK };
  s.addText("V · RECOMMANDATION", {
    x: M, y: 0.6, w: 8.4, h: 0.25, isTextBox: true, margin: 0,
    fontFace: BODY, fontSize: 10, bold: true, charSpacing: 2.2, color: BRONZE_L,
  });
  s.addText("La stratégie de prix", {
    x: M, y: 0.98, w: 8.4, h: 0.6, isTextBox: true, margin: 0,
    fontFace: HEAD, fontSize: 32, color: WHITE,
  });
  const bloc = (y, lib, prix, ratio, txt, fort) => {
    s.addShape(pres.ShapeType.rect, { x: M, y, w: 9, h: 0.94, fill: { color: fort ? "3A2E17" : DARK2 }, line: { color: fort ? "3A2E17" : DARK2, width: 0 } });
    s.addText(lib.toUpperCase(), { x: M + 0.24, y: y + 0.13, w: 3.1, h: 0.24, isTextBox: true, margin: 0, fontFace: BODY, fontSize: 8.5, bold: true, charSpacing: 1.1, color: "9A9080" });
    s.addText(prix, { x: M + 0.24, y: y + 0.4, w: 2.4, h: 0.42, isTextBox: true, margin: 0, fontFace: HEAD, fontSize: 22, color: fort ? BRONZE_L : WHITE });
    s.addText(ratio, { x: M + 2.7, y: y + 0.46, w: 1.5, h: 0.34, isTextBox: true, margin: 0, fontFace: BODY, fontSize: 12, color: "B9B0A0" });
    s.addText(txt, { x: M + 4.3, y: y + 0.2, w: 4.5, h: 0.62, isTextBox: true, margin: 0, fontFace: BODY, fontSize: 9.5, color: "B9B0A0", lineSpacing: 12, valign: "middle" });
  };
  bloc(1.74, "Prix de présentation", "8 450 000 €", "20 032 €/m²", "Sur la moyenne du segment neuf ; laisse une marge de négociation crédible", true);
  bloc(2.82, "Valeur de référence du dossier", "8 436 400 €", "20 000 €/m²", "Point de convergence des trois méthodes");
  bloc(3.90, "Plancher de négociation", "7 950 000 €", "18 847 €/m²", "Encadré par la médiane du segment neuf (18 935 €) et l'extrapolation des comparables (18 407 €)");
}

/* ══ 19. Réserves ══════════════════════════════════════════════════════ */
{
  const s = slideClaire("Sources et réserves", "Annexe");
  carte(s, M, 1.3, 4.4, 1.5, "Documents de l'opération",
    "Notice descriptive du 12 octobre 2025 · plans ESQ.2 à ESQ.5 du 30 mai 2025, indice 120 · plan cadastral parcelle AF 168 · dossier Fournitures La Crémerie · panorama Twinmotion.");
  carte(s, 5.1, 1.3, 4.4, 1.5, "Marché",
    "Collection Provence Immobilier · Belles Demeures · John Taylor · Barnes International · MySweetImmo (février et juillet 2026) · Côte d'Azur Sotheby's, Ultra-Prime Report 2026.");
  s.addShape(pres.ShapeType.rect, { x: M, y: 2.98, w: 9, h: 1.62, fill: { color: "F6E9E7" }, line: { color: "F6E9E7", width: 0 } });
  s.addText("Réserves", {
    x: M + 0.24, y: 3.12, w: 8.5, h: 0.26, isTextBox: true, margin: 0,
    fontFace: BODY, fontSize: 11.5, bold: true, color: "6E2A22",
  });
  s.addText([
    { text: "Les comparables sont des prix d'offre relevés en septembre 2026, non des prix de vente.", options: { bullet: true, breakLine: true } },
    { text: "Les coûts du bilan de reconstitution sont des ordres de grandeur de marché, à remplacer par les coûts réels de l'opération.", options: { bullet: true, breakLine: true } },
    { text: "Les surfaces proviennent de plans d'esquisse non contractuels et devront être attestées à la livraison.", options: { bullet: true, breakLine: true } },
    { text: "Les indicateurs de la tranche 7 – 12 M€ cadrent le segment mais ne le dénombrent pas : aucun comptage de transactions n'est avancé sans exécution du script DVF.", options: { bullet: true } },
  ], {
    x: M + 0.24, y: 3.44, w: 8.5, h: 1.06, isTextBox: true, margin: 0,
    fontFace: BODY, fontSize: 9.5, color: "6E2A22", lineSpacing: 12, paraSpaceAfter: 3,
  });
}

pres.writeFile({ fileName: "Villa-Roi-de-la-Camargue-slides.pptx" })
  .then((f) => console.log("écrit :", f));
