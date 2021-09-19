import { createStore } from 'redux';
import reducers from './reducers/playersreducer';


const store = createStore(reducers);
export default store;