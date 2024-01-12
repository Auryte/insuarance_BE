export const capitalize = (string?: string): string =>
  `${string && string[0].toUpperCase()}${string?.slice(1)}`;

export const getSearchOptionValue = (defaultValue: number, value: string | number): number => {
  const numberValue = Number.parseInt(value.toString(), 10);
  return Number.isNaN(numberValue) ? defaultValue : numberValue;
};

export const addZeros = (counter: number, size: number): string => {
  let counterString = counter.toString();
  while (counterString.length < size) counterString = `0${counterString}`;
  return counterString;
};

export const generateRandomCapitalLetter = (): string =>
  String.fromCharCode(Math.floor(Math.random() * 26) + 97).toUpperCase();
