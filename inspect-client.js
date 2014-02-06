(function (construct) {
if (typeof module === 'object') {
    module.exports = construct();
} else if (typeof window === 'object') {
    window.$closure = construct();
}
}(function construct() {
    return function (func, variables, evalFunc) {
        func.closure = {
            variables: variables,
            variable: evalFunc,
            eval: evalFunc
        }

        return func
    }
}))
