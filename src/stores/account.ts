import { acceptHMRUpdate, defineStore } from "pinia";
import { Ref } from "vue";

type AccountData = {
  name: string | null;
  authenticated: boolean;
};

export const useAccountStore = defineStore("account", () => {
  const account: Ref<AccountData> = ref({ name: null, authenticated: false });
  const authenticate = () =>
    new Promise(function (resolve, reject) {
      const user = account.value.name;
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
                account.value.authenticated = true;
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
