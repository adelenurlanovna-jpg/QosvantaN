-- Seed: countries with FATF status, sanctions, dominant payment methods
-- fatf_status: compliant | grey_list | black_list
-- is_sanctioned: true for OFAC/UN primary sanctioned countries

insert into countries (code, name, name_ru, region, fatf_status, is_sanctioned, sanction_details, dominant_payment_methods) values

-- EUROPE (EU)
('AT', 'Austria', 'Австрия', 'eu', 'compliant', false, null, '{visa_mastercard,sepa}'),
('BE', 'Belgium', 'Бельгия', 'eu', 'compliant', false, null, '{bancontact,visa_mastercard,sepa}'),
('BG', 'Bulgaria', 'Болгария', 'eu', 'compliant', false, null, '{visa_mastercard,sepa}'),
('HR', 'Croatia', 'Хорватия', 'eu', 'compliant', false, null, '{visa_mastercard,sepa}'),
('CY', 'Cyprus', 'Кипр', 'eu', 'compliant', false, null, '{visa_mastercard,sepa}'),
('CZ', 'Czech Republic', 'Чехия', 'eu', 'compliant', false, null, '{visa_mastercard,sepa}'),
('DK', 'Denmark', 'Дания', 'eu', 'compliant', false, null, '{visa_mastercard,sepa}'),
('EE', 'Estonia', 'Эстония', 'eu', 'compliant', false, null, '{visa_mastercard,sepa}'),
('FI', 'Finland', 'Финляндия', 'eu', 'compliant', false, null, '{visa_mastercard,sepa}'),
('FR', 'France', 'Франция', 'eu', 'compliant', false, null, '{visa_mastercard,sepa}'),
('DE', 'Germany', 'Германия', 'eu', 'compliant', false, null, '{visa_mastercard,sepa}'),
('GR', 'Greece', 'Греция', 'eu', 'compliant', false, null, '{visa_mastercard,sepa}'),
('HU', 'Hungary', 'Венгрия', 'eu', 'compliant', false, null, '{visa_mastercard,sepa}'),
('IE', 'Ireland', 'Ирландия', 'eu', 'compliant', false, null, '{visa_mastercard,sepa}'),
('IT', 'Italy', 'Италия', 'eu', 'compliant', false, null, '{visa_mastercard,sepa}'),
('LV', 'Latvia', 'Латвия', 'eu', 'compliant', false, null, '{visa_mastercard,sepa}'),
('LT', 'Lithuania', 'Литва', 'eu', 'compliant', false, null, '{visa_mastercard,sepa}'),
('LU', 'Luxembourg', 'Люксембург', 'eu', 'compliant', false, null, '{visa_mastercard,sepa}'),
('MT', 'Malta', 'Мальта', 'eu', 'compliant', false, null, '{visa_mastercard,sepa}'),
('NL', 'Netherlands', 'Нидерланды', 'eu', 'compliant', false, null, '{ideal,visa_mastercard,sepa}'),
('PL', 'Poland', 'Польша', 'eu', 'compliant', false, null, '{blik,visa_mastercard,sepa}'),
('PT', 'Portugal', 'Португалия', 'eu', 'compliant', false, null, '{visa_mastercard,sepa}'),
('RO', 'Romania', 'Румыния', 'eu', 'compliant', false, null, '{visa_mastercard,sepa}'),
('SK', 'Slovakia', 'Словакия', 'eu', 'compliant', false, null, '{visa_mastercard,sepa}'),
('SI', 'Slovenia', 'Словения', 'eu', 'compliant', false, null, '{visa_mastercard,sepa}'),
('ES', 'Spain', 'Испания', 'eu', 'compliant', false, null, '{visa_mastercard,sepa}'),
('SE', 'Sweden', 'Швеция', 'eu', 'compliant', false, null, '{visa_mastercard,sepa}'),
('GB', 'United Kingdom', 'Великобритания', 'eu', 'compliant', false, null, '{visa_mastercard,sepa}'),
('CH', 'Switzerland', 'Швейцария', 'eu', 'compliant', false, null, '{visa_mastercard,sepa}'),
('NO', 'Norway', 'Норвегия', 'eu', 'compliant', false, null, '{visa_mastercard,sepa}'),
('IS', 'Iceland', 'Исландия', 'eu', 'compliant', false, null, '{visa_mastercard,sepa}'),
('GI', 'Gibraltar', 'Гибралтар', 'eu', 'compliant', false, null, '{visa_mastercard,sepa}'),
('IM', 'Isle of Man', 'Остров Мэн', 'eu', 'compliant', false, null, '{visa_mastercard,sepa}'),

-- NORTH AMERICA
('US', 'United States', 'США', 'na', 'compliant', false, null, '{visa_mastercard,ach,paypal}'),
('CA', 'Canada', 'Канада', 'na', 'compliant', false, null, '{visa_mastercard,ach}'),
('MX', 'Mexico', 'Мексика', 'na', 'compliant', false, null, '{visa_mastercard,spei}'),

