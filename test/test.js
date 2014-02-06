var client = require('../inspect-client');
var index = require('../index.js');

var tap = require('tap');

var window = { $CLOSURE: client };

tap.test('code in, code out', function (t) {
    t.equal(typeof index('2 * 2'), 'string')
    t.end()
})

tap.test('wraps functions, doesn\'t modify their usage', function (t) {
    var s = '(' + function () {
        return 2
    } + ')()';

    t.equal(eval(index(s)), 2)

    var inObj = '(' + function () {
        return {
            f: function () {
                return 2;
            }
        }
    } + ')()'

    t.equal(eval(index(inObj)).f(), 2)

    t.end();
})


