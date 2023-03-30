<template>
    <div class="mt-2"></div>
    <div class="grow overflow-y-scroll scrollBox" :key="updateKey">
        <div class="scrollBoxContent flex flex-col pr-3">
            <div v-for="message in messages">
                <Message :message="message" :displayOnly="true" :displayEdits="true"/>
            </div>
        </div>
    </div>
    <div><small>{{updateMessage}}</small></div>
</template>
<script setup>
import { useAccountStore } from "../../stores/account";
const accountStore = useAccountStore();
const messages = ref([]);
const canLoadPreviousMessages = ref(true);
const loadingPreviousMessages = ref(false);
const updateKey = ref('#'+stlib.Utils.nextId());

function setMessages(list) {
    var result = [];
    //var array = null;
    for(var msg of list) {
        if(!msg || msg.isEdit || msg.isEmote() || msg.isFlag() || msg.getContent() == null) continue;
        /*var type = msg.isThread()?'h':'t';
        if(array === null || array.type !== type) {
            array = [];
            array.type = type;
            result.push(array);
        } */ 
        //array.push(msg);
        result.push(msg);
    }
    //for(var i = 0; i < 100; i++) result.push(list[0]);
    messages.value = result;
}
async function init() {
    var user = accountStore.account.name;
    if(user == null) return;
    var manager = getManager();
    
    var updateMessages = async () => {
        /*var container = messages.value;
        var scrollToBottom = !valueFlipMessageBox.value;
        var scrollTop = 0;
        if(container) { 
            scrollToBottom = isAtScrollBottom(container); 
            scrollTop = container.scrollTop;
        }*/
        var data = await manager.getSelectedConversations('&'+user);
        data.messages.sort((a,b)=>a.getTimestamp()-b.getTimestamp());
        setMessages(data.messages);
        
        updateKey.value = ""+stlib.Utils.nextId();
        /*if(data.messages.length > 0) {
            manager.setLastRead(conversation,
                 data.messages[data.messages.length-1].getTimestamp());
        }*/
        /*nextTick(async () => {
            var container = messages.value;
            if(container) container.scrollTop = scrollToBottom?
                          container.scrollHeight:scrollTop;
        });*/
        return data;
    };
    //var prefs = await manager.getPreferences();
    //valueFlipMessageBox.value = prefs.getValueBoolean("flipMessageBox", false);
    //var isAutoDecode = prefs.getValueBoolean("autoDecode", false);
    //valueAutoDecode.value = isAutoDecode;
    var data = await updateMessages();
    if(data) canLoadPreviousMessages.value = data.maxTime > 0;

    manager.setCallback("Mentions.vue", updateMessages);

}
init();
</script>


