-- Seed: processors (idempotent via ON CONFLICT DO NOTHING)

insert into processors
  (name, slug, segment_id, description, website_url, scraper_url, kyc_level,
   onboarding_days_min, onboarding_days_max, api_quality_score, is_verified, status)
values
  ('Stripe',                 'stripe',           (select id from segments where slug='business'),         'Leading global payment processor. Best-in-class API.',                                         'https://stripe.com',                   'https://stripe.com/pricing',                         'standard', 1,  3,  5, true,  'active'),
  ('Adyen',                  'adyen',            (select id from segments where slug='business'),         'Enterprise payment platform used by global brands.',                                           'https://adyen.com',                    'https://adyen.com/pricing',                          'full',     14, 30, 5, true,  'active'),
  ('Checkout.com',           'checkout-com',     (select id from segments where slug='business'),         'High-performance payment platform with strong emerging market coverage.',                       'https://checkout.com',                 'https://checkout.com/pricing',                       'standard', 3,  10, 4, true,  'active'),
  ('Braintree',              'braintree',        (select id from segments where slug='business'),         'PayPal-owned gateway with easy PayPal/Venmo integration.',                                     'https://braintreepayments.com',        'https://braintreepayments.com/features/fees',        'standard', 1,  5,  4, true,  'active'),
  ('Worldpay',               'worldpay',         (select id from segments where slug='business'),         'One of the largest global acquirers. Strong EU and North America coverage.',                    'https://worldpay.com',                 'https://worldpay.com/pricing',                       'full',     14, 30, 3, true,  'active'),
  ('PayKings',               'paykings',         (select id from segments where slug='high_risk_fiat'),   'Dedicated high-risk accounts for gambling, adult, nutra, forex.',                              'https://paykings.com',                 'https://paykings.com/high-risk-merchant-account',    'standard', 5,  14, 3, true,  'active'),
  ('Durango Merchant Services','durango',         (select id from segments where slug='high_risk_fiat'),   'Specialist high-risk processor with offshore and domestic acquiring.',                          'https://durangomerchantservices.com',  'https://durangomerchantservices.com/pricing',        'standard', 5,  21, 3, true,  'active'),
  ('eMerchantBroker',        'emerchantbroker',  (select id from segments where slug='high_risk_fiat'),   'High-risk acquirer for gambling, firearms, adult, subscriptions.',                             'https://emerchantbroker.com',          'https://emerchantbroker.com/fees',                   'standard', 3,  14, 3, true,  'active'),
  ('Soar Payments',          'soar-payments',    (select id from segments where slug='high_risk_fiat'),   'US-based high-risk accounts with competitive rates for nutra and CBD.',                        'https://soarpay.com',                  'https://soarpay.com/rates',                          'basic',    5,  14, 2, true,  'active'),
  ('Cleo',                   'cleo-payments',    (select id from segments where slug='high_risk_fiat'),   'European high-risk gateway with strong iGaming and forex coverage.',                           'https://cleo-payments.com',            'https://cleo-payments.com/pricing',                  'standard', 7,  21, 3, false, 'active'),
  ('NOWPayments',            'nowpayments',      (select id from segments where slug='high_risk_crypto'),  'Non-custodial crypto gateway. Accepts 300+ coins. No KYC for basic integration.',               'https://nowpayments.io',               'https://nowpayments.io/fees',                        'basic',    1,  1,  4, true,  'active'),
  ('Cryptomus',              'cryptomus',        (select id from segments where slug='high_risk_crypto'),  'Crypto payment gateway with merchant API and iGaming-friendly terms.',                         'https://cryptomus.com',                'https://cryptomus.com/fees',                         'basic',    1,  3,  4, true,  'active'),
  ('Triple-A',               'triple-a',         (select id from segments where slug='high_risk_crypto'),  'MAS-licensed crypto gateway with fiat settlement. Strong in SG, EU, APAC.',                    'https://triple-a.io',                  'https://triple-a.io/pricing',                        'standard', 5,  14, 4, true,  'active'),
  ('MoonPay',                'moonpay',          (select id from segments where slug='high_risk_crypto'),  'Fiat-to-crypto on-ramp with broad global coverage. Consumer and B2B API.',                     'https://moonpay.com',                  'https://moonpay.com/fees',                           'standard', 3,  7,  4, true,  'active'),
  ('Payscout',               'payscout',         (select id from segments where slug='alternative_dark'),  'Offshore acquiring with minimal documentation. Accepts challenging merchant categories.',      'https://payscout.com',                 'https://payscout.com',                               'none',     3,  10, 2, false, 'active')
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- Volume tiers
-- ============================================================

