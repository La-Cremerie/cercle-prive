/**
 * Smoke tests Brique 2 (node --test).
 * Lancer : npm test
 */

import { test } from "node:test";
import assert from "node:assert/strict";

import { enrichLeadWithoutAI } from "../src/enrichment/enrichLeadWithoutAI.js";
import { generateLeadBrief } from "../src/exports/generateLeadBrief.js";
import {
  isGenericProfessionalEmail,
  normalizePhone,
  normalizeWebsite,
} from "../src/enrichment/publicContactFinder.js";

test("enrichLeadWithoutAI produit tous les champs requis", () => {
  const e = enrichLeadWithoutAI({
    id: "T001",
    title: "Hôtel particulier à rénover",
    description: "Beaucoup de potentiel. Gros oeuvre à reprendre.",
    city: "Chartrons",
    price: 1_500_000,
    surface_m2: 300,
    bedrooms: 5,
    dpe: "F",
    photos_count: 4,
    seller_type: "agence",
    agency_name: "Bordeaux Patrimoine",
    initial_score: 80,
  });

  assert.equal(e.enrichment_status, "enriched_rules");
  assert.equal(e.human_review_required, true);
  assert.ok(e.legal_basis_note.length > 0);
  assert.ok(["A", "B", "C", "D"].includes(e.commercial_priority));
  assert.ok(e.top_3_value_levers.length > 0 && e.top_3_value_levers.length <= 3);
  assert.ok(e.suggested_audit_offer.length > 0);
  assert.ok(["faible", "moyenne", "forte"].includes(e.estimated_conversion_probability));
});

test("particulier → recommandation non-contact + manual_check", () => {
  const e = enrichLeadWithoutAI({
    id: "T002",
    city: "Talence",
    surface_m2: 42,
    price: 189_000,
    seller_type: "particulier",
    initial_score: 60,
  });
  assert.equal(e.best_first_contact_channel, "non recommandé");
  assert.equal(e.manual_check_required, true);
  assert.match(e.recommended_next_action, /Ne pas contacter/i);
});

test("zone Bassin → offre saisonnière", () => {
  const e = enrichLeadWithoutAI({
    id: "T003",
    city: "Cap Ferret",
    price: 2_500_000,
    surface_m2: 180,
    seller_type: "agence",
    agency_name: "X",
    initial_score: 75,
  });
  assert.equal(e.suggested_audit_offer, "Audit ameublement / location saisonnière");
});

test("priorité A : score haut + zone premium + agence + potentiel fort", () => {
  const e = enrichLeadWithoutAI({
    id: "T004",
    title: "Hôtel particulier rénové",
    city: "Triangle d'Or",
    price: 3_500_000,
    surface_m2: 310,
    seller_type: "agence",
    agency_name: "Y",
    initial_score: 90,
    dpe: "F",
    photos_count: 4,
  });
  assert.equal(e.commercial_priority, "A");
  assert.equal(e.lead_temperature, "hot");
});

test("generateLeadBrief produit un markdown bien structuré", () => {
  const e = enrichLeadWithoutAI({
    id: "T005",
    city: "Pessac",
    surface_m2: 60,
    price: 220_000,
    seller_type: "pro",
    agency_name: "Z",
  });
  const md = generateLeadBrief(e);
  assert.match(md, /^# Fiche opportunité/);
  assert.match(md, /## Résumé/);
  assert.match(md, /## Offre recommandée/);
  assert.match(md, /## Risques \/ précautions/);
  assert.match(md, /## Prochaine action recommandée/);
});

test("normalisations contacts publics", () => {
  assert.equal(normalizeWebsite("bordeaux-patrimoine.example.fr"), "https://bordeaux-patrimoine.example.fr");
  assert.equal(normalizeWebsite("https://x.com/path/"), "https://x.com/path");
  assert.equal(normalizePhone("05 56 44 10 10"), "+33556441010");
  assert.equal(normalizePhone("+33556441010"), "+33556441010");

  assert.equal(isGenericProfessionalEmail("contact@agence.fr"), true);
  assert.equal(isGenericProfessionalEmail("info.commercial@agence.fr"), true);
  assert.equal(isGenericProfessionalEmail("jean.dupont@agence.fr"), false);
});
