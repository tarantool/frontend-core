// @flow

type Action = {
  type: 'action',
  action: string,
  category: string,
  label?: string,
  value?: number,
};

type PageView = {
  type: 'pageview',
  url: string,
};

type AnalyticsEvent = Action | PageView;

type AnalyticModule = {
  sendEvent: (AnalyticsEvent) => void,
  effect: (Function) => Function,
  __storage: Array<AnalyticsEvent>,
  __effects: Array<{ handler: Function, cursor: number }>,
  __timerInterval: number,
};

const DEFAULT_TIMER_INTERVAL = 10000;
const DEFAULT_STORAGE_KEY = '__tarantool_analytics_module';
const THRESHOLD = 300;

export const generateAnalyticModule = (storagePrefix: ?string = ''): AnalyticModule => {
  const setStorageName: string = `${storagePrefix || ''}${DEFAULT_STORAGE_KEY}`;
  let storedActionName: { [key: string]: 1 } = {};
  let storedSessionActionName: { [key: string]: 1 } = {};
  try {
    const localStorageItem = localStorage.getItem(setStorageName);
    if (localStorageItem) storedActionName = JSON.parse(localStorageItem);
  } catch (e) {
    storedActionName = {};
  }

  try {
    if (window.sessionStorage) {
      const sessionStorageItem = window.sessionStorage.getItem(setStorageName);
      if (sessionStorageItem) storedSessionActionName = JSON.parse(sessionStorageItem);
    }
  } catch (e) {
    storedSessionActionName = {};
  }
  let storage: Array<AnalyticsEvent> = [];
  const effects: Array<{ cursor: number, handler: Function }> = [];

  let timerStarted: boolean = false;

  const clearStorage = () => {
    for (let j = 0; j < effects.length; j++) {
      effects[j].cursor = 0;
    }
    storage.splice(0, storage.length);
  };

  const updateCursors = () => {
    for (let j = 0; j < effects.length; j++) {
      const { handler, cursor } = effects[j];
      for (let i = cursor; i < storage.length; i++) {
        handler(storage[i]);
      }
      effects[j].cursor = storage.length;
    }
  };

  return {
    __timerInterval: DEFAULT_TIMER_INTERVAL,
    sendEvent(event: AnalyticsEvent) {
      if (effects.length === 0 && storage.length > THRESHOLD) {
        storage = storage.splice(0, storage.length);
        storedActionName = {};
        storedSessionActionName = {};
      }
      if (event.type === 'action') {
        const hash = `${event.category}_${event.action}`;
        if (!storedActionName[hash]) {
          storage.push({ ...event, action: `first_${event.action}` });
          storedActionName[hash] = 1;
          localStorage.setItem(setStorageName, JSON.stringify(storedActionName));
        }
        if (!storedSessionActionName[hash]) {
          storage.push({ ...event, action: `session_${event.action}` });
          storedSessionActionName[hash] = 1;
          sessionStorage.setItem(setStorageName, JSON.stringify(storedSessionActionName));
        }
      }
      storage.push(event);
      updateCursors();
    },
    effect(handler: Function) {
      effects.push({
        handler,
        cursor: 0,
      });
      updateCursors();
      if (!timerStarted) {
        timerStarted = true;
        setInterval(clearStorage, this.__timerInterval);
      }
      return () => {
        effects.splice(
          effects.findIndex((obj) => obj.handler === handler),
          1
        );
      };
    },
    __effects: effects,
    __storage: storage,
  };
};

export default generateAnalyticModule();
