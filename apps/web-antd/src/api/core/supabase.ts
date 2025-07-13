import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { message } from 'ant-design-vue';

const env = import.meta.env;

export const supabase: SupabaseClient = createClient(
  env.VITE_SUPABASE_URL,
  env.VITE_SUPABASE_KEY,
);

export function getSbData(res: any, showTip = true, opts?: any) {
  if (res.error) {
    const { getErrMsg } = opts;
    const msg = getErrMsg ? getErrMsg(res.error) : res.error.message;
    if (showTip) {
      message.error(msg);
    }
    throw res.error;
  }
  return res.data;
}

export default supabase;
