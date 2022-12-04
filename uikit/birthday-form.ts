import { IUIKitModalViewParam } from "@rocket.chat/apps-engine/definition/uikit/UIKitInteractionResponder";
import {
	BlockBuilder,
	BlockElementType,
	ButtonStyle,
	IInputElement,
	TextObjectType
} from "@rocket.chat/apps-engine/definition/uikit";

import { getLocalizer } from "../helpers/localization-helper";

interface BirthdayFormProps {
	blockBuilder: BlockBuilder;
	birthday: string;
	shouldNotifyBirthday: boolean;
	roomName: string;
	roomId: string;
}

export const BIRTHDAY_FORM_ID = "BIRTHDAY_FORM_ID";
export const BIRTHDAY_INPUT_ACTION_ID = "BIRTHDAY_INPUT_ACTION_ID";
export const BIRTHDAY_INPUT_BLOCK_ID = "BIRTHDAY_INPUT_BLOCK_ID";
export const NOTIFY_SELECT_ACTION_ID = "NOTIFY_SELECT_ACTION_ID";
export const NOTIFY_SELECT_BLOCK_ID = "NOTIFY_SELECT_BLOCK_ID";

export const renderBirthdayForm = (props: BirthdayFormProps): IUIKitModalViewParam => {
	const { blockBuilder, roomName, birthday, shouldNotifyBirthday, roomId } = props;
	const localizer = getLocalizer();

	blockBuilder.addSectionBlock({
		text: blockBuilder.newPlainTextObject(localizer("birthdayForm_description"))
	});
	blockBuilder.addInputBlock({
		label: blockBuilder.newPlainTextObject(localizer("birthdayForm_birthday_label")),
		blockId: BIRTHDAY_INPUT_BLOCK_ID,
		element: {
			type: "datepicker" as BlockElementType,
			actionId: BIRTHDAY_INPUT_ACTION_ID,
			initialDate: birthday,
			initialValue: birthday,
			placeholder: blockBuilder.newPlainTextObject(localizer("birthdayForm_birthday_placeholder"))
		} as IInputElement
	});

	blockBuilder.addInputBlock({
		label: blockBuilder.newMarkdownTextObject(localizer("birthdayForm_shouldNotify_label", { roomName })),
		blockId: NOTIFY_SELECT_BLOCK_ID,
		element: blockBuilder.newStaticSelectElement({
			placeholder: blockBuilder.newPlainTextObject(localizer("birthdayForm_birthday_placeholder")),
			actionId: NOTIFY_SELECT_ACTION_ID,
			options: [
				{
					text: blockBuilder.newPlainTextObject(localizer("birthdayForm_shouldNotify_option_yes")),
					value: "yes"
				},
				{
					text: blockBuilder.newPlainTextObject(localizer("birthdayForm_shouldNotify_option_no")),
					value: "no"
				}
			],
			initialValue: shouldNotifyBirthday ? "yes" : "no"
		})
	});
	return {
		id: BIRTHDAY_FORM_ID,
		title: {
			type: TextObjectType.PLAINTEXT,
			text: localizer("birthdayForm_title")
		},
		blocks: blockBuilder.getBlocks(),
		close: blockBuilder.newButtonElement({
			text: blockBuilder.newPlainTextObject(localizer("birthdayForm_close_label")),
			style: ButtonStyle.DANGER
		}),
		submit: blockBuilder.newButtonElement({
			text: blockBuilder.newPlainTextObject(localizer("birthdayForm_submit_label")),
			style: ButtonStyle.PRIMARY
		}),
		roomId
	} as IUIKitModalViewParam;
};
