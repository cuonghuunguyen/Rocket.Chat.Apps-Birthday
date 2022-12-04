export const convertDateToDateString = (date: Date = new Date()) => {
	const yyyy = date.getFullYear();
	let mm: string | number = date.getMonth() + 1; // Months start at 0!
	let dd: string | number = date.getDate();

	if (dd < 10) {
		dd = "0" + dd;
	}
	if (mm < 10) {
		mm = "0" + mm;
	}

	return `${yyyy}-${mm}-${dd}`;
};
