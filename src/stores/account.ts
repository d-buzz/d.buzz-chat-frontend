import { acceptHMRUpdate, defineStore } from "pinia";
import { Ref } from "vue";

type AccountData = {
  name: string | null;
  authenticated: boolean;
};

export const useAccountStore = defineStore("account", () => {
    var userData = localStorage.getItem("_user");
    if(userData == null) userData = { name: null, authenticated: false }; 
    else {
        try {
            userData = JSON.parse(userData);
            if(userData.authenticated) {
                const manager = getManager();
                manager.setUser(userData.name);
                if(stlib.Utils.isGuest(userData.name)) {
                    var guest = manager.readGuest(userData.name);
                    manager.setLoginKey(guest[1]);
                }
                else {
                    manager.setUseKeychain();
                }
                manager.sendOnlineStatus(true);
            }
        }
        catch(e) {
            userData = { name: null, authenticated: false }; 
            console.log(e);
        }
    }
    const account: Ref<AccountData> = ref(userData);
    const updateStore = ()=>{
        localStorage.setItem("_user", JSON.stringify(account.value));
    };
    

  const authenticate = async (user: string) => {
    const manager = getManager();
    manager.setUser(user);
    manager.setUseKeychain();
    await manager.joinGroups();
    var pref = await manager.getPreferences();
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
  return {
    authenticate, loginGuest, 
    signOut,
    account,
  };
});

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useAccountStore, import.meta.hot));
