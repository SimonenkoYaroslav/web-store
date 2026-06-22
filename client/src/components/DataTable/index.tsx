import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from '@mui/material';
import { ReactNode } from 'react';

export interface IColumn<T> {
    key: string;
    header: ReactNode;
    cell: (row: T) => ReactNode;
    align?: 'left' | 'center' | 'right';
}

interface IDataTableProps<T> {
    columns: IColumn<T>[];
    rows: T[];
    getRowKey: (row: T) => string;
    emptyMessage?: string;
}

/**
 * Column-driven table primitive.
 *
 * Encapsulates the Paper-wrapped MUI table shell, header styling and hover
 * rows so every table on the platform stays visually consistent. Callers
 * describe their data via `columns`; the table owns the markup.
 */
function DataTable<T>({ columns, rows, getRowKey, emptyMessage = 'No data found.' }: IDataTableProps<T>) {
    if (rows.length === 0) {
        return (
            <div className="glass-panel py-12 text-center uppercase tracking-wider text-brand-600">
                {emptyMessage}
            </div>
        );
    }

    return (
        <TableContainer
            component={Paper}
            className="overflow-hidden border-2 border-brand-950 brutal-shadow"
        >
            <Table>
                <TableHead>
                    <TableRow>
                        {columns.map((column) => (
                            <TableCell
                                key={column.key}
                                align={column.align}
                            >
                                {column.header}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row) => (
                        <TableRow key={getRowKey(row)} className="transition-colors hover:bg-brand-50/70">
                            {columns.map((column) => (
                                <TableCell key={column.key} align={column.align}>
                                    {column.cell(row)}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default DataTable;
