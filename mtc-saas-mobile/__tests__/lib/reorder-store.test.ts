// __tests__/lib/reorder-store.test.ts

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

import { useReorderStore } from '../../lib/reorder-store';

const FIXED_NOW = new Date('2026-01-01T00:00:00.000Z');

describe('reorder-store', () => {
  beforeEach(() => {
    useReorderStore.setState({ schedules: [] });
    jest.useFakeTimers();
    jest.setSystemTime(FIXED_NOW);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('starts empty', () => {
    expect(useReorderStore.getState().schedules).toHaveLength(0);
  });

  it('adds a schedule with a generated id and a nextDate offset by the cadence', () => {
    useReorderStore.getState().addSchedule({
      productId: 'prod-1',
      productName: '32 oz Round Container',
      unit: 'case',
      quantity: 10,
      cadence: 'weekly',
    });

    const [schedule] = useReorderStore.getState().schedules;
    expect(schedule.id).toContain('prod-1');
    expect(schedule.nextDate).toBe('2026-01-08T00:00:00.000Z'); // +7 days
  });

  it('offsets biweekly and monthly cadences correctly', () => {
    useReorderStore.getState().addSchedule({
      productId: 'prod-2', productName: 'Film Wrap', unit: 'roll', quantity: 1, cadence: 'biweekly',
    });
    useReorderStore.getState().addSchedule({
      productId: 'prod-3', productName: 'Degreaser', unit: 'pail', quantity: 1, cadence: 'monthly',
    });

    const [biweekly, monthly] = useReorderStore.getState().schedules;
    expect(biweekly.nextDate).toBe('2026-01-15T00:00:00.000Z'); // +14 days
    expect(monthly.nextDate).toBe('2026-01-31T00:00:00.000Z'); // +30 days
  });

  it('skipNext pushes nextDate forward by one more cadence period', () => {
    useReorderStore.getState().addSchedule({
      productId: 'prod-1', productName: 'Container', unit: 'case', quantity: 10, cadence: 'weekly',
    });
    const { id } = useReorderStore.getState().schedules[0];

    useReorderStore.getState().skipNext(id);

    expect(useReorderStore.getState().schedules[0].nextDate).toBe('2026-01-15T00:00:00.000Z'); // +14 days total
  });

  it('removeSchedule removes only the targeted schedule', () => {
    useReorderStore.getState().addSchedule({
      productId: 'prod-1', productName: 'Container', unit: 'case', quantity: 10, cadence: 'weekly',
    });
    useReorderStore.getState().addSchedule({
      productId: 'prod-2', productName: 'Film Wrap', unit: 'roll', quantity: 1, cadence: 'monthly',
    });
    const [first, second] = useReorderStore.getState().schedules;

    useReorderStore.getState().removeSchedule(first.id);

    const remaining = useReorderStore.getState().schedules;
    expect(remaining).toHaveLength(1);
    expect(remaining[0].id).toBe(second.id);
  });
});
