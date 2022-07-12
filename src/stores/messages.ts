import { acceptHMRUpdate, defineStore } from "pinia";
import { Ref } from "vue";

export const useMessageStore = defineStore("messageStore", {
    state: () => {
        return {
              messages: [],
              fetching: false
        }
    },
    getters: {
        getMessages(state) {
            return state.messages;
        },
        isFetching(state) {
            return state.fetching;
        }
    },
    actions: {
        async loadUserMessages(user) {
            const manager = getManager();
            manager.setUser(user);
            this.messages = await manager.readUserMessages();
        }
    }
});

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useMessageStore, import.meta.hot));
