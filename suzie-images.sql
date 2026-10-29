-- Applied through Supabase apply_migration: suzie_image_request_limits.
alter table public.usage_events drop constraint usage_events_event_type_check;
alter table public.usage_events add constraint usage_events_event_type_check
 check(event_type in ('chat','speech_to_text','text_to_speech','image_analyze','image_generate'));
-- Usage records must not be erasable by API clients to reset their quota.
revoke update,delete,truncate,references,trigger on public.usage_events from anon,authenticated;
create or replace function public.reserve_image_request(operation text)
returns boolean language plpgsql security invoker set search_path = '' as $$
declare actor uuid:=auth.uid(); event text; hourly integer; daily integer;
begin
 if actor is null then raise exception 'Sign in required'; end if;
 if operation not in ('analyze','generate') or operation is null then raise exception 'Invalid operation'; end if;
 event:='image_'||operation;
 perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(actor::text||':images',0));
 select count(*) filter(where created_at>now()-interval '1 hour'),count(*)
 into hourly,daily from public.usage_events
 where user_id=actor and event_type=event and created_at>now()-interval '24 hours';
 if hourly >= (case when operation='generate' then 5 else 30 end)
 or (operation='generate' and daily>=20) then return false; end if;
 insert into public.usage_events(user_id,event_type) values(actor,event);
 return true;
end; $$;
revoke all on function public.reserve_image_request(text) from public,anon;
grant execute on function public.reserve_image_request(text) to authenticated;
