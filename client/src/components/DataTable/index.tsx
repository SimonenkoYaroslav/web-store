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
        return <p className="text-center text-gray-500 py-8">{emptyMessage}</p>;
    }

    return (
        <TableContainer component={Paper} className="rounded-lg overflow-hidden shadow">
            <Table>
                <TableHead className="bg-gray-100">
                    <TableRow>
                        {columns.map((column) => (
                            <TableCell
                                key={column.key}
                                align={column.align}
                                className="font-semibold text-gray-800"
                            >
                                {column.header}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row) => (
                        <TableRow key={getRowKey(row)} className="hover:bg-gray-50">
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
