import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, ChevronRight, ChevronLeft, ChevronsRight, ChevronsLeft } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface Column<T> {
  key: string
  label: string
  render?: (value: any, row: T) => React.ReactNode
  sortable?: boolean
  width?: string
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  totalPages?: number
  currentPage?: number
  onPageChange?: (page: number) => void
  searchValue?: string
  onSearch?: (value: string) => void
  searchPlaceholder?: string
  isLoading?: boolean
  actions?: React.ReactNode
  emptyMessage?: string
  onRowClick?: (row: T) => void
}

export default function DataTable<T extends Record<string, any>>({
  columns,
  data,
  totalPages = 1,
  currentPage = 1,
  onPageChange,
  searchValue,
  onSearch,
  searchPlaceholder = 'بحث...',
  isLoading,
  actions,
  emptyMessage = 'لا توجد بيانات',
  onRowClick,
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null)
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  const sortedData = sortKey
    ? [...data].sort((a, b) => {
        const aVal = a[sortKey]
        const bVal = b[sortKey]
        const cmp = typeof aVal === 'string' ? aVal.localeCompare(bVal) : (aVal - bVal)
        return sortDir === 'asc' ? cmp : -cmp
      })
    : data

  return (
    <div className="glass-card overflow-hidden">
      {/* Header — Glass search + actions */}
      {(onSearch || actions) && (
        <div className="flex items-center justify-between p-4 border-b border-border/40">
          {onSearch && (
            <div className="relative w-72">
              <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground gold-icon" />
              <input
                type="text"
                value={searchValue || ''}
                onChange={(e) => onSearch(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full h-10 pr-10 pl-4 rounded-xl bg-surface2/60 backdrop-blur-sm border border-border/40 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/15 focus:bg-surface2/80 transition-all duration-300"
              />
            </div>
          )}
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border/40 bg-surface/30">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={cn(
                    'px-4 py-3.5 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider',
                    col.sortable && 'cursor-pointer hover:text-primary transition-colors duration-300',
                    col.width
                  )}
                  onClick={() => col.sortable && handleSort(col.key)}
                >
                  <span className="flex items-center gap-1.5">
                    {col.label}
                    {col.sortable && sortKey === col.key && (
                      <span className="text-primary text-[10px]">{sortDir === 'asc' ? '▲' : '▼'}</span>
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b border-border/20">
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3.5">
                      <div className="h-4 rounded-lg shimmer" />
                    </td>
                  ))}
                </tr>
              ))
            ) : sortedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-16 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-surface2/60 flex items-center justify-center">
                      <Search size={20} className="text-muted-foreground/50" />
                    </div>
                    <p className="text-muted-foreground text-sm">{emptyMessage}</p>
                  </div>
                </td>
              </tr>
            ) : (
              <AnimatePresence>
                {sortedData.map((row, idx) => (
                  <motion.tr
                    key={row.id || idx}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.015, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className={cn(
                      'border-b border-border/20 transition-all duration-300',
                      onRowClick && 'cursor-pointer hover:bg-primary/[0.04] hover:shadow-[inset_3px_0_0_var(--primary)]',
                      !onRowClick && 'hover:bg-surface2/40'
                    )}
                    onClick={() => onRowClick?.(row)}
                  >
                    {columns.map((col) => (
                      <td key={col.key} className="px-4 py-3.5 text-sm text-foreground">
                        {col.render ? col.render(row[col.key], row) : row[col.key]}
                      </td>
                    ))}
                  </motion.tr>
                ))}
              </AnimatePresence>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination — Glass buttons */}
      {totalPages > 1 && onPageChange && (
        <div className="flex items-center justify-between p-4 border-t border-border/40">
          <span className="text-xs text-muted-foreground font-medium">
            صفحة {currentPage} من {totalPages}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onPageChange(1)}
              disabled={currentPage === 1}
              className="p-2 rounded-xl hover:bg-surface2/60 disabled:opacity-25 transition-all duration-300 hover:shadow-sm"
            >
              <ChevronsRight size={16} />
            </button>
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-xl hover:bg-surface2/60 disabled:opacity-25 transition-all duration-300 hover:shadow-sm"
            >
              <ChevronRight size={16} />
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const start = Math.max(1, Math.min(currentPage - 2, totalPages - 4))
              const page = start + i
              if (page > totalPages) return null
              return (
                <button
                  key={page}
                  onClick={() => onPageChange(page)}
                  className={cn(
                    'w-8 h-8 rounded-xl text-sm font-semibold transition-all duration-300',
                    page === currentPage
                      ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20'
                      : 'hover:bg-surface2/60 text-muted-foreground hover:text-foreground'
                  )}
                >
                  {page}
                </button>
              )
            })}
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-xl hover:bg-surface2/60 disabled:opacity-25 transition-all duration-300 hover:shadow-sm"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => onPageChange(totalPages)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-xl hover:bg-surface2/60 disabled:opacity-25 transition-all duration-300 hover:shadow-sm"
            >
              <ChevronsLeft size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
