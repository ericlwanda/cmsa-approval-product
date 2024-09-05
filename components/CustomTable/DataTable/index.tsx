import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ColumnDef,
  ColumnFiltersState,
  OnChangeFn,
  PaginationState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type Table as ReactTable,
  RowSelectionState,
} from "@tanstack/react-table";
import { Skeleton } from "@/components/ui/skeleton";
import { DataTablePagination } from "./DataTablePagination";

export interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  title?: string;
  description?: string;
  pageCount?: number;
  pagination?: PaginationState;
  SetPagination?: OnChangeFn<PaginationState>;
  paginated?: boolean;
  onRowClicked?: (id: any) => void;
  loading?: boolean;
  rowSelection: RowSelectionState;
  setRowSelection: OnChangeFn<RowSelectionState>;
  emptyState?: React.ReactNode;
}

const DataTable = <TData, TValue>({
  columns,
  data,
  title,
  description,
  pageCount,
  pagination,
  SetPagination,
  paginated,
  onRowClicked,
  loading,
  emptyState,
  rowSelection,
  setRowSelection,
}: DataTableProps<TData, TValue>) => {
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  // RowSelectionState
  const table = useReactTable({
    data,
    columns,
    pageCount: pageCount ?? 0,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    manualPagination: true,
    onPaginationChange: SetPagination,
  });

  return (
    <>
      {loading ? (
        <SkeletonLoader table={table} />
      ) : (
        <div className=" flex-1 flex-col flex">
          <div className="border-b">
            {/* <DataTableToolbar table={table} /> */}
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead className="px-4" key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell
                          onClick={() =>
                            onRowClicked && !cell.column.columnDef.enableHiding
                              ? onRowClicked(row.original)
                              : () => {}
                          }
                          className="px-4"
                          key={cell.id}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      {!emptyState ? <span> No results.</span> : emptyState}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          {paginated && <DataTablePagination table={table} />}
        </div>
      )}
    </>
  );
};

export default DataTable;

const SkeletonLoader = ({ table }: { table: any }) => {
  const count = table.getAllColumns().length ?? 0;
  return (
    <div className=" flex-1 flex-col flex">
      <div className="border-b">
        <Table>
          <TableHeader>
            <TableRow>
              {Array.from({ length: count }, (_, rowIndex) => {
                return (
                  <TableHead className="" key={rowIndex}>
                    <Skeleton className="  h-3" />
                  </TableHead>
                );
              })}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 6 }, (_, rowIndex) => (
              <TableRow key={rowIndex}>
                {Array.from({ length: count }, (_, cellIndex) => (
                  <TableCell key={cellIndex}>
                    <Skeleton className="  h-3" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
