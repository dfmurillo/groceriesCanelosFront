import { ColumnDef } from '@tanstack/react-table'
import { CategoryType } from '@/schemas/Category/Category.type'

export const categoryTableColumns: ColumnDef<CategoryType>[] = [
  {
    accessorKey: 'category',
    header: 'Category',
  },
  {
    accessorKey: 'tags',
    header: 'Tags',
  },
]
