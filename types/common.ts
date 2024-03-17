export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

export interface FilterDto {
  keyword?: string | string[];
  searchBy?: string | string[];
  andKeyword?: string | string[];
  searchAndBy?: string | string[];
  sortBy?: string;
  sortOrder?: SortOrder;
  page?: number;
  limit?: number;
  isGetAll?: boolean;
}
