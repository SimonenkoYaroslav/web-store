const en = {
    productFormFields: {
        nameLabel: 'Name',
        typeLabel: 'Type',
        billingIntervalLabel: 'Billing Interval',
        amountLabel: 'Amount',
        currencyLabel: 'Currency',
        validation: {
            nameRequired: 'Name is required',
            typeInvalid: 'Invalid product type',
            typeRequired: 'Type is required',
            intervalInvalid: 'Invalid billing interval',
            intervalRequired: 'Billing interval is required',
            amountNotNumber: 'Amount must be a number',
            amountRequired: 'Amount is required',
            amountNonNegative: 'Amount must be non-negative',
            currencyInvalid: 'Invalid currency',
            currencyRequired: 'Currency is required',
            imageRequired: 'Image is required',
            imageWrongFormat: 'Wrong image format',
            imageIncompatibleSize: 'Incompatible image size',
            imageWrongDimensions: 'Incorrect image dimension',
        },
    },
} as const;

export default en;
