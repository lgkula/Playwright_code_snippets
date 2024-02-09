export const convertCurrencyAmountToNumber = (
    plnAmountText: string,
): number => {
    return parseFloat(plnAmountText.replace(',', '.').replace(/[^\d.-]/g, ''));
};
