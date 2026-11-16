-- Updated membership pricing: Bronze $12.99 -> $14.99, Silver $44.99 -> $39.99.
-- Gold is unchanged at $59.99.
--
-- Migration 0005 now seeds these figures, so a fresh database is already correct.
-- This migration updates a database where 0005 already ran, and is safe either way.
--
-- NOTE: this changes the price shown on the website only. The amount customers are
-- actually charged comes from the Stripe prices referenced by STRIPE_PRICE_*, so the
-- matching prices must be updated in the Stripe dashboard too.

update public.membership_packages set price_display = '$14.99', updated_at = now()
where key = 'bronze';

update public.membership_packages set price_display = '$39.99', updated_at = now()
where key = 'silver';

update public.app_config
set value = jsonb_set(
      jsonb_set(value, '{bronze_monthly}', '14.99'),
      '{silver_monthly}', '39.99'
    ),
    updated_at = now()
where key = 'pricing';
