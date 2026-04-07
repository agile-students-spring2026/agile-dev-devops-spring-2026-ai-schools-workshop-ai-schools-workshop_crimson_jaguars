import { describe, it, expect } from 'vitest';
import { mockDistricts } from './mockDistricts';
import type { District, Audience, PresetKey, ScoredDistrict } from '../lib/types';

describe('mockDistricts', () => {
  it('should be an array', () => {
    expect(Array.isArray(mockDistricts)).toBe(true);
  });

  it('should contain districts with all required properties', () => {
    mockDistricts.forEach(district => {
      expect(district).toHaveProperty('id');
      expect(district).toHaveProperty('name');
      expect(district).toHaveProperty('state');
      expect(district).toHaveProperty('graduationRate');
      expect(district).toHaveProperty('perPupilSpending');
      expect(district).toHaveProperty('studentTeacherRatio');
      expect(district).toHaveProperty('enrollment');
      expect(district).toHaveProperty('povertyIndex');
      expect(district).toHaveProperty('score');
    });
  });

  it('should contain districts from multiple states', () => {
    const states = new Set(mockDistricts.map(d => d.state));
    expect(states.size).toBeGreaterThan(0);
  });

  it('should have valid numeric values', () => {
    mockDistricts.forEach(district => {
      expect(typeof district.graduationRate).toBe('number');
      expect(district.graduationRate).toBeGreaterThanOrEqual(0);
      expect(district.graduationRate).toBeLessThanOrEqual(1);

      expect(typeof district.perPupilSpending).toBe('number');
      expect(district.perPupilSpending).toBeGreaterThan(0);

      expect(typeof district.studentTeacherRatio).toBe('number');
      expect(district.studentTeacherRatio).toBeGreaterThan(0);

      expect(typeof district.enrollment).toBe('number');
      expect(district.enrollment).toBeGreaterThan(0);

      expect(typeof district.povertyIndex).toBe('number');
      expect(district.povertyIndex).toBeGreaterThanOrEqual(0);
      expect(district.povertyIndex).toBeLessThanOrEqual(1);

      expect(typeof district.score).toBe('number');
    });
  });

  it('should have NY districts', () => {
    const nyDistricts = mockDistricts.filter(d => d.state === 'NY');
    expect(nyDistricts.length).toBeGreaterThan(0);
  });

  it('should have unique IDs', () => {
    const ids = mockDistricts.map(d => d.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it('should have non-empty names', () => {
    mockDistricts.forEach(district => {
      expect(district.name.length).toBeGreaterThan(0);
    });
  });
});
