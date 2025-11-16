import { getRequestConfig } from 'next-intl/server';
import { routing } from './i18n/routing';
import { messages } from './i18n/messages';

export default getRequestConfig(async ({ requestLocale }: { requestLocale: Promise<string | undefined> }) => {
    // This typically corresponds to the `[locale]` segment
    let locale = await requestLocale;

    // Ensure that a valid locale is used
    if (!locale || !routing.locales.includes(locale as (typeof routing.locales)[number])) {
        locale = routing.defaultLocale;
    }

    return {
        locale,
        messages: messages[locale as keyof typeof messages] || messages[routing.defaultLocale],
    };
});
