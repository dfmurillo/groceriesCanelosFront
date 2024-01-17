import { useQuery } from '@tanstack/react-query'
import LoadingDots from '@/components/ui/loadingDots'
import { getCategoriesTags } from '@/server/categoryActions'
import AlertBanner from '../ui/AlertBanner/AlertBanner'
import { AlertBannerTypeEnum } from '../ui/AlertBanner/AlertBanner.type'

const CategoryTable = () => {
  const {
    data: categoryFilters,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategoriesTags,
  })

  if (isLoading) return <LoadingDots />
  if (error) return <AlertBanner alertType={AlertBannerTypeEnum.ERROR} message={error.message} />

  return (
    <div className='container mx-auto py-10'>
      <DataTable columns={columns} data={data} />
    </div>
  )
}

export default CategoryTable