-- LATIN AMERICA
('BR', 'Brazil', 'Бразилия', 'latam', 'compliant', false, null, '{pix,visa_mastercard}'),
('AR', 'Argentina', 'Аргентина', 'latam', 'grey_list', false, null, '{visa_mastercard,crypto}'),
('CO', 'Colombia', 'Колумбия', 'latam', 'compliant', false, null, '{visa_mastercard}'),
('CL', 'Chile', 'Чили', 'latam', 'compliant', false, null, '{visa_mastercard}'),
('PE', 'Peru', 'Перу', 'latam', 'compliant', false, null, '{visa_mastercard}'),
('VE', 'Venezuela', 'Венесуэла', 'latam', 'grey_list', false, null, '{crypto,visa_mastercard}'),
('EC', 'Ecuador', 'Эквадор', 'latam', 'compliant', false, null, '{visa_mastercard}'),
('BO', 'Bolivia', 'Боливия', 'latam', 'grey_list', false, null, '{visa_mastercard}'),
('PY', 'Paraguay', 'Парагвай', 'latam', 'grey_list', false, null, '{visa_mastercard}'),
('UY', 'Uruguay', 'Уругвай', 'latam', 'compliant', false, null, '{visa_mastercard}'),
('CR', 'Costa Rica', 'Коста-Рика', 'latam', 'compliant', false, null, '{visa_mastercard}'),
('GT', 'Guatemala', 'Гватемала', 'latam', 'compliant', false, null, '{visa_mastercard}'),
('PA', 'Panama', 'Панама', 'latam', 'grey_list', false, null, '{visa_mastercard}'),
('CW', 'Curaçao', 'Кюрасао', 'latam', 'compliant', false, null, '{visa_mastercard}'),
('SV', 'El Salvador', 'Сальвадор', 'latam', 'compliant', false, null, '{bitcoin,visa_mastercard}'),

-- CIS
('RU', 'Russia', 'Россия', 'cis', 'grey_list', true, 'OFAC/EU sanctions; MIR/SBP only', '{mir,sbp,crypto}'),
('KZ', 'Kazakhstan', 'Казахстан', 'cis', 'compliant', false, null, '{visa_mastercard,sbp}'),
('UA', 'Ukraine', 'Украина', 'cis', 'compliant', false, null, '{visa_mastercard,crypto}'),
('BY', 'Belarus', 'Беларусь', 'cis', 'grey_list', true, 'EU/US sectoral sanctions', '{visa_mastercard}'),
('UZ', 'Uzbekistan', 'Узбекистан', 'cis', 'grey_list', false, null, '{visa_mastercard}'),
('AZ', 'Azerbaijan', 'Азербайджан', 'cis', 'compliant', false, null, '{visa_mastercard}'),
('GE', 'Georgia', 'Грузия', 'cis', 'compliant', false, null, '{visa_mastercard}'),
('AM', 'Armenia', 'Армения', 'cis', 'compliant', false, null, '{visa_mastercard}'),
('KG', 'Kyrgyzstan', 'Кыргызстан', 'cis', 'grey_list', false, null, '{visa_mastercard}'),
('TJ', 'Tajikistan', 'Таджикистан', 'cis', 'grey_list', false, null, '{visa_mastercard}'),
('TM', 'Turkmenistan', 'Туркменистан', 'cis', 'grey_list', false, null, '{visa_mastercard}'),
('MD', 'Moldova', 'Молдова', 'cis', 'compliant', false, null, '{visa_mastercard}'),

-- MENA
('AE', 'UAE', 'ОАЭ', 'mena', 'compliant', false, null, '{visa_mastercard,crypto}'),
('SA', 'Saudi Arabia', 'Саудовская Аравия', 'mena', 'compliant', false, null, '{visa_mastercard,mada}'),
('QA', 'Qatar', 'Катар', 'mena', 'compliant', false, null, '{visa_mastercard}'),
('KW', 'Kuwait', 'Кувейт', 'mena', 'compliant', false, null, '{visa_mastercard}'),
('BH', 'Bahrain', 'Бахрейн', 'mena', 'compliant', false, null, '{visa_mastercard}'),
('OM', 'Oman', 'Оман', 'mena', 'compliant', false, null, '{visa_mastercard}'),
('JO', 'Jordan', 'Иордания', 'mena', 'compliant', false, null, '{visa_mastercard}'),
('LB', 'Lebanon', 'Ливан', 'mena', 'grey_list', false, null, '{visa_mastercard,cash}'),
('EG', 'Egypt', 'Египет', 'mena', 'grey_list', false, null, '{visa_mastercard,instapay}'),
('MA', 'Morocco', 'Марокко', 'mena', 'grey_list', false, null, '{visa_mastercard}'),
('TN', 'Tunisia', 'Тунис', 'mena', 'compliant', false, null, '{visa_mastercard}'),
('DZ', 'Algeria', 'Алжир', 'mena', 'grey_list', false, null, '{visa_mastercard}'),
('IQ', 'Iraq', 'Ирак', 'mena', 'grey_list', false, null, '{visa_mastercard,cash}'),
('IR', 'Iran', 'Иран', 'mena', 'black_list', true, 'Full OFAC/UN/EU sanctions', null),
('SY', 'Syria', 'Сирия', 'mena', 'black_list', true, 'Full OFAC/EU sanctions', null),
('YE', 'Yemen', 'Йемен', 'mena', 'grey_list', false, null, '{visa_mastercard,cash}'),
('IL', 'Israel', 'Израиль', 'mena', 'compliant', false, null, '{visa_mastercard,sepa}'),
('TR', 'Turkey', 'Турция', 'mena', 'grey_list', false, null, '{visa_mastercard,troy}'),

