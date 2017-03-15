/*global expect*/
describe('hook', function () {
    it('should hook into the expect function itself', function () {
        var clonedExpect = expect.clone();
        var called = false;
        clonedExpect.hook(function (next) {
            return function (subject, testDescriptionString) {
                called = true;
                return next.apply(this, arguments);
            };
        });
        expect(called, 'to be false');
        clonedExpect(123, 'to equal', 123);
        expect(called, 'to be true');
    });

    it('should not affect clones', function () {
        var clonedExpect = expect.clone();
        var called = false;
        clonedExpect.hook(function (next) {
            return function (subject, testDescriptionString) {
                called = true;
                return next.apply(this, arguments);
            };
        });
        var clonedClonedExpect = clonedExpect.clone();
        clonedClonedExpect(123, 'to equal', 123);
        expect(called, 'to be false');
    });

    it('should allow rewriting the assertion string', function () {
        var clonedExpect = expect.clone();
        clonedExpect.hook(function (next) {
            return function () {
                arguments[1] = 'to equal';
                return next.apply(this, arguments);
            };
        });
        clonedExpect(123, 'to foobarquux', 123);
    });

    it('should allow suppressing the return value of the "next" expect', function () {
        var clonedExpect = expect.clone();
        clonedExpect.hook(function (next) {
            return function () {
                try {
                    next.apply(this, arguments);
                } catch (e) {
                    return expect.promise.resolve();
                }
            };
        });
        clonedExpect(123, 'to equal', 456);
    });

    it('should allow installing multiple hooks', function () {
        var firstCalled = false;
        var secondCalled = false;
        var clonedExpect = expect.clone();
        clonedExpect.hook(function (next) {
            return function () {
                firstCalled = true;
                return next.apply(this, arguments);
            };
        });
        clonedExpect.hook(function (next) {
            return function () {
                secondCalled = true;
                return next.apply(this, arguments);
            };
        });
        clonedExpect(123, 'to equal', 123);
        expect(firstCalled, 'to be true');
        expect(secondCalled, 'to be true');
    });
});
