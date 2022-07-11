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
  const authenticate = (user: string) =>
    new Promise(function (resolve, reject) {
      window.hive_keychain.requestEncodeMessage(
        user,
        user,
        "#login-HiveHub.Dev",
        "Active",
        function (encrypted) {
          window.hive_keychain.requestVerifyKey(
            user,
            encrypted.result,
            "Active",
            function (decrypted) {
              if (decrypted.result === "#login-HiveHub.Dev") {
                account.value.name = user;
                account.value.authenticated = true;
                localStorage.setItem("_user", JSON.stringify(account.value));
                return resolve(account.value);
              }
              account.value.authenticated = false;
              return reject("error");
            }
          );
        }
      );
    });
  const signOut = () => {
    account.value.authenticated = false;
  };
  return {
    authenticate,
    signOut,
    account,
  };
});

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useAccountStore, import.meta.hot));