-- AFRICA
('ZA', 'South Africa', 'ЮАР', 'africa', 'grey_list', false, null, '{visa_mastercard,eft}'),
('NG', 'Nigeria', 'Нигерия', 'africa', 'grey_list', false, null, '{visa_mastercard,crypto,bank_transfer}'),
('KE', 'Kenya', 'Кения', 'africa', 'compliant', false, null, '{m_pesa,visa_mastercard}'),
('GH', 'Ghana', 'Гана', 'africa', 'compliant', false, null, '{mtn_mobile_money,visa_mastercard}'),
('TZ', 'Tanzania', 'Танзания', 'africa', 'compliant', false, null, '{m_pesa,visa_mastercard}'),
('ET', 'Ethiopia', 'Эфиопия', 'africa', 'compliant', false, null, '{visa_mastercard,telebirr}'),
('UG', 'Uganda', 'Уганда', 'africa', 'compliant', false, null, '{mtn_mobile_money,visa_mastercard}'),
('RW', 'Rwanda', 'Руанда', 'africa', 'compliant', false, null, '{mtn_mobile_money,visa_mastercard}'),
('SN', 'Senegal', 'Сенегал', 'africa', 'compliant', false, null, '{orange_money,visa_mastercard}'),
('CI', 'Ivory Coast', 'Кот-д''Ивуар', 'africa', 'compliant', false, null, '{orange_money,mtn_mobile_money}'),
('CM', 'Cameroon', 'Камерун', 'africa', 'compliant', false, null, '{mtn_mobile_money,orange_money}'),
('AO', 'Angola', 'Ангола', 'africa', 'grey_list', false, null, '{visa_mastercard}'),
('ZM', 'Zambia', 'Замбия', 'africa', 'compliant', false, null, '{visa_mastercard,mobile_money}'),
('MZ', 'Mozambique', 'Мозамбик', 'africa', 'grey_list', false, null, '{m_pesa,visa_mastercard}'),

-- APAC
('CN', 'China', 'Китай', 'apac', 'compliant', false, null, '{wechat_pay,alipay,unionpay}'),
('IN', 'India', 'Индия', 'apac', 'compliant', false, null, '{upi,visa_mastercard}'),
('JP', 'Japan', 'Япония', 'apac', 'compliant', false, null, '{visa_mastercard,konbini,paypay}'),
('KR', 'South Korea', 'Южная Корея', 'apac', 'compliant', false, null, '{visa_mastercard,kakaopay}'),
('SG', 'Singapore', 'Сингапур', 'apac', 'compliant', false, null, '{visa_mastercard,paynow,crypto}'),
('AU', 'Australia', 'Австралия', 'apac', 'compliant', false, null, '{visa_mastercard,bpay,osko}'),
('NZ', 'New Zealand', 'Новая Зеландия', 'apac', 'compliant', false, null, '{visa_mastercard}'),
('HK', 'Hong Kong', 'Гонконг', 'apac', 'compliant', false, null, '{visa_mastercard,fps,crypto}'),
('TW', 'Taiwan', 'Тайвань', 'apac', 'compliant', false, null, '{visa_mastercard,linepay}'),
('TH', 'Thailand', 'Таиланд', 'apac', 'compliant', false, null, '{promptpay,visa_mastercard}'),
('MY', 'Malaysia', 'Малайзия', 'apac', 'compliant', false, null, '{duitnow,visa_mastercard}'),
('ID', 'Indonesia', 'Индонезия', 'apac', 'grey_list', false, null, '{gopay,ovo,visa_mastercard}'),
('PH', 'Philippines', 'Филиппины', 'apac', 'grey_list', false, null, '{gcash,visa_mastercard}'),
('VN', 'Vietnam', 'Вьетнам', 'apac', 'grey_list', false, null, '{visa_mastercard,vnpay,momo}'),
('PK', 'Pakistan', 'Пакистан', 'apac', 'grey_list', false, null, '{visa_mastercard,jazzcash,easypaisa}'),
('BD', 'Bangladesh', 'Бангладеш', 'apac', 'grey_list', false, null, '{bkash,visa_mastercard}'),
('LK', 'Sri Lanka', 'Шри-Ланка', 'apac', 'grey_list', false, null, '{visa_mastercard}'),
('NP', 'Nepal', 'Непал', 'apac', 'grey_list', false, null, '{visa_mastercard,esewa}'),
('MM', 'Myanmar', 'Мьянма', 'apac', 'grey_list', false, null, '{kbzpay,visa_mastercard}'),
('KH', 'Cambodia', 'Камбоджа', 'apac', 'grey_list', false, null, '{visa_mastercard,bakong}'),
('KP', 'North Korea', 'Северная Корея', 'apac', 'black_list', true, 'Full UN/OFAC/EU sanctions', null),

