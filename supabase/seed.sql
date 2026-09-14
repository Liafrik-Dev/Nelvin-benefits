-- ============================================================================
-- Nelvin Benefits — seed data
--
-- Starter categories, countries, plans and offers so the marketplace is not
-- empty on a fresh Supabase project. Idempotent (upserts by natural keys).
-- Run AFTER 0001_init.sql:
--    psql "$DATABASE_URL" -f supabase/seed.sql
-- ============================================================================

-- ------------------------------ categories --------------------------------
insert into public.categories (name, slug, description, icon, display_order, is_active, is_enabled, is_featured)
values
  ('Restaurants & Cafés', 'restaurants-cafes', 'Dining deals at top restaurants and cafés', 'utensils', 1, true, true, true),
  ('Hotels & Resorts', 'hotels-resorts', 'Hand-picked hotels, resorts and stays worldwide', 'hotel', 2, true, true, true),
  ('Travel & Airlines', 'travel-airlines', 'Flights, getaways and holidays at member-only rates', 'plane', 3, true, true, true),
  ('Entertainment', 'entertainment', 'Cinema, live events, gaming and streaming', 'clapperboard', 4, true, true, true),
  ('Shopping & Fashion', 'shopping-fashion', 'Cashback and discounts across retail and e-commerce', 'shopping-bag', 5, true, true, true),
  ('Beauty & Spa', 'beauty-spa', 'Salons, grooming and self-care indulgences', 'sparkles', 6, true, true, true),
  ('Healthcare', 'healthcare', 'Clinics, telemedicine, dental and optical care', 'stethoscope', 7, true, true, true),
  ('Fitness & Sports', 'fitness-sports', 'Gym memberships, classes and athletic gear savings', 'dumbbell', 8, true, true, true),
  ('Education', 'education', 'Courses, tutoring and lifelong learning benefits', 'graduation-cap', 9, true, true, false),
  ('Automotive', 'automotive', 'Fuel, servicing, rides and vehicle benefits', 'car', 10, true, true, false),
  ('Professional Services', 'professional-services', 'Legal, accounting and business services', 'briefcase', 11, true, true, false),
  ('Home Services', 'home-services', 'Furniture, utilities and home services savings', 'home', 12, true, true, false)
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  icon = excluded.icon,
  display_order = excluded.display_order,
  is_active = true;

