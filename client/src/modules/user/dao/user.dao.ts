import type { SupabaseClient } from '@supabase/supabase-js';

import { AbstractDao } from '@core/dao/AbstractDao';

import { IUser } from '../types/user';

// Data Access Object for the `users` table. Owns every query against that table
// so services deal in domain entities. Auth (`supabase.auth.*`) is a separate
// concern and stays in the user service.
class UserDao extends AbstractDao {
    protected readonly table = 'users';

    async findById(client: SupabaseClient, userId: string): Promise<IUser> {
        return this.unwrap(
            await client.from(this.table).select<'*', IUser>('*').eq('id', userId).single(),
        );
    }
}

const userDao = new UserDao;
export default userDao;