-- OCEANIA
('FJ', 'Fiji', 'Фиджи', 'oceania', 'compliant', false, null, '{visa_mastercard}'),
('PG', 'Papua New Guinea', 'Папуа Новая Гвинея', 'oceania', 'grey_list', false, null, '{visa_mastercard}'),

-- OTHER SANCTIONED / BLACKLISTED
('CU', 'Cuba', 'Куба', 'latam', 'compliant', true, 'OFAC comprehensive sanctions', null),
('SD', 'Sudan', 'Судан', 'africa', 'black_list', true, 'OFAC sanctions', null),
('SS', 'South Sudan', 'Южный Судан', 'africa', 'grey_list', false, null, '{m_pesa,visa_mastercard}'),
('LY', 'Libya', 'Ливия', 'africa', 'grey_list', false, null, '{visa_mastercard,cash}'),

-- CRYPTO-FRIENDLY SPECIAL JURISDICTIONS
('CF', 'Central African Republic', 'ЦАР', 'africa', 'grey_list', false, null, '{bitcoin,mobile_money}')
ON CONFLICT (code) DO NOTHING;
-- Seed: business verticals
insert into verticals (name, display_name, risk_level) values
('ecommerce',          'E-Commerce',              'low'),
('saas',               'SaaS / Software',         'low'),
('marketplace',        'Marketplace',             'low'),
('fintech',            'Fintech / Neobank',       'low'),
('travel',             'Travel & Hospitality',    'low'),
('education',          'Education / EdTech',      'low'),
('healthcare',         'Healthcare',              'medium'),
('subscription',       'Subscription Billing',    'low'),
('gambling',           'Online Gambling / Casino','very_high'),
('sports_betting',     'Sports Betting',          'very_high'),
('lottery',            'Lottery',                 'high'),
('forex',              'Forex / CFD Trading',     'very_high'),
('crypto_exchange',    'Crypto Exchange',         'high'),
('adult',              'Adult Content',           'very_high'),
('nutra',              'Nutra / Supplements',     'high'),
('dating',             'Dating',                  'high'),
('igaming',            'iGaming (General)',        'very_high'),
('esports',            'Esports Betting',         'high'),
('p2p',                'P2P Payments',            'high'),
('remittance',         'Remittance',              'medium'),
('nft',                'NFT / Digital Assets',    'high'),
('defi',               'DeFi / Web3',             'high'),
('offshore',           'Offshore / Shell',        'very_high')
ON CONFLICT (name) DO NOTHING;
-- Seed: first 15 processors (representative set across all 4 segments)
-- Uses CTEs to reference segments by slug

