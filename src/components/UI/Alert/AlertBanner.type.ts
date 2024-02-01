export enum AlertBannerTypeEnum {
  INFO = 'alert-info',
  SUCCESS = 'alert-success',
  WARNING = 'alert-warning',
  ERROR = 'alert-error',
}

export type AlertBannerType = {
  alertType?: AlertBannerTypeEnum
  message: string
}