insert into volume_tiers
  (processor_id, volume_min_usd, volume_max_usd, fee_percentage, fee_fixed_usd,
   settlement_currency, settlement_days_min, settlement_days_max,
   rolling_reserve_percentage, rolling_reserve_days)
select p.id, 0, null, 2.90, 0.30, array['USD','EUR','GBP'], 2, 7, null, null
from processors p where p.slug = 'stripe'
  and not exists (select 1 from volume_tiers where processor_id = p.id);

insert into volume_tiers
  (processor_id, volume_min_usd, volume_max_usd, fee_percentage, fee_fixed_usd,
   settlement_currency, settlement_days_min, settlement_days_max,
   rolling_reserve_percentage, rolling_reserve_days)
select p.id, 100000, null, 2.50, 0.25, array['USD','EUR','GBP'], 2, 7, null, null
from processors p where p.slug = 'stripe'
  and not exists (select 1 from volume_tiers where processor_id = p.id and volume_min_usd = 100000);

insert into volume_tiers
  (processor_id, volume_min_usd, volume_max_usd, fee_percentage, fee_fixed_usd,
   settlement_currency, settlement_days_min, settlement_days_max,
   rolling_reserve_percentage, rolling_reserve_days, chargeback_limit_percentage)
select p.id, 0, 10000, 4.50, 0.35, array['USD'], 7, 14, 10.0, 180, 1.5
from processors p where p.slug = 'paykings'
  and not exists (select 1 from volume_tiers where processor_id = p.id and volume_min_usd = 0);

insert into volume_tiers
  (processor_id, volume_min_usd, volume_max_usd, fee_percentage, fee_fixed_usd,
   settlement_currency, settlement_days_min, settlement_days_max,
   rolling_reserve_percentage, rolling_reserve_days, chargeback_limit_percentage)
select p.id, 10000, 50000, 3.90, 0.30, array['USD'], 5, 10, 10.0, 180, 1.5
from processors p where p.slug = 'paykings'
  and not exists (select 1 from volume_tiers where processor_id = p.id and volume_min_usd = 10000);

insert into volume_tiers
  (processor_id, volume_min_usd, volume_max_usd, fee_percentage, fee_fixed_usd,
   settlement_currency, settlement_days_min, settlement_days_max,
   rolling_reserve_percentage, rolling_reserve_days, chargeback_limit_percentage)
select p.id, 50000, null, 3.25, 0.25, array['USD'], 5, 10, 10.0, 180, 1.5
from processors p where p.slug = 'paykings'
  and not exists (select 1 from volume_tiers where processor_id = p.id and volume_min_usd = 50000);

insert into volume_tiers
  (processor_id, volume_min_usd, volume_max_usd, fee_percentage,
   settlement_currency, settlement_days_min, settlement_days_max)
select p.id, 0, null, 0.50, array['BTC','ETH','USDT','USDC','LTC'], 0, 1
from processors p where p.slug = 'nowpayments'
  and not exists (select 1 from volume_tiers where processor_id = p.id);

insert into volume_tiers
  (processor_id, volume_min_usd, volume_max_usd, fee_percentage,
   settlement_currency, settlement_days_min, settlement_days_max)
select p.id, 0, 50000, 0.70, array['USDT','BTC','ETH'], 0, 1
from processors p where p.slug = 'cryptomus'
  and not exists (select 1 from volume_tiers where processor_id = p.id and volume_min_usd = 0);

insert into volume_tiers
  (processor_id, volume_min_usd, volume_max_usd, fee_percentage,
   settlement_currency, settlement_days_min, settlement_days_max)
select p.id, 50000, null, 0.40, array['USDT','BTC','ETH'], 0, 1
from processors p where p.slug = 'cryptomus'
  and not exists (select 1 from volume_tiers where processor_id = p.id and volume_min_usd = 50000);

insert into volume_tiers
  (processor_id, volume_min_usd, volume_max_usd, fee_percentage, fee_fixed_usd,
   settlement_currency, settlement_days_min, settlement_days_max)