with seg as (
  select id, slug from segments
),
proc_insert as (
  insert into processors
    (name, slug, segment_id, description, website_url, scraper_url, kyc_level,
     onboarding_days_min, onboarding_days_max, api_quality_score, is_verified, status)
  values

  -- SEGMENT: business
  (
    'Stripe',
    'stripe',
    (select id from seg where slug = 'business'),
    'Leading global payment processor for internet businesses. Best-in-class API and developer experience.',
    'https://stripe.com',
    'https://stripe.com/pricing',
    'standard', 1, 3, 5, true, 'active'
  ),
  (
    'Adyen',
    'adyen',
    (select id from seg where slug = 'business'),
    'Enterprise payment platform used by global brands. Unified commerce across online, mobile, and in-store.',
    'https://adyen.com',
    'https://adyen.com/pricing',
    'full', 14, 30, 5, true, 'active'
  ),
  (
    'Checkout.com',
    'checkout-com',
    (select id from seg where slug = 'business'),
    'High-performance payment platform with strong emerging market coverage and advanced fraud tools.',
    'https://checkout.com',
    'https://checkout.com/pricing',
    'standard', 3, 10, 4, true, 'active'
  ),
  (
    'Braintree',
    'braintree',
    (select id from seg where slug = 'business'),
    'PayPal-owned payment gateway with strong US market presence and easy PayPal/Venmo integration.',
    'https://braintreepayments.com',
    'https://braintreepayments.com/features/fees',
    'standard', 1, 5, 4, true, 'active'
  ),
  (
    'Worldpay',
    'worldpay',
    (select id from seg where slug = 'business'),
    'One of the largest global acquirers. Strong coverage across EU and North America for enterprise merchants.',
    'https://worldpay.com',
    'https://worldpay.com/pricing',
    'full', 14, 30, 3, true, 'active'
  ),

  -- SEGMENT: high_risk_fiat
  (
    'PayKings',
    'paykings',
    (select id from seg where slug = 'high_risk_fiat'),
    'Dedicated high-risk merchant accounts for gambling, adult, nutra, forex. US-based with global reach.',
    'https://paykings.com',
    'https://paykings.com/high-risk-merchant-account',
    'standard', 5, 14, 3, true, 'active'
  ),
  (
    'Durango Merchant Services',
    'durango',
    (select id from seg where slug = 'high_risk_fiat'),
    'Specialist high-risk payment processor with offshore and domestic acquiring options.',
    'https://durangomerchantservices.com',
    'https://durangomerchantservices.com/pricing',
    'standard', 5, 21, 3, true, 'active'
  ),
  (
    'eMerchantBroker',
    'emerchantbroker',
    (select id from seg where slug = 'high_risk_fiat'),
    'High-risk acquirer specialising in gambling, firearms, adult, and subscription businesses.',
    'https://emerchantbroker.com',
    'https://emerchantbroker.com/fees',
    'standard', 3, 14, 3, true, 'active'
  ),
  (
    'Soar Payments',
    'soar-payments',
    (select id from seg where slug = 'high_risk_fiat'),
    'US-based high-risk merchant account provider with competitive rates for nutra and CBD.',
    'https://soarpay.com',
    'https://soarpay.com/rates',
    'basic', 5, 14, 2, true, 'active'
  ),
  (
    'Cleo',
    'cleo-payments',
    (select id from seg where slug = 'high_risk_fiat'),
    'European high-risk payment gateway with strong iGaming and forex coverage.',
    'https://cleo-payments.com',
    'https://cleo-payments.com/pricing',
    'standard', 7, 21, 3, false, 'active'
  ),

  -- SEGMENT: high_risk_crypto
  (
    'NOWPayments',
    'nowpayments',
    (select id from seg where slug = 'high_risk_crypto'),
    'Non-custodial crypto payment gateway. Accepts 300+ coins. No KYC for basic integration.',
    'https://nowpayments.io',
    'https://nowpayments.io/fees',
    'basic', 1, 1, 4, true, 'active'
  ),
  (
    'Cryptomus',
    'cryptomus',
    (select id from seg where slug = 'high_risk_crypto'),
    'Crypto payment gateway with merchant API, white-label options, and iGaming-friendly terms.',
    'https://cryptomus.com',
    'https://cryptomus.com/fees',
    'basic', 1, 3, 4, true, 'active'
  ),
  (
    'Triple-A',
    'triple-a',
    (select id from seg where slug = 'high_risk_crypto'),
    'MAS-licensed crypto payment gateway with fiat settlement. Strong in SG, EU, APAC.',
    'https://triple-a.io',
    'https://triple-a.io/pricing',
    'standard', 5, 14, 4, true, 'active'
  ),
  (
    'MoonPay',
    'moonpay',
    (select id from seg where slug = 'high_risk_crypto'),
    'Fiat-to-crypto on-ramp with broad global coverage. Consumer-facing and B2B API.',
    'https://moonpay.com',
    'https://moonpay.com/fees',
    'standard', 3, 7, 4, true, 'active'
  ),

  -- SEGMENT: alternative_dark
  (
    'Payscout',
    'payscout',
    (select id from seg where slug = 'alternative_dark'),
    'Offshore acquiring with minimal documentation requirements. Accepts challenging merchant categories.',
    'https://payscout.com',
    'https://payscout.com',
    'none', 3, 10, 2, false, 'active'
  )

  returning id, slug
)
select slug from proc_insert;

-- ============================================================
-- Volume tiers for key processors
-- ============================================================

-- Stripe tiers
insert into volume_tiers
  (processor_id, volume_min_usd, volume_max_usd, fee_percentage, fee_fixed_usd,
   settlement_currency, settlement_days_min, settlement_days_max,
   rolling_reserve_percentage, rolling_reserve_days)
select
  p.id, t.vol_min, t.vol_max, t.fee_pct, t.fee_fixed,
  t.settle_cur, t.settle_min, t.settle_max, t.rr_pct, t.rr_days
from processors p
cross join (values
  (0,       null,   2.90, 0.30, array['USD','EUR','GBP'], 2, 7, null, null),
  (100000,  null,   2.50, 0.25, array['USD','EUR','GBP'], 2, 7, null, null)
) as t(vol_min, vol_max, fee_pct, fee_fixed, settle_cur, settle_min, settle_max, rr_pct, rr_days)
where p.slug = 'stripe';

-- PayKings tiers
insert into volume_tiers
  (processor_id, volume_min_usd, volume_max_usd, fee_percentage, fee_fixed_usd,
   settlement_currency, settlement_days_min, settlement_days_max,
   rolling_reserve_percentage, rolling_reserve_days, chargeback_limit_percentage)
select
  p.id, t.vol_min, t.vol_max, t.fee_pct, t.fee_fixed,
  t.settle_cur, t.settle_min, t.settle_max, t.rr_pct, t.rr_days, t.cb_limit
