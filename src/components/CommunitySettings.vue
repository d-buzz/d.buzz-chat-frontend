<template>
  <TransitionRoot :show="showAddChatModal">
    <AddChatModal @oninput="addText" @close="toggleAddChatModal"></AddChatModal>
  </TransitionRoot>
  <TransitionRoot :show="showCategoryModal">
    <AddCategoryModal @oninput="addCategory" @close="toggleAddCategoryModal"></AddCategoryModal>
  </TransitionRoot>
  <TransitionRoot :show="showInfoModal">
    <AddInfoModal @oninput="addInfo" @close="toggleAddInfoModal"></AddInfoModal>
  </TransitionRoot>
  <div class="appbg2 w-full h-full overflow-y-scroll scrollBox ml-3">
    <div class="scrollBoxContent flex flex-col mr-3" style="margin-bottom:150px;">
        <div class="flex border-b-1 font-bold">Settings {{pageTitle}}</div>

        <div>
            <button class="btn" @click="toggleAddChatModal()"><span class="oi oi-plus"></span> chat</button>
            <button class="btn" @click="toggleAddCategoryModal()"><span class="oi oi-plus"></span> category</button>
            <button class="btn" @click="toggleAddInfoModal()"><span class="oi oi-plus"></span> info</button>
            <button class="btn" @click="moveUp()"><span class="oi oi-chevron-top"></span></button>
            <button class="btn" @click="moveDown()"><span class="oi oi-chevron-bottom"></span></button>
            <button class="btn" @click="remove()"><span class="oi oi-x"></span></button>
        </div>

        <div class="grid grid-cols-2 gap-2">

            <div>
                <!--<label class="block text-sm font-medium text-gray-700">Streams: </label>-->
        <Draggable v-model="streams" :key="messageKey">
            <template v-slot:item="{item}">
                <div class="item border rounded-md border-gray-700 my-1 p-1"
                    @mousedown="select(item)"
                    :data-selected="item.selected"
                >
                <span v-if="item.getPathType() == null" 
                    class="font-bold">{{item.getName()}} 
                    <span class="float-right font-normal text-sm">(category)</span>
                </span>
                <span v-else-if="item.getPathType() == 't'" 
                    class="pl-2"><span class="monoIcon">#</span> {{item.getName()}} 
                    <span class="float-right text-sm">(text)</span>
                </span>
                <span v-else-if="item.getPathType() == 'g'" 
                    class="pl-2"><span class="oi oi-lock-locked"></span> {{item.getName()}} 
                    <span class="float-right text-sm">(private text)</span>
                </span>
                <span v-else-if="item.getPathType() == 'i'"><span class="oi oi-info text-center" style="width:14px;"></span> {{item.getName()}} 
                    <span class="float-right text-sm">(info)</span>
                </span> 
                <span v-else-if="item.getPathType() == 'u'"><span class="oi oi-globe text-center" style="width:14px;"></span> {{item.getName()}} 
                    <span class="float-right text-sm">(url)</span>
                </span>              
                <span v-else>{{item.getName()}}</span>
                </div>
            </template>
        </Draggable>

            </div>

            <div> 
                <div>
                    <label for="streamname" class="block text-sm font-medium text gray-700">            Displayable name: 
                    </label>
                    <input id="streamname" name="streamname" type="text" class="inputText1" placeholder="Stream Name" @input="setStreamName">    
                </div>

                <div>
                    <label for="datapath" class="block text-sm font-medium text gray-700">            Data path: 
                    </label>
                    <input id="datapath" name="datapath" type="text" class="inputText1" placeholder="Data Path" @input="setDataPath"> 
                       
                </div>

                <div v-if="selected">
                    <label class="block text-sm font-medium text gray-700">Shown for:</label>
                    <PermissionSet :set="selected.readSet" :key="selectKey"/>
                </div>
            
                <div v-if="selected && selected.dataPath != null && selected.dataPath.getType() != 'i' && selected.dataPath.getType() != 'g' && selected.dataPath.getType() != 'u'">
                    <label class="block text-sm font-medium text gray-700">Write Permissions:</label>
                    <PermissionSet :set="selected.writeSet" :key="selectKey"/>
                </div>
            </div>
        </div>

        <div><small>{{updateMessage}}</small></div>
        <div>
            <button class="btn" @click="updateSettings" title="Save changes">Update</button>
            <button class="btn2" @click="resetSettings" title="Discard changes and reload existing settings"><span class="oi oi-reload"></span> Reset</button>
        </div>
        <hr/>
        <div class="font-bold">Emotes</div>
        <table>
            <tr v-for="link, name in emotes">
                <td style="min-width:20px;"><img :src="`https://images.hive.blog/20x0/${link}`" width="20"></td>
                <td class="px-1">{{name}}</td> 
                <td class="px-1 break-all"><small>{{link}}</small></td>
                <td><span class="oi oi-trash cursor-pointer" @click="deleteEmote(name)" @mouseenter="tooltip($event.target, $t('CommunitySettings.DeleteEmote.Info'))"></span></td>
            </tr>
        </table>
        <div class="flex gap-x-2 pr-4">
            <div style="flex-basis: 120px;"><input ref="emotename" id="emotename" name="emotename" type="text" class="inputText1" placeholder="emote name"></div>
            <div style="flex-basis: 150px;"><input ref="emoteimage" id="emoteimage" name="emoteimage" type="text" class="inputText1" placeholder="emote image url"></div>
            <button class="btn" @click="addEmote(emotename.value, emoteimage.value)" title="Add"><span class="oi oi-plus"></span> Add</button>
        </div>
        <div><small>{{updateMessage}}</small></div>
        <div>
            <button class="btn" @click="updateSettings" title="Save changes">Update</button>
            <button class="btn2" @click="resetSettings" title="Discard changes and reload existing settings"><span class="oi oi-reload"></span> Reset</button>
        </div>
    </div>
 </div>
