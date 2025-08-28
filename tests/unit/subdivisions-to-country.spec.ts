import { describe, it, expect } from 'vitest';
import { mapSubdivisionToCountryId } from '../../src/lib/subdivisions-to-country';

describe('mapSubdivisionToCountryId', () => {
  it('maps common US states to united-states', () => {
    expect(mapSubdivisionToCountryId('California')).toBe('united-states');
    expect(mapSubdivisionToCountryId(' new  york ')).toBe('united-states');
    expect(mapSubdivisionToCountryId('TEXAS')).toBe('united-states');
  });

  it('handles diacritics and known variants (Austria)', () => {
    expect(mapSubdivisionToCountryId('Kärnten')).toBe('austria');
    expect(mapSubdivisionToCountryId('Niederösterreich')).toBe('austria');
    expect(mapSubdivisionToCountryId('Oberösterreich')).toBe('austria');
  });

  it('maps selected international subdivisions', () => {
    expect(mapSubdivisionToCountryId('Dublin')).toBe('ireland');
    expect(mapSubdivisionToCountryId('Berlin')).toBe('germany');
    expect(mapSubdivisionToCountryId('Osaka')).toBe('japan');
    expect(mapSubdivisionToCountryId('Bolzano')).toBe('italy');
    expect(mapSubdivisionToCountryId('Seoul')).toBe('south-korea');
  });

  it('returns unknown for unmapped input', () => {
    expect(mapSubdivisionToCountryId('Atlantis')).toBe('unknown');
  });
});
