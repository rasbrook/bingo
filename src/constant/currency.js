export const MIN_BET_UGX = 1000;

const ugxFormatter = new Intl.NumberFormat('en-UG', {
    style: 'currency',
    currency: 'UGX',
    currencyDisplay: 'code',
    maximumFractionDigits: 0
});

export const formatUGX = (amount) => ugxFormatter.format(Number(amount));