</template>
<script setup>
import Draggable from "vue3-draggable";
import { useAccountStore } from "../stores/account";
import { useRoute } from "vue-router";
import { ref, nextTick } from 'vue';
const tooltip = ref(window.tooltip);
const router = useRouter();
const route = useRoute();
const accountStore = useAccountStore();
const displayableMessages = ref([]);
const emotename = ref();
const emoteimage = ref();
const emotes = ref({});
const messageKey = ref("");
const selectKey = ref("");

const showAddChatModal = ref(false);
const showCategoryModal = ref(false);
const showInfoModal = ref(false);
function toggleAddChatModal() { showAddChatModal.value = !showAddChatModal.value; }
function toggleAddCategoryModal() { showCategoryModal.value = !showCategoryModal.value; }
function toggleAddInfoModal() { showInfoModal.value = !showInfoModal.value; }

var community = null;
const pageTitle = ref("");
const streams = ref([]);
const selected = ref(null);

const updateMessage = ref("");
function updateSettings() {
    var user = accountStore.account.name;
    if(user == null) return;
    var duplicateCheck = {};
    for(var stream of streams.value) {
        var type = stream.getPathType();
        if(type === 't' || type === 'g') {
            var name = stream.getName();
            if(duplicateCheck[name]) {
                updateMessage.value = "Error: Duplicate name '"+name+"'.";
                return;
            }
            duplicateCheck[name] = true;
        }
    }

    community.setStreams(streams.value);
    community.emotes = emotes.value;
    var json = community.updateStreamsCustomJSON();
    updateMessage.value = "";
    stlib.Utils.queueKeychain((keychain, resolve, error)=>{
        keychain.requestCustomJson(user, "community", "Posting",
             JSON.stringify(json), "Update Community Data", (result)=>{
            if(result.success) { 
                updateMessage.value="Succesfully updated settings."; 
                resolve(true); 
            }
            else {
                updateMessage.value="Error: " + result.error;
                error(result.error);
            }
        });
    });
}
function resetSettings() {
    initChat();
}
function update() {
    messageKey.value = community.getName()+'#'+stlib.Utils.nextId();
}
function setStreamName(event) {
    var item = getSelected();
    if(item == null) return;
    var value = event.target.value;
    item.name = value;
} 
function setDataPath(event) {
    var item = getSelected();
    if(item == null) return;
    var value = event.target.value;
    item.dataPath = stlib.DataPath.fromString(value, item.community);
}
function select(item) {
    for(var stream of streams.value) stream.selected = false;
    if(item == null) return;    
    item.selected = true;
    var streamname = document.getElementById("streamname");
    var datapath = document.getElementById("datapath");
    //var readpermissions = document.getElementById("readpermissions");
    //var writepermissions = document.getElementById("writepermissions");
    streamname.value = item.getName();
    datapath.value = item.getCompactPath();
    //readpermissions.value = item.getReadPermissions().toJSON();
    //writepermissions.value = item.getWritePermissions().toJSON();
    selected.value = item;
    selectKey.value = community.getName()+'#'+stlib.Utils.nextId();
}
function getSelected() {
    for(var stream of streams.value) if(stream.selected) return stream;
    return null;
}
function addText(displayName="Text", path=null) {
    community.setStreams(streams.value);
    select(community.newTextStream(displayName, path));
    update();
}
function addCategory(displayName="Category") {
    community.setStreams(streams.value);
    select(community.newCategory(displayName));
    update();
}
function addInfo(displayName="About", dataPath='/about') {
    community.setStreams(streams.value);
    select(community.newInfo(displayName, dataPath));
    update();
}
function moveUp() {
    for(var i = 1; i < streams.value.length; i++) {
        if(streams.value[i].selected) {
            swap(streams.value, i-1, i);
            update();
            return;
        }
    }
}
function moveDown() {
    for(var i = 0; i < streams.value.length-1; i++) {
        if(streams.value[i].selected) {
            swap(streams.value, i, i+1);
            update();
            return;
        }
    }
}
function remove() {
    for(var i = 0; i < streams.value.length; i++) {
        if(streams.value[i].selected) {
            streams.value.splice(i, 1);
            update();
            return;
        }
    }
}
function swap(array,x,y) {
    var tmp = array[x];
    array[x] = array[y];
    array[y] = tmp;
    return array;
}
function addEmote(name, link) {
    if(name == null || link == null || link == "") return;
    emotes.value[name] = link;
    emotename.value.value = "";
    emoteimage.value.value = "";
}
function deleteEmote(name) {
    delete emotes.value[name];
}
async function initChat() {
    var user = accountStore.account.name;
    if(user == null) return; //TODO ask to login
    var user2 = route.params.user;
    if(user2 == null || user2 == "") return;

    community = await stlib.Community.load(user2);
    if(community) {
        community = community.copy();

        pageTitle.value = community.getTitle() + ` (${community.getName()})`;
        streams.value = community.getStreams();
        if(streams.value.length > 0) select(streams.value[0]);
        emotes.value = community.emotes;
        update();
    }
}
initChat();
function isAtScrollBottom(e) {
    return e.scrollTop + e.clientHeight >= e.scrollHeight;
}
/*app.router.beforeEach(async (to, from, next) => {
    await initChat();
    next();
});*/
</script>
<style>
.item[data-selected="true"] {
    color: var(--appfgbtn1);
    background-color: var(--appbgbtn1);
}

</style>
