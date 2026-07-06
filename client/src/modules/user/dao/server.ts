import { createClient } from '@core/clients/supabase/server';

import { UserDao } from './user.dao';

export default new UserDao(createClient);
