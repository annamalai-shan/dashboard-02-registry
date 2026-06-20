"use client"

import * as React from "react"
import {
  IconArrowsSort,
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconCircleCheckFilled,
  IconClock,
  IconDotsVertical,
  IconInbox,
  IconLayoutColumns,
  IconPlus,
  IconSearch,
  IconSortAscending,
  IconSortDescending,
  IconUserOff,
} from "@tabler/icons-react"
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table"
import { z } from "zod"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

// ---------------------------------------------------------------------------
// Generic reusable DataTable component
// ---------------------------------------------------------------------------

/**
 * Sortable column header — renders a button that toggles asc / desc / none.
 * Use inside a column's `header` definition:
 *
 *   header: ({ column }) => <DataTableSortHeader column={column}>Name</DataTableSortHeader>
 */
export function DataTableSortHeader({
  column,
  children,
}: {
  column: {
    getIsSorted: () => false | "asc" | "desc"
    toggleSorting: (desc?: boolean) => void
  }
  children: React.ReactNode
}) {
  const sorted = column.getIsSorted()
  return (
    <Button
      variant="ghost"
      size="sm"
      className="-ml-3 h-8"
      onClick={() => column.toggleSorting(sorted === "asc")}
    >
      {children}
      {sorted === "asc" ? (
        <IconSortAscending className="ml-1 size-4" />
      ) : sorted === "desc" ? (
        <IconSortDescending className="ml-1 size-4" />
      ) : (
        <IconArrowsSort className="ml-1 size-4 text-muted-foreground/50" />
      )}
    </Button>
  )
}

/** Default empty state shown when data is empty and not loading. */
function DefaultEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="rounded-full bg-muted p-3">
        <IconInbox className="size-6 text-muted-foreground" />
      </div>
      <h3 className="mt-4 text-sm font-medium">No results found</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Try adjusting your filters.
      </p>
    </div>
  )
}

