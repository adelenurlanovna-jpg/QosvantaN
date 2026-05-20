-- PayMap Database Schema
create extension if not exists "uuid-ossp";

-- ============================================================
-- GROUP 1: CORE
-- ============================================================

create table if not exists segments (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  display_name text not null,
  description text,
  ui_tone text not null,
  requires_tos_acceptance boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists payment_methods (
  id uuid primary key default uuid_generate_v4(),
  name text unique not null,
  type text not null check (type in ('fiat', 'crypto', 'local', 'bank')),
  icon_url text,
  created_at timestamptz not null default now()
);

create table if not exists verticals (
  id uuid primary key default uuid_generate_v4(),
  name text unique not null,
  display_name text not null,
  risk_level text not null check (risk_level in ('low', 'medium', 'high', 'very_high')),
  created_at timestamptz not null default now()
);

-- ============================================================
-- GROUP 2: GEO
-- ============================================================

create table if not exists countries (
  id uuid primary key default uuid_generate_v4(),
  code char(2) unique not null,
  name text not null,
  name_ru text,
  region text not null check (region in ('eu', 'apac', 'latam', 'africa', 'mena', 'cis', 'na', 'oceania')),
  fatf_status text not null default 'compliant' check (fatf_status in ('compliant', 'grey_list', 'black_list')),
  is_sanctioned boolean not null default false,
  sanction_details text,
  dominant_payment_methods text[],
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists countries_code_idx on countries (code);
create index if not exists countries_fatf_idx on countries (fatf_status);
create index if not exists countries_sanctioned_idx on countries (is_sanctioned);

-- ============================================================
-- GROUP 3: PROCESSORS
-- ============================================================

create table if not exists processors (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text unique not null,
  segment_id uuid not null references segments (id),
  description text,
  website_url text,
  scraper_url text,
  logo_url text,
  kyc_level text not null default 'standard' check (kyc_level in ('none', 'basic', 'standard', 'full')),
  onboarding_days_min int,
  onboarding_days_max int,
  api_quality_score int check (api_quality_score between 1 and 5),
  is_verified boolean not null default false,
  is_featured boolean not null default false,
  status text not null default 'pending_review' check (status in ('active', 'inactive', 'pending_review', 'flagged')),
  last_scraped_at timestamptz,
  last_verified_at timestamptz,
  page_hash text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists processors_segment_idx on processors (segment_id);
create index if not exists processors_status_idx on processors (status);
create index if not exists processors_verified_idx on processors (is_verified);
create index if not exists processors_featured_idx on processors (is_featured);

-- ============================================================
-- GROUP 4: MANY-TO-MANY RELATIONS
-- ============================================================

create table if not exists processor_payment_methods (
  processor_id uuid not null references processors (id) on delete cascade,
  payment_method_id uuid not null references payment_methods (id) on delete cascade,
  primary key (processor_id, payment_method_id)
);

create table if not exists processor_countries (
  processor_id uuid not null references processors (id) on delete cascade,
  country_id uuid not null references countries (id) on delete cascade,
  role text not null check (role in ('client_geo', 'license_jurisdiction', 'settlement_destination')),
  is_supported boolean not null default true,
  notes text,
  primary key (processor_id, country_id, role)
);

create index if not exists proc_countries_country_idx on processor_countries (country_id, role);

create table if not exists processor_verticals (
  processor_id uuid not null references processors (id) on delete cascade,
  vertical_id uuid not null references verticals (id) on delete cascade,
  approval_likelihood text not null default 'medium' check (approval_likelihood in ('low', 'medium', 'high', 'confirmed')),
  notes text,
  primary key (processor_id, vertical_id)
);

create index if not exists proc_verticals_vertical_idx on processor_verticals (vertical_id, approval_likelihood);

-- ============================================================
-- GROUP 5: PRICING
-- ============================================================

create table if not exists volume_tiers (
  id uuid primary key default uuid_generate_v4(),
  processor_id uuid not null references processors (id) on delete cascade,
  volume_min_usd numeric not null default 0,
  volume_max_usd numeric,
  fee_percentage numeric,
  fee_fixed_usd numeric,
  settlement_currency text[],
  settlement_days_min int,
  settlement_days_max int,
  rolling_reserve_percentage numeric,
  rolling_reserve_days int,
  chargeback_limit_percentage numeric,
  transaction_limit_usd numeric,
  monthly_volume_limit_usd numeric,
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists volume_tiers_processor_idx on volume_tiers (processor_id);
create index if not exists volume_tiers_volume_idx on volume_tiers (volume_min_usd, volume_max_usd);

-- ============================================================
-- GROUP 6: USER DATA
-- ============================================================

create table if not exists profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  is_verified boolean not null default false,
  verification_method text check (verification_method in ('email_domain', 'manual')),
  segment_preference uuid references segments (id),
  tos_accepted_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists reviews (
  id uuid primary key default uuid_generate_v4(),
  processor_id uuid not null references processors (id) on delete cascade,
  user_id uuid not null references profiles (id) on delete cascade,
  rating int not null check (rating between 1 and 5),
  body text,
  pros text,
  cons text,
  use_case text,
  is_verified boolean not null default false,
  moderation_status text not null default 'pending' check (moderation_status in ('pending', 'approved', 'rejected', 'flagged')),
  moderation_notes text,
  helpful_count int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists reviews_processor_idx on reviews (processor_id, moderation_status);

create table if not exists user_alerts (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references profiles (id) on delete cascade,
  processor_id uuid not null references processors (id) on delete cascade,
  alert_types text[] not null,
  is_active boolean not null default true,
  last_triggered_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists saved_cascades (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references profiles (id) on delete cascade,
  name text not null,
  steps jsonb not null,
  target_country_id uuid references countries (id),
  vertical_id uuid references verticals (id),
  monthly_volume_usd numeric,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================
-- GROUP 7: PRESETS
-- ============================================================

create table if not exists presets (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text unique not null,
  description text,
  segment_id uuid references segments (id),
  target_region text,
  vertical_id uuid references verticals (id),
  is_featured boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists preset_processors (
  preset_id uuid not null references presets (id) on delete cascade,
  processor_id uuid not null references processors (id) on delete cascade,
  role text not null check (role in ('primary', 'backup', 'fallback')),
  sort_order int not null default 0,
  notes text,
  primary key (preset_id, processor_id)
);

-- ============================================================
-- GROUP 8: AUTOMATION
-- ============================================================

create table if not exists scraper_jobs (
  id uuid primary key default uuid_generate_v4(),
  processor_id uuid not null references processors (id) on delete cascade,
  target_url text not null,
  last_run_at timestamptz,
  last_success_at timestamptz,
  next_run_at timestamptz,
  status text not null default 'pending' check (status in ('pending', 'running', 'completed', 'failed', 'changes_detected')),
  page_hash_before text,
  page_hash_after text,
  changes_detected boolean not null default false,
  raw_content text,
  error_message text,
  created_at timestamptz not null default now()
);

create table if not exists data_change_log (
  id uuid primary key default uuid_generate_v4(),
  processor_id uuid references processors (id) on delete set null,
  table_name text not null,
  field_name text not null,
  old_value text,
  new_value text,
  source text not null check (source in ('scraper', 'manual', 'community_report')),
  confirmed_by uuid references profiles (id) on delete set null,
  change_type text not null check (change_type in ('update', 'create', 'delete')),
  created_at timestamptz not null default now()
);

-- ============================================================
-- AUTO-UPDATE updated_at
-- ============================================================

create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists processors_updated_at on processors;
create trigger processors_updated_at
  before update on processors
  for each row execute function update_updated_at();

drop trigger if exists reviews_updated_at on reviews;
create trigger reviews_updated_at
  before update on reviews
  for each row execute function update_updated_at();

drop trigger if exists saved_cascades_updated_at on saved_cascades;
create trigger saved_cascades_updated_at
  before update on saved_cascades
  for each row execute function update_updated_at();
-- Seed: 4 platform segments
insert into segments (slug, display_name, description, ui_tone, requires_tos_acceptance) values
(
  'business',
  'Business',
  'Licensed e-commerce, SaaS, marketplaces, regulated fintech',
  'corporate',
  false
),
(
  'high_risk_fiat',
  'High-Risk Fiat',
  'Gambling, forex, adult, nutra — accepting Visa/Mastercard and fiat',
  'direct',
  true
),
(
  'high_risk_crypto',
  'High-Risk Crypto',
  'Crypto casinos, p2p operators, crypto-forex, iGaming with crypto deposits',
  'technical',
  true
),
(
  'alternative_dark',
  'Alternative',
  'Offshore operators, anonymous payments, unlicensed structures',
  'neutral',
  true
)
ON CONFLICT (slug) DO NOTHING;

-- Seed: payment methods
insert into payment_methods (name, type) values
('Visa / Mastercard', 'fiat'),
('American Express', 'fiat'),
('ACH / Bank Transfer', 'bank'),
('SEPA', 'bank'),
('SWIFT', 'bank'),
('PayPal', 'fiat'),
('Klarna', 'fiat'),
('iDEAL', 'local'),
('BLIK', 'local'),
('Bancontact', 'local'),
('UPI', 'local'),
('Pix', 'local'),
('M-Pesa', 'local'),
('MTN Mobile Money', 'local'),
('Orange Money', 'local'),
('СБП', 'local'),
('МИР', 'local'),
('Bitcoin', 'crypto'),
('Ethereum', 'crypto'),
('USDT (TRC-20)', 'crypto'),
('USDT (ERC-20)', 'crypto'),
('USDC', 'crypto'),
('Litecoin', 'crypto'),
('Monero', 'crypto'),
('DEX / On-chain', 'crypto')
ON CONFLICT (name) DO NOTHING;
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
