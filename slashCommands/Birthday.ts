import { IHttp, IModify, IPersistence, IRead } from "@rocket.chat/apps-engine/definition/accessors";
import { ISlashCommand, SlashCommandContext } from "@rocket.chat/apps-engine/definition/slashcommands";

import { RocketChatAppsBirthdayApp } from "../RocketChatAppsBirthdayApp";
import { renderBirthdayForm } from "../uikit/birthday-form";
import { eraseUserData, getBirthday, getShouldNotifyBirthday } from "../helpers/birthday-persistence-helper";
import { convertDateToDateString } from "../helpers/date-helper";
import { renderRemoveNotification } from "../uikit/remove-notification";
import { getLocalizer } from "../helpers/localization-helper";

export enum BirthdaySubCommand {
	CONFIG = "config",
	REMOVE = "remove"
}

export class Birthday implements ISlashCommand {
	public command = "birthday";
	public i18nDescription = "slashCommand_birthday_description";
	public i18nParamsExample = "slashCommand_birthday_paramExample";
	public permission = "";
	public providesPreview = false;

	constructor(private readonly app: RocketChatAppsBirthdayApp) {}

	public async executor(
		context: SlashCommandContext,
		read: IRead,
		modify: IModify,
		http: IHttp,
		persis: IPersistence
	): Promise<void> {
		const [subCommand] = context.getArguments();
		const sender = context.getSender();
		const room = context.getRoom();
		const triggerId = context.getTriggerId();
		const persistenceReader = read.getPersistenceReader();
		const localizer = getLocalizer();

		if (!triggerId) {
			console.error("no trigger id");
			return;
		}
		const appUser = await read.getUserReader().getAppUser();
		switch (subCommand) {
			case BirthdaySubCommand.CONFIG: {
				const blockBuilder = modify.getCreator().getBlockBuilder();

				const birthday = (await getBirthday(sender.id, persistenceReader)) || convertDateToDateString();
				const shouldNotifyBirthday = await getShouldNotifyBirthday(sender.id, room.id, persistenceReader);

				const birthdayForm = renderBirthdayForm({
					blockBuilder,
					birthday,
					shouldNotifyBirthday,
					roomName: room.displayName || room.slugifiedName,
					roomId: room.id
				});

				return modify.getUiController().openModalView(birthdayForm, { triggerId }, sender);
			}
			case BirthdaySubCommand.REMOVE: {
				await eraseUserData(sender.id, persis);
				const builder = modify
					.getNotifier()
					.getMessageBuilder()
					.setRoom(room)
					.setSender(appUser!)
					.setBlocks(renderRemoveNotification({ blockBuilder: modify.getCreator().getBlockBuilder() }));

				await modify.getNotifier().notifyUser(sender, builder.getMessage());
				return;
			}
			default: {
				const builder = modify
					.getNotifier()
					.getMessageBuilder()
					.setRoom(room)
					.setSender(appUser!)
					.setText(localizer("helpText"));
				await modify.getNotifier().notifyUser(sender, builder.getMessage());
			}
		}
	}
}
