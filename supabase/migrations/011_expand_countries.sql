-- ============================================================
-- Migration 011: expand country coverage
-- Adds offshore financial centers and missed markets that matter
-- for high-risk fiat, crypto, and alternative payment processors.
-- ============================================================

insert into countries (code, name, name_ru, region, fatf_status, is_sanctioned, sanction_details, dominant_payment_methods) values

-- OFFSHORE FINANCIAL CENTERS (critical for high_risk and alternative segments)
('LI', 'Liechtenstein',     'Лихтенштейн',    'eu',     'compliant', false, null, '{visa_mastercard,sepa}'),
('AD', 'Andorra',            'Андорра',         'eu',     'compliant', false, null, '{visa_mastercard,sepa}'),
('MC', 'Monaco',             'Монако',          'eu',     'compliant', false, null, '{visa_mastercard,sepa}'),
('SM', 'San Marino',         'Сан-Марино',      'eu',     'compliant', false, null, '{visa_mastercard,sepa}'),
('VA', 'Vatican',            'Ватикан',         'eu',     'compliant', false, null, '{visa_mastercard,sepa}'),
('KY', 'Cayman Islands',     'Каймановы Острова','latam', 'compliant', false, null, '{visa_mastercard,crypto}'),
('VG', 'British Virgin Islands','Британские Виргинские острова','latam','compliant', false, null, '{visa_mastercard,crypto}'),
('BM', 'Bermuda',            'Бермуды',         'latam',  'compliant', false, null, '{visa_mastercard,crypto}'),
('BS', 'Bahamas',            'Багамы',          'latam',  'compliant', false, null, '{visa_mastercard,crypto}'),
('MU', 'Mauritius',          'Маврикий',        'africa', 'compliant', false, null, '{visa_mastercard,m-pesa}'),
('SC', 'Seychelles',         'Сейшелы',         'africa', 'compliant', false, null, '{visa_mastercard,crypto}'),
('AI', 'Anguilla',           'Ангилья',         'latam',  'compliant', false, null, '{visa_mastercard,crypto}'),
('TC', 'Turks and Caicos',   'Тёркс и Кайкос',  'latam',  'compliant', false, null, '{visa_mastercard}'),

-- LATIN AMERICA / CARIBBEAN gaps
('DO', 'Dominican Republic', 'Доминиканская Республика','latam','compliant', false, null, '{visa_mastercard}'),
('JM', 'Jamaica',            'Ямайка',          'latam',  'compliant', false, null, '{visa_mastercard}'),
('TT', 'Trinidad and Tobago','Тринидад и Тобаго','latam', 'compliant', false, null, '{visa_mastercard}'),
('HT', 'Haiti',              'Гаити',           'latam',  'grey_list', false, null, '{visa_mastercard,crypto}'),
('HN', 'Honduras',           'Гондурас',        'latam',  'compliant', false, null, '{visa_mastercard}'),
('NI', 'Nicaragua',          'Никарагуа',       'latam',  'grey_list', false, null, '{visa_mastercard,crypto}'),

-- BALKANS
('AL', 'Albania',            'Албания',         'eu',     'grey_list', false, null, '{visa_mastercard,sepa}'),
('MK', 'North Macedonia',    'Северная Македония','eu',   'compliant', false, null, '{visa_mastercard,sepa}'),
('RS', 'Serbia',             'Сербия',          'eu',     'compliant', false, null, '{visa_mastercard,sepa}'),
('ME', 'Montenegro',         'Черногория',      'eu',     'compliant', false, null, '{visa_mastercard,sepa}'),
('BA', 'Bosnia and Herzegovina','Босния и Герцеговина','eu','compliant', false, null, '{visa_mastercard,sepa}'),
('XK', 'Kosovo',             'Косово',          'eu',     'compliant', false, null, '{visa_mastercard,sepa}'),

-- AFRICA missed
('ZW', 'Zimbabwe',           'Зимбабве',        'africa', 'grey_list', false, null, '{m-pesa,crypto}'),
('BW', 'Botswana',           'Ботсвана',        'africa', 'compliant', false, null, '{visa_mastercard}'),
('NA', 'Namibia',            'Намибия',         'africa', 'compliant', false, null, '{visa_mastercard}'),
('MG', 'Madagascar',         'Мадагаскар',      'africa', 'compliant', false, null, '{mtn_mobile_money}'),
('CD', 'DR Congo',           'ДР Конго',        'africa', 'compliant', false, null, '{mtn_mobile_money,orange_money}'),

-- APAC missed
('BN', 'Brunei',             'Бруней',          'apac',   'compliant', false, null, '{visa_mastercard}'),
('MN', 'Mongolia',           'Монголия',        'apac',   'compliant', false, null, '{visa_mastercard}'),
('MV', 'Maldives',           'Мальдивы',        'apac',   'compliant', false, null, '{visa_mastercard}')

ON CONFLICT (code) DO NOTHING;
