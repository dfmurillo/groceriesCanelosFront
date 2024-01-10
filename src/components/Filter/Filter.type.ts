export type FilterCategoryType = {
  [id: number]: FilterTagsType[]
}

export type FilterTagsType = {
  tagId: number,
  tagName: string,
}