/** Loading skeleton that mirrors table structure with realistic column widths. */
function DataTableLoadingState({
  rowCount = 5,
}: {
  rowCount?: number
}) {
  return (
    <div className="overflow-hidden rounded-lg border">
      <Table>
        <TableHeader className="bg-muted">
          <TableRow>
            <TableHead className="w-10">
              <Skeleton className="size-4" />
            </TableHead>
            <TableHead>
              <Skeleton className="h-4 w-16" />
            </TableHead>
            <TableHead>
              <Skeleton className="h-4 w-14" />
            </TableHead>
            <TableHead>
              <Skeleton className="h-4 w-10" />
            </TableHead>
            <TableHead>
              <Skeleton className="h-4 w-14" />
            </TableHead>
            <TableHead>
              <Skeleton className="ml-auto h-4 w-16" />
            </TableHead>
            <TableHead className="w-10" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: rowCount }).map((_, i) => (
            <TableRow key={i}>
              <TableCell>
                <Skeleton className="size-4 rounded-sm" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-28" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-36" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-5 w-16 rounded-full" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-5 w-16 rounded-full" />
              </TableCell>
              <TableCell>
                <Skeleton className="ml-auto h-4 w-20" />
              </TableCell>
              <TableCell>
                <Skeleton className="size-8 rounded-md" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

interface DataTableFilterOption {
  label: string
  value: string
}

interface DataTableFilter {
  /** The column id to filter. */
  columnId: string
  /** Display label for the filter. */
  label: string
  /** Filter options including an "all" option. */
  options: DataTableFilterOption[]
}

interface DataTableProps<TData, TValue> {
  /** Column definitions — use TanStack ColumnDef<TData, TValue>. */
  columns: ColumnDef<TData, TValue>[]
  /** The data array to render. */
  data: TData[]
  /** Show loading skeleton instead of data. @default false */
  loading?: boolean
  /** Enable pagination controls. @default true */
  pagination?: boolean
  /** Enable column sorting. @default true */
  sorting?: boolean
  /** Search placeholder & column key for the filter input. */
  filterColumn?: string
  /** Placeholder text for the filter input. @default "Filter..." */
  filterPlaceholder?: string
  /** Custom dropdown filters for specific columns. */
  filters?: DataTableFilter[]
  /** Custom empty state component. Falls back to a sensible default. */
  emptyState?: React.ReactNode
  /** Optional toolbar actions (buttons) rendered after the column toggle. */
  toolbarActions?: React.ReactNode
}

/**
 * A generic, reusable data table built on TanStack Table and shadcn/ui.
 *
 * @example
 * ```tsx
 * <DataTable
 *   columns={columns}
 *   data={users}
 *   loading={isLoading}
 *   pagination
 *   sorting
 *   filterColumn="name"
 *   filterPlaceholder="Search users..."
 * />
 * ```
 */
export function DataTableBase<TData, TValue>({
  columns,
  data,
  loading = false,
  pagination: enablePagination = true,
  sorting: enableSorting = true,
  filterColumn,
  filterPlaceholder = "Filter...",
  filters,
  emptyState,
  toolbarActions,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [sortingState, setSortingState] = React.useState<SortingState>([])
  const [paginationState, setPaginationState] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  })

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting: sortingState,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination: paginationState,
    },
    enableRowSelection: true,
    enableSorting: enableSorting,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSortingState,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPaginationState,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    ...(enablePagination && {
      getPaginationRowModel: getPaginationRowModel(),
    }),
    ...(enableSorting && { getSortedRowModel: getSortedRowModel() }),
  })

  // ---- Loading ----
  if (loading) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-1 items-center gap-2">
            <Skeleton className="h-9 w-40 lg:w-64" />
            <Skeleton className="hidden h-9 w-28 sm:block" />
            <Skeleton className="hidden h-9 w-24 sm:block" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-9 w-28" />
          </div>
        </div>
        <DataTableLoadingState rowCount={5} />
        <div className="flex items-center justify-between">
          <Skeleton className="hidden h-4 w-40 lg:block" />
          <div className="flex w-full items-center gap-4 lg:w-fit">
            <Skeleton className="hidden h-9 w-32 lg:block" />
            <Skeleton className="h-4 w-24" />
            <div className="ml-auto flex items-center gap-2 lg:ml-0">
              <Skeleton className="hidden size-8 lg:block" />
              <Skeleton className="size-8" />
              <Skeleton className="size-8" />
              <Skeleton className="hidden size-8 lg:block" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {/* ---- Toolbar ---- */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex flex-1 items-center gap-2">
          {filterColumn ? (
            <div className="relative md:max-w-sm">
              <IconSearch className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
              <Input
                placeholder={filterPlaceholder}
                value={
                  (table.getColumn(filterColumn)?.getFilterValue() as string) ??
                  ""
                }
                onChange={(event) =>
                  table
                    .getColumn(filterColumn)
                    ?.setFilterValue(event.target.value)
                }
                className="h-9 w-40 pl-9 lg:w-64"
              />
            </div>
          ) : null}
          {filters?.map((filter) => {
            const column = table.getColumn(filter.columnId)
            if (!column) return null
            return (
              <Select
                key={filter.columnId}
                value={
                  (column.getFilterValue() as string) ?? "all"
                }
                onValueChange={(value) =>
                  column.setFilterValue(value === "all" ? undefined : value)
                }
              >
                <SelectTrigger size="sm" className="w-auto gap-1">
                  <span className="text-muted-foreground">
                    {filter.label}:
                  </span>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {filter.options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )
          })}
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="outline" size="sm" />}><IconLayoutColumns /><span className="hidden lg:inline">Columns</span><IconChevronDown /></DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {table
                .getAllColumns()
                .filter(
                  (column) =>
                    typeof column.accessorFn !== "undefined" &&
                    column.getCanHide()
                )
                .map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
          {toolbarActions}
        </div>
      </div>

      {/* ---- Table ---- */}
      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader className="bg-muted">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="[&_tr]:transition-colors">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="animate-in fade-in-50 duration-200"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
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
                <TableCell colSpan={columns.length} className="p-0">
                  <div className="animate-in fade-in-0 zoom-in-95 duration-300">
                    {emptyState ?? <DefaultEmptyState />}
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* ---- Footer: selection count + pagination ---- */}
      {enablePagination && (
        <div className="flex items-center justify-between">
          <div className="hidden flex-1 text-sm text-muted-foreground lg:flex">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          <div className="flex w-full items-center gap-8 lg:w-fit">
            <div className="hidden items-center gap-2 lg:flex">
              <Label htmlFor="rows-per-page" className="text-sm font-medium">
                Rows per page
              </Label>
              <Select
                value={`${table.getState().pagination.pageSize}`}
                onValueChange={(value) => table.setPageSize(Number(value))}
              >
                <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                  <SelectValue
                    placeholder={table.getState().pagination.pageSize}
                  />
                </SelectTrigger>
                <SelectContent side="top">
                  {[10, 20, 30, 40, 50].map((size) => (
                    <SelectItem key={size} value={`${size}`}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex w-fit items-center justify-center text-sm font-medium">
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </div>
            <div className="ml-auto flex items-center gap-2 lg:ml-0">
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to first page</span>
                <IconChevronsLeft />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to previous page</span>
                <IconChevronLeft />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to next page</span>
                <IconChevronRight />
              </Button>
              <Button
                variant="outline"
                className="hidden size-8 lg:flex"
                size="icon"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to last page</span>
                <IconChevronsRight />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Dashboard-specific: Customer columns, schema, and composed DataTable
// ---------------------------------------------------------------------------

export const schema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string(),
  plan: z.string(),
  status: z.string(),
  revenue: z.string(),
  joinDate: z.string(),
})

type Customer = z.infer<typeof schema>

const customerColumns: ColumnDef<Customer, unknown>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableSortHeader column={column}>Name</DataTableSortHeader>
    ),
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("name")}</div>
    ),
    enableHiding: false,
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableSortHeader column={column}>Email</DataTableSortHeader>
    ),
    cell: ({ row }) => (
      <div className="text-muted-foreground">{row.getValue("email")}</div>
    ),
  },
  {
    accessorKey: "plan",
    header: ({ column }) => (
      <DataTableSortHeader column={column}>Plan</DataTableSortHeader>
    ),
    cell: ({ row }) => {
      const plan = row.getValue("plan") as string
      return (
        <Badge
          variant="outline"
          className={
            plan === "Enterprise"
              ? "border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-800 dark:bg-violet-950 dark:text-violet-300"
              : plan === "Pro"
                ? "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300"
                : "px-1.5 text-muted-foreground"
          }
        >
          {plan}
        </Badge>
      )
    },
    filterFn: (row, id, value) => {
      if (!value || value === "all") return true
      return row.getValue(id) === value
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      return (
        <Badge variant="outline" className="px-1.5 text-muted-foreground">
          {status === "Active" ? (
            <IconCircleCheckFilled className="fill-green-500 dark:fill-green-400" />
          ) : status === "Inactive" ? (
            <IconClock className="text-yellow-500" />
          ) : (
            <IconUserOff className="text-red-500" />
          )}
          {status}
        </Badge>
      )
    },
    filterFn: (row, id, value) => {
      if (!value || value === "all") return true
      return row.getValue(id) === value
    },
  },
  {
    accessorKey: "revenue",
    header: ({ column }) => (
      <div className="text-right">
        <DataTableSortHeader column={column}>Revenue</DataTableSortHeader>
      </div>
    ),
    cell: ({ row }) => (
      <div className="text-right font-medium tabular-nums">
        {row.getValue("revenue")}
      </div>
    ),
  },
  {
    id: "actions",
    cell: () => (
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant="ghost" className="flex size-8 text-muted-foreground data-[state=open]:bg-muted" size="icon" />}><IconDotsVertical /><span className="sr-only">Open menu</span></DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-32">
          <DropdownMenuItem>View</DropdownMenuItem>
          <DropdownMenuItem>Edit</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
]

