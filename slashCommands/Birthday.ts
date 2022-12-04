import { IHttp, IModify, IPersistence, IRead } from "@rocket.chat/apps-engine/definition/accessors";
import {
	ISlashCommand,
	ISlashCommandPreview,
	SlashCommandContext
} from "@rocket.chat/apps-engine/definition/slashcommands";

import { RocketChatAppsBirthdayApp } from "../RocketChatAppsBirthdayApp";
import { renderBirthdayForm } from "../uikit/birthday-form";
import { getBirthday, getShouldNotifyBirthday } from "../helpers/birthday-persistence-helper";
import { convertDateToDateString } from "../helpers/date-helper";

export class Birthday implements ISlashCommand {
	public command = "birthday";
	public i18nDescription = "slashCommand.birthday.description";
	public i18nParamsExample = "slashCommand.birthday.paramExample";
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

		if (!triggerId) {
			return;
		}

		const blockBuilder = modify.getCreator().getBlockBuilder();

		const birthday = (await getBirthday(sender.id, persistenceReader)) || convertDateToDateString();
		const shouldNotifyBirthday = await getShouldNotifyBirthday(sender.id, room.id, persistenceReader);

		console.log(birthday, shouldNotifyBirthday);

		const birthdayForm = renderBirthdayForm({
			blockBuilder,
			birthday,
			shouldNotifyBirthday,
			roomName: room.displayName || room.slugifiedName,
			roomId: room.id
		});

		await modify.getUiController().openModalView(birthdayForm, { triggerId }, sender);
	}

	public async previewer(
		context: SlashCommandContext,
		read: IRead,
		modify: IModify,
		http: IHttp,
		persis: IPersistence
	): Promise<ISlashCommandPreview> {
		throw new Error("Method not implemented");
	}
}
