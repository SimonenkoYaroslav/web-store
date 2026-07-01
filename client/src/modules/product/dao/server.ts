import { createClient } from "@core/clients/supabase/server";

import { ProductDao } from "./product.dao";

export default new ProductDao(createClient)
