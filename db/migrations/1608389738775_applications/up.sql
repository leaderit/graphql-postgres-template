CREATE TABLE public.applications (
    id uuid DEFAULT public.uuid_generate_v1mc() NOT NULL,
    client_id text NOT NULL,
    client_secret text NOT NULL
);
ALTER TABLE ONLY public.applications
    ADD CONSTRAINT applications_client_id_key UNIQUE (client_id);
ALTER TABLE ONLY public.applications
    ADD CONSTRAINT applications_pkey PRIMARY KEY (id);
