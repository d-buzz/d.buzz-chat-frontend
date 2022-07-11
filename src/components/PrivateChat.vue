<template>
  <div class="w-full h-full flex flex-col justify-end overflow-y-scroll">
    <Message v-for="message in messageList" :message="message"/>
    <div class="flex mt-4">
      <input
        class="shadow appearance-none border rounded-full w-[calc(100%-4rem)] py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline grow"
        id="Message"
        v-model="messageText"
        @keyup.enter="enterMessage(messageText)"
        type="text"
        placeholder="Message"
      />
      <!--<button class="right-0 x-16 bg-primary text-white font-bold py-2 px-4 rounded-full">Send</button>-->
    </div>
  </div>
</template>
<script setup>
import { useAccountStore } from "../stores/account";
import { useRoute } from "vue-router";
const route = useRoute();
const accountStore = useAccountStore();
var messageList = [{"user": "mirafun", "text": "hiii ", verified: true}];
function initChat() {
    
    var user = accountStore.account.name;
    if(user == null) {
        //TODO ask to login
        return;
    }
    const manager = getManager();  //TODO pagination
    manager.client.readUserMessages(user, 0, stlib.Utils.utcTime(), 
        async (result)=>{
        if(result.isSuccess()) {
            var list = [];
            var array = result.getResult();
            for(var msgJSON of array) {
                var msg = stlib.SignableMessage.fromJSON(msgJSON);
                console.log(msg);
                var verified = await msg.verify();
                var content = msg.getContent();
                if(content == null) {
                    //unsupported content 
                    continue;
                }
                if(content.getType() === stlib.Content.Text.TYPE) {
                    list.push({
                        "text": content.getText(),
                        "verified": verified
                    });
                }
            }
            console.log(list);
            messageList = list;
        }
        else {
            console.log(result.getError());
        }
    }); 
}
initChat();

const enterMessage = async (message) => {
    var user = accountStore.account.name;
    var user2 = route.params.user;
    console.log("user " + user + " " + user2);
    if(user == null) {
        //TODO ask to login
        return;
    }
    if(user2 == null || user2 == "") return;

    const manager = getManager();
    var client = manager.client;
    var textMsg = stlib.Content.text(message);
    var signableMessage = textMsg.forUser(user, [user, user2] );
    await signableMessage.signWithKeychain('Posting');
    
    client.write(signableMessage, (result)=>{
        console.log(result);
    });
};

</script>
