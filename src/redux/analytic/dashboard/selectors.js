import { createSelector } from 'reselect';

const selectRaw = (state) => state.Analytic.dashboard;

const selectLoading = createSelector(
    [selectRaw],
    (raw) => raw.loading,
);
const selectRows = createSelector(
    [selectRaw],
    (raw) => raw.rows,
  );

const selectRawFilter = createSelector(
    [selectRaw],
    (raw) => {
        return raw.rawFilter;
    },
);
const selectLoadingProgress = createSelector(
    [selectRaw],
    (raw) => {
        return raw.loadingProgress;
    },
);
const dashboardSelectors = {
    selectLoading,
    selectRows,
    selectRawFilter,
    selectLoadingProgress
};

export default dashboardSelectors;