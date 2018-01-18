//ref:https://en.wikipedia.org/wiki/Discrete_wavelet_transform#Code_example
function haarWaveletTransform(input) {
    // This function assumes that input.length=2^n, n>1
    var output = new Array(input.length);

    for (var length = input.length / 2; ; length = length / 2) {
        // length is the current length of the working area of the output array.
        // length starts at half of the array size and every iteration is halved until it is 1.
        for (var i = 0; i < length; i++) {
            var sum = input[i * 2] + input[i * 2 + 1];
            var difference = input[i * 2] - input[i * 2 + 1];
            output[i] = sum;
            output[length + i] = difference;
        }
        if (length == 1) {
            return output;
        }

        //Swap arrays to do next iteration
        input = output.slice();
    }
}
