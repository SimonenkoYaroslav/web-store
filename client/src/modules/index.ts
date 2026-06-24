import auth from '@modules/auth/locales/en';
import catalog from '@modules/catalog/locales/en';
import imageUpload from '@modules/common/components/ImageUpload/locales/en';
import common from '@modules/common/locales/en';
import dashboard from '@modules/dashboard/locales/en';
import product from '@modules/product/locales/en';
import user from '@modules/user/locales/en';

const en = {
    ...auth,
    ...catalog,
    ...common,
    ...dashboard,
    ...imageUpload,
    ...product,
    ...user,
} as const;

const rootModule = {
    locales: {
        en,
    }
}

export default rootModule;
