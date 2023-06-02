<template>
  <TransitionRoot :show="loginModalOpen">
    <LoginModal @close="toggleLoginModal()"></LoginModal>
  </TransitionRoot>
  <TransitionRoot :show="newUserMessageModalOpen">
    <NewUserMessageModal @close="toggleNewUserMessageModalOpen()"></NewUserMessageModal>
  </TransitionRoot>
  <TransitionRoot :show="addCommunityModal">
    <AddCommunityModal @close="toggleAddCommunityModal()"></AddCommunityModal>
  </TransitionRoot>
  <div class="border-b-1 relative">
    <!--<SideBarLoginIcon :number="number" @click="toggleMenu" @toggleStreambar=""/>-->
    <div v-if="accountName" @mouseenter="tooltip($event.target, '@' + accountName)">
      <UserIcon class="p-1 cursor-pointer" @click.stop.prevent="toggleMenu" :name="accountName" :imgCss="'avCommunity'" />
    </div>
    <button v-else class="btn mt-2" style="padding: 2px 4px; margin-left: 3px" @click="toggleLoginModal">Login</button>
    <div v-if="showMenu" class="menu appbg1 border-default flex flex-col">
      <!--<div><b class="border-b-1"><a :href="`https://peakd.com/@${accountName}`" target="_blank" rel="noreferrer noopener">@{{accountName}}</a></b></div>-->
      <div>
        <b class="border-b-1"
          ><router-link to="/mentions">@{{ accountName }}</router-link></b
        >
      </div>
      <div><router-link to="/preferences">Preferences</router-link></div>
      <div><router-link to="/themes">Themes</router-link></div>
      <div class="border-t-1" @click="logout">Logout</div>
    </div>
  </div>
  <!--<div>
        <button class="w-full avCommunity md:hidden" style="padding-left: 1px;"
             @click="$emit('toggleStreambar')"><span class="oi oi-menu" style="font-size:30px;"></span></button>
    </div>-->

  <div class="flex flex-col">
    <div class="flex flex-col" ref="directPanel">
      <div class="flex justify-between relative border-b-1 p-1 cursor-pointer appsg0" @click="toggleDirect">
        <small v-if="number && number != '0'" class="number border-default"
          ><b>{{ number }}</b></small
        >
        <b class="text-xs">{{ $t("SideBar.Direct") }}</b>
        <button v-if="addButton === 0" class="text-xs" @click.stop="IfLoggedIn(toggleNewUserMessageModalOpen)">
          <span class="oi oi-plus"></span>
        </button>
        <span v-else class="oi oi-elevator iconSize"></span>
      </div>
    </div>
    <div class="flex flex-col" ref="communityPanel">
      <div class="flex justify-between relative gap-x-1 border-b-1 p-1 font-bold cursor-pointer appsg0" @click="toggleCommunities">
        <small v-if="communityNumber && communityNumber != '0'" class="number border-default"
          ><b>{{ communityNumber }}</b></small
        >
        <b class="text-xs">C/</b>
        <button v-if="addButton === 0" class="text-xs" @click.stop="IfLoggedIn(toggleAddCommunityModal)">
          <span class="oi oi-plus"></span>
        </button>
        <span v-else class="oi oi-elevator iconSize"></span>
      </div>
    </div>
  </div>

  <div
    v-if="showDirect"
    class="h-screen m-0 shadow-lg overflow-y-scroll scrollBox hideScrollbar border-b-1"
    style="overflow-x: clip"
    @dragover.prevent
    @drop.stop.prevent="onDrop"
  >
    <div class="scrollBoxContent flex flex-col">
      <div :key="updateKey2">
        <TextIcon
          v-if="addButton === 1"
          class="p-1 cursor-pointer"
          :text="'+'"
          @click.stop="IfLoggedIn(toggleNewUserMessageModalOpen)"
          @mouseenter="tooltip($event.target, $t('SideBar.NewConversation'))"
        />
        <div v-for="conversation in conversations">
          <Conversation
            v-if="conversation.id !== undefined"
            :conversation="conversation.conversation"
            :id="conversation.id"
            :username="conversation.username"
            :number="conversation.lastReadNumber + conversation.plus"
            :compact="true"
          />
          <Conversation v-else :conversation="conversation.conversation" :username="username" :number="'' + conversation.lastReadNumber" :compact="true" />
        </div>
        <TextIcon
          v-if="addButton === 2"
          class="p-1 cursor-pointer"
          :text="'+'"
          @click.stop="IfLoggedIn(toggleNewUserMessageModalOpen)"
          @mouseenter="tooltip($event.target, $t('SideBar.NewConversation'))"
        />
        <div style="height: 50px"></div>
      </div>
    </div>
  </div>
  <div
    v-if="showCommunities"
    class="h-screen m-0 shadow-lg overflow-y-scroll scrollBox hideScrollbar"
    style="overflow-x: clip"
    @dragover.prevent
    @drop.stop.prevent="onDrop"
  >
    <div class="scrollBoxContent flex flex-col">
      <TextIcon
        v-if="addButton === 1"
        class="p-1 cursor-pointer"
        :text="'+'"
        @click.stop="IfLoggedIn(toggleAddCommunityModal)"
        @mouseenter="tooltip($event.target, $t('SideBar.AddCommunity'))"
      />
      <Draggable v-model="communities" :key="updateKey">
        <template v-slot:item="{ item }">
          <SideBarIcon :img="item[0]" :name="item[1]" :community="item" :number="item.lastReadNumber" @toggleStreambar="$emit('toggleStreambar')" />
        </template>
      </Draggable>
      <TextIcon
        v-if="addButton === 2"
        class="p-1 cursor-pointer"
        :text="'+'"
        @click.stop="IfLoggedIn(toggleAddCommunityModal)"
        @mouseenter="tooltip($event.target, $t('SideBar.AddCommunity'))"
      />
      <div style="height: 50px"></div>
    </div>
  </div>
