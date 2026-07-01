const en = {
    editProductModal: {
        title: 'Edit Product',
        nameLabel: 'Name',
        typeLabel: 'Type',
        amountLabel: 'Amount',
        currencyLabel: 'Currency',
        replaceImageLabel: 'Replace Image',
        cancelButton: 'Cancel',
        submittingLabel: 'Saving...',
        submitButton: 'Save Changes',
        serverError: 'Something went wrong',
        validation: {
            nameRequired: 'Name is required',
            typeInvalid: 'Invalid product type',
            typeRequired: 'Type is required',
            amountNotNumber: 'Amount must be a number',
            amountRequired: 'Amount is required',
            amountNonNegative: 'Amount must be non-negative',
            currencyInvalid: 'Invalid currency',
            currencyRequired: 'Currency is required',
            imageWrongFormat: 'Wrong image format',
            imageIncompatibleSize: 'Incompitible image size',
            imageWrongDimensions: 'Incorrect image dimension',
        },
    },
} as const;

export default en;
