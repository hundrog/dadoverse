


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


CREATE EXTENSION IF NOT EXISTS "pg_cron" WITH SCHEMA "pg_catalog";






COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE OR REPLACE FUNCTION "public"."clean_old_rolls"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    DELETE FROM rolls
    WHERE id IN (
        SELECT id
        FROM rolls
        WHERE session_id = NEW.session_id
        ORDER BY created_at DESC
        OFFSET 100 -- Guardamos las 100 más recientes
    );
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."clean_old_rolls"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."delete_expired_sessions"() RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    -- Borra sesiones sin dueño creadas hace más de 5 días
    DELETE FROM sessions
    WHERE owner_id IS NULL 
    AND created_at < NOW() - INTERVAL '5 days';
END;
$$;


ALTER FUNCTION "public"."delete_expired_sessions"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."generate_unique_session_slug"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
declare
  new_slug text;
  suffix text;
  ready boolean := false;
begin
  -- 1. Convertir el nombre a formato slug (minúsculas, sin espacios ni caracteres raros)
  -- Reemplaza espacios por guiones y quita todo lo que no sea alfanumérico
  new_slug := lower(regexp_replace(new.name, '[^a-zA-Z0-9]+', '-', 'g'));
  -- Quitar guiones al inicio o al final
  new_slug := trim(both '-' from new_slug);

  -- Si el nombre estaba vacío o solo tenía caracteres raros, dar un default
  if new_slug = '' then
    new_slug := 'my-roll-session';
  end if;

  -- 2. Bucle para asegurar que no hay colisión (aunque con 4 números es raro)
  while not ready loop
    suffix := lpad(floor(random() * 10000)::text, 4, '0'); -- Genera '0000' a '9999'
    if not exists (select 1 from sessions where slug = new_slug || '-' || suffix) then
      new_slug := new_slug || '-' || suffix;
      ready := true;
    end if;
  end loop;

  new.slug := new_slug;
  return new;
end;
$$;


ALTER FUNCTION "public"."generate_unique_session_slug"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."rls_auto_enable"() RETURNS "event_trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'pg_catalog'
    AS $$
DECLARE
  cmd record;
BEGIN
  FOR cmd IN
    SELECT *
    FROM pg_event_trigger_ddl_commands()
    WHERE command_tag IN ('CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO')
      AND object_type IN ('table','partitioned table')
  LOOP
     IF cmd.schema_name IS NOT NULL AND cmd.schema_name IN ('public') AND cmd.schema_name NOT IN ('pg_catalog','information_schema') AND cmd.schema_name NOT LIKE 'pg_toast%' AND cmd.schema_name NOT LIKE 'pg_temp%' THEN
      BEGIN
        EXECUTE format('alter table if exists %s enable row level security', cmd.object_identity);
        RAISE LOG 'rls_auto_enable: enabled RLS on %', cmd.object_identity;
      EXCEPTION
        WHEN OTHERS THEN
          RAISE LOG 'rls_auto_enable: failed to enable RLS on %', cmd.object_identity;
      END;
     ELSE
        RAISE LOG 'rls_auto_enable: skip % (either system schema or not in enforced list: %.)', cmd.object_identity, cmd.schema_name;
     END IF;
  END LOOP;
END;
$$;


ALTER FUNCTION "public"."rls_auto_enable"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."rolls" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "session_id" "uuid",
    "user_name" "text" NOT NULL,
    "system_type" "text" NOT NULL,
    "raw_result" "jsonb" NOT NULL,
    "is_collaborative" boolean DEFAULT false,
    "group_id" "uuid"
);


ALTER TABLE "public"."rolls" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."session_members" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "session_id" "uuid",
    "user_id" "uuid",
    "guest_name" "text",
    "joined_at" timestamp with time zone DEFAULT "now"(),
    "role" "text" DEFAULT 'player'::"text",
    CONSTRAINT "session_members_role_check" CHECK (("role" = ANY (ARRAY['owner'::"text", 'player'::"text", 'spectator'::"text"])))
);


ALTER TABLE "public"."session_members" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."sessions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "name" "text" NOT NULL,
    "slug" "text",
    "config" "jsonb" DEFAULT '{}'::"jsonb",
    "owner_id" "uuid",
    "system_type" "text" DEFAULT 'duality'::"text" NOT NULL,
    "tray_type" "text" DEFAULT 'standard'::"text" NOT NULL,
    CONSTRAINT "check_system_type" CHECK (("system_type" = ANY (ARRAY['duality'::"text", 'yze'::"text", '2d20'::"text", 'step'::"text"]))),
    CONSTRAINT "check_tray_type" CHECK (("tray_type" = ANY (ARRAY['standard'::"text", 'collaborative'::"text"])))
);


