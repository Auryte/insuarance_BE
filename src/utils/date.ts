export const getTime = (date: string) => new Date(date).getTime();

export const isValidBetweenDates = (
  mainDate: string,
  startDate: string,
  endDate: string
): boolean => getTime(startDate) < getTime(mainDate) && getTime(mainDate) < getTime(endDate);
