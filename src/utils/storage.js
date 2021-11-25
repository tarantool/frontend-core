// @flow

export const createStorage = (type: 'local' | 'session', parentKey: string = 'tt') => {
  const storage: Storage | null =
    typeof window !== 'undefined' ? window[type === 'local' ? 'localStorage' : 'sessionStorage'] : null;

  const name = (key: string): string => `${parentKey}.${key}`;

  const get = (key: string): string => {
    if (!storage) {
      return '';
    }

    try {
      return storage.getItem(name(key)) || '';
    } catch (error) {
      // no-empty
    }

    return '';
  };

  const set = (key: string, value: string): void => {
    if (!storage) {
      return;
    }

    try {
      storage.setItem(name(key), value);
    } catch (error) {
      // no-empty
    }
  };

  const remove = (key: string): void => {
    if (!storage) {
      return;
    }

    try {
      storage.removeItem(name(key));
    } catch (error) {
      // no-empty
    }
  };

  return {
    get,
    set,
    remove,
  };
};
