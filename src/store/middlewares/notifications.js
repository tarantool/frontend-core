import { checkNotifications } from '../actions/notifications'

export const startTimer = store => {
  setInterval(() => {
    store.dispatch(checkNotifications())
  }, 1000)
}
