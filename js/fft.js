/**
 *  Arshan Alam
 *
 *  Simple Library for taking the fourier transform and it's inverse of
 *  equally sampled data.
 *
 */

/**
 *  Complex
 *
 *  A Complex Number
 *
 */
class Complex {
  /**
   *  re:  Real component
   *  im:  Imaginary component
   */
  constructor(re, im) {
    this.re = re;
    this.im = im;
  }

  /**
   *  Calculate the magnitude of this complex number
   */
  get magnitude() {
      return this.calcMagnitude();
  }

  /**
   *  Calculate the magnitude of this complex number
   */
  calcMagnitude() {
    return Math.sqrt(this.re*this.re + this.im*this.im);
  }

  static add(c1, c2) {
    return new Complex(c1.re + c2.re, c1.im + c2.im);
  }

  static sub(c1, c2) {
    return new Complex(c1.re - c2.re, c1.im - c2.im);
  }

  static mul(c1, c2) {
    /**
     * (a + bi)(x + yi) = (ax - by) + (ay + bx)i
     */
    return new Complex(c1.re * c2.re - c1.im*c2.im, c1.re*c2.im + c1.im*c2.re);
  }

  static div(c1, c2) {
    /**
     * URL: http://mathworld.wolfram.com/ComplexDivision.html
     *
     * (a + bi)/(c + di) = [(ac + bd) + (bc-ad)i]/[c^2  + d^2]
     */
    var den = c2.re*c2.re + c2.im*c2.im;
    return new Complex(
      (c1.re*c2.re + c1.im*c2.im)/den,
      (c1.im*c2.re - c1.re*c2.im)/den
    );
  }
}

(function(ft){

  /**
   *  FFT
   *
   *  Compute the Fourier Transform of equally space sampled data f
   *
   *  NOTE: For simplicity, let f.length = 2^m (Length is a power of 2)
   */
  function FFT(f) {
    var N = f.length;
    var half = N/2;

    if(N == 1) {
      return f;
    }

    // Apply the butterfly
    var g = new Array();
    var h = new Array();
    for (var k = 0; k < half; k++) {
      g.push(Complex.div(Complex.add(f[k], f[half + k]), new Complex(2, 0)));
      var hCoef = Complex.div(Complex.sub(f[k], f[half + k]), new Complex(2, 0));
      var unity = new Complex(
        Math.cos(2*(-k)*Math.PI/N),
        Math.sin(2*(-k)*Math.PI/N)
      );
      h.push(Complex.mul(hCoef, unity));
    }

    var G = FFT(g);
    var H = FFT(h);

    // combine the result
    var F = new Array();
    for(var k = 0; k < half; k++) {
      F.push(G[k]);
      F.push(H[k]);
    }

    return F;
  }

  /**
   *  IFFT
   *
   *  Compute the Inverse of a Fourier Transform F
   *
   *  NOTE: For simplicity, let f.length = 2^m (Length is a power of 2)
   */
  function IFFT(f) {
    var N = f.length;
    var half = N/2;

    if(N == 1) {
      return f;
    }

    // Apply the butterfly (Inverse)
    var g = new Array();
    var h = new Array();
    for (var k = 0; k < half; k++) {
      g.push(Complex.add(f[k], f[half + k]));
      var hCoef = Complex.sub(f[k], f[half + k]);
      var unity = new Complex(
        Math.cos(2*k*Math.PI/N),
        Math.sin(2*k*Math.PI/N)
      );
      h.push(Complex.mul(hCoef, unity));
    }

    var G = IFFT(g);
    var H = IFFT(h);

    // combine the result
    var F = new Array();
    for(var k = 0; k < half; k++) {
      F.push(G[k]);
      F.push(H[k]);
    }

    return F;
  }

  /**
   *  Make the function global
   */
   ft.FFT = FFT;
   ft.IFFT = IFFT;

  if (!window.ft) {
    window.ft = ft;
  }
})(window.ft || {});


// Testing
//
//var f = new Array();
//f.push(new Complex(6, 0));
//f.push(new Complex(0, 2));
//f.push(new Complex(0, -2));
//f.push(new Complex(2, 0));
//f.push(new Complex(6, 0));
//f.push(new Complex(0, 2));
//f.push(new Complex(0, -2));
//f.push(new Complex(2, 0));
//
//var F = ft.FFT(f);
//var N = f.length;
// for(var i = 0; i < N; i++) {
//   console.log(F[i]);
//}

//var I = ft.IFFT(F);
//for(var i = 0; i < N; i++) {
//   console.log(I[i]);
//}
