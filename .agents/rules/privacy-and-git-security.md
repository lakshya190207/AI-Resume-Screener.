---
trigger: model_decision
description: Privacy guardrails for PII redaction, PDF exclusion in Git, and database purge controls.
---

# Data Privacy & Git Security Rules

1. **Git Exclusions**: Always add `*.pdf` to `.gitignore` and untrack from Git (`git rm --cached`) to prevent committing confidential PDF documents to public repositories.
2. **PII Anonymization**: Strip all PII (names, emails, phones, addresses, social links, gender pronouns, graduation dates) prior to evaluation.
3. **Recruiter Controls**: Provide explicit `Reject Candidate` (with notice logging) and `Delete / Purge DB` (with GDPR compliance logging) buttons.
