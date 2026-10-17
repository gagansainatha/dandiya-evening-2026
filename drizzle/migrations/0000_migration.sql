CREATE TYPE public.app_role AS ENUM ('organiser');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own roles" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE TABLE public.registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  full_name text NOT NULL CHECK (char_length(full_name) BETWEEN 2 AND 100),
  usn text NOT NULL CHECK (usn ~ '^[A-Z0-9]{4,20}$'),
  department text NOT NULL CHECK (department IN ('CS Engineering','CSE IN A.I & M.L Engineering','A.I & M.L Engineering','EC Engineering','CSE IN D.S. Engineering','Mechanical Engineering','Civil Engineering','VVIMS')),
  semester smallint NOT NULL CHECK (semester BETWEEN 1 AND 10),
  email text NOT NULL CHECK (char_length(email) <= 255 AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  phone text CHECK (phone IS NULL OR phone ~ '^\+?[0-9 ]{7,15}$'),
  attendance text NOT NULL CHECK (attendance IN ('Definitely attending','Very likely','Maybe','Not sure yet')),
  dandiya_interest text CHECK (dandiya_interest IS NULL OR dandiya_interest IN ('Yes','No','Maybe')),
  activities text[] NOT NULL DEFAULT '{}' CHECK (activities <@ ARRAY['Group dance','Solo dance','Singing','Ramp walk','Other performance','Volunteer','Stall','Other']::text[]),
  other_activity text CHECK (other_activity IS NULL OR char_length(other_activity) <= 200),
  stall_interest text CHECK (stall_interest IS NULL OR stall_interest IN ('Yes','No','Maybe')),
  stall_details text CHECK (stall_details IS NULL OR char_length(stall_details) <= 1000),
  suggestions text CHECK (suggestions IS NULL OR char_length(suggestions) <= 1000),
  eligibility_confirmed boolean NOT NULL CHECK (eligibility_confirmed = true),
  CONSTRAINT registrations_usn_unique UNIQUE (usn)
);
CREATE INDEX registrations_created_at_idx ON public.registrations (created_at DESC);
CREATE INDEX registrations_department_idx ON public.registrations (department);
CREATE INDEX registrations_attendance_idx ON public.registrations (attendance);

GRANT INSERT ON public.registrations TO anon;
GRANT SELECT ON public.registrations TO authenticated;
GRANT ALL ON public.registrations TO service_role;
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit a registration" ON public.registrations FOR INSERT TO anon WITH CHECK (eligibility_confirmed = true);
CREATE POLICY "Organisers can read registrations" ON public.registrations FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'organiser'));