import { useOnClickOutside } from '@/hooks/useOnClickOutside';
import { renderHook } from '@testing-library/react';

describe('hooks/useOnClickOutside', () => {
  it('calls handler when clicking outside', () => {
    const handler = jest.fn();
    const ref = { current: document.createElement('div') };
    document.body.appendChild(ref.current);

    renderHook(() => useOnClickOutside(ref, handler));

    const outside = document.createElement('div');
    document.body.appendChild(outside);
    outside.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));

    expect(handler).toHaveBeenCalledTimes(1);

    document.body.removeChild(ref.current);
    document.body.removeChild(outside);
  });

  it('does not call handler when clicking inside', () => {
    const handler = jest.fn();
    const ref = { current: document.createElement('div') };
    document.body.appendChild(ref.current);

    renderHook(() => useOnClickOutside(ref, handler));

    ref.current.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));

    expect(handler).not.toHaveBeenCalled();

    document.body.removeChild(ref.current);
  });

  it('does not call handler when clicking excluded element', () => {
    const handler = jest.fn();
    const ref = { current: document.createElement('div') };
    const excludeRef = { current: document.createElement('div') };
    document.body.appendChild(ref.current);
    document.body.appendChild(excludeRef.current);

    renderHook(() => useOnClickOutside(ref, handler, [excludeRef]));

    excludeRef.current.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));

    expect(handler).not.toHaveBeenCalled();

    document.body.removeChild(ref.current);
    document.body.removeChild(excludeRef.current);
  });

  it('handles touch events', () => {
    const handler = jest.fn();
    const ref = { current: document.createElement('div') };
    document.body.appendChild(ref.current);

    renderHook(() => useOnClickOutside(ref, handler));

    const outside = document.createElement('div');
    document.body.appendChild(outside);
    outside.dispatchEvent(new TouchEvent('touchstart', { bubbles: true }));

    expect(handler).toHaveBeenCalledTimes(1);

    document.body.removeChild(ref.current);
    document.body.removeChild(outside);
  });

  it('handles null ref gracefully', () => {
    const handler = jest.fn();
    const ref = { current: null };

    renderHook(() => useOnClickOutside(ref as any, handler));

    const outside = document.createElement('div');
    document.body.appendChild(outside);
    outside.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));

    // When ref.current is null, the listener exits early (null check guard)
    expect(handler).not.toHaveBeenCalled();

    document.body.removeChild(outside);
  });
});
