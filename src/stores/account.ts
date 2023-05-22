import { acceptHMRUpdate, defineStore } from "pinia";
import { Ref } from "vue";

type AccountData = {
  name: string | null;
  authenticated: boolean;
};

export const useAccountStore = defineStore("account", () => {
    const account: Ref<AccountData> = ref({name: null, authenticated: null});
    
    const initStore = async ()=>{
        var userData = localStorage.getItem("_user");
        if(userData == null) account.value.authenticated = false;
        else {
            try {
                var _userData = JSON.parse(userData);
                if(_userData.authenticated) {   
                    account.value.name = _userData.name;
                    account.value.authenticated = _userData.authenticated;
                    const manager = getManager();
                    manager.setUser(_userData.name);
                    if(stlib.Utils.isGuest(_userData.name)) {
                        var guest = manager.readGuest(_userData.name);
                        manager.setLoginKey(guest[1]);
                    }
                    else {
                        manager.setUseKeychain();
                    }
                    manager.setOnlineStatusTimer(true);
                    manager.sendOnlineStatus(true);
                }
            }
            catch(e) {
                userData = { name: null, authenticated: false }; 
                console.log(e);
            }
        }
    };
    
    
    const updateStore = ()=>{
        localStorage.setItem("_user", JSON.stringify(account.value));
    };
    

  const authenticate = async (user: string) => {
    const manager = getManager();
    manager.setUser(user);
    manager.setUseKeychain();
    var pref = await manager.getPreferences();
    console.log("login pref" , pref);
    await manager.joinGroups();
    var pref0 = await stlib.Utils.getAccountPreferences(user);
    if(pref0 == null) return await new Promise(function (resolve, reject) {
        window.hive_keychain.requestSignBuffer(
            user,
            `{login:"${user}"}`,
            "Posting",
            function (result) {
                if(result.success) {
                    account.value.name = user;
                    account.value.authenticated = true;
                    updateStore();
                    manager.setOnlineStatusTimer(true);
                    manager.sendOnlineStatus(true);
                    return resolve(account.value);
                }
                account.value.authenticated = false;
                return reject("error");
            }
        );
        });
        try {
            var priv = await manager.getPrivatePreferences();
            account.value.name = user;
            account.value.authenticated = true;
            updateStore();
            manager.setOnlineStatusTimer(true);
            await manager.sendOnlineStatus(true);
            return account.value;
        }
        catch(e) { 
            account.value.authenticated = false;
            console.log(e);
        }
    };
    const loginGuest = async (user: string) => {       
        const manager = getManager();
        var guest = manager.readGuest(user);
        if(guest == null) {
            var result = await manager.createGuestAccount(user);
            if(!result.isSuccess()) return result;
            guest = manager.readGuest(result.getResult());
            if(guest == null) return [false, 'error not found.'];
        }
        try {
            manager.setUser(guest[0]);
            manager.setLoginKey(guest[1]);
            account.value.name = guest[0];
            account.value.authenticated = true;
            updateStore();
            manager.setOnlineStatusTimer(true);
            await manager.joinGroups();
            await manager.getPrivatePreferences();
            await manager.sendOnlineStatus(true);
        }
        catch(e) {
            account.value.authenticated = false;
            console.log(e);
            return [false, 'error.']
        }
        return [true, guest[0]];
    };
  const signOut = () => {
    account.value.authenticated = false;
    updateStore();
  };
  const setLogin = (user) => {
    account.value.name = user;
    account.value.authenticated = true;
    updateStore();
  };
  window.setLogin = setLogin;
  return {
    initStore,
    authenticate, loginGuest, 
    signOut,
    account,
    setLogin
  };
});

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useAccountStore, import.meta.hot));
