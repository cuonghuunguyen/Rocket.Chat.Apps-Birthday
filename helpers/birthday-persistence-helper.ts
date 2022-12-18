import { IPersistence, IPersistenceRead } from "@rocket.chat/apps-engine/definition/accessors";
import { RocketChatAssociationModel, RocketChatAssociationRecord } from "@rocket.chat/apps-engine/definition/metadata";

export interface NotifiedRoomListRecord {
	rooms: string[];
}

export interface BirthdayRecord {
	birthday: string;
}

const getUserBirthdayAssociations = (userId: string): RocketChatAssociationRecord[] => {
	return [new RocketChatAssociationRecord("birthday" as RocketChatAssociationModel, userId)];
};

const getNotifiedRoomsAssociations = (userId: string): RocketChatAssociationRecord[] => {
	return [new RocketChatAssociationRecord("notified-room" as RocketChatAssociationModel, userId)];
};

export const saveBirthday = async (userId: string, birthday: string, persistence: IPersistence) => {
	await persistence.updateByAssociations(getUserBirthdayAssociations(userId), { birthday } as BirthdayRecord, true);
};

export const getBirthday = async (userId: string, persistenceRead: IPersistenceRead) => {
	const [record] = await persistenceRead.readByAssociations(getUserBirthdayAssociations(userId));
	return (record as BirthdayRecord)?.birthday;
};

export const getShouldNotifyBirthday = async (userId: string, roomId: string, persistenceRead: IPersistenceRead) => {
	const notifiedRooms = await getNotifiedRoomsForBirthday(userId, persistenceRead);
	return notifiedRooms.some(id => id === roomId);
};

export const getNotifiedRoomsForBirthday = async (userId: string, persistenceRead: IPersistenceRead) => {
	const [record] = await persistenceRead.readByAssociations(getNotifiedRoomsAssociations(userId));
	return (record as NotifiedRoomListRecord)?.rooms || [];
};

export const saveNotifiedRoomList = async (userId: string, notifiedRoomList: string[], persistence: IPersistence) => {
	await persistence.updateByAssociations(
		getNotifiedRoomsAssociations(userId),
		{ rooms: notifiedRoomList } as NotifiedRoomListRecord,
		true
	);
};

export const saveShouldNotifyRoom = async (
	userId: string,
	roomId: string,
	shouldNotifyRoom: boolean,
	persistenceRead: IPersistenceRead,
	persistence: IPersistence
) => {
	const notifiedRooms = new Set(await getNotifiedRoomsForBirthday(userId, persistenceRead));
	if (shouldNotifyRoom) {
		notifiedRooms.add(roomId);
	} else {
		notifiedRooms.delete(roomId);
	}

	return saveNotifiedRoomList(userId, Array.from(notifiedRooms), persistence);
};

export const eraseUserData = async (userId: string, persistence: IPersistence) => {
	await persistence.removeByAssociations(getUserBirthdayAssociations(userId));
	await persistence.removeByAssociations(getNotifiedRoomsAssociations(userId));
};
