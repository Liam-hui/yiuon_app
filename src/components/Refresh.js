import React from 'react';
import { RefreshControl} from 'react-native';

// export default function Refresh({action}) {
  export default function Refresh({refreshing,onRefresh}) {
    // const [refreshing, setRefreshing] = React.useState(false);

    // const wait = (timeout) => {
    //     return new Promise(resolve => {
    //       setTimeout(resolve, timeout);
    //     });
    //   }
    
    // const onRefresh = React.useCallback(() => {
    //     setRefreshing(true);
    //     action();

    //     wait(1000).then(() => setRefreshing(false));
    // }, []);

    return (
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
    );
}
  