import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { IconButton } from '@mui/material';

import { IColumn } from '@modules/common/components';
import en from '@modules/product/locales/en';
import { IProduct } from '@modules/product/types';

const t = en.productsTable;

export interface IProductActionHandlers {
    onEdit: (product: IProduct) => void;
    onDelete: (product: IProduct) => void;
}

export const actionsColumn = ({ onEdit, onDelete }: IProductActionHandlers): IColumn<IProduct> => ({
    key: 'actions',
    header: '',
    align: 'right',
    cell: (product) => (
        <>
            <IconButton
                size="small"
                aria-label={t.ariaLabels.editProduct}
                onClick={() => onEdit(product)}
            >
                <EditIcon fontSize="small" />
            </IconButton>
            <IconButton
                size="small"
                color="error"
                aria-label={t.ariaLabels.deleteProduct}
                onClick={() => onDelete(product)}
            >
                <DeleteIcon fontSize="small" />
            </IconButton>
        </>
    ),
});
