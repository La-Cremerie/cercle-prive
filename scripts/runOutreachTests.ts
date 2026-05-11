/**
 * Tests simples pour la brique 3 (outreach).
 * Lance : npm run outreach:test
 *
 * Cas couverts :
 * - agence A à Bordeaux : message premium B2B avec disclaimer RGPD
 * - investisseur locatif Talence : ton investisseur_roi
 * - résidence secondaire Arcachon : ton residence_secondaire
 * - particulier sans agence : manual_review_only, pas de message email envoyable
 * - priorité D : not_recommended, pas de message, pas de séquence
 * - JSON IA simulé : structure valide
 */

import { assessCompliance, GDPR_OPT_OUT_LINE } from '../src/outreach/outreachCompliance.js';
import { generateMessageWithoutAI } from '../src/outreach/generateMessageWithoutAI.js';
import { generateOutreachSequence } from '../src/outreach/generateOutreachSequence.js';
import { pickToneForLead } from '../src/outreach/outreachToneRules.js';
import { validateOutreachContent } from '../src/outreach/outreachGuards.js';
import type { EnrichedLead, OutreachMessage } from '../src/types/Outreach.js';

let passed = 0;
let failed = 0;
const failures: string[] = [];

function test(name: string, fn: () => void): void {
  try {
    fn();
    console.log(`✓ ${name}`);
    passed++;
  } catch (err) {
    console.error(`✗ ${name}`);
    console.error(`  → ${(err as Error).message}`);
    failures.push(name);
    failed++;
  }
}

function assert(cond: unknown, msg: string): void {
  if (!cond) throw new Error(msg);
}

const leadAgence: EnrichedLead = {
  id: 'test_agence',
  city: 'Bordeaux',
  zone: 'bordeaux_centre',
  agency_name: 'Agence Patrimoine Bordeaux',
  contact_email: 'contact@patrimoine-bordeaux.fr',
  seller_type: 'agence',
  commercial_priority: 'A',
  property_type: 'maison_pierre',
  surface_m2: 180,
  data_confidence: 'high',
  is_public_b2b_data: true,
  identified_levers: ['lisibilité éditoriale', 'mise en scène'],
};

const leadInvestisseur: EnrichedLead = {
  id: 'test_investisseur',
  city: 'Talence',
  zone: 'talence',
  agency_name: null,
  contact_email: 'julien.moreau@example.com',
  seller_type: 'investisseur_locatif',
  likely_buyer_profile: 'investisseur_locatif',
  commercial_priority: 'B',
  property_type: 'appartement',
  surface_m2: 55,
  data_confidence: 'medium',
  is_public_b2b_data: true,
};

const leadResidenceSecondaire: EnrichedLead = {
  id: 'test_arcachon',
  city: 'Arcachon',
  zone: 'bassin_arcachon',
  agency_name: 'Cap Ferret Properties',
  contact_email: 'contact@capferretproperties.fr',
  seller_type: 'agence',
  commercial_priority: 'A',
  property_type: 'villa',
  surface_m2: 220,
  data_confidence: 'high',
  is_public_b2b_data: true,
};

const leadParticulier: EnrichedLead = {
  id: 'test_particulier',
  city: 'Mérignac',
  zone: 'merignac',
  agency_name: null,
  seller_type: 'particulier',
  commercial_priority: 'C',
  data_confidence: 'low',
  is_public_b2b_data: false,
};

const leadPrioriteD: EnrichedLead = {
  id: 'test_prio_d',
  city: 'Cap Ferret',
  zone: 'cap_ferret',
  agency_name: 'Bassin Prestige',
  seller_type: 'agence',
  commercial_priority: 'D',
  data_confidence: 'low',
};

test('agence A Bordeaux : statut allowed_b2b_contextual', () => {
  const c = assessCompliance(leadAgence);
  assert(
    c.outreach_allowed_status === 'allowed_b2b_contextual',
    `attendu allowed_b2b_contextual, obtenu ${c.outreach_allowed_status}`,
  );
});

test('agence A Bordeaux : email B2B contient le disclaimer RGPD', () => {
  const multi = generateMessageWithoutAI(leadAgence);
  assert(multi !== null, 'multi attendu non nul');
  assert(
    multi!.email_short.body.includes(GDPR_OPT_OUT_LINE),
    'email court doit inclure la mention d’opposition',
  );
  assert(
    multi!.email_premium.body.includes(GDPR_OPT_OUT_LINE),
    'email premium doit inclure la mention d’opposition',
  );
});

test('agence Bordeaux : ton partenaire_agence', () => {
  assert(pickToneForLead(leadAgence) === 'partenaire_agence', 'ton incorrect');
});

