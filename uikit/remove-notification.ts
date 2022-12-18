import { BlockBuilder, IBlock } from "@rocket.chat/apps-engine/definition/uikit";

import { getLocalizer } from "../helpers/localization-helper";

type RemoveNotificationProps = {
	blockBuilder: BlockBuilder;
};

export const renderRemoveNotification = ({ blockBuilder }: RemoveNotificationProps): IBlock[] => {
	const localizer = getLocalizer();

	blockBuilder.addContextBlock({
		elements: [
			blockBuilder.newImageElement({
				imageUrl: "https://i.postimg.cc/mZK8xKNY/correct.png",
				altText: localizer("removeNotification_image_alt")
			}),
			blockBuilder.newPlainTextObject(localizer("removeNotification_text"))
		]
	});
	return blockBuilder.getBlocks();
};
