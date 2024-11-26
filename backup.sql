--
-- PostgreSQL database dump
--

-- Dumped from database version 16.3
-- Dumped by pg_dump version 16.3

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: patrick
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO patrick;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: patrick
--

COMMENT ON SCHEMA public IS '';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: patrick
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO patrick;

--
-- Name: cities; Type: TABLE; Schema: public; Owner: patrick
--

CREATE TABLE public.cities (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    slug text NOT NULL,
    name text NOT NULL,
    description text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.cities OWNER TO patrick;

--
-- Name: club_events; Type: TABLE; Schema: public; Owner: patrick
--

CREATE TABLE public.club_events (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    club_id uuid,
    day_of_week text NOT NULL,
    start_time time without time zone NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.club_events OWNER TO patrick;

--
-- Name: clubs; Type: TABLE; Schema: public; Owner: patrick
--

CREATE TABLE public.clubs (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    slug text NOT NULL,
    name text NOT NULL,
    location text,
    description text,
    instagram text,
    facebook text,
    city_id uuid,
    status character varying(50) DEFAULT 'approved'::character varying,
    submitter_email character varying(255),
    submitted_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    reviewed_at timestamp without time zone,
    reviewed_by character varying(255),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.clubs OWNER TO patrick;

--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: patrick
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
f4a11948-f2d9-4cec-af46-31e063d80fc7	69a2f9027b14451d46dc63e07bda23b26ee79f95fa110ce2eee349e8b32d2d44	2024-11-01 15:56:02.783722-07	20241101225521_init	\N	\N	2024-11-01 15:56:02.774728-07	1
\.


--
-- Data for Name: cities; Type: TABLE DATA; Schema: public; Owner: patrick
--

COPY public.cities (id, slug, name, description, created_at, updated_at) FROM stdin;
1439fb63-520a-4de1-91ec-96f778678d67	vancouver	Vancouver	Vancouver is a runner's paradise, featuring a vibrant running community and diverse terrain, from the iconic Stanley Park Seawall to scenic trails in the North Shore mountains. With a mild climate and numerous run clubs catering to all levels, the city has run clubs offering anything from casual group runs to competitive training.	2024-11-25 20:01:10.704459	2024-11-25 20:01:10.704459
4ef35cae-287f-4f05-b7d0-b37b0cc99f70	toronto	Toronto	Toronto offers a diverse running scene with numerous clubs catering to all levels of runners. From scenic routes along Lake Ontario to urban trails through parks and neighborhoods, the city provides a variety of terrains for runners to explore. With a mix of casual social runs and more structured training groups, Toronto's running clubs foster a vibrant community for fitness enthusiasts.	2024-11-25 20:01:10.704459	2024-11-25 20:01:10.704459
421f4835-c7c0-4767-86af-e9a57b225abf	kitchener-waterloo	Kitchener-Waterloo	Kitchener-Waterloo boasts a vibrant running community with various clubs catering to runners of all levels. The area features scenic trails, parks, and urban routes that provide excellent opportunities for both casual and competitive runners. Whether you're looking to improve your pace or simply enjoy a social run, there's a club for you.	2024-11-25 20:01:10.704459	2024-11-25 20:01:10.704459
c552f1a0-0ab7-4dd1-b78a-3f08f1de4471	ottawa	Ottawa	Ottawa offers a vibrant and diverse running community with several established clubs catering to different preferences and skill levels.  Most clubs maintain an inclusive atmosphere with participants ranging from their twenties to forties, making it an ideal environment for runners of all ages and abilities.	2024-11-25 20:30:40.468693	2024-11-25 20:30:40.468693
\.


--
-- Data for Name: club_events; Type: TABLE DATA; Schema: public; Owner: patrick
--

COPY public.club_events (id, club_id, day_of_week, start_time, created_at, updated_at) FROM stdin;
3b4e1fc6-b093-49dd-a9f7-6ffcc7980cda	4fefe57f-e6d0-44d8-8627-aafa5a832403	Monday	18:30:00	2024-11-25 20:01:10.704459	2024-11-25 20:01:10.704459
91fa7825-81db-4139-9c5a-57fa6e3cdd93	c492f4f1-1ae2-493a-8d02-9c2db5cad901	Friday	19:00:00	2024-11-25 20:01:10.704459	2024-11-25 20:01:10.704459
7ae41315-fb54-48e2-ad7f-149833ab5dba	298966d4-b629-4ad4-b5e9-25fb16717ec3	Wednesday	18:30:00	2024-11-25 20:01:10.704459	2024-11-25 20:01:10.704459
2618b9e2-d425-48f7-afa4-98e871ade31b	298966d4-b629-4ad4-b5e9-25fb16717ec3	Saturday	08:15:00	2024-11-25 20:01:10.704459	2024-11-25 20:01:10.704459
46ea0e28-1e77-43ee-ab2c-250b55c3cccf	20e54734-b808-4df0-8faf-7487f452c165	Thursday	06:30:00	2024-11-25 20:01:10.704459	2024-11-25 20:01:10.704459
43f40d17-d446-48ca-8345-772a7105d15d	417fd370-6a0c-4804-b1c5-c2ad730cee46	Tuesday	18:30:00	2024-11-25 20:01:10.704459	2024-11-25 20:01:10.704459
3e0267f0-51a9-4c0f-8a43-a0e11cab14bf	95a5bed5-fb1b-4d5d-97aa-a77fe4701efd	Wednesday	19:00:00	2024-11-25 20:01:10.704459	2024-11-25 20:01:10.704459
ef83a5c6-abf8-4bd8-bd06-e34b47ae5775	6e204e66-13d0-48ad-8de6-e8f875b6ebab	Wednesday	19:00:00	2024-11-25 20:01:10.704459	2024-11-25 20:01:10.704459
ce782e24-d567-46a7-8fff-9e49d87af299	2a35b901-622d-4f23-8542-32d2ecb6599d	Thursday	18:30:00	2024-11-25 20:01:10.704459	2024-11-25 20:01:10.704459
6541bc5b-72e4-40d3-9547-14f2790522eb	530c76f5-a2d6-455d-9d3c-f47c3eaf3d40	Tuesday	18:00:00	2024-11-25 20:01:10.704459	2024-11-25 20:01:10.704459
af8c0024-893e-417b-ab40-e05f9a2a281e	c8d178be-ebf9-46e3-8543-4d7bbf3e5f7a	Monday	17:30:00	2024-11-25 20:01:10.704459	2024-11-25 20:01:10.704459
0a8c955b-92ad-4933-923c-b80e06921a79	604dc859-24cf-4339-bb31-d5dc6d788830	Saturday	10:00:00	2024-11-25 20:01:10.704459	2024-11-25 20:01:10.704459
363a78b5-4eb5-4a0e-8da7-d5756104b940	604dc859-24cf-4339-bb31-d5dc6d788830	Wednesday	19:00:00	2024-11-25 20:01:10.704459	2024-11-25 20:01:10.704459
248d370d-ca14-48bd-b61a-baaa55f74b0e	604dc859-24cf-4339-bb31-d5dc6d788830	Tuesday	18:00:00	2024-11-25 20:01:10.704459	2024-11-25 20:01:10.704459
43c54a01-57e0-4e2c-b69e-978778a9e44e	660cf5d5-8866-4f2e-83de-aa32f05aeadc	Thursday	17:30:00	2024-11-25 20:01:10.704459	2024-11-25 20:01:10.704459
e6dc5ff2-cf11-40b2-9547-f34ffdea8948	660cf5d5-8866-4f2e-83de-aa32f05aeadc	Sunday	10:30:00	2024-11-25 20:01:10.704459	2024-11-25 20:01:10.704459
fa0a93b6-4bd2-41e0-8f7d-adff715af6e4	52ea36ae-1e94-46db-ae9b-f953ba3804cd	Wednesday	18:30:00	2024-11-25 20:01:10.704459	2024-11-25 20:01:10.704459
d6c464da-ef07-46ee-a750-171238ef16f6	81ce62ea-a9de-4022-a6ff-33c9a8abf678	Friday	18:00:00	2024-11-25 20:01:10.704459	2024-11-25 20:01:10.704459
47fb9996-6df9-4859-8733-3a9f4aa3f28d	81ce62ea-a9de-4022-a6ff-33c9a8abf678	Sunday	08:30:00	2024-11-25 20:01:10.704459	2024-11-25 20:01:10.704459
82bffd93-4c0a-4adc-af6a-6da91436cc12	07aa8a1f-6e14-4d1e-a5ef-3983cb6733ff	Sunday	08:00:00	2024-11-25 20:01:10.704459	2024-11-25 20:01:10.704459
c2d27b80-ff06-46cf-bfb9-ae6a8e16d234	ac1b0ffe-0423-43b6-ae11-58fb4ef7fafd	Thursday	19:15:00	2024-11-25 20:01:10.704459	2024-11-25 20:01:10.704459
50a9afc5-82cc-4f60-8a5c-db4c1dad905d	81f850b1-bdda-4bd5-84a3-6de411186286	Thursday	08:30:00	2024-11-25 20:01:10.704459	2024-11-25 20:01:10.704459
e9d18732-09d9-4a30-bfef-5205f4f885a7	e6ddef73-885b-47a6-9508-24c547e916a5	Friday	06:00:00	2024-11-25 20:01:10.704459	2024-11-25 20:01:10.704459
b37d9714-2a80-4948-9a38-2c3570ea7d7e	b8e725ee-7589-4aee-a733-3aaa4d07e8d5	Wednesday	18:30:00	2024-11-25 20:01:10.704459	2024-11-25 20:01:10.704459
4ff4b723-1e1b-4756-a7b0-4c753512bfc6	3b87e123-6e08-4106-b4b6-58a4cb8ec32f	Saturday	08:00:00	2024-11-25 20:01:10.704459	2024-11-25 20:01:10.704459
479d694b-ae91-4d10-9f11-c7d461b77fb7	78ca8592-757a-4ed4-b4ac-b6485d75b51c	Tuesday	18:00:00	2024-11-25 20:01:10.704459	2024-11-25 20:01:10.704459
a171a190-cb30-4ecf-b4d8-9a109f19b3d1	78ca8592-757a-4ed4-b4ac-b6485d75b51c	Thursday	07:00:00	2024-11-25 20:01:10.704459	2024-11-25 20:01:10.704459
825c2472-fb3b-4aa4-a708-6381bba02ecd	20b5732f-95b4-47c2-90be-84e0423b25cc	Monday	19:00:00	2024-11-25 20:01:10.704459	2024-11-25 20:01:10.704459
08efd957-d623-4613-b39e-d1fcf266cf0e	20b5732f-95b4-47c2-90be-84e0423b25cc	Wednesday	19:00:00	2024-11-25 20:01:10.704459	2024-11-25 20:01:10.704459
7fb134c3-aaec-4dcc-95b9-3db16aa82573	d1b7c466-d07a-4927-a0dc-cb59ac18f20b	Tuesday	18:30:00	2024-11-25 20:30:40.468693	2024-11-25 20:30:40.468693
15e9ff82-613c-45f9-9012-3913f9b01614	d1b7c466-d07a-4927-a0dc-cb59ac18f20b	Saturday	08:30:00	2024-11-25 20:30:40.468693	2024-11-25 20:30:40.468693
8a0f8d4d-109f-432f-b6df-880e8886d431	5eec9516-303a-4d6e-ab2d-9e115614c897	Saturday	08:00:00	2024-11-25 20:30:40.468693	2024-11-25 20:30:40.468693
ea530a5b-3b80-4dc3-b3f1-ffe9a86714be	cc4d663e-6e47-4bb5-883a-4daaf0361930	Monday	18:30:00	2024-11-25 20:30:40.468693	2024-11-25 20:30:40.468693
393b997d-35cc-4e1d-8df6-3925f8ec875e	51b0eb34-a9bd-4638-b208-85ab5a59c700	Monday	19:30:00	2024-11-25 20:30:40.468693	2024-11-25 20:30:40.468693
8da8f26a-4e40-4a4f-a7b5-f3202272a745	f1fc4925-9653-4234-859c-8476fb3b660d	Sunday	08:30:00	2024-11-25 20:30:40.468693	2024-11-25 20:30:40.468693
b2d00d69-c0a8-4a72-bd13-8b21ac526a5d	66d3fb39-be71-4634-9327-98ea263a9a37	Thursday	18:30:00	2024-11-25 20:30:40.468693	2024-11-25 20:30:40.468693
7d771e7c-e47d-4c13-87b4-e67e4b2748d7	761045ff-8de6-4115-9be5-46ebd6db9817	Friday	06:00:00	2024-11-25 20:30:40.468693	2024-11-25 20:30:40.468693
beaed211-69e1-41fc-820d-d12890602263	997c77e7-6a65-4def-9521-e4843d51b302	Tuesday	18:30:00	2024-11-25 20:30:40.468693	2024-11-25 20:30:40.468693
6ed6b723-9531-4678-a230-8a119c51e314	c1f92483-0c32-4afc-8754-6bdea01a6943	Tuesday	19:30:00	2024-11-25 20:30:40.468693	2024-11-25 20:30:40.468693
a81025fa-ea76-4293-9871-1bcf89c20b8b	ecb50f84-314e-4dea-9ea9-59d3c689051f	Monday	19:00:00	2024-11-25 20:30:40.468693	2024-11-25 20:30:40.468693
4acdc8c4-040a-460a-8b78-734795b60a0c	a911a336-6923-484b-9451-1545331e33f1	Wednesday	18:30:00	2024-11-25 20:30:40.468693	2024-11-25 20:30:40.468693
e053aa89-ea49-42c8-b213-424d0e45b6f1	a911a336-6923-484b-9451-1545331e33f1	Saturday	09:00:00	2024-11-25 20:30:40.468693	2024-11-25 20:30:40.468693
\.


--
-- Data for Name: clubs; Type: TABLE DATA; Schema: public; Owner: patrick
--

COPY public.clubs (id, slug, name, location, description, instagram, facebook, city_id, status, submitter_email, submitted_at, reviewed_at, reviewed_by, created_at, updated_at) FROM stdin;
4fefe57f-e6d0-44d8-8627-aafa5a832403	east-van-run-crew	East Van Run Crew (EVRC)	Various breweries in East Van	A social run to shake out the Monday emeralds, starting from a different brewery each week.	@eastvanruncrew	eastvanruncrew	1439fb63-520a-4de1-91ec-96f778678d67	approved	\N	2024-11-25 20:01:10.704459	\N	\N	2024-11-25 20:01:10.704459	2024-11-25 20:01:10.704459
c492f4f1-1ae2-493a-8d02-9c2db5cad901	fraser-street-run-crew	Fraser Street Run Crew (FSRC)	1008 E20th Avenue	Social runs open to everyone for a 5 or 10k social run.	@fraserstreetrunclub	fraserstreetrunclub	1439fb63-520a-4de1-91ec-96f778678d67	approved	\N	2024-11-25 20:01:10.704459	\N	\N	2024-11-25 20:01:10.704459	2024-11-25 20:01:10.704459
298966d4-b629-4ad4-b5e9-25fb16717ec3	mile2marathon	Mile2Marathon	Point Grey Secondary School Track/Stanley Park	Offers top-notch coaching with twice-weekly interval workouts.	@mile2marathon	mile2marathon	1439fb63-520a-4de1-91ec-96f778678d67	approved	\N	2024-11-25 20:01:10.704459	\N	\N	2024-11-25 20:01:10.704459	2024-11-25 20:01:10.704459
20e54734-b808-4df0-8faf-7487f452c165	runvan-run-club	RUNVAN Run Club	Fairmont Waterfront Hotel	A casual run club open to anyone who likes an early morning jog along the seawall.	@runvancanada	runvancanada	1439fb63-520a-4de1-91ec-96f778678d67	approved	\N	2024-11-25 20:01:10.704459	\N	\N	2024-11-25 20:01:10.704459	2024-11-25 20:01:10.704459
417fd370-6a0c-4804-b1c5-c2ad730cee46	north-shore-lions-acc	North Shore Lions Athletic Club	Lions Gate Bridge Parking Lot	A competitive running club offering training for all experience levels.	@northshorelions	northshorelions	1439fb63-520a-4de1-91ec-96f778678d67	approved	\N	2024-11-25 20:01:10.704459	\N	\N	2024-11-25 20:01:10.704459	2024-11-25 20:01:10.704459
95a5bed5-fb1b-4d5d-97aa-a77fe4701efd	vancouver-frontrunners	Vancouver Frontrunners	Coal Harbour Seawall	A welcoming club for all LGBTQ+ runners, providing social runs and training opportunities.	@vancouverfrontrunners	vancouverfrontrunners	1439fb63-520a-4de1-91ec-96f778678d67	approved	\N	2024-11-25 20:01:10.704459	\N	\N	2024-11-25 20:01:10.704459	2024-11-25 20:01:10.704459
6e204e66-13d0-48ad-8de6-e8f875b6ebab	steel-oak-run-club	Steel and Oak Run Club	Steel & Oak Brewing Co.	A run club that combines social running with craft beer and fun events.	@steelandoakrunclub	steelandoakrunclub	1439fb63-520a-4de1-91ec-96f778678d67	approved	\N	2024-11-25 20:01:10.704459	\N	\N	2024-11-25 20:01:10.704459	2024-11-25 20:01:10.704459
2a35b901-622d-4f23-8542-32d2ecb6599d	queer-van-run-club	Queer Van Run Club	Various Locations	An inclusive run club for the LGBTQ+ community, focusing on fun and fitness.	@queervanrunclub	queervanrunclub	1439fb63-520a-4de1-91ec-96f778678d67	approved	\N	2024-11-25 20:01:10.704459	\N	\N	2024-11-25 20:01:10.704459	2024-11-25 20:01:10.704459
530c76f5-a2d6-455d-9d3c-f47c3eaf3d40	vancity-beer-run	Vancouver Beer Run	Various locations	Get fit, drink beer. Chill paces. All welcome!	@vancitybeerrun		1439fb63-520a-4de1-91ec-96f778678d67	approved	\N	2024-11-25 20:01:10.704459	\N	\N	2024-11-25 20:01:10.704459	2024-11-25 20:01:10.704459
c8d178be-ebf9-46e3-8543-4d7bbf3e5f7a	mondays-run-club	Mondays Run Club	Various locations	More than just a run club. MRC - Mondays. SOLE TIES - BE BACK SOON	@mondaysrunclub		1439fb63-520a-4de1-91ec-96f778678d67	approved	\N	2024-11-25 20:01:10.704459	\N	\N	2024-11-25 20:01:10.704459	2024-11-25 20:01:10.704459
604dc859-24cf-4339-bb31-d5dc6d788830	slowpokes-van	Slowpokes Vancouver	Juice Truck (Sat), Nemesis Coffee (Wed), Lynn Headwaters (Tue)	Social Run Club with multiple weekly runs	@slowpokes.van		1439fb63-520a-4de1-91ec-96f778678d67	approved	\N	2024-11-25 20:01:10.704459	\N	\N	2024-11-25 20:01:10.704459	2024-11-25 20:01:10.704459
660cf5d5-8866-4f2e-83de-aa32f05aeadc	peak-pursuit-yvr	Peak Pursuit Trail Crew	Various trail locations	We run trails. Trail Thursdays and Sunday runs with rotating locations.	@peakpursuityvr		1439fb63-520a-4de1-91ec-96f778678d67	approved	\N	2024-11-25 20:01:10.704459	\N	\N	2024-11-25 20:01:10.704459	2024-11-25 20:01:10.704459
52ea36ae-1e94-46db-ae9b-f953ba3804cd	nrg-vancouver	NRG Vancouver	Morton Park	Vancouver's Most Fun Run Club. All paces welcome. Free runs followed by social gathering at English Bay.	@nrgvancouver		1439fb63-520a-4de1-91ec-96f778678d67	approved	\N	2024-11-25 20:01:10.704459	\N	\N	2024-11-25 20:01:10.704459	2024-11-25 20:01:10.704459
81ce62ea-a9de-4022-a6ff-33c9a8abf678	blacktoe-running	BlackToe Running	95 Bathurst St	Offers free drop-in runs with tempo runs on Fridays and long runs on Sundays, suitable for all levels.	@blacktoerunning	blacktoerunning	4ef35cae-287f-4f05-b7d0-b37b0cc99f70	approved	\N	2024-11-25 20:01:10.704459	\N	\N	2024-11-25 20:01:10.704459	2024-11-25 20:01:10.704459
07aa8a1f-6e14-4d1e-a5ef-3983cb6733ff	culture-athletics	Culture Athletics	972 Queen St E	Provides free community runs with short, medium, and long route options to accommodate different skill levels.	@cultureathletics	cultureathletics	4ef35cae-287f-4f05-b7d0-b37b0cc99f70	approved	\N	2024-11-25 20:01:10.704459	\N	\N	2024-11-25 20:01:10.704459	2024-11-25 20:01:10.704459
ac1b0ffe-0423-43b6-ae11-58fb4ef7fafd	me-versus-me	Me Versus Me	Canoe Landing Park	A welcoming club for runners of all paces and abilities, meeting rain or shine.	@meversusmerun	meversusmerun	4ef35cae-287f-4f05-b7d0-b37b0cc99f70	approved	\N	2024-11-25 20:01:10.704459	\N	\N	2024-11-25 20:01:10.704459	2024-11-25 20:01:10.704459
81f850b1-bdda-4bd5-84a3-6de411186286	piccolo-run-club	Piccolo Run Club	Piccolo Caffe E Vino	Offers 5km runs with great vibes and the option to grab a bite after the run.	@piccolocaffe	piccolocaffe	4ef35cae-287f-4f05-b7d0-b37b0cc99f70	approved	\N	2024-11-25 20:01:10.704459	\N	\N	2024-11-25 20:01:10.704459	2024-11-25 20:01:10.704459
e6ddef73-885b-47a6-9508-24c547e916a5	curre-club	Curre Club	Neo Coffee Bar	An early morning run club perfect for ending the work week and starting the weekend.	@curreclub	curreclub	4ef35cae-287f-4f05-b7d0-b37b0cc99f70	approved	\N	2024-11-25 20:01:10.704459	\N	\N	2024-11-25 20:01:10.704459	2024-11-25 20:01:10.704459
42978988-4e50-4435-bbc3-3fcb71c38589	runtobeer	RunTOBeer		Combines running with visits to the best bars and breweries in Toronto, offering 3, 5, and 10k routes.	@runtobeer	runtobeer	4ef35cae-287f-4f05-b7d0-b37b0cc99f70	approved	\N	2024-11-25 20:01:10.704459	\N	\N	2024-11-25 20:01:10.704459	2024-11-25 20:01:10.704459
b8e725ee-7589-4aee-a733-3aaa4d07e8d5	waterloo-running-room	Waterloo Running Room	Unit #3, 15 King Street South, Waterloo, ON N2J 1N9	Offers group runs every Wednesday evening, catering to various paces and distances.	@runningroom	runningroom	421f4835-c7c0-4767-86af-e9a57b225abf	approved	\N	2024-11-25 20:01:10.704459	\N	\N	2024-11-25 20:01:10.704459	2024-11-25 20:01:10.704459
3b87e123-6e08-4106-b4b6-58a4cb8ec32f	kitchener-waterloo-runners	Kitchener-Waterloo Runners	Kitchener City Hall, 200 King St W, Kitchener, ON N2G 4G7	A social running club that meets every Saturday morning for group runs of various distances.	@kwrunners	kwrunners	421f4835-c7c0-4767-86af-e9a57b225abf	approved	\N	2024-11-25 20:01:10.704459	\N	\N	2024-11-25 20:01:10.704459	2024-11-25 20:01:10.704459
78ca8592-757a-4ed4-b4ac-b6485d75b51c	guelph-running-club	Guelph Running Club	Various locations in Guelph and Kitchener-Waterloo area	Hosts regular training sessions suitable for all levels, with a focus on community and support.	@guelphrunningclub	guelphrunningclub	421f4835-c7c0-4767-86af-e9a57b225abf	approved	\N	2024-11-25 20:01:10.704459	\N	\N	2024-11-25 20:01:10.704459	2024-11-25 20:01:10.704459
20b5732f-95b4-47c2-90be-84e0423b25cc	run-for-fun-club	Run For Fun Club	Victoria Park, Kitchener, ON	A casual club focused on making running fun and social, meeting twice a week.	@runforfunclub		421f4835-c7c0-4767-86af-e9a57b225abf	approved	\N	2024-11-25 20:01:10.704459	\N	\N	2024-11-25 20:01:10.704459	2024-11-25 20:01:10.704459
627e4b0f-9035-407d-9b27-085db0d5b959	speed-demons-run-club	Speed Demons Run Club		An informal group that meets for speed workouts and interval training at various locations.	@speeddemonsrunclub	speeddemonsrunclub	421f4835-c7c0-4767-86af-e9a57b225abf	approved	\N	2024-11-25 20:01:10.704459	\N	\N	2024-11-25 20:01:10.704459	2024-11-25 20:01:10.704459
d1b7c466-d07a-4927-a0dc-cb59ac18f20b	yvr-social-run	YVR Social Run Club	Various locations	Offers multiple pace groups (6:00/km, 6:30/km, and 7:00/km) with consistent pacing	@yvrsocialrun		1439fb63-520a-4de1-91ec-96f778678d67	approved	\N	2024-11-25 20:30:40.468693	\N	\N	2024-11-25 20:30:40.468693	2024-11-25 20:30:40.468693
5eec9516-303a-4d6e-ab2d-9e115614c897	hummingbird-run	Hummingbird Run Club	Second Beach Concession Stand, Stanley Park	Social running group with post-run coffee and food	@hummingbirdrun		1439fb63-520a-4de1-91ec-96f778678d67	approved	\N	2024-11-25 20:30:40.468693	\N	\N	2024-11-25 20:30:40.468693	2024-11-25 20:30:40.468693
cc4d663e-6e47-4bb5-883a-4daaf0361930	monday-run-club	Monday Run Club	Various locations	Social runs with average pace of 6-6:30/km	@monday.run.club		1439fb63-520a-4de1-91ec-96f778678d67	approved	\N	2024-11-25 20:30:40.468693	\N	\N	2024-11-25 20:30:40.468693	2024-11-25 20:30:40.468693
51b0eb34-a9bd-4638-b208-85ab5a59c700	shift-together	Shift Together	Central Park and Deer Lake (rotating)	Social run for all levels	@shift.together		1439fb63-520a-4de1-91ec-96f778678d67	approved	\N	2024-11-25 20:30:40.468693	\N	\N	2024-11-25 20:30:40.468693	2024-11-25 20:30:40.468693
f1fc4925-9653-4234-859c-8476fb3b660d	distance-runwear	Distance Runwear Group	Distance Runwear (Main Street & 32nd)	Free long run group, typically 20-30km, different routes weekly	@distancerunwear		1439fb63-520a-4de1-91ec-96f778678d67	approved	\N	2024-11-25 20:30:40.468693	\N	\N	2024-11-25 20:30:40.468693	2024-11-25 20:30:40.468693
66d3fb39-be71-4634-9327-98ea263a9a37	slow-canucks	Slow as F*ck Canuks	Varies (West Toronto)	Inclusive social running group	@slowcanucks		4ef35cae-287f-4f05-b7d0-b37b0cc99f70	approved	\N	2024-11-25 20:30:40.468693	\N	\N	2024-11-25 20:30:40.468693	2024-11-25 20:30:40.468693
761045ff-8de6-4115-9be5-46ebd6db9817	le-6am-club	Le 6am Club	Balzacs Coffee on Market Street	Early morning easy pace runs	@le6amclub		4ef35cae-287f-4f05-b7d0-b37b0cc99f70	approved	\N	2024-11-25 20:30:40.468693	\N	\N	2024-11-25 20:30:40.468693	2024-11-25 20:30:40.468693
997c77e7-6a65-4def-9521-e4843d51b302	running-rats	Running Rats Toronto	Decathlon store at Union Station	Three distances offered: 7k, 10k, and 13k	@runningratsto		4ef35cae-287f-4f05-b7d0-b37b0cc99f70	approved	\N	2024-11-25 20:30:40.468693	\N	\N	2024-11-25 20:30:40.468693	2024-11-25 20:30:40.468693
c1f92483-0c32-4afc-8754-6bdea01a6943	ottawa-city	Ottawa City Run Club	Beyond the Pale	Large inclusive group with runners of all levels	@ottcityrunclub		c552f1a0-0ab7-4dd1-b78a-3f08f1de4471	approved	\N	2024-11-25 20:30:40.468693	\N	\N	2024-11-25 20:30:40.468693	2024-11-25 20:30:40.468693
ecb50f84-314e-4dea-9ea9-59d3c689051f	badass-lady-gang	Badass Lady Gang	Tunney's Pasture	Women's running group with multiple pace options	@badassladygangott		c552f1a0-0ab7-4dd1-b78a-3f08f1de4471	approved	\N	2024-11-25 20:30:40.468693	\N	\N	2024-11-25 20:30:40.468693	2024-11-25 20:30:40.468693
a911a336-6923-484b-9451-1545331e33f1	sparks-street	Sparks Street Run Club	Sparks Street	Mixed level running group in downtown Ottawa	@sparksstreetrun		c552f1a0-0ab7-4dd1-b78a-3f08f1de4471	approved	\N	2024-11-25 20:30:40.468693	\N	\N	2024-11-25 20:30:40.468693	2024-11-25 20:30:40.468693
\.


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: patrick
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: cities cities_pkey; Type: CONSTRAINT; Schema: public; Owner: patrick
--

ALTER TABLE ONLY public.cities
    ADD CONSTRAINT cities_pkey PRIMARY KEY (id);


--
-- Name: cities cities_slug_key; Type: CONSTRAINT; Schema: public; Owner: patrick
--

ALTER TABLE ONLY public.cities
    ADD CONSTRAINT cities_slug_key UNIQUE (slug);


--
-- Name: club_events club_events_pkey; Type: CONSTRAINT; Schema: public; Owner: patrick
--

ALTER TABLE ONLY public.club_events
    ADD CONSTRAINT club_events_pkey PRIMARY KEY (id);


--
-- Name: clubs clubs_pkey; Type: CONSTRAINT; Schema: public; Owner: patrick
--

ALTER TABLE ONLY public.clubs
    ADD CONSTRAINT clubs_pkey PRIMARY KEY (id);


--
-- Name: clubs clubs_slug_key; Type: CONSTRAINT; Schema: public; Owner: patrick
--

ALTER TABLE ONLY public.clubs
    ADD CONSTRAINT clubs_slug_key UNIQUE (slug);


--
-- Name: idx_club_events_club; Type: INDEX; Schema: public; Owner: patrick
--

CREATE INDEX idx_club_events_club ON public.club_events USING btree (club_id);


--
-- Name: idx_clubs_city; Type: INDEX; Schema: public; Owner: patrick
--

CREATE INDEX idx_clubs_city ON public.clubs USING btree (city_id);


--
-- Name: idx_clubs_status; Type: INDEX; Schema: public; Owner: patrick
--

CREATE INDEX idx_clubs_status ON public.clubs USING btree (status);


--
-- Name: club_events club_events_club_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: patrick
--

ALTER TABLE ONLY public.club_events
    ADD CONSTRAINT club_events_club_id_fkey FOREIGN KEY (club_id) REFERENCES public.clubs(id) ON DELETE CASCADE;


--
-- Name: clubs clubs_city_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: patrick
--

ALTER TABLE ONLY public.clubs
    ADD CONSTRAINT clubs_city_id_fkey FOREIGN KEY (city_id) REFERENCES public.cities(id);


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: patrick
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: -; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres GRANT ALL ON SEQUENCES TO patrick;


--
-- Name: DEFAULT PRIVILEGES FOR TYPES; Type: DEFAULT ACL; Schema: -; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres GRANT ALL ON TYPES TO patrick;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: -; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres GRANT ALL ON FUNCTIONS TO patrick;


--
-- Name: DEFAULT PRIVILEGES FOR SCHEMAS; Type: DEFAULT ACL; Schema: -; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres GRANT ALL ON SCHEMAS TO patrick;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: -; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres GRANT ALL ON TABLES TO patrick;


--
-- PostgreSQL database dump complete
--

