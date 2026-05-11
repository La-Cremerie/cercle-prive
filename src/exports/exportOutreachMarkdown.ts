import { writeFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import type { OutreachOutput, OutreachSequenceStep } from '../types/Outreach.js';

function fmtStep(steps: OutreachSequenceStep[], n: number): string {
  const s = steps.find((x) => x.step === n);
  if (!s) return '_(non applicable)_';
  const head = `**J+${s.delay_days}** — canal : ${s.channel_recommended}`;
  const subj = s.subject ? `\nObjet : ${s.subject}` : '';
  return `${head}${subj}\n\n${s.message}\n\n_Stop : ${s.stop_condition}_`;
}

export function toMarkdown(out: OutreachOutput): string {
  const city = out.city ?? 'inconnue';
  const prio = out.commercial_priority;
  const m = out.messages;

  const opportunity =
    out.messages?.crm_note.body ??
    `Lead ${out.seller_type}, priorité ${prio}. Statut : ${out.outreach_allowed_status}.`;

  return `# Outreach Lead — ${city} — Priorité ${prio}

## Opportunité
${opportunity}

## Canal recommandé
${out.recommended_channel} (ton : ${out.recommended_tone})

## Précautions
- Statut RGPD/outreach : **${out.outreach_allowed_status}**
- Validation humaine requise : **${out.human_review_required ? 'oui' : 'non'}**
- Risk flags : ${out.risk_flags.length > 0 ? out.risk_flags.join(', ') : '_(aucun)_'}
- Disclaimer d’opposition inclus : ${out.gdpr_disclaimer_included ? 'oui' : 'non'}

## Email court
Objet : ${m?.email_short.subject ?? ''}

\`\`\`
${m?.email_short.body ?? '(non généré)'}
\`\`\`

## Email premium
Objet : ${m?.email_premium.subject ?? ''}

\`\`\`
${m?.email_premium.body ?? '(non généré)'}
\`\`\`

## LinkedIn
\`\`\`
${m?.linkedin.body ?? '(non généré)'}
\`\`\`

## Script d’appel
\`\`\`
${m?.call_script.body ?? '(non généré)'}
\`\`\`

## Message formulaire
\`\`\`
${m?.contact_form.body ?? '(non généré)'}
\`\`\`

## Note CRM
\`\`\`
${m?.crm_note.body ?? '(non généré)'}
\`\`\`

## Séquence recommandée
### J0
${fmtStep(out.sequence, 1)}

### J+4
${fmtStep(out.sequence, 2)}

### J+10
${fmtStep(out.sequence, 3)}

### J+21
${fmtStep(out.sequence, 4)}

## Validation
Statut : ${out.validation_status}
Mode de génération : ${out.generator_mode}${out.ai_model ? ` (${out.ai_model})` : ''}
Notes : ${out.reviewer_notes || '_(à compléter par le réviseur)_'}
`;
}

export async function exportOutreachMarkdown(
  outputs: OutreachOutput[],
  dir: string,
): Promise<string[]> {
  await mkdir(dir, { recursive: true });
  const paths: string[] = [];
  for (const out of outputs) {
    const fname = `${out.lead_id}_${(out.city ?? 'inconnu').replace(/[^\w-]+/g, '_')}.md`;
    const filePath = join(dir, fname);
    await writeFile(filePath, toMarkdown(out), 'utf8');
    paths.push(filePath);
  }
  return paths;
}