test('investisseur Talence : ton investisseur_roi', () => {
  assert(
    pickToneForLead(leadInvestisseur) === 'investisseur_roi',
    'ton incorrect pour investisseur',
  );
});

test('résidence secondaire Arcachon : ton residence_secondaire', () => {
  const leadCopy: EnrichedLead = {
    ...leadResidenceSecondaire,
    agency_name: null,
    seller_type: 'professionnel',
    likely_buyer_profile: null,
  };
  assert(
    pickToneForLead(leadCopy) === 'residence_secondaire',
    `ton incorrect pour Arcachon : ${pickToneForLead(leadCopy)}`,
  );
});

test('particulier : statut manual_review_only', () => {
  const c = assessCompliance(leadParticulier);
  assert(
    c.outreach_allowed_status === 'manual_review_only',
    `attendu manual_review_only, obtenu ${c.outreach_allowed_status}`,
  );
});

test('priorité D : statut not_recommended et pas de message', () => {
  const c = assessCompliance(leadPrioriteD);
  assert(
    c.outreach_allowed_status === 'not_recommended',
    `attendu not_recommended, obtenu ${c.outreach_allowed_status}`,
  );
  const multi = generateMessageWithoutAI(leadPrioriteD);
  assert(multi === null, 'aucun message attendu pour priorité D');
  const seq = generateOutreachSequence(leadPrioriteD);
  assert(seq.length === 0, 'aucune étape de séquence attendue pour priorité D');
});

test('aucune critique frontale dans les messages générés', () => {
  const multi = generateMessageWithoutAI(leadAgence)!;
  const blob = JSON.stringify(multi).toLowerCase();
  assert(
    !blob.includes('votre bien est mal vendu'),
    'critique frontale détectée',
  );
  assert(
    !blob.includes('vous vous y prenez mal'),
    'critique frontale détectée',
  );
});

test('garde-fou : message contenant une promesse chiffrée est invalidé', () => {
  const bad: OutreachMessage = {
    channel: 'email_premium',
    subject: 'Vendez 30% plus cher',
    body: `Bonjour, nous vous garantissons +30% de marge dès demain.\n${GDPR_OPT_OUT_LINE}`,
    tone: 'premium_sobre',
    cta: 'cta',
    personalization_points: [],
    compliance_note: '',
    human_review_required: true,
    risk_flags: [],
  };
  const v = validateOutreachContent(bad, leadAgence);
  assert(!v.is_valid, 'le garde-fou aurait dû invalider ce message');
  assert(v.severity === 'high', `severity attendue high, obtenue ${v.severity}`);
});

test('garde-fou : absence de disclaimer dans un email B2B = warning', () => {
  const noDisclaimer: OutreachMessage = {
    channel: 'email_short',
    subject: 'Bordeaux — une idée rapide',
    body: 'Bonjour, nous proposons une lecture rapide de valorisation.',
    tone: 'premium_sobre',
    cta: 'cta',
    personalization_points: [],
    compliance_note: '',
    human_review_required: true,
    risk_flags: [],
  };
  const v = validateOutreachContent(noDisclaimer, leadAgence);
  assert(
    v.warnings.some((w) => w.includes('opposition')),
    'absence de mention d’opposition non détectée',
  );
});

test('séquence : 4 étapes pour priorité A', () => {
  const seq = generateOutreachSequence(leadAgence);
  assert(seq.length === 4, `attendu 4 étapes, obtenu ${seq.length}`);
  assert(seq[0].delay_days === 0, 'étape 1 doit être à J0');
  assert(seq[3].delay_days === 21, 'étape 4 doit être à J+21');
  for (const s of seq) {
    assert(s.human_review_required === true, 'chaque étape doit exiger validation humaine');
  }
});

test('séquence priorité C : note CRM uniquement', () => {
  const leadC: EnrichedLead = { ...leadInvestisseur, commercial_priority: 'C' };
  const seq = generateOutreachSequence(leadC);
  assert(seq.length === 1, 'priorité C doit produire 1 étape (note CRM)');
  assert(
    seq[0].channel_recommended === 'crm_note',
    'priorité C doit cibler crm_note',
  );
});

test('linkedin <= 320 caractères', () => {
  const multi = generateMessageWithoutAI(leadInvestisseur)!;
  assert(
    multi.linkedin.body.length <= 320,
    `LinkedIn trop long : ${multi.linkedin.body.length}`,
  );
});

test('formulaire de contact <= 600 caractères', () => {
  const multi = generateMessageWithoutAI(leadInvestisseur)!;
  assert(
    multi.contact_form.body.length <= 600,
    `formulaire trop long : ${multi.contact_form.body.length}`,
  );
});

console.log(`\nRésultats : ${passed} passés, ${failed} échec(s)`);
if (failed > 0) {
  console.error('Échecs :', failures);
  process.exit(1);
}
