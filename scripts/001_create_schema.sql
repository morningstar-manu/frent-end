-- Linkuup Medical CRM Database Schema
-- Profiles table for user information
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'moderator', 'admin')),
  is_online BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Commercials table (sales representatives)
CREATE TABLE IF NOT EXISTS public.commercials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Appointments table
CREATE TABLE IF NOT EXISTS public.appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  commercial_id UUID REFERENCES public.commercials(id) ON DELETE SET NULL,
  full_name TEXT NOT NULL,
  phone_fixed TEXT,
  phone_mobile TEXT,
  address TEXT,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  comment TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'not-interested', 'to-be-reminded', 'longest-date')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.commercials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "profiles_select_own" ON public.profiles 
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "profiles_select_admin" ON public.profiles 
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'moderator'))
  );

CREATE POLICY "profiles_insert_own" ON public.profiles 
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_own" ON public.profiles 
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "profiles_update_admin" ON public.profiles 
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "profiles_delete_admin" ON public.profiles 
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Commercials policies (everyone can read, only admin can modify)
CREATE POLICY "commercials_select_all" ON public.commercials 
  FOR SELECT USING (TRUE);

CREATE POLICY "commercials_insert_admin" ON public.commercials 
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "commercials_update_admin" ON public.commercials 
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "commercials_delete_admin" ON public.commercials 
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Appointments policies
CREATE POLICY "appointments_select_own" ON public.appointments 
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "appointments_select_admin" ON public.appointments 
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'moderator'))
  );

CREATE POLICY "appointments_insert_own" ON public.appointments 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "appointments_update_own" ON public.appointments 
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "appointments_update_admin" ON public.appointments 
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "appointments_delete_admin" ON public.appointments 
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Trigger to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name, email, role)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data ->> 'first_name', ''),
    COALESCE(new.raw_user_meta_data ->> 'last_name', ''),
    new.email,
    COALESCE(new.raw_user_meta_data ->> 'role', 'user')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Insert some default commercials
INSERT INTO public.commercials (name, email, phone) VALUES
  ('Jean Dupont', 'jean.dupont@linkuup.com', '0123456789'),
  ('Marie Martin', 'marie.martin@linkuup.com', '0123456790'),
  ('Pierre Bernard', 'pierre.bernard@linkuup.com', '0123456791'),
  ('Sophie Petit', 'sophie.petit@linkuup.com', '0123456792'),
  ('Lucas Moreau', 'lucas.moreau@linkuup.com', '0123456793')
ON CONFLICT DO NOTHING;