select p.id, 0, null, 0.30, 0.12, array['USD','EUR','GBP','AUD'], 2, 3
from processors p where p.slug = 'adyen'
  and not exists (select 1 from volume_tiers where processor_id = p.id);

-- ============================================================
-- Processor verticals
-- ============================================================

insert into processor_verticals (processor_id, vertical_id, approval_likelihood)
select p.id, v.id, 'confirmed'
from processors p, verticals v
where p.slug = 'stripe' and v.name in ('ecommerce','saas','marketplace','fintech','travel','education','subscription')
on conflict do nothing;

insert into processor_verticals (processor_id, vertical_id, approval_likelihood)
select p.id, v.id, 'high'
from processors p, verticals v
where p.slug = 'paykings' and v.name in ('gambling','adult','nutra','forex','sports_betting','lottery','igaming')
on conflict do nothing;

insert into processor_verticals (processor_id, vertical_id, approval_likelihood)
select p.id, v.id, 'confirmed'
from processors p, verticals v
where p.slug = 'nowpayments' and v.name in ('crypto_exchange','igaming','gambling','nft','defi','p2p','adult','forex')
on conflict do nothing;

insert into processor_verticals (processor_id, vertical_id, approval_likelihood)
select p.id, v.id, 'confirmed'
from processors p, verticals v
where p.slug = 'cryptomus' and v.name in ('igaming','gambling','crypto_exchange','nft','defi','adult')
on conflict do nothing;

insert into processor_verticals (processor_id, vertical_id, approval_likelihood)
select p.id, v.id, 'confirmed'
from processors p, verticals v
where p.slug = 'adyen' and v.name in ('ecommerce','marketplace','fintech','travel','saas','subscription')
on conflict do nothing;

-- ============================================================
-- Processor countries (client_geo)
-- ============================================================

insert into processor_countries (processor_id, country_id, role, is_supported)
select p.id, c.id, 'client_geo', true
from processors p, countries c
where p.slug = 'stripe' and c.fatf_status = 'compliant' and c.is_sanctioned = false
on conflict do nothing;

insert into processor_countries (processor_id, country_id, role, is_supported)
select p.id, c.id, 'client_geo', true
from processors p, countries c
where p.slug = 'paykings' and c.is_sanctioned = false
on conflict do nothing;

insert into processor_countries (processor_id, country_id, role, is_supported)
select p.id, c.id, 'client_geo', true
from processors p, countries c
where p.slug = 'nowpayments' and c.is_sanctioned = false
on conflict do nothing;

insert into processor_countries (processor_id, country_id, role, is_supported)
select p.id, c.id, 'client_geo', true
from processors p, countries c
where p.slug = 'cryptomus' and c.is_sanctioned = false
on conflict do nothing;

-- ============================================================
-- Processor payment methods
-- ============================================================

insert into processor_payment_methods (processor_id, payment_method_id)
select p.id, pm.id from processors p, payment_methods pm
where p.slug = 'stripe' and pm.name in ('Visa / Mastercard','American Express','ACH / Bank Transfer','SEPA')
on conflict do nothing;

insert into processor_payment_methods (processor_id, payment_method_id)
select p.id, pm.id from processors p, payment_methods pm
where p.slug = 'paykings' and pm.name in ('Visa / Mastercard','American Express')
on conflict do nothing;

insert into processor_payment_methods (processor_id, payment_method_id)
select p.id, pm.id from processors p, payment_methods pm
where p.slug = 'nowpayments' and pm.name in ('Bitcoin','Ethereum','USDT (TRC-20)','USDT (ERC-20)','USDC','Litecoin','Monero')
on conflict do nothing;

insert into processor_payment_methods (processor_id, payment_method_id)
select p.id, pm.id from processors p, payment_methods pm
where p.slug = 'cryptomus' and pm.name in ('Bitcoin','Ethereum','USDT (TRC-20)','USDT (ERC-20)','USDC')
on conflict do nothing;

insert into processor_payment_methods (processor_id, payment_method_id)
select p.id, pm.id from processors p, payment_methods pm
where p.slug = 'adyen' and pm.name in ('Visa / Mastercard','American Express','SEPA','PayPal','Klarna','iDEAL','Bancontact')
on conflict do nothing;
