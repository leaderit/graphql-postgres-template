CREATE FUNCTION public.set_current_timestamp_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  _new record;
BEGIN
  _new := NEW;
  _new."updated_at" = NOW();
  RETURN _new;
END;
$$;
CREATE TABLE public.applications (
    id uuid DEFAULT public.uuid_generate_v1mc() NOT NULL,
    client_id text NOT NULL,
    client_secret text NOT NULL
);
COMMENT ON TABLE public.applications IS 'Applications access list. Every application must provide it''s own client_id and client_secret for backend access.';
CREATE TABLE public.files (
    id uuid DEFAULT public.uuid_generate_v1mc() NOT NULL,
    name text,
    filename text,
    owner_id uuid,
    org_id uuid,
    type text,
    public boolean DEFAULT false NOT NULL,
    access integer DEFAULT 0,
    descr text,
    size integer DEFAULT 0,
    "group" text
);
CREATE TABLE public.orgs (
    id uuid DEFAULT public.uuid_generate_v1mc() NOT NULL,
    name text,
    owner_id uuid,
    descr text
);
CREATE TABLE public.orgusers (
    id uuid DEFAULT public.uuid_generate_v1mc() NOT NULL,
    org_id uuid NOT NULL,
    user_id uuid NOT NULL,
    role_id integer DEFAULT 1000
);
CREATE SEQUENCE public.roles_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 2147483647
    CACHE 1;
CREATE TABLE public.roles (
    id integer DEFAULT nextval('public.roles_id_seq'::regclass) NOT NULL,
    name text NOT NULL,
    access json
);
CREATE TABLE public.users (
    id uuid DEFAULT public.uuid_generate_v1mc() NOT NULL,
    name text,
    login text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    password text,
    role_id integer DEFAULT 1000,
    org_id uuid
);
COMMENT ON TABLE public.users IS 'Application Users';
COMMENT ON COLUMN public.users.org_id IS 'Selected organisation id';
ALTER TABLE ONLY public.applications
    ADD CONSTRAINT applications_client_id_key UNIQUE (client_id);
ALTER TABLE ONLY public.applications
    ADD CONSTRAINT applications_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.files
    ADD CONSTRAINT files_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.orgs
    ADD CONSTRAINT orgs_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.orgusers
    ADD CONSTRAINT orgusers_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key UNIQUE (name);
ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_login_key UNIQUE (login);
ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_login_password_key UNIQUE (login, password);
ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);
CREATE TRIGGER set_public_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
COMMENT ON TRIGGER set_public_users_updated_at ON public.users IS 'trigger to set value of column "updated_at" to current timestamp on row update';
ALTER TABLE ONLY public.files
    ADD CONSTRAINT files_org_id_fkey FOREIGN KEY (org_id) REFERENCES public.orgs(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.files
    ADD CONSTRAINT files_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.orgs
    ADD CONSTRAINT orgs_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.orgusers
    ADD CONSTRAINT orgusers_org_id_fkey FOREIGN KEY (org_id) REFERENCES public.orgs(id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE ONLY public.orgusers
    ADD CONSTRAINT orgusers_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(id) ON UPDATE CASCADE ON DELETE SET DEFAULT;
ALTER TABLE ONLY public.orgusers
    ADD CONSTRAINT orgusers_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;
