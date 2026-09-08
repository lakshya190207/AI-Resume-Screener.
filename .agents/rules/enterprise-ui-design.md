---
trigger: model_decision
description: Enterprise UI design guidelines for clean, high-legibility interfaces modeled after Stripe/Linear/Ashby without flashy neon tropes.
---

# Enterprise UI Design Rules

1. **Aesthetics & Tone**: Avoid neon AI tropes, floating blur blobs, or rainbow gradients. Use clean, high-contrast enterprise dark/light themes modeled after Stripe, Linear, or Ashby.
2. **Panel & Container Structure**: Wrap content in structured panel containers (`bg-[#111622]`, `border-slate-800`, `rounded-xl`).
3. **Interactive Feedback**: Provide animated floating toast notifications (`ToastNotification`) for user actions (uploads, rejections, DB purges).
4. **Micro-Animations**: Use subtle CSS animations (`@keyframes slideIn`, `@keyframes pulseGlow`) for smooth tab transitions and status pills.
