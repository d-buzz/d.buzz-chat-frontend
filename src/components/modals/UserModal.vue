<template>
  <DefaultModal>
    <div class="flex">
        <div class="flex-shrink-0 mr-5px">
            <UserIcon :name="user" imgCss="av128" size="medium"/>
        </div>
        <div class="flex flex-col grow" style="margin-top:-7px;min-width:210px;">
            <div class="grow">
                <div class="flex justify-between">
                    <b class="text-lg">{{user}}</b>
                </div>
                <div>
                    <small class="text-gray-700 mr-1" 
                        style="align-self: center; padding: 1px 2px; " @mouseenter="tooltip($event.target, $t('UserModal.Reputation'))">{{reputation}}
                        <span class="oi oi-badge" style="opacity:0.5;"></span></small> 
                    <small class="text-gray-700" style="align-self: center;" @mouseenter="tooltip($event.target, $t('UserModal.CreatedDate'))">
                        {{created}}<span class="oi oi-calendar" style="margin-left:1px; opacity:0.5;"></span></small> 
                </div>     
                <hr/>
                <div v-if="communityData">
                    <div v-if="editable" class="mt-1">
                        <PermissionSet :set="roleSet" :rolesOnly="true" :titleButtonText="' '"/>
                        <hr/>
                        <div>
                        <button class="btn" @click="saveChanges">Update</button>
                        <button class="btn2" @click="discardChanges">Reset</button>
                        </div>
                    </div>
                    <div v-else-if="isMod">
                        <div><i>{{role}}</i><span class="cursor-pointer text-sm float-right" @click="toggleEditable" title="edit role, titles"><span class="oi oi-pencil"></span></span></div>
                        <div><span v-for="title in titles" class="rounded-lg bg-green-700 pr-1 pl-1 mr-1 text-white font-bold text-sm">{{title}}</span></div> 
                    </div>
                </div>
            </div>
            <div>
                <small>Visit on:
                    <a class="font-bold" :href="`https://peakd.com/@${user}`" @mouseenter="tooltip($event.target, `https://peakd.com/@${user}`)" target="_blank" rel="noreferrer noopener">Peakd <span class="oi oi-external-link text-xm"></span></a>
                </small>            
            </div>
        </div>
    </div>
    <div class="mt-2">
        <router-link :to="`/p/${user}`"><span class="btn" @mouseenter="tooltip($event.target, $t('UserModal.Message.Info'))"><span class="oi oi-chat text-sm"></span> {{$t("UserModal.Message")}}</span></router-link> 
        <span v-if="relations">     
            <button class="btn" @click="add(user, !relations.follows)" @mouseenter="tooltip($event.target, $t('UserModal.'+(relations.follows?'Remove.Info':'Add.Info')))"><span class="oi oi-people"></span> {{$t("UserModal."+(relations.follows?'Remove':'Add'))}}</button>   
        </span> 
    </div>
    <div class="mt-1"><small>{{updateMessage}}</small></div>
  </DefaultModal>
</template>

<script setup lang="ts">
const props = defineProps<{
    user: String,
    community: String
}>();
const tooltip = ref(window.tooltip);
var communityData = ref(null);
var role = ref(null);
var titles = ref(null);
var updateMessage = ref("");
var editable = ref(false);
var isMod = ref(false);
var roleSet = ref(new stlib.PermissionSet());
var created = ref(null);
var reputation = ref(null);
var relations = ref(null);
async function saveChanges() {
    if(roleSet.value.role != role.value) await setRole(roleSet.value.role);
    var titleToSet = roleSet.value.titles.join(",");
    var titles2 = titles.value==null?'':titles.value.join(",");
    if(titleToSet != titles2) await setTitle(titleToSet);
    editable.value = false;
}
function discardChanges() {
    editable.value = false;
}
function toggleEditable() {
    roleSet.value.setRole(role.value);
    roleSet.value.titles = stlib.Utils.copy(titles.value);
    editable.value = true;
}
async function add(toAdd, addOrRemove) {
    var user = getManager().user;
    if(!user) return;
    var json = ["follow",{
        "follower": user,
        "following": toAdd,
        "what": addOrRemove?["blog"]:[]
      }
    ];
    updateMessage.value = "";

    var p = stlib.Utils.queueKeychain((keychain, resolve, error)=>{
        keychain.requestCustomJson(user, "follow", "Posting",
         JSON.stringify(json), "Add User", (result)=>{
            if(result.success) resolve(result.result);
            else error(result);
        });
    });
    try {
        await p;
        updateMessage.value="Succesfully "+(addOrRemove?'added.':'removed.');
    } catch(e) {
        updateMessage.value="Error: " + e.error;
        console.log(e);
    }
}
async function setRole(role) {
    var user = getManager().user;
    var community = props.community;
    console.log("settitle ", community, role);
    if(!community || !user) return;
    var json = ["setRole", {
		    "community": community,
		    "account": props.user, "role": role  
        }];
    updateMessage.value = "";
    
    var p = stlib.Utils.queueKeychain((keychain, resolve, error)=>{
        keychain.requestCustomJson(user, "community", "Posting",
         JSON.stringify(json), "Set Title", (result)=>{
            if(result.success) resolve(result.result);
            else error(result);
        });
    });
    try {
        await p;
        updateMessage.value="Succesfully updated.";
    } catch(e) {
        updateMessage.value="Error: " + e.error;
        console.log(e);
    }
}
async function setTitle(titles) {
    var user = getManager().user;
    var community = props.community;
    console.log("settitle ", community, titles);
    if(!community || !user) return;
    if(Array.isArray()) titles = titles.join(",");
    var json =  ["setUserTitle", {
		    "community": community,
		    "account": props.user, "title": titles
        }];
    updateMessage.value = "";
    
    var p = stlib.Utils.queueKeychain((keychain, resolve, error)=>{
        keychain.requestCustomJson(user, "community", "Posting",
         JSON.stringify(json), "Set Title", (result)=>{
            if(result.success) resolve(result.result);
            else error(result);
        });
    });
    try {
        await p;
        updateMessage.value="Succesfully updated.";
    } catch(e) {
        updateMessage.value="Error: " + e.error;
        console.log(e);
    }
}
function formatDate(date) {
    var t = date.indexOf('T');
    if(t !== -1) date = date.substring(0, t);
    return date;
}
async function initRelation() {
    var user = getManager().user;
    var user2 = props.user;
    if(!user || !user2 || user === user2) return;
    relations.value = {"follows": false }; 
    var data = await stlib.Utils.getDhiveClient().call("bridge", "get_relationship_between_accounts", [user, user2]);
    if(data) relations.value = data;
}
initRelation();
async function initUserData() {
    var user = props.user;
    if(!user) return; 
    var data = await stlib.Utils.getAccountData(user);
    if(data) { 
        created.value = formatDate(data.created);
        reputation.value = data.reputation===0?25:hive.formatter.reputation(data.reputation);    
    }
}
initUserData();
async function init() {
    //bridge.list_community_roles
    var community = props.community;
    if(!community) return;
    var user = props.user;
    var data = await stlib.Community.load(community);
    if(user && data) {
        role.value = data.getRole(user);
        titles.value = data.getTitles(user);
        isMod.value = data.canSetTitles(getManager().user);
        communityData.value = data;
    }
}
init();
</script>
