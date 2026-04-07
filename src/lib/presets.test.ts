import { describe, it, expect } from 'vitest';
import { STATES, PRESETS } from './presets';
import type { Audience, PresetKey } from './types';

describe('presets', () => {
  describe('STATES', () => {
    it('should contain all required states', () => {
      expect(STATES).toContain('NY');
      expect(STATES).toContain('CA');
      expect(STATES).toContain('TX');
    });

    it('should be an array of strings', () => {
      expect(Array.isArray(STATES)).toBe(true);
      expect(STATES.every(state => typeof state === 'string')).toBe(true);
    });

    it('should have reasonable length', () => {
      expect(STATES.length).toBeGreaterThan(10);
    });
  });

  describe('PRESETS', () => {
    it('should have parent and educator presets', () => {
      expect(PRESETS).toHaveProperty('parent');
      expect(PRESETS).toHaveProperty('educator');
    });

    it('parent presets should include academic, balancedFamily, smallClassrooms', () => {
      const parentValues = PRESETS.parent.map(p => p.value);
      expect(parentValues).toContain('academic');
      expect(parentValues).toContain('balancedFamily');
      expect(parentValues).toContain('smallClassrooms');
    });

    it('educator presets should include classroomConditions, resourceSupport, balancedTeaching', () => {
      const educatorValues = PRESETS.educator.map(p => p.value);
      expect(educatorValues).toContain('classroomConditions');
      expect(educatorValues).toContain('resourceSupport');
      expect(educatorValues).toContain('balancedTeaching');
    });

    it('each preset should have value and label', () => {
      PRESETS.parent.forEach(preset => {
        expect(preset).toHaveProperty('value');
        expect(preset).toHaveProperty('label');
        expect(typeof preset.value).toBe('string');
        expect(typeof preset.label).toBe('string');
      });

      PRESETS.educator.forEach(preset => {
        expect(preset).toHaveProperty('value');
        expect(preset).toHaveProperty('label');
        expect(typeof preset.value).toBe('string');
        expect(typeof preset.label).toBe('string');
      });
    });

    it('should have 3 presets for each audience', () => {
      expect(PRESETS.parent.length).toBe(3);
      expect(PRESETS.educator.length).toBe(3);
    });

    it('labels should not be empty', () => {
      PRESETS.parent.forEach(preset => {
        expect(preset.label.length).toBeGreaterThan(0);
      });

      PRESETS.educator.forEach(preset => {
        expect(preset.label.length).toBeGreaterThan(0);
      });
    });
  });
});
