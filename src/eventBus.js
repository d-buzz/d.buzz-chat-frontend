// eventBus.js
import { reactive, readonly } from 'vue';

const state = reactive(new Map());

export const eventBus = {
  $on(event, handler) {
    if (!state.has(event)) {
      state.set(event, new Set());
    }
    state.get(event).add(handler);
  },
  $off(event, handler) {
    if (state.has(event)) {
      state.get(event).delete(handler);
      if (state.get(event).size === 0) {
        state.delete(event);
      }
    }
  },
  $emit(event, ...args) {
    if (state.has(event)) {
      for (const handler of state.get(event)) {
        handler(...args);
      }
    }
  },
};

// Export a readonly version to prevent external modifications
export default readonly(eventBus);
