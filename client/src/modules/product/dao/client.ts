import { createClient } from "@core/clients/supabase/client";

import { ProductDao } from "./product.dao";

export default new ProductDao(createClient)
