/*
 * Listenable - a base class for things that want to be listened to.
 * Usage:
 *
 * class SomeClass {
 *   myHandler() { do something fun }
 * }
 * listener = new SomeClass();
 * obj = new Listenable();
 * obj.addListener('onCreate', listener.myHandler.bind(listener))
 */
class Listenable {
    get handlerList() { return ['onCreate', 'onLoad', 'onChange', 'onUpdate', 'onDelete']}
    constructor(props) {
        this.subscriptions = {};
        for (var handlerName of this.handlerList) {
            if (!(handlerName in this)) {
                // Create the handler from the generic handler, if the handler
                // does not already exist.
                this[handlerName] = this.handler.bind(this, handlerName);
                this.subscriptions[handlerName] = [];
            }
        }
    }
    subscribe(handler, callback) {
        if (handler in this) {
            var found = false;
            for (var existing of this.subscriptions[handler]) {
                if (callback === existing) {
                    found = true;
                    break;
                }
            }
            if (!found) {
                this.subscriptions[handler].push(callback);
            }
        } else {
            throw TypeError("'"+handler+"' is not a valid handler.");
        }
    }
    unsubscribe(handler, callback) {
        if (handler in this) {
            for (var i in this.subscriptions[handler]) {
                if (this.subscriptions[handler][i] === callback) {
                    // remove the handler at index i.
                    this.subscriptions[handler].splice(i, 1);
                }
            }
        } else {
            throw TypeError("'"+handler+"' is not a valid handler.");
        }
    }
    handler(handler, props) {
        // This could be a map(()=>{})...
        for (var i in this.subscriptions[handler]) {
            this.subscriptions[handler][i](props);
        }
    }
}

export default Listenable;