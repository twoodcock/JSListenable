/*
 * Listenable.test.js - test an observable implementation.
 *
 * Strategy:
 *
 * - Extend the Listenable class, providing a set of handlers we will test.
 * - Test various observations.
 * - Test that the subscription list is correct.
 * - Test subscribing more than once with the same function.
 * - Test subscribing more than once with the same function.
 *
 */

import Listenable from '../Listenable';

class testC1 extends Listenable {
    get handlerList() { return ['h1', 'h2', 'h3'] };
}

describe('h1 invoked', ()=>{
    var observableInstance = new testC1();
    var testMe = [];
    function observe(args) { testMe.push(args); }
    observableInstance.subscribe('h1', observe);
    observableInstance.h1('go1');
    observableInstance.h2('go2');
    observableInstance.h3('go3');
    test("h1=>'go'", ()=>{
        expect(testMe).toEqual(["go1"]);
    });
    test("subscriptions.h1", ()=>{
        expect(observableInstance.subscriptions.h1).toEqual([observe]);
    });
    test("subscriptions.h2", ()=>{
        expect(observableInstance.subscriptions.h2).toEqual([]);
    });
    test("subscriptions.h3", ()=>{
        expect(observableInstance.subscriptions.h3).toEqual([]);
    });
});

describe('h1 subscribed twice, invoked once', ()=>{
    var observableInstance = new testC1();
    var testMe = [];
    function observe(args) { testMe.push(args); }
    observableInstance.subscribe('h1', observe);
    observableInstance.subscribe('h1', observe);
    observableInstance.h1('go1');
    observableInstance.h2('go2');
    observableInstance.h3('go3');
    test("h1=>'go'", ()=>{
        expect(testMe).toEqual(["go1"]);
    });
    test("subscriptions.h1", ()=>{
        expect(observableInstance.subscriptions.h1).toEqual([observe]);
    });
    test("subscriptions.h2", ()=>{
        expect(observableInstance.subscriptions.h2).toEqual([]);
    });
    test("subscriptions.h3", ()=>{
        expect(observableInstance.subscriptions.h3).toEqual([]);
    });
});

describe('h1,h2,h3 subscribed, same observer function', ()=>{
    var observableInstance = new testC1();
    var testMe = [];
    function observe(args) { testMe.push(args); }
    observableInstance.subscribe('h1', observe);
    observableInstance.subscribe('h2', observe);
    observableInstance.subscribe('h3', observe);
    observableInstance.h1('go1');
    observableInstance.h2('go2');
    observableInstance.h3('go3');
    test("h1=>'go'", ()=>{
        expect(testMe).toEqual(["go1", "go2", "go3"]);
    });
    test("subscriptions.h1", ()=>{
        expect(observableInstance.subscriptions.h1).toEqual([observe]);
    });
    test("subscriptions.h2", ()=>{
        expect(observableInstance.subscriptions.h2).toEqual([observe]);
    });
    test("subscriptions.h3", ()=>{
        expect(observableInstance.subscriptions.h3).toEqual([observe]);
    });
});

describe('1 observable, multiple observer functions', ()=>{
    var observableInstance = new testC1();
    var testMe1 = [];
    var testMe2 = [];
    var testMe3 = [];
    function observe1(args) { testMe1.push(args); }
    function observe2(args) { testMe2.push(args); }
    function observe3(args) { testMe3.push(args); }
    class TestObserver {
        constructor() {
            this.testMe = [];
            this.boundFunctionForTest = this.observe.bind(this);
            observableInstance.subscribe('h1', this.boundFunctionForTest)
            observableInstance.subscribe('h3', this.boundFunctionForTest)
        }
        observe(args) { this.testMe.push(args); }
    }
    var testObserver = new TestObserver();
    observableInstance.subscribe('h1', observe1);
    observableInstance.subscribe('h1', observe2);
    observableInstance.subscribe('h1', observe3);
    observableInstance.subscribe('h2', observe2);
    observableInstance.subscribe('h2', observe3);
    observableInstance.h1('go1');
    observableInstance.h2('go2');
    observableInstance.h3('go3');
    test("h1 testMe1", ()=>{ expect(testMe1).toEqual(["go1"]); });
    test("h1 testMe2", ()=>{ expect(testMe2).toEqual(["go1", "go2"]); });
    test("h1 testMe3", ()=>{ expect(testMe3).toEqual(["go1", "go2"]); });
    test("h1 object", ()=>{ expect(testObserver.testMe).toEqual(["go1", "go3"]); });
    test("subscriptions.h1", ()=>{
        expect(observableInstance.subscriptions.h1).toEqual([
            testObserver.boundFunctionForTest,
            observe1,
            observe2,
            observe3
        ]);
    });
    test("subscriptions.h2", ()=>{
        expect(observableInstance.subscriptions.h2).toEqual([observe2, observe3]);
    });
    test("subscriptions.h3", ()=>{
        expect(observableInstance.subscriptions.h3).toEqual([testObserver.boundFunctionForTest]);
    });
});

