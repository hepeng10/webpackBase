import React from 'react';

import loading from './loading';
import test from './test';

const storesContext = React.createContext({
    loading,
    test,
});

export default storesContext;