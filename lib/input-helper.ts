import { ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

export async function setInputValue<T>(fixture: ComponentFixture<T>,
    selector: string|DebugElement,
    value: string|number): Promise<DebugElement> {

    const input = getElement(fixture, selector);
    input.nativeElement.value = value;
    input.triggerEventHandler('input', { target: input.nativeElement });
    fixture.detectChanges();
    await fixture.whenStable();
    return input;
}

export async function focusInput<T>(fixture: ComponentFixture<T>,
    selector: string|DebugElement): Promise<DebugElement> {

    const input = getElement(fixture, selector);
    input.triggerEventHandler('focus', { target: input.nativeElement });
    fixture.detectChanges();
    await fixture.whenStable();
    return input;
}

export async function blurInput<T>(fixture: ComponentFixture<T>,
    selector: string|DebugElement): Promise<DebugElement> {

    const input = getElement(fixture, selector);
    input.triggerEventHandler('blur', { target: input.nativeElement });
    fixture.detectChanges();
    await fixture.whenStable();
    return input;
}

export async function clickButton<T, TElement extends Element>(fixture: ComponentFixture<T>,
    selector: string|DebugElement,
    predicate?: (e: TElement) => boolean): Promise<DebugElement> {

    const btn = getElement(fixture, selector, predicate);
    btn.nativeElement.click();
    // It seems that click() is enough.
    // click calls (click) handler with $event: MouseEvent.
    // btn.triggerEventHandler('click', {});
    fixture.detectChanges();
    await fixture.whenStable();
    return btn;
}

export async function clickCheckbox<T>(fixture: ComponentFixture<T>, selector: string|DebugElement): Promise<DebugElement> {
    const checkbox = getElement(fixture, selector);
    checkbox.nativeElement.click();
    fixture.detectChanges();
    await fixture.whenStable();
    return checkbox;
}

export async function selectOption<T>(fixture: ComponentFixture<T>, selector: string|DebugElement, optionIndex: number) {
    const select = getElement(fixture, selector);
    const nativeSelect = select.nativeElement;
    nativeSelect.value = nativeSelect.options[optionIndex].value;
    // select.triggerEventHandler('change', { target: nativeSelect });
    select.nativeElement.dispatchEvent(new Event('change'));

    fixture.detectChanges();
    await fixture.whenStable();
    return select;
}

export function getElement<T, TElement>(fixture: ComponentFixture<T>, selector: string|DebugElement, predicate?: (e: TElement) => boolean) {
    if (typeof selector === 'string') {
       return fixture.debugElement.queryAll(By.css(selector))
        .find(d => !predicate || predicate(d.nativeElement));
    }
    return selector as DebugElement;
}

export function mouseDown<T>(fixture: ComponentFixture<T>, element: DebugElement, x, y) {
    return triggerMouseEvent(fixture, 'mousedown', element, x, y);
}

export function mouseMove<T>(fixture: ComponentFixture<T>, element: DebugElement, x, y) {
    return triggerMouseEvent(fixture, 'mousemove', element, x, y);
}

export function mouseUp<T>(fixture: ComponentFixture<T>, element: DebugElement, x, y) {
    return triggerMouseEvent(fixture, 'mouseup', element, x, y);
}

export function mouseEnter<T>(fixture: ComponentFixture<T>, element: DebugElement, x, y) {
    return triggerMouseEvent(fixture, 'mouseenter', element, x, y, );
}

export function mouseLeave<T>(fixture: ComponentFixture<T>, element: DebugElement, x, y) {
    return triggerMouseEvent(fixture, 'mouseleave', element, x, y);
}

export async function mouseClick<T>(fixture: ComponentFixture<T>, element: DebugElement, x, y) {
    await triggerMouseEvent(fixture, 'mousedown', element, x, y);
    await triggerMouseEvent(fixture, 'mouseup', element, x, y);
}

export async function keyUp<T>(fixture: ComponentFixture<T>, element: DebugElement, key: string) {
    element.nativeElement.dispatchEvent( new KeyboardEvent('keyup', { code: key, bubbles: true }));
    fixture.detectChanges();
    await fixture.whenStable();
}

export async function triggerMouseEvent<T>(fixture: ComponentFixture<T>, eventType: string, element: DebugElement, x, y) {
    element.nativeElement.dispatchEvent(
        new MouseEvent(eventType, { bubbles: true, clientX: x, clientY: y }));
    fixture.detectChanges();
    await fixture.whenStable();
}
