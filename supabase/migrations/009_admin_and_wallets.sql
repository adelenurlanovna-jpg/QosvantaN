-- ============================================================
-- Migration 009: admin role + wallets segment + wallet seeds
-- ============================================================

-- Admin role on profiles (for /admin/* routes)
alter table profiles
  add column if not exists is_admin boolean not null default false;

create index if not exists profiles_admin_idx on profiles (is_admin) where is_admin = true;

-- ============================================================
-- New segment: wallets (Antarctica Wallet, TON Wallet, Trust, etc.)
-- ============================================================
insert into segments (slug, display_name, description, ui_tone, requires_tos_acceptance) values
(
  'wallets',
  'Wallets',
  'Self-custodial and custodial crypto wallets — for direct receive/send without an acquirer',
  'technical',
  true
)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- Seed: wallet providers (initial curated list)
-- All start as is_verified=true since manually curated; auto-scraped ones will be is_verified=false
-- ============================================================
insert into processors
  (name, slug, segment_id, description, website_url, scraper_url, kyc_level,
   onboarding_days_min, onboarding_days_max, api_quality_score, is_verified, status)
values
  ('Antarctica Wallet',  'antarctica-wallet', (select id from segments where slug='wallets'),
   'Non-custodial multi-chain wallet popular for anonymous OTC and offshore flows.',
   'https://antarctica.io', 'https://antarctica.io', 'none', 0, 1, 3, true, 'active'),
  ('TON Wallet',         'ton-wallet',        (select id from segments where slug='wallets'),
   'Official wallet for The Open Network (TON). Used widely in Telegram ecosystem and CIS.',
   'https://wallet.ton.org', 'https://wallet.ton.org', 'none', 0, 1, 4, true, 'active'),
  ('Trust Wallet',       'trust-wallet',      (select id from segments where slug='wallets'),
   'Self-custodial mobile wallet by Binance. Supports 70+ chains and dApp browser.',
   'https://trustwallet.com', 'https://trustwallet.com', 'none', 0, 1, 4, true, 'active'),
  ('MetaMask',           'metamask',          (select id from segments where slug='wallets'),
   'Browser and mobile wallet — de-facto standard for Ethereum and EVM chains.',
   'https://metamask.io', 'https://metamask.io', 'none', 0, 1, 5, true, 'active'),
  ('Phantom',            'phantom',           (select id from segments where slug='wallets'),
   'Leading wallet for Solana. Also supports Ethereum, Bitcoin, Polygon.',
   'https://phantom.app', 'https://phantom.app', 'none', 0, 1, 5, true, 'active'),
  ('Tonkeeper',          'tonkeeper',         (select id from segments where slug='wallets'),
   'Self-custodial TON wallet with merchant API and recurring payments support.',
   'https://tonkeeper.com', 'https://tonkeeper.com', 'none', 0, 1, 4, true, 'active'),
  ('Exodus',             'exodus',            (select id from segments where slug='wallets'),
   'Multi-asset desktop and mobile wallet with built-in exchange and staking.',
   'https://exodus.com', 'https://exodus.com', 'none', 0, 1, 4, true, 'active'),
  ('Ledger Live',        'ledger-live',       (select id from segments where slug='wallets'),
   'Companion software for Ledger hardware wallets. Hot+cold hybrid flows.',
   'https://ledger.com/ledger-live', 'https://ledger.com/ledger-live', 'none', 0, 1, 4, true, 'active'),
  ('Trezor Suite',       'trezor-suite',      (select id from segments where slug='wallets'),
   'Companion software for Trezor hardware wallets. Open-source ecosystem.',
   'https://trezor.io/trezor-suite', 'https://trezor.io/trezor-suite', 'none', 0, 1, 3, true, 'active'),
  ('Bitget Wallet',      'bitget-wallet',     (select id from segments where slug='wallets'),
   'Multi-chain Web3 wallet (formerly BitKeep). Strong APAC and TRC-20 support.',
   'https://web3.bitget.com', 'https://web3.bitget.com', 'none', 0, 1, 4, true, 'active'),
  ('OKX Wallet',         'okx-wallet',        (select id from segments where slug='wallets'),
   'Web3 wallet from OKX exchange. Supports 80+ chains plus DeFi/NFT.',
   'https://okx.com/web3', 'https://okx.com/web3', 'none', 0, 1, 4, true, 'active'),
  ('SafePal',            'safepal',           (select id from segments where slug='wallets'),
   'Binance-backed wallet (hardware + software). Strong in emerging markets.',
   'https://safepal.com', 'https://safepal.com', 'none', 0, 1, 3, true, 'active')
ON CONFLICT (slug) DO NOTHING;
