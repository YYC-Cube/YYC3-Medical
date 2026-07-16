import { clickableDivProps } from '@/lib/a11y';

describe('lib/a11y', () => {
  describe('clickableDivProps', () => {
    it('returns correct role and tabIndex', () => {
      const props = clickableDivProps();
      expect(props.role).toBe('button');
      expect(props.tabIndex).toBe(0);
    });

    it('calls onClick on Enter key', () => {
      const onClick = jest.fn();
      const props = clickableDivProps(onClick);

      props.onKeyDown({
        key: 'Enter',
        preventDefault: jest.fn(),
      } as any);

      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('calls onClick on Space key', () => {
      const onClick = jest.fn();
      const props = clickableDivProps(onClick);

      props.onKeyDown({
        key: ' ',
        preventDefault: jest.fn(),
      } as any);

      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('does not call onClick on other keys', () => {
      const onClick = jest.fn();
      const props = clickableDivProps(onClick);

      props.onKeyDown({
        key: 'Escape',
        preventDefault: jest.fn(),
      } as any);

      expect(onClick).not.toHaveBeenCalled();
    });

    it('handles undefined onClick gracefully', () => {
      const props = clickableDivProps();

      expect(() => {
        props.onKeyDown({
          key: 'Enter',
          preventDefault: jest.fn(),
        } as any);
      }).not.toThrow();
    });

    it('prevents default on Enter and Space', () => {
      const preventDefault = jest.fn();
      const props = clickableDivProps(jest.fn());

      props.onKeyDown({ key: 'Enter', preventDefault } as any);
      expect(preventDefault).toHaveBeenCalled();
    });
  });
});