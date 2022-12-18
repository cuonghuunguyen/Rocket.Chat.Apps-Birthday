import { BlockBuilder, IBlock } from "@rocket.chat/apps-engine/definition/uikit";

import { getLocalizer } from "../helpers/localization-helper";

type ConfigNotificationProps = {
	blockBuilder: BlockBuilder;
};

export const renderConfigNotification = ({ blockBuilder }: ConfigNotificationProps): IBlock[] => {
	const localizer = getLocalizer();

	blockBuilder.addContextBlock({
		elements: [
			blockBuilder.newImageElement({
				imageUrl: "https://i.postimg.cc/mZK8xKNY/correct.png",
				altText: localizer("removeNotification_image_alt")
			}),
			blockBuilder.newPlainTextObject(localizer("configNotification_text"))
		]
	});
	return blockBuilder.getBlocks();
};