-- ------------------------------- countries --------------------------------
insert into public.countries (name, slug, flag, image_url, is_active, display_order)
values
  ('Nigeria', 'nigeria', '🇳🇬', 'https://images.unsplash.com/photo-1618828665011-0abd973f7bb8?w=400&q=80', true, 1),
  ('South Africa', 'south-africa', '🇿🇦', 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=400&q=80', true, 2),
  ('Kenya', 'kenya', '🇰🇪', 'https://images.unsplash.com/photo-1489392191049-fc10c97e64b6?w=400&q=80', true, 3),
  ('Morocco', 'morocco', '🇲🇦', 'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=400&q=80', true, 4),
  ('Egypt', 'egypt', '🇪🇬', 'https://images.unsplash.com/photo-1553913861-c0fddf2619ee?w=400&q=80', true, 5),
  ('Ghana', 'ghana', '🇬🇭', 'https://images.unsplash.com/photo-1582650949050-07e61ed5cf27?w=400&q=80', true, 6),
  ('Tanzania', 'tanzania', '🇹🇿', 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=400&q=80', true, 7),
  ('Rwanda', 'rwanda', '🇷🇼', 'https://images.unsplash.com/photo-1580745294857-df41bfb44e4b?w=400&q=80', true, 8),
  ('Côte d''Ivoire', 'cote-divoire', '🇨🇮', 'https://images.unsplash.com/photo-1618828665011-0abd973f7bb8?w=400&q=80', true, 9),
  ('Senegal', 'senegal', '🇸🇳', 'https://images.unsplash.com/photo-1618828665011-0abd973f7bb8?w=400&q=80', true, 10)
on conflict (slug) do update set
  flag = excluded.flag,
  image_url = excluded.image_url,
  is_active = true;

-- ---------------------------- membership_plans ----------------------------
insert into public.membership_plans (name, tier, price_monthly, price_yearly, currency, description, benefits, display_order, color, is_active, seats_included, is_corporate)
values
  ('Free', 'free', 0, 0, 'USD', 'For individuals', 'Find & redeem offers', 1, '#64748b', true, 0, false),
  ('Premium', 'premium', 9, 90, 'USD', 'Most popular choice', 'Everything in Free, plus\nUnlimited redemptions, cashback, priority support', 2, '#00BD00', true, 0, false),
  ('VIP', 'vip', 29, 290, 'USD', 'The full luxury experience', 'Everything in Premium, plus\nConcierge, airport lounge, luxury partners', 3, '#eab308', true, 0, false),
  ('Enterprise', 'enterprise', 0, 0, 'USD', 'For businesses', 'Custom plans, analytics, SSO', 5, '#082F24', true, 100, true)
on conflict (tier) do update set
  price_monthly = excluded.price_monthly,
  price_yearly = excluded.price_yearly,
  description = excluded.description,
  benefits = excluded.benefits,
  is_active = true;

-- -------------------------------- offers ----------------------------------
insert into public.offers
  (title, business_name, description, image_url, discount_label, category, country, city, rating, reviews,
   original_price, discount_price, savings_amount, tag, status, is_published, is_featured, membership_requirement,
   max_redemptions_per_user, total_redemptions_count, expires_date)
values
  ('25% Off Fine Dining — The Signature Grill', 'The Signature Grill', 'Enjoy 25% off fine dining at The Signature Grill. This exclusive offer is available to active Nelvin members.',
   'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80', '25% Off Fine Dining', 'Restaurants & Cafés', 'Nigeria', 'Lagos', 4.8, 132, 200, 150, 50, 'Popular', 'active', true, true, 'All', 1, 0, now() + interval '30 days'),
  ('30% Off Weekend Getaways — Sunrise Resorts', 'Sunrise Resorts', 'Enjoy 30% off weekend getaways at Sunrise Resorts.',
   'https://images.unsplash.com/photo-1506878206813-92402b8ded23?w=800&q=80', '30% Off Weekend Getaways', 'Hotels & Resorts', 'South Africa', 'Cape Town', 4.7, 89, 450, 315, 135, 'Trending', 'active', true, true, 'All', 1, 0, now() + interval '45 days'),
  ('Up to 40% Off Flights — AeroSkies Airlines', 'AeroSkies Airlines', 'Fly smarter with up to 40% off flights across the AeroSkies network.',
   'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80', 'Up to 40% Off Flights', 'Travel & Airlines', 'Kenya', 'Nairobi', 4.6, 210, 800, 480, 320, 'Exclusive', 'active', true, true, 'All', 2, 0, now() + interval '60 days'),
  ('2 Months Free — FitHub Gym', 'FitHub Gym', 'Get 2 months free on any annual FitHub membership plan.',
   'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80', '2 Months Free', 'Fitness & Sports', 'Ghana', 'Accra', 4.5, 74, 300, 250, 50, 'New', 'active', true, true, 'All', 1, 0, now() + interval '30 days'),
  ('20% Off Vitamins & Care — Glow Pharmacy', 'Glow Pharmacy', 'Save 20% on vitamins, supplements and personal care at Glow Pharmacy.',
   'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=800&q=80', '20% Off', 'Healthcare', 'Morocco', 'Casablanca', 4.9, 56, 60, 48, 12, 'Popular', 'active', true, false, 'All', 3, 0, now() + interval '20 days'),
  ('Buy 1 Get 1 — Urban Threads Weekend', 'Urban Threads', 'Buy one item, get the second free, every weekend at Urban Threads.',
   'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80', 'BOGO', 'Shopping & Fashion', 'Egypt', 'Cairo', 4.4, 190, 100, 50, 50, 'Limited Time', 'active', true, true, 'All', 2, 0, now() + interval '15 days'),
  ('₦20,000 Off Gadgets — TechNova Store', 'TechNova Store', 'Get ₦20,000 off selected gadgets and electronics at TechNova Store.',
   'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&q=80', '₦20,000 Off', 'Shopping & Fashion', 'Nigeria', 'Lagos', 4.7, 110, 350, 300, 50, 'Trending', 'active', true, false, 'Gold', 1, 0, now() + interval '40 days'),
  ('35% Off Spa Packages — La Belle Spa', 'La Belle Spa', 'Pamper yourself with 35% off full spa packages at La Belle Spa.',
   'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80', '35% Off', 'Beauty & Spa', 'Tanzania', 'Dar es Salaam', 4.8, 67, 250, 162, 88, 'Popular', 'active', true, false, 'All', 1, 0, now() + interval '25 days'),
  ('50% Off Movie Tickets — CinemaMax', 'CinemaMax', 'Enjoy 50% off movie tickets at CinemaMax on weekdays.',
   'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&q=80', '50% Off', 'Entertainment', 'Rwanda', 'Kigali', 4.3, 145, 20, 10, 10, 'New', 'active', true, false, 'All', 4, 0, now() + interval '30 days')
on conflict (id) do nothing;