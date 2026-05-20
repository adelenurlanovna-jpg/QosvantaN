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
