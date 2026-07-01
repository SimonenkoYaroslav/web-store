import { getRequestConfig } from 'next-intl/server';

import { getLocale } from './locale.service';
import { getMessages } from './messages';


export default getRequestConfig(async () => {
    const locale = await getLocale();

    return {
        locale,
        messages: getMessages(locale),
    };
});
