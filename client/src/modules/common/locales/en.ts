import imageUpload from '@common/components/ImageUpload/locales/en';
import navbarHeader from '@common/components/Navbar/locales/en';
import errorPage from '@common/pages/ErrorPage/locales/en';

const en = {
    ...imageUpload,
    ...navbarHeader,
    ...errorPage,
} as const;

export default en;
