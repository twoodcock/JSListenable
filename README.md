# JSListenable

An observable mixin for JavaScript classes.

## Goals

* Provide the ability to subscribe to and unsubscribe from events.
* Invoke the subscribed callback routines when each event triggers. 
* Handlers are generated automatically by the mixin on construction based on a
  handler list provided by subclass.

# Usage

```
class IAmObservable extends Listenable {
    get handlerList() { ['event1', 'event2']}
}

function ObserverFunction(args) {
   console.log("observer function sees", args)
}

class IObserve {
    rightEye(args) {
        console.log("right eye sees", args)
    }
    leftEye(args) {
        console.log("left eye sees", args)
    }
    directEyes(observee) {
        observee.subscribe('event1', this.rightEye.bind(this));
        observee.subscribe('event2', this.leftEye.bind(this));
    }
}

observee = new IAmObservable();
observee.subscribe('event1', ObserverFunction);
IObserve.directEyes(observee);

IObserve.event1({a: 1});
// observer function sees {a: 1}
// right eye sees {a: 1}
IObserve.event1({a: 2});
// left eye sees {a: 2}
```

# Personal Note.

I had a look for a mixin that does observables and didn't find anything. That
surprised me. I could use mobx, but that interferes with parts of my react app.
I wrote this to make observables practical. If nothing else, it is good
practice.


# Note:

This is part of a larger project. It is not currently useful for more than cut
and paste due to the lack of support infrastructure in the repository.

Testing is implemented for jest.