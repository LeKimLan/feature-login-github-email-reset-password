import { lazy, Suspense } from "react";

const lazyFn = (importFn) => {
  const LazyComponent = lazy(() => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(importFn());
      }, 1000);
    });
  });
  ///const LazyComponent = lazy(importFn)

  return () => (
    <Suspense fallback={<div className="lazyLoading"><span className="loader"></span></div>}>
      <LazyComponent />
    </Suspense>
  );
};

export default lazyFn;