</template>
<script setup>
import Draggable from "vue3-draggable";
import { nextTick } from "vue";
import { useAccountStore } from "../stores/account";
import { useRoute } from "vue-router";
const $t = app.config.globalProperties.$t;
const router = useRouter();
const emit = defineEmits(["toggleStreambar"]);
const tooltip = ref(window.tooltip);
const accountStore = useAccountStore();
const accountName = ref("");
const communities = ref([]);
const updateKey = ref("");
const number = ref("0");
const communityNumber = ref("0");
function canOpenBoth() {
  return window.globalProperties["sidebar2enableSharedView"] === true;
}
const showDirect = ref(canOpenBoth());
const showCommunities = ref(true);
const addButton = ref(globalProperties.onlyPrependCommunities ? -1 : window.globalProperties["sidebarAddButton"]);
const showMenu = ref(false);
const directPanel = ref();
const communityPanel = ref();

function logout() {
  accountStore.signOut();
  window.location = "/join";
}
function toggleMenu() {
  showMenu.value = !showMenu.value;
}
function order() {
  if (showDirect.value && !showCommunities.value) {
    directPanel.value.style.order = "1";
    communityPanel.value.style.order = "0";
  } else if (!showDirect.value && showCommunities.value) {
    directPanel.value.style.order = "0";
    communityPanel.value.style.order = "1";
  }
}
function toggleDirect() {
  showDirect.value = !showDirect.value;
  if (!showDirect.value && !showCommunities.value) showCommunities.value = true;
  else if (!canOpenBoth() && showDirect.value && showCommunities.value) showCommunities.value = false;
  order();
}
function toggleCommunities() {
  showCommunities.value = !showCommunities.value;
  if (!showDirect.value && !showCommunities.value) showDirect.value = true;
  else if (!canOpenBoth() && showDirect.value && showCommunities.value) showDirect.value = false;
  order();
}

function onDrop() {
  setTimeout(() => {
    var list = [];
    for (var a of communities.value) list.push(a[0]);
    getManager().storeCommunitySortOrderLocally(list);
  }, 1000);
}
function setTitle(communityMessages, directGroupMessages) {
  var str = "";
  if (communityMessages !== 0 || directGroupMessages !== 0) {
    str += "(";
    if (communityMessages !== 0) str += communityMessages;
    if (directGroupMessages !== 0) str += ":" + directGroupMessages;
    str += ") ";
  }
  str += $t("App.Title");
  document.title = str;
  window.sendNotificationsUpdate({community: communityMessages, group: directGroupMessages});
}
async function initCommunities() {
  var user = accountStore.account.name;
  var manager = getManager();
  if (user != null) {
    manager.setUser(user);
    manager.joinGroups();
  }
  var _communities = globalProperties.onlyPrependCommunities || user == null ? [] : await manager.getCommunitiesSorted();
  {
    var tmp = {};
    for (var community of _communities) {
      tmp[community[0]] = true;
    }
    var prepend = globalProperties.prependCommunities;
    if (prepend && prepend.length > 0) {
      for (var name of prepend) {
        if (tmp[name] === true) continue;
        var data = await stlib.Community.load(name);
        if (data) _communities.unshift([name, data.getTitle()]);
      }
    }
  }
  if (user != null) manager.joinCommunities(_communities);
  communities.value = _communities;
  updateKey.value = "" + stlib.Utils.nextId();
  if (user == null) return;
  accountName.value = user;
  var update = async () => {
    var totalCommunities = 0;
    var _communityNumber = 0;
    for (var community of communities.value) {
      var lastReadNumber = await manager.getLastReadCommunity(community[0]);
      if (lastReadNumber != null && lastReadNumber != "0") {
        _communityNumber++;
        totalCommunities += Number(lastReadNumber.endsWith("+") ? lastReadNumber.substring(0, lastReadNumber.length - 1) : lastReadNumber);
      }
      community.lastReadNumber = lastReadNumber;
    }
    updateKey.value = "" + stlib.Utils.nextId();
    nextTick(async () => {
      var directGroupTotal = await manager.getLastReadTotal();
      setTitle(totalCommunities, directGroupTotal);
      number.value = "" + (await manager.getLastReadTotalConversations());
      communityNumber.value = _communityNumber + "";
      updateKey.value = "" + stlib.Utils.nextId();
    });
  };
  await update();
  manager.setCallback("SideBar.vue", update);
  manager.onlastread.set("SideBar.vue", update);
}
initCommunities();

