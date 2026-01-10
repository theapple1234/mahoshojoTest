
import React, { useCallback, useRef, useState } from 'react';

interface Options {
    shouldPreventDefault?: boolean;
    delay?: number;
}

const isTouchEvent = (event: React.TouchEvent | React.MouseEvent): event is React.TouchEvent => {
    return 'touches' in event;
};

const preventDefault = (event: Event) => {
    if ('touches' in event) {
        const touchEvent = event as unknown as { touches: TouchList; preventDefault: () => void };
        if (touchEvent.touches.length < 2 && touchEvent.preventDefault) {
            touchEvent.preventDefault();
        }
    }
};

export const useLongPress = (
    onLongPress: (event: React.TouchEvent | React.MouseEvent) => void,
    onClick: (event: React.TouchEvent | React.MouseEvent) => void,
    { shouldPreventDefault = true, delay = 500 }: Options = {}
) => {
    const [longPressTriggered, setLongPressTriggered] = useState(false);
    const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);
    const targetRef = useRef<EventTarget | null>(null);

    const start = useCallback(
        (event: React.TouchEvent | React.MouseEvent) => {
            // Ignore right-click or other mouse buttons for long press start
            if (!isTouchEvent(event) && (event as React.MouseEvent).button !== 0) {
                return;
            }

            if (shouldPreventDefault && event.target) {
                event.target.addEventListener('touchend', preventDefault, {
                    passive: false,
                });
                targetRef.current = event.target;
            }
            
            setLongPressTriggered(false);
            timeout.current = setTimeout(() => {
                onLongPress(event);
                setLongPressTriggered(true);
            }, delay);
        },
        [onLongPress, delay, shouldPreventDefault]
    );

    const clear = useCallback(
        (event: React.TouchEvent | React.MouseEvent, shouldTriggerClick = true) => {
            // If it was a right click (which we ignored in start), do nothing
            if (!isTouchEvent(event) && (event as React.MouseEvent).button !== 0) {
                return;
            }

            if (timeout.current) {
                clearTimeout(timeout.current);
            }
            
            if (shouldTriggerClick && !longPressTriggered) {
                onClick(event);
            }
            
            setLongPressTriggered(false);
            
            if (shouldPreventDefault && targetRef.current) {
                targetRef.current.removeEventListener('touchend', preventDefault);
            }
        },
        [shouldPreventDefault, onClick, longPressTriggered]
    );

    return {
        onMouseDown: (e: React.MouseEvent) => start(e),
        onTouchStart: (e: React.TouchEvent) => start(e),
        onMouseUp: (e: React.MouseEvent) => clear(e),
        onMouseLeave: (e: React.MouseEvent) => clear(e, false),
        onTouchEnd: (e: React.TouchEvent) => clear(e),
    };
};
