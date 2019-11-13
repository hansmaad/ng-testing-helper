import { DebugElement } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

export interface DebugElementTyped<T extends Element> extends DebugElement {
    nativeElement: T;
}

export function query<TElement extends Element>(element: DebugElement | ComponentFixture<any>,
    predicate: string | ((value: DebugElementTyped<TElement>) => boolean)) {

    predicate = typeof predicate === 'string' ? By.css(predicate) : predicate;
    if (element instanceof DebugElement) {
        return element.query(predicate) as DebugElementTyped<TElement>;
    }
    return element.debugElement.query(predicate) as DebugElementTyped<TElement>;
}

export function queryAll<TElement extends Element>(element: DebugElement | ComponentFixture<any>,
    predicate: string | ((value: DebugElementTyped<TElement>) => boolean)) {

    predicate = typeof predicate === 'string' ? By.css(predicate) : predicate;
    return element instanceof DebugElement ?
        element.queryAll(predicate) as DebugElementTyped<TElement>[] :
        element.debugElement.queryAll(predicate) as DebugElementTyped<TElement>[];
}


interface QueryPredicate {
    (value: any): boolean;
    and: QueryPredicateBuilder;
    or: QueryPredicateBuilder;
}

interface QueryPredicateBuilder {
    css(selector: string): QueryPredicate;
    text(text: string): QueryPredicate;
    substr(text: string): QueryPredicate;
    any(predicate: (value: any) => boolean): QueryPredicate;
}


abstract class Builder implements QueryPredicateBuilder {
    constructor(protected basePredicate: (value: any) => boolean) {}

    css(selector: string) {
        return this.any(By.css(selector));
    }

    text(text: string) {
        text = text.toLowerCase();
        return this.any(v => v.nativeElement.textContent.trim().toLowerCase() === text);
    }

    substr(text: string) {
        text = text.toLowerCase();
        return this.any(v => v.nativeElement.textContent.trim().toLowerCase().includes(text));
    }

    any(predicate: (value: any) => boolean): QueryPredicate {
        const fn = <any>this.buildPredicate(predicate);
        fn.and = new AndBuilder(fn);
        fn.or = new OrBuilder(fn);
        return <any>fn;
    }

    protected abstract buildPredicate(predicate: (value: any) => boolean): (value: any) => boolean;
}

class AndBuilder extends Builder {
    constructor(p: (value: any) => boolean) {
        super(p);
    }

    protected buildPredicate(predicate: (value: any) => boolean) {
        const base = this.basePredicate;
        return function (value: any) {
            return base(value) && predicate(value);
        };
    }
}

class OrBuilder extends Builder {
    constructor(p: (value: any) => boolean) {
        super(p);
    }

    protected buildPredicate(predicate: (value: any) => boolean) {
        const base = this.basePredicate;
        return function (value: any) {
            return base(value) || predicate(value);
        };
    }
}

function never() {
    return false;
}

function all() {
    return true;
}

function builder() {
    return new AndBuilder(all);
}

export const Query = builder();
