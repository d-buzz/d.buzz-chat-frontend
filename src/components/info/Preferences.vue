<template>
    <div class="mt-2"></div>
    <div class="flex flex-row" v-for="item in preferences" :key="updateKey">
        <div v-if="item.options">
            <div>
                <div><b>{{item.display}}</b></div>
                <div><small>{{item.desc}}</small></div>
            </div>
            <div>
                <select v-model="item.newvalue" class="inputSelect1">
                    <option v-for="option in item.options" :value="option[0]">{{option[1]}}</option>
                </select>
            </div>
        </div>
        <div v-else>
            <div>
                <div><b>{{item.display}}</b></div>
                <div><small>{{item.desc}}</small></div>
            </div>
            <div>
                <input type="checkbox" v-model="item.newvalue">
            </div>
        </div>
    </div>
    <div><small>{{updateMessage}}</small></div>
    <button class="btn" @click="updatePreferences" title="Update settings.">Update</button>
    <button class="btn2" @click="resetChanges" title="Discard changes and show currently set values.">Reset changes</button>     
</template>
<script setup>
import { useAccountStore } from "../../stores/account";
const accountStore = useAccountStore();
const updateMessage = ref("");
const preferences = ref([]);
const updateKey = ref('#'+stlib.Utils.nextId());

const defaultPreferences = [
    {name: "memoKey:b", display: "Use Memo Key", desc: "Use memo key or 1st posting key for private messages.", value: false, newvalue: false},
    {name: "directMessage:s", display: "Direct Message", desc: "Permission to message directly is granted to:",
     value: '', newvalue:'', options:[
        ['everyone', 'Everyone'],['accounts', 'Hive users'],
        ['communities','Communities in common'], ['friends', 'Friends']]},
    {name: "showOnline:b", display: "Online Status", desc: "Show online status.", value: true, newvalue:true},
    {name: "autoDecode:b", display: "Auto Decode", desc: "Automatically decode private messages.", value: false, newvalue:false},
    {name: "flipMessageBox:b", display: "Flip Message Box", desc: "Flip message box on y-axis.", value: false, newvalue:false},
    {name: "showDetailedProfile:b", display: "Show Detailed Profile", desc: "Show user profile image and data.", value: false, newvalue:false}
];
async function init() {
    var user = accountStore.account.name;
    if(user == null) return;
    var manager = getManager();
    var prefs = await manager.getPreferences();
    var values = prefs.getValues();
    var array = [];
    for(var pref of defaultPreferences) {
        try {
            var name = pref.name;
            var value = values[name];
            if(value != null) array.push({name, display:pref.display, desc:pref.desc, value, newvalue:value, options:pref.options});
            else array.push(pref);
        }
        catch(e) {
            console.log(e);
        }
    }
    preferences.value = array;
    updateKey.value = '#'+stlib.Utils.nextId(); 
}
init();
async function updatePreferences() {
    var user = accountStore.account.name;
    if(user == null) return;
    var manager = getManager();
    var prefs = await manager.getPreferences();
    for(var item of preferences.value) {
        item.value = item.newvalue;
        prefs.setValue(item.name, item.value);
    }
    var result;
    if(prefs.getValue("showOnline:b", false) === true) result = await manager.setupOnlineStatus(true);
    else result = await manager.updatePreferences(prefs);
    if(result.isSuccess()) updateMessage.value = "Succesfully updated settings.";
    else updateMessage.value = "Failed to update preferences. " + result.getError();
}
function resetChanges() {
    var user = accountStore.account.name;
    if(user == null) return;
    for(var item of preferences.value)
        item.newvalue = item.value;
    updateKey.value = '#'+stlib.Utils.nextId(); 
}
</script>