/** Full-page skeleton used with Suspense in page.tsx. */
export function DataTableSkeleton() {
  return (
    <div className="space-y-4 px-4 lg:px-6">
      <div className="flex items-center justify-between gap-2">
        <div className="flex flex-1 items-center gap-2">
          <Skeleton className="h-9 w-40 lg:w-64" />
          <Skeleton className="hidden h-9 w-28 sm:block" />
          <Skeleton className="hidden h-9 w-24 sm:block" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-28" />
        </div>
      </div>
      <DataTableLoadingState rowCount={5} />
      <div className="flex items-center justify-between">
        <Skeleton className="hidden h-4 w-40 lg:block" />
        <div className="flex w-full items-center gap-4 lg:w-fit">
          <Skeleton className="hidden h-9 w-32 lg:block" />
          <Skeleton className="h-4 w-24" />
          <div className="ml-auto flex items-center gap-2 lg:ml-0">
            <Skeleton className="hidden size-8 lg:block" />
            <Skeleton className="size-8" />
            <Skeleton className="size-8" />
            <Skeleton className="hidden size-8 lg:block" />
          </div>
        </div>
      </div>
    </div>
  )
}

function CustomerEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="rounded-full bg-muted p-3">
        <IconInbox className="size-6 text-muted-foreground" />
      </div>
      <h3 className="mt-4 text-sm font-medium">No customers found</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Try adjusting your search or filter to find what you&apos;re looking
        for.
      </p>
      <Button variant="outline" size="sm" className="mt-4">
        <IconPlus />
        Add Customer
      </Button>
    </div>
  )
}

