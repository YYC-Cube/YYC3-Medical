import {
  formatDate,
  dateDifference,
  getDateRange,
  isDateInRange,
  formatISODate,
  getAge,
} from '@/lib/utils/date';

describe('lib/utils/date', () => {
  describe('formatDate', () => {
    const testDate = new Date('2026-06-15T10:30:00');

    it('formats as datetime by default', () => {
      const result = formatDate(testDate);
      expect(result).toContain('2026');
      expect(result).toContain('6');
      expect(result).toContain('15');
    });

    it('formats as date-only', () => {
      const result = formatDate(testDate, 'date');
      expect(result).toContain('2026');
      expect(result).not.toContain('10:');
    });

    it('formats as time-only', () => {
      const result = formatDate(testDate, 'time');
      expect(result).toContain('10');
      expect(result).toContain('30');
    });

    it('formats as relative time', () => {
      const now = new Date();
      const recent = new Date(now.getTime() - 60 * 1000); // 1 minute ago
      const result = formatDate(recent, 'relative');
      expect(result).toContain('分钟');
    });

    it('returns "无效日期" for invalid date', () => {
      expect(formatDate('not-a-date')).toBe('无效日期');
    });

    it('accepts ISO string input', () => {
      const result = formatDate('2026-06-15T10:30:00Z', 'date');
      expect(result).toContain('2026');
    });

    it('accepts numeric timestamp input', () => {
      const result = formatDate(Date.now(), 'time');
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('dateDifference', () => {
    it('calculates difference between two dates', () => {
      const start = new Date('2026-01-01');
      const end = new Date('2026-01-11');
      const diff = dateDifference(start, end);

      expect(diff.days).toBe(10);
      expect(diff.totalDays).toBe(10);
    });

    it('handles negative difference', () => {
      const start = new Date('2026-06-15');
      const end = new Date('2026-01-01');
      const diff = dateDifference(start, end);

      expect(diff.totalDays).toBeLessThan(0);
    });

    it('returns zero for same dates', () => {
      const date = new Date('2026-06-15');
      const diff = dateDifference(date, date);
      expect(diff.totalDays).toBe(0);
    });

    it('accepts string inputs', () => {
      const diff = dateDifference('2026-01-01', '2026-06-15');
      expect(diff.totalDays).toBeGreaterThan(0);
    });
  });

  describe('getDateRange', () => {
    it('returns all dates in range inclusive', () => {
      const start = new Date('2026-06-01');
      const end = new Date('2026-06-05');
      const dates = getDateRange(start, end);

      expect(dates).toHaveLength(5);
      expect(dates[0].toISOString().split('T')[0]).toBe('2026-06-01');
      expect(dates[4].toISOString().split('T')[0]).toBe('2026-06-05');
    });

    it('returns single date when start equals end', () => {
      const date = new Date('2026-06-15');
      const dates = getDateRange(date, date);
      expect(dates).toHaveLength(1);
    });

    it('accepts string inputs', () => {
      const dates = getDateRange('2026-06-01', '2026-06-03');
      expect(dates).toHaveLength(3);
    });
  });

  describe('isDateInRange', () => {
    const start = new Date('2026-01-01');
    const end = new Date('2026-12-31');

    it('returns true for date within range', () => {
      expect(isDateInRange(new Date('2026-06-15'), start, end)).toBe(true);
    });

    it('returns true for boundary dates', () => {
      expect(isDateInRange(start, start, end)).toBe(true);
      expect(isDateInRange(end, start, end)).toBe(true);
    });

    it('returns false for date before range', () => {
      expect(isDateInRange(new Date('2025-12-31'), start, end)).toBe(false);
    });

    it('returns false for date after range', () => {
      expect(isDateInRange(new Date('2027-01-01'), start, end)).toBe(false);
    });
  });

  describe('formatISODate', () => {
    it('formats to YYYY-MM-DD', () => {
      const date = new Date('2026-06-15T10:30:00');
      expect(formatISODate(date)).toBe('2026-06-15');
    });

    it('accepts string input', () => {
      expect(formatISODate('2026-06-15T10:30:00Z')).toBe('2026-06-15');
    });
  });

  describe('getAge', () => {
    it('calculates correct age', () => {
      const birthDate = new Date('1990-01-15');
      const age = getAge(birthDate);
      expect(age).toBeGreaterThanOrEqual(35);
      expect(age).toBeLessThanOrEqual(37);
    });
  });
});
