"use strict";

function SimpleElementsOfExpression(value) {
    this.value = value;
}

SimpleElementsOfExpression.prototype.toString = function () {
    return this.value.toString();
};

SimpleElementsOfExpression.prototype.prefix = function () {
    return this.value.toString();
};

function Const(value) {
    SimpleElementsOfExpression.call(this, value);
}

Const.prototype.constructor = Variable;
Const.prototype = Object.create(SimpleElementsOfExpression.prototype);
Const.prototype.evaluate = function (...args) {
    return this.value;
};


function Variable(value) {
    SimpleElementsOfExpression.call(this, value);
}

Variable.prototype.constructor = Variable;
Variable.prototype = Object.create(SimpleElementsOfExpression.prototype);
Variable.prototype.evaluate = function (x, y, z) {
    if (this.value === "x") {
        return x;
    } else if (this.value === "y") {
        return y;
    } else if (this.value === "z") {
        return z;
    }
};

function Operations(action, sign, ...parts) {
    this.action = action;
    this.sign = sign;
    this.parts = parts;
}

Operations.prototype.toString = function () {
    return this.parts.join(' ').concat(' ').concat(this.sign);
};

Operations.prototype.prefix = function () {
    return '('.concat(this.sign.concat(' '.concat((this.parts.map(i => i.prefix())).join(' ')))).concat(')');
};

Operations.prototype.evaluate = function (...variables) {
    return this.action(...this.parts.map(i => i.evaluate(...variables)))
}

function fabrica(nameOfOperation, functionOfOperation) {
    return function (...args) {
        const elementFabrica = new Operations(functionOfOperation, nameOfOperation, ...args)
        elementFabrica.prototype = Object.create(Operations.prototype)
        return elementFabrica;
    }
}

function summary(numbers) {
    let total = 0;
    for (let i = 0; i < numbers.length; i++) {
        total += numbers[i];
    }
    return total;
}

const Sum = fabrica("sum", (...args) => summary(args));
const Avg = fabrica('avg', (...args) => summary(args) / args.length);
const Add = fabrica("+", (a, b) => a + b);
const Subtract = fabrica("-", (a, b) => a - b);
const Multiply = fabrica("*", (a, b) => a * b);
const Divide = fabrica("/", (a, b) => a / b);
const Negate = fabrica("negate", a => -a);
const ArcTan = fabrica("atan", Math.atan);
const ArcTan2 = fabrica("atan2", Math.atan2);

let mapOfVariables = new Map([
    ['x', 'variable'],
    ['y', 'variable'],
    ['z', 'variable']
]);

let mapOfActions = new Map([
    ['+', [Add, 2]],
    ['sum', [Sum, Infinity]],
    ['avg', [Avg, Infinity]],
    ['-', [Subtract, 2]],
    ['*', [Multiply, 2]],
    ['/', [Divide, 2]],
    ['negate', [Negate, 1]],
    ['atan', [ArcTan, 1]],
    ['atan2', [ArcTan2, 2]],
]);

let mapOfBrackets = new Map([
    ['(', 'leftBracket'],
    [')', 'rightBracket']
]);

function parse(string) {
    const lexemes = string.trim().split(/\s+/);
    const stack = [];

    let map = lexemes.map(lexeme => {
        if (mapOfActions.has(lexeme)) {
            const ofMap = mapOfActions.get(lexeme)
            stack.push(new ofMap[0](...stack.splice(-ofMap[1])));
        } else if (mapOfVariables.has(lexeme)) {
            stack.push(new Variable(lexeme));
        } else {
            stack.push(new Const(Number(lexeme)));
        }
    });
    return stack.pop();
}

function parsePrefix(string) {
    const lexemes = string.replace(/[)(]/g, function (match) {return match === ')' ? ' ) ' : ' ( ';}).trim().split(/\s+/);
    return parsePrefixlexemes(lexemes, false);
}

function parsePrefixlexemes(lexemes, recursive=true) {
    let toOut = null;
    const element = lexemes.shift();

    if (recursive === true && element === ")") {
        return -1
    } else if (element === "(") {
        toOut = checkingOperation(lexemes);
    } else if (mapOfVariables.has(element)) {
        toOut = new Variable(element);
    } else if (element !== "" && !isNaN(element)) {
        toOut = new Const(Number(element));
    } else {
        checkingError(element);
    }

    if (!recursive) {
        if (lexemes.length !== 0) {
            throw new InputError("Excessive info");
        }
    }
    return toOut;
}

function checkingOperation(lexemes) {
    let array = [];
    if (lexemes.length === 0) {
        checkingError("(")
    }
    let element = lexemes.shift();
    if (mapOfActions.has(element)) {
        const ofMap = mapOfActions.get(element);
        const op = element
        let count = 0;
        let toPush;
        while (lexemes.length !== 0 && count < ofMap[1]) {
            toPush = parsePrefixlexemes(lexemes);
            if (toPush === -1) {
                if (ofMap[1] === Infinity) {
                    break;
                }
                throw new InputError(`Incorrect number of elements, LESS, than we need (${count}): (${op} ${array.join(' ')})`)
            }
            array.push(toPush)
            count++
        }

        if (ofMap[1] !== Infinity) {
            if (lexemes.length !== 0) {
                element = lexemes.shift();
                if (element !== ")") {
                    throw new InputError(`Incorrect number of elements, MORE, than we need (${count}): (${op} ${array.join(' ')})`)
                }
            } else {
                throw new InputError("Missing )");
            }
        } else {
            if (toPush !== -1) {
                throw new InputError("Missing )");
            }
        }

        return new ofMap[0](...array.splice(-ofMap[1]));
    } else if (element === ")") {
        throw new InputError("Empty op: \"()\"");
    } else {
        checkingError(element, lexemes)
    }
}


function checkingError(errorElement, array = null) {
    if (array === null) {
        if (errorElement === "") {
            throw new InputError("Empty input");
        } else if (errorElement.length === 1 && /[a-z]/i.test(errorElement)) {
            throw new InputError(`Unknown variable: ${errorElement}`);
        } else {
            throw new InputError(`Invalid number: ${errorElement}`);
        }
    }
    throw new InputError(`Unknown operation: -> ${errorElement} <- (${errorElement} ${array.slice(0, -1).join(' ')})`);
}

class InputError extends Error {
    constructor(message) {
        super(message);
        this.name = "InputError";
    }
}