/**
 * Dashboard-02 composed DataTable.
 * All filtering (search, status, plan) lives in one unified toolbar.
 * Includes demo toggles to preview loading and empty states.
 */
export function DataTable({ data }: { data: Customer[] }) {
  const [demoLoading, setDemoLoading] = React.useState(false)
  const [demoEmpty, setDemoEmpty] = React.useState(false)

  return (
    <div className="flex flex-col gap-4 px-4 lg:px-6">
      {/* Demo state toggles */}
      <div className="flex items-center gap-2">
        <Button
          variant={demoLoading ? "default" : "outline"}
          size="sm"
          onClick={() => {
            setDemoLoading(!demoLoading)
            setDemoEmpty(false)
          }}
        >
          {demoLoading ? "Hide" : "Show"} Loading State
        </Button>
        <Button
          variant={demoEmpty ? "default" : "outline"}
          size="sm"
          onClick={() => {
            setDemoEmpty(!demoEmpty)
            setDemoLoading(false)
          }}
        >
          {demoEmpty ? "Hide" : "Show"} Empty State
        </Button>
      </div>
      <DataTableBase
        columns={customerColumns}
        data={demoEmpty ? [] : data}
        loading={demoLoading}
        sorting
        pagination
        filterColumn="name"
        filterPlaceholder="Filter by name..."
        filters={[
          {
            columnId: "status",
            label: "Status",
            options: [
              { label: "All Statuses", value: "all" },
              { label: "Active", value: "Active" },
              { label: "Inactive", value: "Inactive" },
            ],
          },
          {
            columnId: "plan",
            label: "Plan",
            options: [
              { label: "All Plans", value: "all" },
              { label: "Free", value: "Free" },
              { label: "Pro", value: "Pro" },
              { label: "Enterprise", value: "Enterprise" },
            ],
          },
        ]}
        emptyState={<CustomerEmptyState />}
        toolbarActions={
          <Button variant="outline" size="sm">
            <IconPlus />
            <span className="hidden lg:inline">Add Customer</span>
          </Button>
        }
      />
    </div>
  )
}
