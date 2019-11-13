import { ReplaySubject } from 'rxjs';
import { ParamMap, Params, convertToParamMap } from '@angular/router';

export class ActivatedRouteStub {
    // Use a ReplaySubject to share previous values with subscribers
    // and pump new values into the `paramMap` observable
    private subject = new ReplaySubject<ParamMap>();

    /** The mock paramMap observable */
    readonly paramMap = this.subject.asObservable();
    snapshot = {
        paramMap: null,
        params: null,
        parent: null,
    };
    parent = null;

    constructor(initialParams?: Params) {
        this.setNextParams(initialParams);
    }

    /** Set the paramMap observables's next value */
    setNextParams(params?: Params) {
        this.snapshot.params = params;
        this.snapshot.paramMap = convertToParamMap(params);
        this.subject.next(convertToParamMap(params));
    }
}
