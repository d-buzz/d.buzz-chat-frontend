import { acceptHMRUpdate, defineStore } from "pinia";
import { Ref } from "vue";

export const useMessageStore = defineStore("messageStore", {
    state: () => {
        return {
              messages: [],
              fetching: false,
              communities: []
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
        async loadCommunities(user) {
             console.log("loading communities " + window.hive);
            for(var i = 0; i < 10; i++)
                if(window.hive === undefined)
                    await new Promise(resolve => setTimeout(resolve, 500));

            console.log("loading communities " + window.hive);
            this.communities = await window.hive.api.callAsync("bridge.list_all_subscriptions", {"account":user});
        },
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