from processors p
cross join (values
  (0,      10000,  4.50, 0.35, array['USD'], 7,  14, 10.0, 180, 1.5),
  (10000,  50000,  3.90, 0.30, array['USD'], 5,  10, 10.0, 180, 1.5),
  (50000,  null,   3.25, 0.25, array['USD'], 5,  10, 10.0, 180, 1.5)
) as t(vol_min, vol_max, fee_pct, fee_fixed, settle_cur, settle_min, settle_max, rr_pct, rr_days, cb_limit)
where p.slug = 'paykings';

-- NOWPayments tiers
insert into volume_tiers
  (processor_id, volume_min_usd, volume_max_usd, fee_percentage,
   settlement_currency, settlement_days_min, settlement_days_max,
   rolling_reserve_percentage, rolling_reserve_days)
select
  p.id, t.vol_min, t.vol_max, t.fee_pct,
  t.settle_cur, t.settle_min, t.settle_max, t.rr_pct, t.rr_days
from processors p
cross join (values
  (0,      null,   0.50, array['BTC','ETH','USDT','USDC','LTC'], 0, 1, null, null)
) as t(vol_min, vol_max, fee_pct, settle_cur, settle_min, settle_max, rr_pct, rr_days)
where p.slug = 'nowpayments';

-- Cryptomus tiers
insert into volume_tiers
  (processor_id, volume_min_usd, volume_max_usd, fee_percentage,
   settlement_currency, settlement_days_min, settlement_days_max)
select
  p.id, t.vol_min, t.vol_max, t.fee_pct, t.settle_cur, t.settle_min, t.settle_max
from processors p
cross join (values
  (0,      50000,   0.70, array['USDT','BTC','ETH'], 0, 1),
  (50000,  null,    0.40, array['USDT','BTC','ETH'], 0, 1)
) as t(vol_min, vol_max, fee_pct, settle_cur, settle_min, settle_max)
where p.slug = 'cryptomus';

-- Adyen tiers
insert into volume_tiers
  (processor_id, volume_min_usd, volume_max_usd, fee_percentage, fee_fixed_usd,
   settlement_currency, settlement_days_min, settlement_days_max)
select
  p.id, t.vol_min, t.vol_max, t.fee_pct, t.fee_fixed, t.settle_cur, t.settle_min, t.settle_max
from processors p
cross join (values
  (0,       null,   0.30, 0.12, array['USD','EUR','GBP','AUD'], 2, 3)
) as t(vol_min, vol_max, fee_pct, fee_fixed, settle_cur, settle_min, settle_max)
where p.slug = 'adyen';

-- ============================================================
-- Processor verticals
-- ============================================================

-- Stripe → ecommerce, saas, marketplace, fintech, travel, education, subscription
insert into processor_verticals (processor_id, vertical_id, approval_likelihood)
select p.id, v.id, 'confirmed'
from processors p, verticals v
where p.slug = 'stripe'
  and v.name in ('ecommerce','saas','marketplace','fintech','travel','education','subscription');

-- PayKings → gambling, adult, nutra, forex, sports_betting, lottery, igaming
insert into processor_verticals (processor_id, vertical_id, approval_likelihood)
select p.id, v.id, 'high'
from processors p, verticals v
where p.slug = 'paykings'
  and v.name in ('gambling','adult','nutra','forex','sports_betting','lottery','igaming');

-- NOWPayments → crypto_exchange, igaming, gambling, nft, defi, p2p
insert into processor_verticals (processor_id, vertical_id, approval_likelihood)
select p.id, v.id, 'confirmed'
from processors p, verticals v
where p.slug = 'nowpayments'
  and v.name in ('crypto_exchange','igaming','gambling','nft','defi','p2p','adult','forex');

-- Cryptomus → igaming, gambling, crypto_exchange, nft
insert into processor_verticals (processor_id, vertical_id, approval_likelihood)
select p.id, v.id, 'confirmed'
from processors p, verticals v
where p.slug = 'cryptomus'
  and v.name in ('igaming','gambling','crypto_exchange','nft','defi','adult');

-- Adyen → ecommerce, marketplace, fintech, travel, saas
insert into processor_verticals (processor_id, vertical_id, approval_likelihood)
select p.id, v.id, 'confirmed'
from processors p, verticals v
where p.slug = 'adyen'
  and v.name in ('ecommerce','marketplace','fintech','travel','saas','subscription');

-- ============================================================
-- Processor countries (client_geo — where they accept payments from)
-- ============================================================

-- Stripe: accepts from EU + US + CA + AU + SG + others (compliant countries)
insert into processor_countries (processor_id, country_id, role, is_supported)
select p.id, c.id, 'client_geo', true
from processors p, countries c
where p.slug = 'stripe'
  and c.fatf_status = 'compliant'
  and c.is_sanctioned = false;

-- PayKings: accepts from most non-sanctioned countries
insert into processor_countries (processor_id, country_id, role, is_supported)
select p.id, c.id, 'client_geo', true
from processors p, countries c
where p.slug = 'paykings'
  and c.is_sanctioned = false;

-- NOWPayments: global (non-sanctioned)
insert into processor_countries (processor_id, country_id, role, is_supported)
select p.id, c.id, 'client_geo', true
from processors p, countries c
where p.slug = 'nowpayments'
  and c.is_sanctioned = false;