const route = useRoute();
const username = accountStore.account.name;
const streams = ref([]);
const conversations = ref([]);
const isAdmin = ref(false);
const communityName = ref("");
const isCommunity = ref(false);
const updateKey2 = ref("");

const newUserMessageModalOpen = ref(false);
const toggleNewUserMessageModalOpen = () => {
  newUserMessageModalOpen.value = !newUserMessageModalOpen.value;
};
const addCommunityModal = ref(false);
const toggleAddCommunityModal = () => {
  addCommunityModal.value = !addCommunityModal.value;
};
const loginModalOpen = ref(false);
function toggleLoginModal() {
  loginModalOpen.value = !loginModalOpen.value;
}
function IfLoggedIn(fn) {
  var user = accountStore.account.name;
  if (user == null) toggleLoginModal();
  else fn();
}
/*const showJoinModal = ref(false);
function toggleJoinModal() {
    showJoinModal.value = !showJoinModal.value;
}*/

async function initConversations(route) {
  console.log(route);
  console.log("load community " + route.name);
  if (username == null || route.name == null) return;
  //isCommunity.value = route.name.startsWith('Community');
  const manager = getManager();

  /*if(isCommunity.value) {
        title.value = "";

        var user2 = route.params.community || route.params.user;
        if(user2 == null || user2 == "") return;
        communityName.value = user2;
        var community = await stlib.Community.load(user2);

        var role = community.getRole(username);
        var titles = community.getTitles(username);

        title.value = community.getTitle();
        streams.value = community.getStreams();
        isAdmin.value = community.canUpdateSettings(username);

        for(var stream of streams.value)
            stream.visible = stream.readSet.validate(role, titles);

        var update = async() => {
            console.log("Callback message update StreamBar.vue Community");
            for(var stream of streams.value) {
                var path = stream.getPath();
                stream.lastReadNumber = (path != null && path.getType() === 't')?
                    (await manager.getLastReadCommunityStream(path.getUser()+'/'+path.getPath())):'0';
            }
            console.log("Callback message end StreamBar.vue Community");
        };
        await update();
        manager.setCallback("StreamBar.vue", update);
        manager.onlastread.set("StreamBar.vue", update);
        //var streams = temp0.getStreams;
    }
    else {*/
  var update = async () => {
    console.log("Callback message update SideBar2.vue");

    var groupObjs = await manager.getJoinedAndCreatedGroups();
    var conversationArray = await manager.readUserConversations();
    var conversationObjects = [];
    for (var conversation in groupObjs) {
      var groupObj = groupObjs[conversation];
      console.log("group obj", groupObj);
      groupObj.tmp = groupObj.timestamp;
      conversationObjects.push(groupObj);
    }
    for (var conversation of conversationArray) {
      var obj = { conversation, lastReadNumber: 0, timestamp: 0, plus: "", tmp: 0 };
      var lastRead = manager.getLastRead(conversation);
      if (lastRead != null) {
        obj.lastReadNumber = lastRead.number;
        obj.timestamp = obj.tmp = lastRead.timestamp;
      }
      conversationObjects.push(obj);
    }
    var conversationMap = {};
    for (var conversation of conversationObjects) conversationMap[conversation.conversation] = conversation;
    var messages = await manager.readCachedUserMessages();
    for (var message of messages) {
      var conversation = conversationMap[message.getConversation()];
      if(conversation && message.isVerified() && message.getTimestamp() > conversation.tmp) {
        //conversation.lastReadNumber++;
        conversation.timestamp = Math.max(conversation.timestamp, message.getTimestamp());
      }
    }
    conversationObjects.sort((a, b) => b.timestamp - a.timestamp);
    conversations.value = conversationObjects;
    updateKey2.value = "#" + stlib.Utils.nextId();

    console.log("Callback message end SideBar2.vue");
  };
  await update();
  manager.setCallback("SideBar.vue#2", update);
  manager.onpreferences.set("SideBar.vue#2", update);
  manager.onlastread.set("SideBar.vue#2", update);
  manager.oncommunityhide.set("SideBar.vue#2", initCommunities);
  //}
}
initConversations(route);
window.onclickoutside.set("SideBar.vue", () => {
  showMenu.value = false;
});
</script>
<style scoped>
.iconSize {
  font-size: 10px;
}
.menu {
  @apply absolute py-1 rounded;
  left: 61px;
  top: 20px;
  z-index: 5;
}
.menu > div {
  @apply px-2 cursor-pointer;
  padding-top: 2px;
  padding-bottom: 2px;
}
.menu > div:hover {
  background-color: var(--appsg1);
}
.number {
  display: block;
  position: absolute;
  pointer-events: none;
  color: var(--appfg0);
  z-index: 5;
  background: var(--appbg0);
  top: 2px;
  right: 0px;
  border-radius: 10px;
  padding: 2px 4px;
  line-height: 1;
}
</style>
