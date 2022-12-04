import { LOCALIZATION_ARGS_REGEX } from "../constants/regex";
import { I18nKey, i18nResources } from "../constants/i18n-resources";

export type Localizer = (label: I18nKey, args?: Record<string, string>) => string;

export const getLocalizer = (language = "en"): Localizer => {
	return (label: I18nKey, args?: Record<string, string>) => {
		return i18nResources[language][label].replace(LOCALIZATION_ARGS_REGEX, (match, p1) => args?.[p1] || "");
	};
};
