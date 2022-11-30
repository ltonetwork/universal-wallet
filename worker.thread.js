import { self } from 'react-native-threads';

let count = 0;

self.onmessage = message => {
  console.log(`THREAD: got message ${message}`);

  count++;
  if (count < 5) {
    self.postMessage(`Message #${count} from worker thread!`);
  }
}