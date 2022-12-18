import {
	IAppAccessors,
	IConfigurationExtend,
	IEnvironmentRead,
	IHttp,
	ILogger,
	IModify,
	IPersistence,
	IRead
} from "@rocket.chat/apps-engine/definition/accessors";
import { App } from "@rocket.chat/apps-engine/definition/App";
import { IAppInfo } from "@rocket.chat/apps-engine/definition/metadata";
import {
	IUIKitInteractionHandler,
	IUIKitResponse,
	UIKitViewSubmitInteractionContext
} from "@rocket.chat/apps-engine/definition/uikit";

import { Birthday } from "./slashCommands/Birthday";
import {
	BIRTHDAY_FORM_ID,
	BIRTHDAY_INPUT_ACTION_ID,
	BIRTHDAY_INPUT_BLOCK_ID,
	NOTIFY_SELECT_ACTION_ID,
	NOTIFY_SELECT_BLOCK_ID
} from "./uikit/birthday-form";
import { getLocalizer } from "./helpers/localization-helper";
import { saveBirthday, saveShouldNotifyRoom } from "./helpers/birthday-persistence-helper";
import { renderConfigNotification } from "./uikit/config-notification";

export class RocketChatAppsBirthdayApp extends App implements IUIKitInteractionHandler {
	constructor(info: IAppInfo, logger: ILogger, accessors: IAppAccessors) {
		super(info, logger, accessors);
	}

	protected async extendConfiguration(
		configuration: IConfigurationExtend,
		environmentRead: IEnvironmentRead
	): Promise<void> {
		await super.extendConfiguration(configuration, environmentRead);
		await configuration.slashCommands.provideSlashCommand(new Birthday(this));
	}

	async executeViewSubmitHandler(
		context: UIKitViewSubmitInteractionContext,
		read: IRead,
		http: IHttp,
		persistence: IPersistence,
		modify: IModify
	): Promise<IUIKitResponse> {
		const interactionData = context.getInteractionData();
		const { view, user, room } = interactionData;

		const localizer = getLocalizer();
		switch (view.id) {
			case BIRTHDAY_FORM_ID: {
				const state = view.state as any;
				const roomId = (view as any).roomId;

				if (!state || !roomId) {
					return context.getInteractionResponder().viewErrorResponse({
						viewId: view.id,
						errors: {
							[BIRTHDAY_INPUT_ACTION_ID]: localizer("birthdayForm_error_general")
						}
					});
				}

				const birthday = state[BIRTHDAY_INPUT_BLOCK_ID]?.[BIRTHDAY_INPUT_ACTION_ID];
				const shouldNotifyRoom = state[NOTIFY_SELECT_BLOCK_ID]?.[NOTIFY_SELECT_ACTION_ID];

				if (!birthday || !shouldNotifyRoom) {
					return context.getInteractionResponder().viewErrorResponse({
						viewId: view.id,
						errors: {
							[BIRTHDAY_INPUT_ACTION_ID]: localizer("birthdayForm_error_input")
						}
					});
				}

				await saveBirthday(user.id, birthday, persistence);
				await saveShouldNotifyRoom(
					user.id,
					roomId,
					shouldNotifyRoom === "yes",
					read.getPersistenceReader(),
					persistence
				);

				const appUser = await read.getUserReader().getAppUser();

				const notifiedRoom = await read.getRoomReader().getById(roomId);
				if (notifiedRoom && appUser) {
					const builder = modify
						.getNotifier()
						.getMessageBuilder()
						.setRoom(notifiedRoom)
						.setSender(appUser)
						.setBlocks(renderConfigNotification({ blockBuilder: modify.getCreator().getBlockBuilder() }));

					await modify.getNotifier().notifyUser(user, builder.getMessage());
				}

				return { success: true };
			}
			default: {
				return { success: false };
			}
		}
	}

	async executeViewClosedHandler(): Promise<IUIKitResponse> {
		return {
			success: true
		};
	}
}
