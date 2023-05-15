# Arithmetic parser on JavaScript


This is an arithmetic parser implemented in JavaScript. It's capable of parsing and evaluating arithmetic expressions involving the basic arithmetic operations like addition, subtraction, multiplication, division, and also more complex operations like sum, average, negate, arctangent (atan, atan2). The parser can handle variables x, y, and z in the expressions.

------------


#### Features
- Evaluate arithmetic expressions.
- Handle multiple operations: +, -, *, /, sum, avg, negate, atan, atan2.
- Support for variables: x, y, z.
- Two parsing modes: regular and prefix.

------------



#### Usage
Here is a simple example on how to use the parser:
```javascript
const expression = parse("2 * x - 3");
const expressionPrefix = parsePrefix("(- (* 2 x) 3)");
/*
expression/expressionParser: 

    new Subtract(
        new Multiply(
            new Const(2),
            new Variable("x")
        ),
        new Const(3)
    );
 */

let result = expression.evaluate(5, 2, 3);  // evaluates "2 * 5 - 3"
let resultPrefix = expressionParser.evaluate(1, 2, 3);  // evaluates "(- (* 2 5) 3)"
console.log(result);  // Outputs: 7
console.log(resultPrefix);  // Outputs: 7
```
In this example, we first parse the expression "2x - 3" and then evaluate it with x=5, y=2, and z=3.

------------

#### API
The parser exposes the following main functions:

- parse(string): Parses a string containing an arithmetic expression and returns an object representing the parsed expression.
- parsePrefix(string): Parses a string containing an arithmetic expression in [prefix notation](https://ru.wikipedia.org/wiki/Польская_запись) and returns an object representing the parsed expression.
- evaluate(x, y, z): Evaluates the parsed expression with the provided variable values. This function is a method of the object returned by parse and parsePrefix.
- toString(): outputs an expression entry in a [postfix notation](https://ru.wikipedia.org/wiki/Обратная_польская_запись)
- prefix(): outputs an expression entry in a [prefix notation](https://ru.wikipedia.org/wiki/Польская_запись)

Additionally, the parser provides the following helper functions:

- fabrica(nameOfOperation, functionOfOperation): Factory function to create specific operation instances.
- summary(numbers): Sum the given numbers.
- checkingOperation(lexemes): Checks if the operation is valid.
- checkingError(errorElement, array = null): Checks for errors in the parsed expressions.

------------

#### Error Handling

The parser includes an InputError class to report errors during parsing. If the input string cannot be parsed correctly, an InputError will be thrown with a message indicating what went wrong.

Example errors and error's messages:
```
Empty input              Error: Empty input
Unknown variable         Error: Unknown variable: a
Invalid number           Error: Invalid number: -a
Missing )                Error: Missing )
Unknown operation        Error: Unknown operation: -> @@ <- (@@ x y)
Excessive info           Error: Excessive info
Empty op                 Error: Empty op: "()"
Invalid unary (0 args)   Error: Incorrect number of elements, LESS, than we need (0): (negate )
Invalid unary (2 args)   Error: Incorrect number of elements, MORE, than we need (1): (negate x)
Invalid binary (0 args)  Error: Incorrect number of elements, LESS, than we need (0): (+ )
Invalid binary (1 args)  Error: Incorrect number of elements, LESS, than we need (1): (+ x)
Invalid binary (3 args)  Error: Incorrect number of elements, MORE, than we need (2): (+ x y)
Variable op (0 args)     Error: Unknown operation: -> x <- (x )
Variable op (1 args)     Error: Unknown operation: -> x <- (x 1)
Variable op (2 args)     Error: Unknown operation: -> x <- (x 1 2)
Const op (0 args)        Error: Unknown operation: -> 0 <- (0 )
Const op (1 args)        Error: Unknown operation: -> 0 <- (0 1)
Const op (2 args)        Error: Unknown operation: -> 0 <- (0 1 2)
```
