import { notifications as notMantine } from '@mantine/notifications'

import type { NotificationData } from '@mantine/notifications'

const notificationStyles: NotificationData['styles'] = {
  title: {
    fontSize: '1.15rem',
    fontWeight: 600,
    lineHeight: 1.2,
  },

  description: {
    fontSize: '1rem',
    lineHeight: 1.5,
  },
}

const show = (params: NotificationData) => {
  notMantine.show({
    title: params.title,
    message: params.message,
    color: params.color || 'blue',
    autoClose: params.autoClose || 5000,
    withBorder: params.withBorder === undefined ? params.withBorder : true,
    withCloseButton:
      params.withCloseButton === undefined ? params.withBorder : true,
    styles: {
      ...notificationStyles,
      ...(params.styles || {}),
    },
  })
}

const update = (params: NotificationData) => {
  notMantine.update({
    id: params.id,
    title: params.title,
    message: params.message,
    color: params.color || 'blue',
    autoClose: params.autoClose || 10000,
    withBorder: params.withBorder === undefined ? params.withBorder : true,
    withCloseButton:
      params.withCloseButton === undefined ? params.withBorder : true,
    styles: {
      ...notificationStyles,
      ...(params.styles || {}),
    },
  })
}

const hide = (id: string) => {
  notMantine.hide(id)
}

const clean = () => {
  notMantine.clean()
}

const cleanQueue = () => {
  notMantine.cleanQueue()
}

const success = (params: Omit<NotificationData, 'color'>) => {
  show({
    ...params,
    color: 'green',
  })
}

const error = (params: Omit<NotificationData, 'color' | 'autoClose'>) => {
  show({
    ...params,
    color: 'red',
    autoClose: 15000,
  })
}

const info = (params: Omit<NotificationData, 'color'>) => {
  show({
    ...params,
    color: 'blue',
  })
}

const warning = (params: Omit<NotificationData, 'color'>) => {
  show({
    ...params,
    color: 'yellow',
  })
}

export const notifications = {
  show,
  hide,
  clean,
  cleanQueue,
  update,
  success,
  error,
  info,
  warning,
}
