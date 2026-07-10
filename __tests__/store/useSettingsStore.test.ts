import { useSettingsStore } from '@/store/useSettingsStore';

beforeEach(() => {
  // Reset to defaults before each test
  useSettingsStore.getState().resetSettings();
});

describe('store/useSettingsStore', () => {
  it('starts with default values', () => {
    const s = useSettingsStore.getState();
    expect(s.theme).toBe('system');
    expect(s.language).toBe('zh-CN');
    expect(s.fontSize).toBe(16);
    expect(s.highContrast).toBe(false);
    expect(s.animations).toBe(true);
    expect(s.notifications).toBe(true);
    expect(s.autoSave).toBe(true);
    expect(s.compactView).toBe(false);
  });

  it('setTheme updates theme', () => {
    useSettingsStore.getState().setTheme('dark');
    expect(useSettingsStore.getState().theme).toBe('dark');
    useSettingsStore.getState().setTheme('light');
    expect(useSettingsStore.getState().theme).toBe('light');
  });

  it('setLanguage updates language', () => {
    useSettingsStore.getState().setLanguage('en-US');
    expect(useSettingsStore.getState().language).toBe('en-US');
  });

  it('setFontSize updates fontSize', () => {
    useSettingsStore.getState().setFontSize(20);
    expect(useSettingsStore.getState().fontSize).toBe(20);
  });

  it('toggleHighContrast flips boolean', () => {
    expect(useSettingsStore.getState().highContrast).toBe(false);
    useSettingsStore.getState().toggleHighContrast();
    expect(useSettingsStore.getState().highContrast).toBe(true);
    useSettingsStore.getState().toggleHighContrast();
    expect(useSettingsStore.getState().highContrast).toBe(false);
  });

  it('toggleAnimations flips boolean', () => {
    expect(useSettingsStore.getState().animations).toBe(true);
    useSettingsStore.getState().toggleAnimations();
    expect(useSettingsStore.getState().animations).toBe(false);
  });

  it('toggleNotifications flips boolean', () => {
    expect(useSettingsStore.getState().notifications).toBe(true);
    useSettingsStore.getState().toggleNotifications();
    expect(useSettingsStore.getState().notifications).toBe(false);
  });

  it('toggleAutoSave flips boolean', () => {
    expect(useSettingsStore.getState().autoSave).toBe(true);
    useSettingsStore.getState().toggleAutoSave();
    expect(useSettingsStore.getState().autoSave).toBe(false);
  });

  it('toggleCompactView flips boolean', () => {
    expect(useSettingsStore.getState().compactView).toBe(false);
    useSettingsStore.getState().toggleCompactView();
    expect(useSettingsStore.getState().compactView).toBe(true);
  });

  it('resetSettings restores all defaults after mutations', () => {
    useSettingsStore.getState().setTheme('dark');
    useSettingsStore.getState().setLanguage('en-US');
    useSettingsStore.getState().setFontSize(24);
    useSettingsStore.getState().toggleAnimations();
    useSettingsStore.getState().toggleHighContrast();

    useSettingsStore.getState().resetSettings();

    const s = useSettingsStore.getState();
    expect(s.theme).toBe('system');
    expect(s.language).toBe('zh-CN');
    expect(s.fontSize).toBe(16);
    expect(s.animations).toBe(true);
    expect(s.highContrast).toBe(false);
  });
});
