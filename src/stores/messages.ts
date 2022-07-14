import { acceptHMRUpdate, defineStore } from "pinia";
import { Ref } from "vue";

export const useMessageStore = defineStore("messageStore", {
    state: () => {
        return {
              fetching: false,
              messages: [],
              communities: [],
              conversations: []
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
            this.communities = await hive.api.callAsync("bridge.list_all_subscriptions", {"account":user});
        },
        async loadConversations(user) {
            console.log("conversations load " + user);
            const manager = getManager();
            manager.setUser(user);
            this.conversations = await manager.readUserConversations();
            console.log("conversations done ");
            console.log(this.conversations);
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
