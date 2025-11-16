import enDefault from '../locales/en/default.json';
import enCommon from '../locales/en/common.json';
import bnDefault from '../locales/bn/default.json';
import bnCommon from '../locales/bn/common.json';

export const messages = {
    en: {
        default: enDefault,
        common: enCommon,
    },
    bn: {
        default: bnDefault,
        common: bnCommon,
    },
} as const;
