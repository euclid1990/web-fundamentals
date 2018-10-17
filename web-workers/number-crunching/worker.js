var n = 1;

/* eslint no-labels:off */
search: while (true) {
  n += 1;
  for (let i = 2; i <= Math.sqrt(n); i++) {
    if (n % i === 0) { continue search; /* eslint no-labels:off */ }
  }
  // Found a prime!
  postMessage(n);
}
