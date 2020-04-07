import React from 'react'
import storeContext from '../stores'

const useStores = () => React.useContext(storeContext);

export default useStores;