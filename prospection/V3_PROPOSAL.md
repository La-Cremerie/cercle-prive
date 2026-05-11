# Brique 3 — Proposition (post-enrichissement)

> La Brique 2 enrichit & qualifie. La Brique 3 **activerait** la prospection, **toujours sous validation humaine**.

## Périmètre proposé

### 1. Génération de messages personnalisés validés humainement
- Un générateur produit 1-3 variantes de message (email, courrier, message LinkedIn) à partir de `EnrichedLead`.
- Chaque variante est **soumise à validation humaine** via Airtable (checkbox "approuvé") ou Slack avant tout envoi.
- Templates par offre et par segment Gironde (premium / volume / bassin / patrimoine).
- Garde-fous : longueur max, ton imposé, opt-out obligatoire, mention de la source.

### 2. Scoring de probabilité de réponse
- Modèle léger entraîné sur les leads convertis (réponse / réunion / contrat).
- Features : priorité, zone, type de bien, ancienneté annonce, canal, qualité données.
- Sortie : `predicted_reply_probability` + `confidence_interval`.

### 3. Intégrations CRM
- **HubSpot** : push contact + deal stage "Prospection auditée".
- **Pipedrive** : push deal + activité "À valider avant envoi".
- Mapping bidirectionnel des statuts (RGPD : sync des opt-out).

### 4. Dashboard commercial
- Vue React (réutilisant le `/src/` du site existant ou app séparée).
- KPIs : leads par priorité, leads en attente de validation, taux de conversion par zone/offre, ROI estimé.
- Filtres par zone Gironde, par offre, par température.

### 5. Séquences de relance semi-automatiques
- Cadencement défini (J+0, J+7, J+21) **avec point de validation humaine à chaque étape**.
- Pas de relance automatique en cas de non-réponse silencieuse > 3 messages.
- Détection automatique d'opt-out / unsubscribe / "ne pas recontacter".

### 6. Tracking des réponses
- Webhook entrant (email/forms) → mise à jour du statut lead.
- Catégorisation IA des réponses (positif / neutre / négatif / opt-out).
- Création automatique d'une tâche commerciale si réponse positive.

### 7. Apprentissage sur leads convertis
- Boucle de feedback : lead converti → re-scoring du modèle.
- Comparaison des leads convertis vs. ignorés pour identifier les signaux différenciants.
- A/B testing des messages générés.

### 8. Enrichissement Pappers avancé
- Bilans financiers publiés (CA, résultat, effectif).
- Détection des changements de dirigeant (signal d'opportunité).
- Liens entre sociétés (groupes, holdings).

### 9. Connexion Google Maps pour agences
- API Places (légitime, publique, payante) : horaires, note publique, photo de devanture.
- Rayon de couverture estimé par agence.
- ⚠️ Pas de scraping de Maps : usage exclusif de l'API officielle.

---

## Ce que la Brique 3 NE FERA PAS

- ❌ Envoi automatique sans validation humaine.
- ❌ Personnalisation à partir de données privées (réseaux sociaux personnels, etc.).
- ❌ Bypass d'opt-out ou de listes Bloctel/Robinson.
- ❌ Mass mailing.

---

## Découpage technique suggéré

```
prospection/
├── src/
│   ├── messaging/        ← générateurs + templates
│   ├── crm-sync/         ← HubSpot/Pipedrive
│   ├── tracking/         ← webhooks, parsing réponses
│   ├── scoring/          ← ML prob de réponse
│   └── ui/               ← dashboard (option)
```

---

## Pré-requis avant V3

1. Avoir 30-50 leads enrichis Brique 2 effectivement traités humainement (pour calibrer).
2. Définir 2-3 templates de message validés juridiquement.
3. Choisir CRM cible.
4. Fixer un seuil de "feu vert" (score min, validation humaine obligatoire) avant tout envoi.
