import { Preferences } from '@capacitor/preferences';

export async function setItem(key: string, value: any) {
  await Preferences.set({
    key,
    value: JSON.stringify(value),
  });
}

export async function getItem<T = any>(key: string): Promise<T | null> {
  const { value } = await Preferences.get({ key });
  return value ? JSON.parse(value) : null;
}

export async function removeItem(key: string) {
  await Preferences.remove({ key });
}

export async function clearAll() {
  await Preferences.clear();
}
