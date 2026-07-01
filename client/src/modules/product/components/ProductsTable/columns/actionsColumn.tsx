import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { IconButton } from '@mui/material';

import { IColumn } from '@modules/common/components';
import { IProduct } from '@modules/product/types';

import { ProductsTableTranslator } from './types';

export interface IProductActionHandlers {
    onEdit: (product: IProduct) => void;
    onDelete: (product: IProduct) => void;
}

export const actionsColumn = (
    t: ProductsTableTranslator,
    { onEdit, onDelete }: IProductActionHandlers,
): IColumn<IProduct> => ({
    key: 'actions',
    header: '',
    align: 'right',
    cell: (product) => (
        <>
            <IconButton
                size="small"
                aria-label={t('ariaLabels.editProduct')}
                onClick={() => onEdit(product)}
            >
                <EditIcon fontSize="small" />
            </IconButton>
            <IconButton
                size="small"
                color="error"
                aria-label={t('ariaLabels.deleteProduct')}
                onClick={() => onDelete(product)}
            >
                <DeleteIcon fontSize="small" />
            </IconButton>
        </>
    ),
});