describe('h1,h2,h3 sub & unsub', ()=>{
    var observableInstance = new testC1();
    var testMe = [];
    function observe(args) { testMe.push(args); }
    describe('subscribed', ()=> {
        observableInstance.subscribe('h1', observe);
        observableInstance.subscribe('h2', observe);
        observableInstance.subscribe('h3', observe);
        test("subscriptions.h1", ()=>{
            expect(observableInstance.subscriptions.h1).toEqual([]);
        });
        test("subscriptions.h2", ()=>{
            expect(observableInstance.subscriptions.h2).toEqual([]);
        });
        test("subscriptions.h3", ()=>{
            expect(observableInstance.subscriptions.h3).toEqual([]);
        });
    });
    describe('unsubscribed', ()=> {
        observableInstance.unsubscribe('h1', observe);
        observableInstance.unsubscribe('h2', observe);
        observableInstance.unsubscribe('h3', observe);
        test("subscriptions.h1", ()=>{
            expect(observableInstance.subscriptions.h1).toEqual([]);
        });
        test("subscriptions.h2", ()=>{
            expect(observableInstance.subscriptions.h2).toEqual([]);
        });
        test("subscriptions.h3", ()=>{
            expect(observableInstance.subscriptions.h3).toEqual([]);
        });
    });
});

describe('unsubscribe when not subscribed', ()=>{
    var observableInstance = new testC1();
    var testMe = [];
    function observe(args) { testMe.push(args); }
    observableInstance.unsubscribe('h1', observe);
    observableInstance.unsubscribe('h2', observe);
    observableInstance.unsubscribe('h3', observe);
    test("subscriptions.h1", ()=>{
        expect(observableInstance.subscriptions.h1).toEqual([]);
    });
    test("subscriptions.h2", ()=>{
        expect(observableInstance.subscriptions.h2).toEqual([]);
    });
    test("subscriptions.h3", ()=>{
        expect(observableInstance.subscriptions.h3).toEqual([]);
    });
});

describe('sub & unsub, invalid handler', ()=>{
    var observableInstance = new testC1();
    var testMe = [];
    function observe(args) { testMe.push(args); }
    function invalidSubscription(){
        observableInstance.subscribe('dne', observe)
    }
    function invalidUnSubscription(){
        observableInstance.unsubscribe('dne', observe)
    }
    test("subscription exception handling", ()=> {
        expect(invalidSubscription)
        .toThrowError("'dne' is not a valid handler.")
        expect(invalidSubscription)
        .toThrowError(TypeError)
    })
    test("subscriptions.h1", ()=>{
        expect(observableInstance.subscriptions.h1).toEqual([]);
    });
    test("subscriptions.h2", ()=>{
        expect(observableInstance.subscriptions.h2).toEqual([]);
    });
    test("subscriptions.h3", ()=>{
        expect(observableInstance.subscriptions.h3).toEqual([]);
    });
    test("subscription exception handling", ()=> {
        expect(invalidUnSubscription)
        .toThrowError("'dne' is not a valid handler.")
        expect(invalidUnSubscription)
        .toThrowError(TypeError)
    })
});