-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.deliver_log (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  company text,
  order_no text,
  phone text,
  result jsonb,
  status smallint,
  updated_at timestamp with time zone,
  user_id text,
  CONSTRAINT deliver_log_pkey PRIMARY KEY (id)
);
CREATE TABLE public.shop_goods (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  name text,
  cover text,
  price real,
  bio text,
  price_old real,
  shelf_day smallint,
  status smallint,
  type integer,
  CONSTRAINT shop_goods_pkey PRIMARY KEY (id)
);
CREATE TABLE public.shop_goods_sku (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  goods_id integer,
  name text,
  bio text,
  cover text,
  price real,
  stock integer,
  sale_num integer,
  meta jsonb,
  status smallint,
  CONSTRAINT shop_goods_sku_pkey PRIMARY KEY (id)
);
CREATE TABLE public.shop_goods_type (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  name text,
  seq integer DEFAULT 1000,
  CONSTRAINT shop_goods_type_pkey PRIMARY KEY (id)
);
CREATE TABLE public.shop_info (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  user_id uuid DEFAULT gen_random_uuid(),
  name text,
  logo text,
  bio text,
  type smallint,
  host_name text,
  host_tel text,
  area_name text,
  area_code text,
  status smallint,
  CONSTRAINT shop_info_pkey PRIMARY KEY (id)
);
CREATE TABLE public.shop_order (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  order_no text,
  buy_info jsonb,
  total_price real,
  pay_info jsonb,
  user_id uuid DEFAULT gen_random_uuid(),
  status smallint,
  CONSTRAINT shop_order_pkey PRIMARY KEY (id)
);
CREATE TABLE public.sys_dept (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  pid integer,
  name text,
  remark text,
  status smallint,
  CONSTRAINT sys_dept_pkey PRIMARY KEY (id)
);
CREATE TABLE public.sys_log (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  tab_name text,
  act text,
  body jsonb,
  rel_id integer,
  user_id uuid,
  CONSTRAINT sys_log_pkey PRIMARY KEY (id)
);
CREATE TABLE public.sys_menu (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  name text,
  type text,
  path text,
  component text,
  meta jsonb,
  status smallint,
  pid integer,
  auth_code text,
  CONSTRAINT sys_menu_pkey PRIMARY KEY (id)
);
CREATE TABLE public.sys_role (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  name text,
  permissions jsonb,
  remark text,
  status smallint,
  CONSTRAINT sys_role_pkey PRIMARY KEY (id)
);
CREATE TABLE public.user_info (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  name text,
  avatar text,
  mobile text,
  vcode text,
  vcode_at timestamp with time zone,
  wx_oid text,
  wx_uid text,
  psw_hash text,
  ip text,
  status smallint,
  user_id uuid,
  role_id integer,
  email text,
  dept_id integer,
  CONSTRAINT user_info_pkey PRIMARY KEY (id)
);
