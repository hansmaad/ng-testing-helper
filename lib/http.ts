import { TestBed } from '@angular/core/testing';
import { throwError, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';

export class MockRequest {
    constructor(private spy: jasmine.Spy<any>, private url: string) {
    }

    respond(data: any) {
        this.spy = this.spy.and.returnValue(of(data));
        return this;
    }

    fail(error: any) {
        this.spy = this.spy.and.returnValue(throwError(error));
        return this;
    }

    verifyNever() {
        const calls = this.calls(() => true);
        if (calls.length) {
            fail(`Expected no calls to ${this.url}.\n${this.actualMessage()}`);
        }
    }

    verify<T>(predicate?: (data: T) => boolean): T {
        const calls = this.calls(predicate);
        if (calls.length < 1) {
            const fn = predicate ? `with ${predicate.toString()}` : '';
            fail(`Expected call to ${this.url} ${fn} not found.\n${this.actualMessage()}`);
        }
        return calls[calls.length - 1].args[1] as T;
    }

    calls(predicate?: (data: any) => boolean) {
        return this.spy.calls.all().filter(call => {
            return call.args[0] === this.url && (!predicate || predicate(call.args[1]));
        });
    }

    private failMessage(predicate?: (data: any) => boolean) {
        const fn = predicate ? `with ${predicate.toString()}` : '';
        const calls = this.spy.calls.all();
        const callLines = calls.map(c => JSON.stringify(c.args, null, 2)).join('\n');
        fail(`Expected call to ${this.url} ${fn} not found.\nActual (${calls.length}) calls were:\n${callLines}`);
    }

    private actualMessage() {
        const calls = this.spy.calls.all();
        const callLines = calls.map(c => JSON.stringify(c.args, null, 2)).join('\n');
        return `Actual (${calls.length}) calls were:\n${callLines}`;
    }
}

export class Http {

    static whenPut(url): MockRequest {
        const client = TestBed.get(HttpClient);
        const spy = spyOn(client, 'put').and.callFake(() => { });
        return new MockRequest(spy, url);
    }
}
