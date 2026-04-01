// types/bootstrap-bundle.d.ts

declare module 'bootstrap/dist/js/bootstrap.bundle.min.js' {
  // We don’t care about the exact shape; we just load it for side-effects.
  const bootstrapBundle: unknown;
  export default bootstrapBundle;
}