ALTER TABLE "public"."sessions" OWNER TO "postgres";


ALTER TABLE ONLY "public"."rolls"
    ADD CONSTRAINT "rolls_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."session_members"
    ADD CONSTRAINT "session_members_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."session_members"
    ADD CONSTRAINT "session_members_session_id_user_id_key" UNIQUE ("session_id", "user_id");



ALTER TABLE ONLY "public"."sessions"
    ADD CONSTRAINT "sessions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."sessions"
    ADD CONSTRAINT "sessions_slug_key" UNIQUE ("slug");



CREATE OR REPLACE TRIGGER "trigger_clean_rolls" AFTER INSERT ON "public"."rolls" FOR EACH ROW EXECUTE FUNCTION "public"."clean_old_rolls"();



CREATE OR REPLACE TRIGGER "trigger_generate_session_slug" BEFORE INSERT ON "public"."sessions" FOR EACH ROW EXECUTE FUNCTION "public"."generate_unique_session_slug"();



ALTER TABLE ONLY "public"."rolls"
    ADD CONSTRAINT "rolls_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "public"."sessions"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."session_members"
    ADD CONSTRAINT "session_members_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "public"."sessions"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."session_members"
    ADD CONSTRAINT "session_members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."sessions"
    ADD CONSTRAINT "sessions_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "auth"."users"("id");



CREATE POLICY "Anyone can insert a roll" ON "public"."rolls" FOR INSERT WITH CHECK (true);



CREATE POLICY "Join session" ON "public"."session_members" FOR INSERT WITH CHECK (true);



CREATE POLICY "Leave session" ON "public"."session_members" FOR DELETE USING ((("auth"."uid"() = "user_id") OR (EXISTS ( SELECT 1
   FROM "public"."sessions"
  WHERE (("sessions"."id" = "session_members"."session_id") AND ("sessions"."owner_id" = "auth"."uid"()))))));



CREATE POLICY "Only session owners can delete rolls" ON "public"."rolls" FOR DELETE TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."sessions"
  WHERE (("sessions"."id" = "rolls"."session_id") AND ("sessions"."owner_id" = "auth"."uid"())))));



CREATE POLICY "Owners can update or delete their own sessions" ON "public"."sessions" TO "authenticated" USING ((("auth"."uid"() = "owner_id") OR ("owner_id" IS NULL))) WITH CHECK (("auth"."uid"() = "owner_id"));



CREATE POLICY "Permitir creación anónima" ON "public"."sessions" FOR INSERT WITH CHECK ((("auth"."uid"() IS NULL) OR ("auth"."uid"() = "owner_id")));



CREATE POLICY "Rolls are viewable by everyone in the session" ON "public"."rolls" FOR SELECT USING (true);



CREATE POLICY "Sessions are viewable by everyone" ON "public"."sessions" FOR SELECT USING (true);



CREATE POLICY "View members" ON "public"."session_members" FOR SELECT USING (true);



ALTER TABLE "public"."rolls" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."session_members" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."sessions" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";









GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";











































































































































































GRANT ALL ON FUNCTION "public"."clean_old_rolls"() TO "anon";
GRANT ALL ON FUNCTION "public"."clean_old_rolls"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."clean_old_rolls"() TO "service_role";



GRANT ALL ON FUNCTION "public"."delete_expired_sessions"() TO "anon";
GRANT ALL ON FUNCTION "public"."delete_expired_sessions"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."delete_expired_sessions"() TO "service_role";



GRANT ALL ON FUNCTION "public"."generate_unique_session_slug"() TO "anon";
GRANT ALL ON FUNCTION "public"."generate_unique_session_slug"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."generate_unique_session_slug"() TO "service_role";



GRANT ALL ON FUNCTION "public"."rls_auto_enable"() TO "anon";
GRANT ALL ON FUNCTION "public"."rls_auto_enable"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."rls_auto_enable"() TO "service_role";
























GRANT ALL ON TABLE "public"."rolls" TO "anon";
GRANT ALL ON TABLE "public"."rolls" TO "authenticated";
GRANT ALL ON TABLE "public"."rolls" TO "service_role";



GRANT ALL ON TABLE "public"."session_members" TO "anon";
GRANT ALL ON TABLE "public"."session_members" TO "authenticated";
GRANT ALL ON TABLE "public"."session_members" TO "service_role";



GRANT ALL ON TABLE "public"."sessions" TO "anon";
GRANT ALL ON TABLE "public"."sessions" TO "authenticated";
GRANT ALL ON TABLE "public"."sessions" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";



































drop extension if exists "pg_net";


