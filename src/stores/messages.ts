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
        isFetching() {
            return state.fetching;
        }
    },
    actions: {
        async loadUserMessages(user) {
            var _this = this;
            const manager = getManager();
            manager.setUser(user);
            manager.onmessage = async function(json) {
                var displayableMessage = await manager.jsonToDisplayable(json);
                _this.messages.push(displayableMessage);
	        };
            this.messages = await manager.readUserMessages();
            console.log(this.messages);
        }
    }
});

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useMessageStore, import.meta.hot));