-- Cryptomus: global (non-sanctioned)
insert into processor_countries (processor_id, country_id, role, is_supported)
select p.id, c.id, 'client_geo', true
from processors p, countries c
where p.slug = 'cryptomus'
  and c.is_sanctioned = false;

-- ============================================================
-- Processor payment methods
-- ============================================================

insert into processor_payment_methods (processor_id, payment_method_id)
select p.id, pm.id
from processors p, payment_methods pm
where p.slug = 'stripe'
  and pm.name in ('Visa / Mastercard','American Express','ACH / Bank Transfer','SEPA');

insert into processor_payment_methods (processor_id, payment_method_id)
select p.id, pm.id
from processors p, payment_methods pm
where p.slug = 'paykings'
  and pm.name in ('Visa / Mastercard','American Express');

insert into processor_payment_methods (processor_id, payment_method_id)
select p.id, pm.id
from processors p, payment_methods pm
where p.slug = 'nowpayments'
  and pm.name in ('Bitcoin','Ethereum','USDT (TRC-20)','USDT (ERC-20)','USDC','Litecoin','Monero');

insert into processor_payment_methods (processor_id, payment_method_id)
select p.id, pm.id
from processors p, payment_methods pm
where p.slug = 'cryptomus'
  and pm.name in ('Bitcoin','Ethereum','USDT (TRC-20)','USDT (ERC-20)','USDC');

insert into processor_payment_methods (processor_id, payment_method_id)
select p.id, pm.id
from processors p, payment_methods pm
where p.slug = 'adyen'
  and pm.name in ('Visa / Mastercard','American Express','SEPA','PayPal','Klarna','iDEAL','Bancontact');
-- Row Level Security policies for PayMap

-- Enable RLS on all tables
alter table segments               enable row level security;
alter table payment_methods        enable row level security;
alter table verticals              enable row level security;
alter table countries              enable row level security;
alter table processors             enable row level security;
alter table processor_payment_methods enable row level security;
alter table processor_countries    enable row level security;
alter table processor_verticals    enable row level security;
alter table volume_tiers           enable row level security;
alter table profiles               enable row level security;
alter table reviews                enable row level security;
alter table user_alerts            enable row level security;
alter table saved_cascades         enable row level security;
alter table presets                enable row level security;
alter table preset_processors      enable row level security;
alter table scraper_jobs           enable row level security;
alter table data_change_log        enable row level security;

-- ============================================================
-- PUBLIC READ — reference data (anyone can read)
-- ============================================================

create policy "public read segments"
  on segments for select using (true);

create policy "public read payment_methods"
  on payment_methods for select using (true);

create policy "public read verticals"
  on verticals for select using (true);

create policy "public read countries"
  on countries for select using (true);

create policy "public read active processors"
  on processors for select using (status = 'active');

create policy "public read processor_payment_methods"
  on processor_payment_methods for select using (true);

create policy "public read processor_countries"
  on processor_countries for select using (true);

create policy "public read processor_verticals"
  on processor_verticals for select using (true);

create policy "public read volume_tiers"
  on volume_tiers for select using (true);

create policy "public read presets"
  on presets for select using (true);

create policy "public read preset_processors"
  on preset_processors for select using (true);

create policy "public read approved reviews"
  on reviews for select using (moderation_status = 'approved');

-- ============================================================
-- SERVICE ROLE WRITE — reference and automation data
-- ============================================================

create policy "service write segments"
  on segments for all using (auth.role() = 'service_role');

create policy "service write payment_methods"
  on payment_methods for all using (auth.role() = 'service_role');

create policy "service write verticals"
  on verticals for all using (auth.role() = 'service_role');

create policy "service write countries"
  on countries for all using (auth.role() = 'service_role');

create policy "service write processors"
  on processors for all using (auth.role() = 'service_role');

create policy "service write processor_payment_methods"
  on processor_payment_methods for all using (auth.role() = 'service_role');

create policy "service write processor_countries"
  on processor_countries for all using (auth.role() = 'service_role');

create policy "service write processor_verticals"
  on processor_verticals for all using (auth.role() = 'service_role');

create policy "service write volume_tiers"
  on volume_tiers for all using (auth.role() = 'service_role');

create policy "service write presets"
  on presets for all using (auth.role() = 'service_role');

create policy "service write preset_processors"
  on preset_processors for all using (auth.role() = 'service_role');

create policy "service write scraper_jobs"
  on scraper_jobs for all using (auth.role() = 'service_role');

create policy "service write data_change_log"
  on data_change_log for all using (auth.role() = 'service_role');

-- ============================================================
-- AUTHENTICATED USERS — own data only
-- ============================================================

-- Profiles: user sees and edits only their own
create policy "user read own profile"
  on profiles for select using (auth.uid() = id);

create policy "user update own profile"
  on profiles for update using (auth.uid() = id);

create policy "user insert own profile"
  on profiles for insert with check (auth.uid() = id);

