import React, { HTMLAttributes } from 'react'

type DataListPropsType = {
  dataListProps: HTMLAttributes<HTMLDataListElement>
  listOptions: string[] | number[]
}

const DataList = ({ dataListProps, listOptions }: DataListPropsType) => {
  return (
    <datalist {...dataListProps}>
      {listOptions.map((dataOption, index) => (
        <option key={index} value={dataOption} />
      ))}
    </datalist>
  )
}

export default DataList
