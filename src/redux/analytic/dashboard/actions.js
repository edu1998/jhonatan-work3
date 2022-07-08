import * as types from "./types";
import dashboardApi from '../../../api/dashboard';
import chunk from 'lodash/chunk';

const dashboardActions = {
    doReset: () => async (dispatch) => {
        dispatch({
          type: types.DASHBOARD_RESETED,
        });    
    },
    doFetch: (rawFilter) => async (
        dispatch,
        getState,
    ) => {
        try {
            const batchSize = 10;
            const pendingBatches = chunk(rawFilter.partner, batchSize);

            dispatch({
                type: types.DASHBOARD_FETCH_STARTED,
                payload: { 
                    rawFilter,
                    loadingProgress: {
                        totalToProcess: pendingBatches.length,
                        progress : 0
                    }
                },
            });

            for(let [index, batch] of pendingBatches.entries()){
                const response = await dashboardApi.search({
                    ...rawFilter,
                    partner: batch
                });

                dispatch({
                    type: types.DASHBOARD_FETCH_SUCCESS,
                    payload: {
                        rows: response.data,
                        loadingProgress: {
                            totalToProcess: pendingBatches.length,
                            progress : index + 1
                        }
                        },
                    });
            }

            dispatch({
                type: types.DASHBOARD_FETCH_FINISH
            });
        } catch (error) {
            dispatch({
                type: types.DASHBOARD_FETCH_ERROR,
            });
        }
    },
};

export default dashboardActions;