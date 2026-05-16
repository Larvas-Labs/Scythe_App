import React from 'react'
import CategorySection from './CategorySection.jsx'

const CATEGORY_ORDER = ['browsers', 'developer', 'orphaned', 'apps', 'user', 'advanced']

export default function ResultList({ results, selectedIds, onToggleItem, onToggleCategory }) {
  const grouped = CATEGORY_ORDER.reduce((acc, cat) => {
    acc[cat] = results.filter(r => r.category === cat)
    return acc
  }, {})

  return (
    <div style={{ paddingBottom: '0' }}>
      {CATEGORY_ORDER.map(category => {
        const items = grouped[category]
        if (!items || items.length === 0 || items.every(r => !r.exists)) return null
        return (
          <CategorySection
            key={category}
            category={category}
            results={items}
            selectedIds={selectedIds}
            onToggleItem={onToggleItem}
            onToggleCategory={onToggleCategory}
          />
        )
      })}
    </div>
  )
}
