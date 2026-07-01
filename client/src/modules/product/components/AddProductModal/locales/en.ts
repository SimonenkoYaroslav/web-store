const en = {
    addProductModal: {
        title: 'Add Product',
        nameLabel: 'Name',
        typeLabel: 'Type',
        billingIntervalLabel: 'Billing Interval',
        amountLabel: 'Amount',
        currencyLabel: 'Currency',
        cancelButton: 'Cancel',
        submittingLabel: 'Adding...',
        submitButton: 'Add Product',
        serverError: 'Something went wrong',
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
            imageIncompatibleSize: 'Incompitible image size',
            imageWrongDimensions: 'Incorrect image dimension',
        },
    },
} as const;

export default en;
