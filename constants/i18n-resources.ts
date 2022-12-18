const defaultResource = {
	birthdayForm_title: "Add your birthday",
	birthdayForm_description: "Add or update your birthday:",
	birthdayForm_birthday_label: "Birthday:",
	birthdayForm_birthday_placeholder: "Please pick a date",
	birthdayForm_shouldNotify_label: "Should we notify your birthday with room: **{roomName}**?",
	birthdayForm_shouldNotify_placeholder: "Please select an answer",
	birthdayForm_shouldNotify_option_yes: "Yes",
	birthdayForm_shouldNotify_option_no: "No",
	birthdayForm_close_label: "Close",
	birthdayForm_submit_label: "Add",
	birthdayForm_error_general: "Error changing birthday config",
	birthdayForm_error_input: "Invalid data, please check your input",
	removeNotification_text: "We have removed your birthday successfully",
	configNotification_text: "We have saved your birthday config successfully",
	removeNotification_image_alt: "Success",
	helpText: `
### Birthday command

Config notifications for your birthday in the current room. Usage:
* \`/birthday config\`: Config your birthday and your birthday notification in the current room
* \`/birthday remove\`: Remove your birthday in the database
    `
} as const;

export type I18nKey = keyof typeof defaultResource;

export const i18nResources: Record<string, Record<I18nKey, string>> = {
	en: defaultResource
};
