/**
 * Format bytes to human-readable string.
 * Returns '—' for 0, KB/MB/GB as appropriate.
 */
export function formatSize(bytes) {
  if (!bytes || bytes === 0) return '—'
  if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(0)} KB`
  if (bytes < 1024 ** 3) return `${(bytes / 1024 ** 2).toFixed(1)} MB`
  return `${(bytes / 1024 ** 3).toFixed(2)} GB`
}

/**
 * Clsx-style className combiner.
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}

/**
 * Sum bytes for all selected scan results.
 */
export function selectedSize(results, selectedIds) {
  return results
    .filter(r => selectedIds.has(r.id))
    .reduce((sum, r) => sum + (r.size || 0), 0)
}
