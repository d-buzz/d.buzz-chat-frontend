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

  const authenticate = (user: string) =>
    new Promise(function (resolve, reject) {
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
  const signOut = () => {
    account.value.authenticated = false;
    updateStore();
  };
  return {
    authenticate,
    signOut,
    account,
  };
});

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useAccountStore, import.meta.hot));