-- Reviews: any authenticated user can create; only own reviews editable
create policy "auth user create review"
  on reviews for insert with check (auth.uid() = user_id);

create policy "user read own reviews"
  on reviews for select using (auth.uid() = user_id);

create policy "user update own review"
  on reviews for update using (auth.uid() = user_id);

create policy "user delete own review"
  on reviews for delete using (auth.uid() = user_id);

-- Alerts: user manages only their own
create policy "user manage own alerts"
  on user_alerts for all using (auth.uid() = user_id);

-- Cascades: user manages only their own
create policy "user manage own cascades"
  on saved_cascades for all using (auth.uid() = user_id);

-- Scraper jobs: admin read only
create policy "admin read scraper_jobs"
  on scraper_jobs for select using (auth.role() = 'service_role');

-- Change log: admin read only
create policy "admin read data_change_log"
  on data_change_log for select using (auth.role() = 'service_role');
-- Smart search function: find processors by geo + volume + max fee + optional filters
-- Returns processors with the matching volume tier already resolved

create or replace function search_processors(
  p_country_code    text,           -- ISO 3166-1 alpha-2, e.g. 'KZ'
  p_volume_usd      numeric,        -- monthly volume in USD
  p_fee_max_pct     numeric,        -- max acceptable fee %, e.g. 4.5
  p_segment_slug    text    default null,  -- filter by segment slug
  p_vertical_name   text    default null,  -- filter by vertical name
  p_method_type     text    default null   -- filter by payment method type: fiat|crypto|local|bank
)
returns table (
  processor_id          uuid,
  processor_name        text,
  processor_slug        text,
  segment_slug          text,
  segment_display_name  text,
  kyc_level             text,
  onboarding_days_min   int,
  onboarding_days_max   int,
  api_quality_score     int,
  is_verified           boolean,
  is_featured           boolean,
  website_url           text,
  fee_percentage        numeric,
  fee_fixed_usd         numeric,
  settlement_currency   text[],
  settlement_days_min   int,
  settlement_days_max   int,
  rolling_reserve_pct   numeric,
  rolling_reserve_days  int,
  chargeback_limit_pct  numeric,
  approval_likelihood   text,
  country_is_sanctioned boolean,
  country_fatf_status   text,
  last_verified_at      timestamptz
)
language sql stable security definer as $$
  select distinct on (p.id)
    p.id,
    p.name,
    p.slug,
    s.slug,
    s.display_name,
    p.kyc_level,
    p.onboarding_days_min,
    p.onboarding_days_max,
    p.api_quality_score,
    p.is_verified,
    p.is_featured,
    p.website_url,
    vt.fee_percentage,
    vt.fee_fixed_usd,
    vt.settlement_currency,
    vt.settlement_days_min,
    vt.settlement_days_max,
    vt.rolling_reserve_percentage,
    vt.rolling_reserve_days,
    vt.chargeback_limit_percentage,
    pv.approval_likelihood,
    c.is_sanctioned,
    c.fatf_status,
    p.last_verified_at
  from processors p
  join segments s on s.id = p.segment_id

  -- match volume tier
  join volume_tiers vt on vt.processor_id = p.id
    and vt.volume_min_usd <= p_volume_usd
    and (vt.volume_max_usd is null or vt.volume_max_usd >= p_volume_usd)
    and (vt.fee_percentage is null or vt.fee_percentage <= p_fee_max_pct)

  -- match client geo
  join processor_countries pc on pc.processor_id = p.id and pc.role = 'client_geo' and pc.is_supported = true
  join countries c on c.id = pc.country_id and c.code = upper(p_country_code)

  -- optional vertical filter
  left join processor_verticals pv on pv.processor_id = p.id

  -- optional payment method type filter
  left join processor_payment_methods ppm on ppm.processor_id = p.id
  left join payment_methods pm on pm.id = ppm.payment_method_id

  where p.status = 'active'
    and c.is_sanctioned = false               -- never return sanctioned country results
    and c.fatf_status != 'black_list'         -- block FATF black list
    and (p_segment_slug is null or s.slug = p_segment_slug)
    and (p_vertical_name is null or exists (
      select 1 from processor_verticals pv2
      join verticals v on v.id = pv2.vertical_id
      where pv2.processor_id = p.id and v.name = p_vertical_name
    ))
    and (p_method_type is null or exists (
      select 1 from processor_payment_methods ppm2
      join payment_methods pm2 on pm2.id = ppm2.payment_method_id
      where ppm2.processor_id = p.id and pm2.type = p_method_type
    ))

  order by
    p.id,
    p.is_featured desc,       -- featured processors first
    p.is_verified desc,       -- verified second
    vt.fee_percentage asc,    -- lower fee is better
    p.api_quality_score desc  -- better API quality
$$;

-- Example usage:
-- select * from search_processors('KZ', 50000, 4.0, 'high_risk_fiat', 'igaming', 'fiat');
-- select * from search_processors('BR', 10000, 3.0, 'business', null, null);
-- select * from search_processors('NG', 20000, 1.0, 'high_risk_crypto', 'gambling', 'crypto');
