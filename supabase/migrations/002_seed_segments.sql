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
