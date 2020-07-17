//Список чисел Фибоначчі
function generateFibonacciSequence(n) {
    var fibo = [1, 1];
    for (var i = 3; i <= n; i++) {
        fibo.push(fibo[fibo.length-2] + fibo[fibo.length-1]);
    }
    return fibo;
}

document.write("10 = " + generateFibonacciSequence(10).join(", ") + '<br>');
document.write("7 = " + generateFibonacciSequence(7).join(", ") + '<br>');
document.write("2 = " + generateFibonacciSequence(2).join(", ") + '<br>');