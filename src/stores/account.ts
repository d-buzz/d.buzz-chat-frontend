import { acceptHMRUpdate, defineStore } from "pinia";
import { Ref } from "vue";

type AccountData = {
  name: string | null;
  authenticated: boolean;
};

export const useAccountStore = defineStore("account", () => {
    var userData = localStorage.getItem("_user");
    if(userData == null) userData = { name: null, authenticated: false }; 
    else userData = JSON.parse(userData);
    const account: Ref<AccountData> = ref(userData);
    const updateStore = ()=>{
        localStorage.setItem("_user", JSON.stringify(account.value));
    };

  const authenticate = async (user: string) => {
    const manager = getManager();
    manager.setUser(user);
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
            return account.value;
        }
        catch(e) { 
            account.value.authenticated = false;
            console.log(e);
        }
    };
    const loginGuest = (user: string) => {        //todo
        account.value.name = user;
        account.value.authenticated = false;
        updateStore();
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
