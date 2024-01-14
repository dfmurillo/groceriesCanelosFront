export enum AlertBannerTypeEnum {
  INFO = 'info',
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error',
}

export type AlertBannerType = {
  alertType?: AlertBannerTypeEnum
  message: string
}
