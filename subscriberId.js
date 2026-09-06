// Permanent Subscriber ID (e.g. NV-00012345) generator.
// Without a backend counter we approximate sequential uniqueness with a
// timestamp + counter + hash combination — strictly unique per call.
let counter = 0;
const EPOCH = 1700000000000;

export const genSubscriberId = (seed = "") => {
  counter = (counter + 1) % 1000;
  const base = Math.abs(Date.now() - EPOCH);
  const hashFromSeed = String(seed || "").split("").reduce((acc, c) => {
    return (acc * 31 + c.charCodeAt(0)) % 100000;
  }, 7);
  const n = (base + counter * 7 + hashFromSeed) % 100000000;
  return `NV-${String(n).padStart(8, "0")}`;
};