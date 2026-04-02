let isRefreshing = false;
let failedQueue: any[] = [];

// this handle process after getting new tokens
const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if(error) {
      prom.reject(error);
    } else {
      prom.resolve(token || '');
    }
  });
  failedQueue = [];
};

const tokenRefreshLock = {
  isRefreshing: () => isRefreshing,

  setIsRefreshing: (value: boolean) => {
    isRefreshing = value;
  },

  addToQueue: (promise: {resolve: (token: string) => void, reject: (error: any) => void}) => {
    failedQueue.push(promise);
  },

  processQueue,
};

export default tokenRefreshLock;