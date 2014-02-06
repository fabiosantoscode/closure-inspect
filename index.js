'use strict';

var escodegen = require('escodegen');
var esprima = require('esprima');
var assert = require('assert');
var astw = require('astw');

var wrap = '$scope($FUNCTION, $VARIABLES, function(code){return eval(code)})';
var evaluator = parseFunc(function(expr){return eval(expr)})
evaluator.isEvaluator = true;

var preamble =
'var $CLOSURE = (' +
function () {
    if (typeof window === "object") {
        return window.$CLOSURE;
    } else if (typeof require !== "undefined") {
        return require("../inspect-client.js");
    }
} + '());\n'

module.exports = function (src) {
    var tree = esprima.parse(src);

    astw(tree)(function (node) {
        if (node.type === 'FunctionExpression' && !node.isEvaluator) {
            var slot;
            for (var key in node.parent) if (node.parent.hasOwnProperty(key)) {
                if (node === node.parent[key]) {
                    slot = key;
                }
            }

            assert(slot);

            node.parent[slot] = {
                type: 'CallExpression',
                callee: {
                    type: 'Identifier',
                    name: '$CLOSURE'
                },
                arguments: [
                    node,
                    evaluator,
                    //["TODO", "VARIABLES"],
                    evaluator
                ]
            }
        }
    })

    return preamble + escodegen.generate(tree);
}

function parseFunc(func) {
    var tree = esprima.parse('(' + func + ')')
    return tree.body[0].expression
}

function extend(obj) {
    var cls = function () {}
    cls.prototype = obj
    cls.prototype.parentScope = obj
    return new cls
}
