var n = 1;

search: while (true) {
  n += 1;
  for (let i = 2; i <= Math.sqrt(n); i++)
    if (n % i == 0)
      continue search;
  // Found a prime!
  postMessage(n);
}
